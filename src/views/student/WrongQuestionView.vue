<template>
  <div class="container">
    <el-timeline class="left">
      <el-timeline-item v-for="(hw,idx) in homeworkList" :key="idx"
                        :timestamp="hw.startTime" placement="top">
        <el-card align="center" style="width: 300px" shadow="hover">
          <div class="card-content" @click="getQuestions(hw.id)">
            <h4>{{ hw.title }}</h4>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <div class="right" v-if="questionList.length!==0">
      <div v-for="(question,idx) in questionList" :key="idx" style="padding: 20px">
        <el-popover
            placement="bottom"
            width="300"
            trigger="hover"
        >
          <p>你的答案：{{ printAns(question.type, question.ans) }}</p>
          <p>正确答案：{{ printAns(question.type, question.corrAns) }}</p>
          <p>解析：{{question.explain}}</p>
          <p>笔记：{{question.note}} </p>
          <div style="text-align: right; margin: 0">
            <el-button type="primary" size="mini" @click="editNote(question.id)">编辑笔记</el-button>
          </div>
          <el-card slot="reference" style="width: 300px;background-color: #d3dce6" shadow="hover">
            <span class="content ">{{ question.content }}</span>
          </el-card>
        </el-popover>
      </div>
    </div>

    <div class="right" v-else>
      <p style="color: #99a9bf; padding: 20px">本次作业没有错题</p>
    </div>

    <el-dialog :visible.sync="open" >
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData">
          <el-col :span="24">
            <el-form-item label="笔记" prop="note">
              <el-input v-model="formData.note" type="textarea" placeholder="请输入笔记"
                        :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "WrongQuestionView",
  props: {
    courseId: {
      type: Number,
      required: true
    },
    userId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      homeworkList: [],
      questionList: [],
      navi: [],
      dict: new Map([
        ['1-1', 'A'],
        ['1-2', 'B'],
        ['1-3', 'C'],
        ['1-4', 'D'],
        ['4-1', 'T'],
        ['4-2', 'F'],
      ]),
      formData: {
        note: null
      },
      open: false
    }
  },
  methods: {
    getHomeworks() {
      axios.get(`/api/homework/bycourse/${this.courseId}`)
          .then(resp => {
            if (resp.data.code === 200) {
              this.homeworkList = resp.data.data;
            } else {
              this.$message.error('发生了错误: ' + resp.data.msg);
            }
          })
    },
    getQuestions(hwId) {
      axios.get(`/api/uq/question/wrong?userId=${this.userId}&homeworkId=${hwId}`)
          .then(resp => {
            if (resp.data.code === 200) {
              this.questionList = resp.data.data;
            } else {
              this.$message.error('发生了错误：' + resp.data.msg);
            }
          })
    },
    printAns(type, ans) {
      if (type === 2) {
        let str = '';
        let parse = JSON.parse(ans);
        for (let i = 0; i < 4; i++) {
          if (parse[i]) str += this.dict.get(`1-${i + 1}`)
        }
        return str;
      } else if (type === 1) {
        return this.dict.get(`1-${ans}`)
      } else if (type === 4) {
        return this.dict.get(`4-${ans}`)
      } else {
        return ans;
      }
    },
    editNote(id){
      axios.get(`/api/uq/${id}`)
      .then(resp=>{
        if(resp.data.code === 200){
          this.formData = resp.data.data;
          this.open = true;
        } else {
          this.$message.error('发生了错误：'+resp.data.msg);
        }
      })
    },
    cancel(){
      this.formData = {
        note: null
      }
      this.open = false;
    },
    submit(){
      axios.put("/api/uq",this.formData)
      .then(resp=>{
        if(resp.data.code === 200){
          this.$message.success('操作成功');
          this.cancel();
        } else {
          this.$message.error('操作失败！');
        }
      })
    }
  },

  mounted() {
    this.getHomeworks();
  }
}
</script>

<style scoped>
.container {
  display: flex;
  height: 100%;
  padding: 10px;
  flex-wrap: wrap;
}

.left {
  width: 28%; /* 左边部分宽度占30% */
  padding-top: 10px;
  height: 100%;
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
  text-align-all: left;
  margin: auto;
}

.card-content {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
</style>
