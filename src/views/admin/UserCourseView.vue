<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item>
        <el-input
            v-model="queryParams.userName"
            placeholder="请输入学生/教师姓名"
        />
      </el-form-item>
      <el-form-item>
        <el-input
            v-model="queryParams.courseName"
            placeholder="请输入课程名"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
            v-model="timevalue"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="tableData">
      <el-table-column label="用户姓名" align="center" prop="userName"/>
      <el-table-column label="课程名" align="center" prop="courseName"/>
      <el-table-column label="开始时间" align="center" prop="startTime"/>
      <el-table-column label="结束时间" align="center" prop="endTime"/>
      <el-table-column label="成绩">
        <template slot-scope="scope">
          <span v-if="scope.row.score != null">{{scope.row.score}}</span>
          <span v-else>暂无成绩</span>
        </template>
      </el-table-column >
      <el-table-column>
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
  name: "UserCourseView",
  data() {
    return {
      // 遮罩层
      loading: true,

      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,

      // 弹出层标题
      title: "",
      timevalue: [null,null],
      tableData: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        userName: '',
        courseName: '',
        startTime: null,
        endTime: null
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

      },
      rules: {
      },

      isAdd: true,

    };
  },
  created() {
    this.getCount();
  },
  methods: {
    getList() {
      axios.get(`/api/ucr`)
          .then(resp => {
            if (resp.data.code === 200) {
              this.loading = false
              this.tableData = resp.data.data
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
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('确定要删除吗？')
          .then(() => {
            axios.delete(`/api/ucr/${row.id}`)
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
      axios.post("/api/ucr/page", this.pageBean).then(resp => {
        if (resp.data.code === 200) {
          this.tableData = resp.data.data
          this.loading = false
        } else {
          this.$message.error(resp.data.msg)
        }
      })
    },

    getCount() {
      this.queryParams.startTime = this.timevalue[0];
      this.queryParams.endTime = this.timevalue[1];
      this.pageBean.data = this.queryParams
      axios.post('/api/ucr/count', this.pageBean).then(resp => {
        if (resp.data.code === 200) {
          this.pageBean = resp.data.data
          this.getPagination()
        } else {
          this.$message.error(resp.data.msg)
        }
      })
    },
  },
  mounted() {
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
