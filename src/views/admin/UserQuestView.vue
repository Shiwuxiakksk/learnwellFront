<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" >
        <el-input
            v-model="queryParams.name"
            placeholder="请输入用户名"/>
      </el-form-item>
      <el-form-item label="题目">
        <el-input
            v-model="queryParams.content"
            placeholder="请输入题目"
        />
      </el-form-item>
      <el-form-item label="笔记">
        <el-input
            v-model="queryParams.note"
            placeholder="请输入笔记"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="questionList">
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="作业名称" prop="homeworkName" />
      <el-table-column label="题目内容" align="center" prop="content" />
      <el-table-column label="原答案" align="center" prop="ans" />
      <el-table-column label="正确答案" align="center" prop="corrAns" />
      <el-table-column label="错题笔记" align="center" prop="note" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"

          >修改</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"

          >删除</el-button>
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

    <!-- 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-col :span="24">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入姓名" :disabled='true' clearable
                        :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="题目内容" prop="content">
              <el-input v-model="formData.content" placeholder="请输入题目内容" :disabled='true' clearable
                        :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="提交答案" prop="ans">
              <el-input v-model="formData.ans" placeholder="请输入提交答案" :disabled='true' clearable
                        :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="正确答案" prop="corrAns">
              <el-input v-model="formData.corrAns" placeholder="请输入正确答案" :disabled='true' clearable
                        :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
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
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "UserQuestView",
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
        name: '',
        content: '',
        note: ''
      },
      pageBean: {
        data: null,
        totalRows: -1,
        pageSize: 5,
        currentPage: 1,
      },
      // 表单参数
      form: {},
      formData: {
        id: -1,
        name: null,
        content: null,
        ans: null,
        corrAns: null,
        note: null
      },
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      this.getCount();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        homeworkId: null,
        userId: null,
        questionId: null,
        ans: null,
        corrAns: null,
        note: null,
        createTime: null,
        updateTime: null,
        status: null,
        version: null
      };
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.pageBean.data = this.queryParams;
      this.getCount();
    },
    /** 重置按钮操作 */
    resetQuery() {
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      axios.get(`/api/uq/dto/${row.id}`)
      .then(resp=>{
        if(resp.data.code === 200){
          this.formData = resp.data.data;
          this.open = true;
        } else {
          this.$message.error('查询错误：'+resp.data.msg)
        }
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log('ok')
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('确定要删除吗？')
          .then(() => {
            axios.delete(`/api/uq/${row.id}`)
                .then(resp => {
                  if (resp.data.code === 200) {
                    this.$message.success('删除成功')
                    this.getPagination()
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
      axios.post("/api/uq/page", this.pageBean).then(resp => {
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
      axios.post('/api/uq/count', this.pageBean).then(resp => {
        if (resp.data.code === 200) {
          this.pageBean = resp.data.data
          this.getPagination()
        } else {
          this.$message.error(resp.data.msg)
        }
      })
    },
    handleConfirm() {
      axios.put('/api/uq',this.formData)
      .then(resp=>{
        if(resp.data.code === 200){
          this.$message.success('操作成功');
          this.getPagination()
          this.open = false;
        } else {
          this.$message.error('操作失败：'+resp.data.msg);
        }
      })
    }
  }
};
</script>
<style scoped>
.pagination-wrapper {
  position: fixed;
  bottom: 30px;
  left: 40%;
}
</style>
