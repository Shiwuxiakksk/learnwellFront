<template>
  <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
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
            <el-image v-if="!isAdd && formData.pic != null"
                      :src="formData.pic"
                      style="width: 100px; height: 100px">
            </el-image>
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
      <el-button type="primary" @click="submitForm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import axios from "axios";

export default {
  name: 'QuestionEdit',
  props: {
  },
  data() {
    return {

      dataPart: {
        'bucketName': 'questionbucket'
      },
      picturefileList: [],
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
      formData: {
        type: 1,
        content: '',
        pic: null,
        answer: undefined,
        explain: undefined,
      },
      isAdd: false,
      answer: [false,false,false,false],
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
      pictureAction: null,
    }
  },
  methods: {
    submitForm() {
      if (this.formData.type === 2) {
        this.formData.answer = JSON.stringify(this.answers);
      }
      if (this.isAdd) {
        axios.post("/api/question", this.formData)
            .then(resp => {
              if (resp.data.code === 200) {
                this.$message.success('添加成功！');
                this.cancel()
              } else {
                this.$message.error('添加失败：' + resp.data.msg)
              }
            })
      } else {
        axios.put("/api/question", this.formData)
            .then(resp => {
              if (resp.data.code === 200) {
                this.$message.success('修改成功！');
                this.cancel()
              } else {
                this.$message.error('修改失败：' + resp.data.msg)
              }
            })
      }
      this.getCount()
      console.log(this.formData)
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
    cancel() {
      this.open = false;
      this.reset();
    },
  }
}
</script>
