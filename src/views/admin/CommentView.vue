<template>
  <div>
    <h1>评论管理</h1>
    <el-form inline :model="queryForm" ref="queryForm">
      <el-form-item label="评论者">
        <el-input v-model="queryForm.name"></el-input>
      </el-form-item>
      <el-form-item label="课程名称">
        <el-input v-model="queryForm.courseName"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="queryForm.content"></el-input>
      </el-form-item>
      <el-button @click="query">查询</el-button>
      <el-button @click="resetForm('queryForm')">重置</el-button>
    </el-form>
    <el-table :data="comments" style="width: 100%">
      <el-table-column prop="name" label="评论者"></el-table-column>
      <el-table-column prop="courseName" label="评论的课程"></el-table-column>
      <el-table-column prop="content" label="内容"></el-table-column>
      <el-table-column prop="createTime" label="发布时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="handleModify(scope.$index, scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination-wrapper"
      background
      layout="sizes, prev, pager, next"
      :total="pageBean.totalRows"
      :page-size="pageBean.pageSize"
      :page-sizes="[5, 10, 20, 50]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>

    <el-dialog :visible.sync="modifyFormVisible" title="修改评论信息">
      <el-form :model="modifyForm">
        <el-form-item label="评论内容">
          <el-input v-model="modifyForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyFormVisible = false">取消</el-button>
        <el-button @click="modify">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
  <script>
import axios from "axios";
export default {
  name: "CommentView",

  data() {
    return {
      comments: [],
      courses: [],
      addFormVisible: false,
      modifyFormVisible: false,
      pageBean: {
        data: null,
        totalRows: -1,
        pageSize: 5,
        currentPage: 1,
      },
      modifyForm: {
        id: undefined,
        content: undefined,
      },
      queryForm: {
        name:undefined,
        courseName: undefined,
        content: undefined,
      },
    };
  },

  mounted() {
    this.handleFind();
    this.getCourses();
  },

  methods: {
    handleFind() {
      this.pageBean.currentPage = 1;
      this.getCount();
    },
    query() {
      this.pageBean.currentPage = 1;
      this.getCount();
    },
    getCourses() {
      axios.get("/api/course").then((res) => {
        if (res.data.code == 200) {
          this.courses = res.data.data;
          console.log("0"+this.courses);
        } else {
          this.$message.error("无法获取课程列表");
        }
      });
    },
    handleModify(index, row) {
      this.modifyFormVisible = true;
      axios.get("/api/uc/" + row.id).then((res) => {
        if (res.data.code == 200) {
          console.log(res.data.data);
          this.modifyForm.id = res.data.data.commentId;
          this.modifyForm.content=res.data.data.content;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    modify() {
      axios.put("/api/comment/updateComment", this.modifyForm).then((res) => {
        if (res.data.code == 200) {
          this.modifyFormVisible = false;
          this.$message({
            type: "success",
            message: "修改成功!",
          });
          this.modifyForm = {};
          this.handleFind();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm("确认删除该评论？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios.delete("/api/uc/" + row.id).then((res) => {
            if (res.data.code != 200) {
              this.$message.error(res.data.msg);
            } else {
              this.$message({
                type: "success",
                message: "删除成功",
              });
            }
            this.handleFind();
          });
        })
        .catch((e) => {
          console.log(e);
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getCount() {
      this.pageBean.data = this.queryForm;
      axios
        .post("/api/uc/count", this.pageBean)
        .then((res) => {
          if (res.data.code == 200) {
            this.pageBean = res.data.data;
            this.getPagination();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getPagination() {
      this.pageBean.data = this.queryForm;
      axios.post("/api/uc/page", this.pageBean).then((res) => {
        if (res.data.code == 200) {
          console.log(this.comments);
          this.comments = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    handleSizeChange(val) {
      this.pageBean.pageSize = val;
      console.log(this.pageBean.pageSize);
      this.getPagination();
    },
    handleCurrentChange(val) {
      this.pageBean.currentPage = val;
      this.getPagination();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
  
  <style scoped>
.pagination-wrapper {
  position: fixed;
  bottom: 30px;
  left: 40%;
}
</style>