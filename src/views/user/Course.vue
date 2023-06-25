<template>
    <div class="app-container">
      <el-table v-loading="loading" :data="questionList" @selection-change="handleSelectionChange">
        <el-table-column label="课程名" align="center" prop="name">
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
        pageBean: {
          data: null,
          totalRows: -1,
          pageSize: 5,
          currentPage: 1,
        },
        // 表单参数
        form: {},
        formData: {
          type: 1,
          content: '',
          pic: null,
          answer: undefined,
          explain: undefined,
        },
      };
    },
    created() {
      this.getCount();
    },
    methods: {
      getList() {
        axios.get(`/getCourseByUser/`+this.$route.params.id)
            .then(resp => {
              if (resp.data.code === 200) {
                this.loading = false
                this.courseList = resp.data.data
              } else {
                this.$message.error('load error')
              }
            })
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
      /** 导出按钮操作 */
      handleExport() {
  
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
  