<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item prop="type">
        <el-radio-group v-model="queryParams.type">
          <el-radio label="0">不限</el-radio>
          <el-radio v-for="(item, index) in typeOptions" :key="index" :label="item.value" v-model="queryParams.type"
                    :disabled="item.disabled">{{ item.label }}</el-radio>
        </el-radio-group>

      </el-form-item>
      <el-form-item prop="answer">
        <el-input
            v-model="queryParams.content"
            placeholder="请输入问题内容"
        />
      </el-form-item>
      <el-form-item prop="explain">
        <el-input
            v-model="queryParams.explain"
            placeholder="请输入问题解析"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleMultiDelete"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="questionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="问题类型" align="center" prop="type">
        <template slot-scope="scope">
          {{typeOptions[scope.row.type-1].label}}
        </template>
      </el-table-column>
      <el-table-column label="问题内容" align="center" prop="content"/>
      <el-table-column label="问题答案" align="center" >
        <template slot-scope="scope">
          {{printAns(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column label="问题解析" align="center" prop="explain"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pagination-wrapper"
                   background
                   layout="sizes, prev, pager, next"
                   :total="pageBean.totalRows"
                   :page-size="pageBean.pageSize"
                   :page-sizes="[5, 10, 20, 100]"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
    >
    </el-pagination>

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


  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "QuestionView",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      questionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        type: null,
        content: null,
        explain: null
      },
      pageBean: {
        data: null,
        totalRows: -1,
        pageSize: 5,
        currentPage: 1,
      },
      // 表单参数
      form: {},
      answers: [false, false, false, false],
      formData: {
        type: 1,
        content: '',
        pic: null,
        answer: undefined,
        explain: undefined,
      },
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
      dataPart: {
        'bucketName': 'questionbucket'
      },
      isAdd: true,
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
    };
  },
  created() {
    this.getCount();
  },
  methods: {
    getList() {
      axios.get(`/api/question`)
          .then(resp => {
            if (resp.data.code === 200) {
              this.loading = false
              this.questionList = resp.data.data
            } else {
              this.$message.error('load error')
            }
          })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.pageBean.currentPage = 1
      this.getCount()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm") ;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.isAdd = true;
      this.title = "新增题目";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      axios.get(`/api/question/${row.id}`)
      .then(resp=>{
        if(resp.data.code === 200){
          this.formData = resp.data.data;
          if(this.formData.type === 2){
            this.answers = JSON.parse(this.formData.answer);
          }
          this.isAdd = false;
          this.title = "修改题目"
          this.open = true;
        } else {
          this.$message.error('根据id查询错误：'+resp.data.msg)
        }
      })

    },
    /** 提交按钮 */
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
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('确定要删除吗？')
          .then(() => {
            axios.delete(`/api/question/${row.id}`)
                .then(resp => {
                  if (resp.data.code === 200) {
                    this.$message.success('删除成功')
                  } else {
                    this.$message.error('删除失败：' + resp.data.data);
                  }
                })
            this.getPagination();
          })
          .catch(() => {
            this.$message.warning("取消了操作")
          });
    },
    handleMultiDelete() {
      this.$confirm('确定要删除吗？')
          .then(() => {
            axios.post("/api/question/delbatch", this.ids)
                .then(resp => {
                  if (resp.data.code === 200) {
                    this.$message.success(`成功删除了${resp.data.data}条记录`);
                  } else {
                    this.$message.error('删除失败：' + resp.data.data);
                  }
                })
            this.getCount();
          })
          .catch((e) => {
            console.log(e)
            this.$message.warning("取消了操作")
          });
    },

    /** 导出按钮操作 */
    handleExport() {

    },
    /** 文件拦截处理 */
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
    }
    ,
    handleSizeChange(val) {
      this.pageBean.pageSize = val
      this.getPagination()
    }
    ,
    handleCurrentChange(val) {
      this.pageBean.currentPage = val
      this.getPagination()
    }
    ,
    getPagination() {
      this.pageBean.data = this.queryParams
      axios.post("/api/question/page", this.pageBean).then(resp => {
        if (resp.data.code === 200) {
          this.questionList = resp.data.data
          this.loading = false
        } else {
          this.$message.error(resp.data.msg)
        }
      })
    },
    getCount() {
      this.pageBean.data = this.queryParams
      axios.post('/api/question/count', this.pageBean).then(resp => {
        if (resp.data.code === 200) {
          this.pageBean = resp.data.data
          this.getPagination()
        } else {
          this.$message.error(resp.data.msg)
        }
      })
    },
    printAns(qus){
      if(qus.type === 2){
        let str='';
        let parse = JSON.parse(qus.answer);
        for(let i=0;i<4;i++){
          if(parse[i]) str += this.dict.get(`1-${i+1}`)
        }
        return str;
      } else if(qus.type === 1){
        return this.dict.get(`1-${qus.answer}`)
      } else if (qus.type === 4){
        return this.dict.get(`4-${qus.answer}`)
      } else {
        return qus.answer;
      }

    }


  },
  mounted() {
    this.pictureAction = `${axios.defaults.baseURL}/api/file/upload/`;

  }
}
</script>
<style scoped>
.pagination-wrapper {
  position: fixed;
  bottom: 30px;
  left: 40%;
}
</style>
