<template>
  <div class="container">
    <el-row gutter="15">

      <div class="left">
        <el-row :gutter="15">
          <el-form  ref="elForm0" label-width="100px">
            <el-col :span="24">
              <el-form-item label="作业名称" prop="title">
                <el-input v-model="homeData.title" placeholder="请输入作业名称" clearable :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始时间" prop="startTime">
                <el-date-picker v-model="homeData.startTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                                :style="{width: '100%'}" placeholder="请选择开始时间" clearable></el-date-picker>

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker v-model="homeData.endTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                                :style="{width: '100%'}" placeholder="请选择结束时间" clearable></el-date-picker>
              </el-form-item>
            </el-col>
            <el-button type="primary" @click="submitForm">保存</el-button>
            <el-button type="danger" @click="del">删除</el-button>
          </el-form>
        </el-row>

        <span style="color: #B3C0D1; padding-top: 20px" > 已选题目 </span>
        <el-table :data="selectedQuestions" height="420" border style="width: 100%">
          <el-table-column label="问题类型" align="center" prop="type" min-width="20%">
            <template slot-scope="scope">
              {{ typeOptions[scope.row.type - 1].label }}
            </template>
          </el-table-column>
          <el-table-column label="问题内容" align="center" prop="content"/>
          <el-table-column label="分值" align="center" min-width="20%">
            <template slot-scope="scope">
              <el-input
                  v-model="scope.row.score"
                  size="mini"
                  :placeholder="5"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding" min-width="20%">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="removeFromSelected(scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save">保存</el-button>
      </div>

      <div class="right">

        <span style="color: #B3C0D1"> 题库 （最多显示500条） </span>

        <el-form style="padding-left: 12%">
          <el-row type="flex" justify="start" align="top" >
            <el-col :span="12">
              <el-form-item label="" prop="searchText">
                <el-input v-model="content" placeholder="请输入题目信息" clearable
                          :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="medium" @click="searchQuestions"> 搜索</el-button>
                <el-button type="danger" icon="el-icon-circle-plus" size="medium" @click="newRequest"> 新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-table :data="dbQuestions" height="610" border style="width: 100%">
          <el-table-column label="问题类型" align="center" prop="type" min-width="20%">
            <template slot-scope="scope">
              {{ typeOptions[scope.row.type - 1].label }}
            </template>
          </el-table-column>
          <el-table-column label="问题内容" align="center" prop="content"/>
          <el-table-column label="操作" align="center" class-name="small-padding" min-width="20%">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="addFromDB(scope.row)">添加
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>

    <!-- 弹窗   -->
    <el-dialog title="添加题目" :visible.sync="open" width="500px" append-to-body>
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-col :span="24">
            <el-form-item label="问题类型" prop="type">
              <el-radio-group v-model="formData.type" size="medium">
                <el-radio v-for="(item, index) in typeOptions" :key="index" :label="item.value"
                          :disabled="item.disabled">{{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容" prop="content">
              <el-input v-model="formData.content" type="textarea" placeholder="请输入内容"
                        :autosize="{minRows: 4, maxRows: 7}" :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图片" prop="picture">
              <el-upload ref="picture"
                         class="upload-demo"
                         :action="pictureAction"
                         :before-upload="pictureBeforeUpload"
                         :multiple="false"
                         name="file"
                         :data="dataPart"
                         :on-success="afterUpload"
                         list-type="picture"
                         :file-list="picturefileList"
                         accept="image/*">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过15MB</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="答案" prop="answer" v-if="formData.type===3 || formData.type===5">
              <el-input v-model="formData.answer" placeholder="请输入答案" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
            <el-form-item label="答案" prop="answer" v-if="formData.type===1">
              <el-radio-group v-model="formData.answer">
                <el-radio v-for="(item, index) in ansOptions" :key="index" :label="item.value" :value="item.value"
                          :disabled="item.disabled">{{ item.label }}
                </el-radio>
              </el-radio-group>

            </el-form-item>
            <el-form-item label="答案" prop="answer" v-if="formData.type===2">
              <el-checkbox v-for="(item, index) in ansOptions" :key="index"
                           :label="item.value" :disabled="item.disabled"
                           v-model="answers[item.value-1]">
                {{ item.label }}
              </el-checkbox>
            </el-form-item>
            <el-form-item label="答案" prop="answer" v-if="formData.type===4">
              <el-radio-group v-model="formData.answer">
                <el-radio v-for="(item, index) in judgeOptions" :key="index" :label="item.value"
                          :disabled="item.disabled">{{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="解析" prop="explain">
              <el-input v-model="formData.explain" type="textarea" :autosize="{minRows: 4, maxRows: 4}"
                        :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="addNewQuestion">确定</el-button>
      </div>
    </el-dialog>


  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "HomeworkManageView",
  inheritAttrs: false,
  props :{
    homeworkId: {
      type: Number,
    }
  },
  data() {
    return {
      open: false,
      formData: {
        type: 1,
        content: '',
        pic: null,
        answer: undefined,
        explain: undefined,
      },
      scores: [],
      isAdd: false,
      rules: {
        type: [{
          required: true,
          message: '问题类型不能为空',
          trigger: 'change'
        }],
        content: [{
          required: true,
          message: '请输入内容',
          trigger: 'blur'
        }],
        answer: [{
          required: true,
          message: '请输入答案',
          trigger: 'blur'
        }],
        explain: [],
      },
      dataPart: {
        'bucketName': 'questionbucket'
      },
      picturefileList: [],
      pictureAction: null,
      answers: [false,false,false,false],
      homeData: {
        title: undefined,
        startTime: null,
        endTime: null,
      },
      typeOptions: [
        {
          "label": "单选题",
          "value": 1
        }, {
          "label": "多选题",
          "value": 2
        }, {
          "label": "填空题",
          "value": 3
        }, {
          "label": "判断题",
          "value": 4
        }, {
          "label": "大题",
          "value": 5
        }],
      ansOptions: [
        {
          "label": "A",
          "value": "1"
        }, {
          "label": "B",
          "value": "2"
        }, {
          "label": "C",
          "value": "3"
        }, {
          "label": "D",
          "value": "4"
        }],
      judgeOptions: [
        {
          "label": "T",
          "value": "1"
        }, {
          "label": "F",
          "value": "2"
        }],
      dict: new Map([
        ['1-1', 'A'],
        ['1-2', 'B'],
        ['1-3', 'C'],
        ['1-4', 'D'],
        ['4-1', 'T'],
        ['4-2', 'F'],
      ]),
      content: '',
      activeName: 'first',
      dbQuestions: [{
        type: 1,
        content: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
        pic: null,
        answer: undefined,
        explain: undefined,
      }],
      selectedQuestions: [{
        type: 1,
        content: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
        pic: null,
        answer: undefined,
        score: 5,
      }],
      scoreArray: []
    }
  },
  methods: {
    submitForm() {
      axios.put("/api/homework",this.homeData)
      .then(resp=>{
        if(resp.data.code===200){
          this.$message.success('保存成功')
          this.cancel();
        } else {
          this.$message.error('保存失败！'+resp.data.msg)
        }
      })
    },
    addNewQuestion(){
      axios.post("/api/question",this.formData)
      .then(resp=>{
        if(resp.data.code === 200){
          this.$message.success('添加成功！');
          this.open=false;
          this.searchQuestions();
        }
      })
    },
    resetForm() {
      this.$refs['elForm0'].resetFields()
    },
    onOpen() {

    },
    onClose() {
      this.$refs['elForm'].resetFields()
    },
    close() {
      this.$emit('update:visible', false)
    },

    addFromDB(data) {
      for (let i of this.selectedQuestions) {
        if (i.id === data.id) return;
      }
      this.selectedQuestions.push(data);
    },
    removeFromSelected(id) {
      let idx = this.selectedQuestions.findIndex(i => i.id === id);
      this.selectedQuestions.splice(idx, 1);
    },
    searchQuestions() {
      axios.get(`/api/question/bycontent?content=${this.content}`)
          .then(resp => {
            if (resp.data.code === 200) {

              this.dbQuestions = resp.data.data;
            } else {
              this.$message.error('搜索出现错误:' + resp.data.message);
            }
          })
    },
    searchSelected() {
      axios.get(`/api/hq/question/${this.homeworkId}`)
          .then(resp => {
            if (resp.data.code === 200) {
              this.selectedQuestions = resp.data.data;
            } else {
              this.$message.error('搜索出现错误:' + resp.data.message);
            }
          })
    },
    save() {
      this.$confirm('确定要提交吗？')
          .then(() => {
            let ls = this.selectedQuestions.map(o => o.id);
            let sc = this.selectedQuestions.map(o => o.score);
            let body = {
              'homeworkId': this.homeworkId,
              'questionIdList': ls,
              'scoreList': sc
            }
            axios.post("/api/hq/batch", body)
                .then(resp => {
                  if (resp.data.code === 200) {
                    this.$message.success('操作成功')
                  } else {
                    this.$message.error('操作失败：' + resp.data.msg);
                  }
                })
          }).catch(() => {
        this.$message.info('取消了操作')
      })
    },
    selectHomework(){
      axios.get(`/api/homework/${this.homeworkId}`)
      .then(resp=>{
        if(resp.data.code === 200){
          this.homeData = resp.data.data;
        } else {
          this.$message.error("查询作业失败！"+resp.data.msg);
        }
      })
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.formData = {
        id: null,
        type: null,
        content: null,
        answer: null,
        pic: null,
        explain: null,
      };
    },
    pictureBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 15
      if (!isRightSize) {
        this.$message.error('文件大小超过 15MB')
      }
      let isAccept = new RegExp('image/*').test(file.type)
      if (!isAccept) {
        this.$message.error('应该选择image/*类型的文件')
      }
      return isRightSize && isAccept
    },
    /** 文件上传后处理 */
    afterUpload(resp) {
      console.log(resp);
      if (resp.code === 200) {
        this.formData.pic = resp.data
      } else {
        this.$message.error(resp.data.msg)
      }
    },
    newRequest(){
      this.reset();
      this.open=true;
    },
    del(){
      this.$confirm('确定要删除吗？')
      .then(()=>{
        axios.delete(`/api/homework/${this.homeworkId}`)
        .then(resp=>{
          if(resp.data.code === 200){
            this.$message.success('删除成功')
          } else {
            this.$message.error('发生了错误：'+resp.data.msg)
          }
        })
      })
      .catch((e)=>{
        this.$message.info('取消了操作')
      })
    }
  },
  mounted() {
    console.log('init')
    this.pictureAction = `${axios.defaults.baseURL}/api/file/upload/`;
    this.selectHomework();
    this.searchQuestions();
    this.searchSelected();
  }
}

</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.left {
  width: 45%;
  float: left;

}

.leftup {
  float: left;
  width: 45%;
  height: 40%;
  margin-left: 4%;
}

.leftdown {
  float: left;
  margin-top: 15%;
  width: 45%;
  margin-left: 4%;
}

.right {
  width: 45%;
  float: right;
  margin-right: 4%;
}
</style>
