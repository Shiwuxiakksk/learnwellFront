<template>
  <div class="container">
    <div class="left">
      <div>题目列表</div>
      <br>
      <span v-for="(row, index) in questions" :key="index">
            <el-button :type="btnType(index)" plain @click="changeTo(index+1)">
              {{ index + 1 }}
            </el-button>
            <span v-if="(index+1)%5===0"><br> </span>

        </span>
    </div>
    <div class="right">

      <span style="color: #B3C0D1;padding: 10px">第{{ activeQuestionIdx + 1 }}/{{ questions.length }}题</span>
      <span style="float: right">
          <el-button @click="submitHomework" :disabled="already">提交</el-button>
        </span>


      <div class="right-top">

        <div class="content">
          {{ activeQuestion.content }}
        </div>
        <div v-if="activeQuestion.pic != null">
          <el-image :src="activeQuestion.pic" style="width: 600px;height: 100px" :fit="fit"></el-image>
        </div>
        <div style="padding-top: 20px">
          <el-form :model="answerForm" ref="answerForm" v-if="activeQuestion">
            <template v-if="activeQuestion.type === 1">
              <el-radio-group v-model="answer">
                <el-radio :label="1">A</el-radio>
                <el-radio :label="2">B</el-radio>
                <el-radio :label="3">C</el-radio>
                <el-radio :label="4">D</el-radio>
              </el-radio-group>
            </template>
            <template v-else-if="activeQuestion.type === 2">

              <el-checkbox v-model="answers[0]">A</el-checkbox>
              <el-checkbox v-model="answers[1]">B</el-checkbox>
              <el-checkbox v-model="answers[2]">C</el-checkbox>
              <el-checkbox v-model="answers[3]">D</el-checkbox>

            </template>
            <template v-else-if="activeQuestion.type === 3 || activeQuestion.type === 5">
              <el-form-item prop="answer" class="content">
                <el-input v-model="answer"></el-input>
              </el-form-item>
            </template>
            <template v-else-if="activeQuestion.type === 4">
              <el-radio-group v-model="answer">
                <el-radio label="1">T</el-radio>
                <el-radio label="2">F</el-radio>
              </el-radio-group>
            </template>
          </el-form>
        </div>
        <div style="padding-top: 20px">
          <el-button type="primary" plain icon="el-icon-arrow-left" @click="changeTo(activeQuestionIdx)"></el-button>
          <el-button type="primary" @click="saveQuest" :disabled="already">确定</el-button>
          <el-button type="primary" plain icon="el-icon-arrow-right" @click="changeTo(activeQuestionIdx+2)"></el-button>
        </div>
      </div>
      <div class="right-bottom" v-if="already">
        <div class="explain-title">答案解析</div>
        <div class="content">{{ activeQuestion.explain }}</div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */

import axios from "axios";

export default {
  name: "Question",
  data() {
    return {
      fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      studentId: 100000,
      homeworkId: 230000,
      questions: [],
      judgeRes: [],
      already: false,
      activeQuestion: null,
      activeQuestionIdx: null,
      questionRows: [],
      answerList: [],
      answer: null,
      answers: [false, false, false, false],
      answerForm: {
        answer: null
      },
      submitFlag: false
    };
  },
  mounted() {
    axios.get(`/api/uh/exist?userId=${this.studentId}&homeworkId=${this.homeworkId}`)
    .then(resp=>{
      if(resp.data.code === 200){
        if(resp.data.data){
        } else {
          this.$message.info('你已提交过该作业');
          this.already = true;
        }
        this.initQuestionList();
      } else {
        this.$message.error('发生了错误：'+resp.data.msg);
      }
    })

  },
  methods: {
    initQuestionList() {
      axios.get(`/api/hq/question/${this.homeworkId}`)
          .then(resp => {
            if (resp.data.code === 200) {
              this.questions = resp.data.data;
              console.log(this.questions)
              this.activeQuestion = this.questions[0];
              console.log(this.activeQuestion)
              this.activeQuestionIdx = 0;
              for (let i = 0; i < this.questions.length; i++) this.answerList.push(null);
            } else {
              this.$message("发送了错误" + resp.data.msg);
            }
          })
      axios.get(`/api/uh/judgeresult?homeworkId=${this.homeworkId}&userId=${this.studentId}`)
      .then(resp=>{
        if(resp.data.code === 200){
          this.judgeRes = resp.data.data;
        } else {
          this.$message.error('发生了错误:'+resp.data.msg);
        }
      })
    },
    handleQuestionClick(idx) {
      this.activeQuestionIdx = idx - 1;
      this.submitFlag = false;
      this.$refs.answerForm.resetFields();
    },
    changeTo(index) {
      if (index < 1 || index > this.questions.length) {
        this.$message.info('已经完成了所有题目')
        return;
      }
      this.answer = null;
      this.activeQuestionIdx = index - 1;
      this.activeQuestion = this.questions[this.activeQuestionIdx];
    },
    saveQuest() {
      if (this.activeQuestion.type === 2) {
        this.answer = JSON.stringify(this.answers);
      }
      this.answerList[this.activeQuestionIdx] = {
        questionId: this.activeQuestion.id,
        userId: this.studentId,
        homeworkId: this.homeworkId,
        ans: this.answer
      }
      console.log(this.answerList)
      this.changeTo(this.activeQuestionIdx + 2)
    },
    btnType(idx){
      if(!this.already) return "primary";
      else {
        if(this.judgeRes[idx]) return "success";
        else if(this.questions[idx].type === 3 ||this.questions[idx].type === 5) return "info";
        else return "danger";
      }
    },
    submitHomework() {
      this.$confirm('确定要提交吗？')
          .then(() => {
            const promiseList = []
            for (let i = 0; i < this.answerList.length; i++) {
              let obj = this.answerList[i];
              promiseList.push(axios.post("/api/uq/judge",obj));
            }
            Promise.all(promiseList)
                .then(() => {
                  let data = {
                    userId: this.studentId,
                    homeworkId: this.homeworkId
                  }
                  axios.post("/api/uh",data)
                      .then(resp=>{
                        if(resp.data.code === 200){
                          this.$message.success('操作成功')
                          this.already = true;
                          this.initQuestionList();
                        } else {
                          this.$message.error("发生了错误："+resp.data.msg);
                        }
                      })
                  this.already = true;
                })
                .catch(error => {
                  this.$message.error('操作失败!' + error);
                })
          })
          .catch(() => {
            this.$message.info('取消了操作')
          })
    }
  }
};
</script>
<style scoped>
.container {
  display: flex;
  height: 100%;
  padding: 10px;
}

.container {
  display: flex; /* 使用flex布局 */
  flex-wrap: wrap; /* 当子元素超出容器宽度时，自动换行 */
}

.left {
  width: 20%; /* 左边部分宽度占30% */
  padding-top: 10px;
  height: 90vh;
  background-color: #f5f5f5;
  box-sizing: border-box;
}

.right {
  width: 70%; /* 右边部分宽度占70% */
  display: flex; /* 使用flex布局 */
  flex-wrap: wrap; /* 当子元素超出容器宽度时，自动换行 */
}

.right-top {
  padding-top: 40px;
  width: 100%; /* 右上部分宽度占100% */
  height: 60%; /* 右上部分高度占50% */
}

.right-bottom {
  width: 100%; /* 右下部分宽度占100% */
  height: 40%; /* 右下部分高度占50% */
}

.content {
  white-space: pre-line;
  width: 600px;
  text-align: left;
  margin: auto;
}
</style>
