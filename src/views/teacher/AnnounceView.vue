<template>
    <div>
      <h1>课程公告管理</h1>
      <el-table :data="announces" >
        <el-table-column prop="title" label="主题"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="info" @click="handle">查看详情</el-button> -->
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleModify(scope.$index, scope.row)"
              >修改</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="addDialogVisible=true">新增公告</el-button>
      <el-dialog :visible.sync="addDialogVisible" title="新增公告">
        <el-form :model="modifyForm" rules="rules">
          <el-form-item label="课程编号">
            <el-input v-model="addForm.courseId" readonly></el-input>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="addForm.content"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button @click="handleAdd()">添加</el-button>
        </span>
      </el-dialog>
  
      <el-dialog :visible.sync="modifyDialogVisible" title="修改公告信息">
        <el-form :model="modifyForm" rules="rules">
          <el-form-item label="课程编号">
            <el-input v-model="modifyForm.courseId" readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="modifyForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="modifyForm.content"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyDialogVisible = false">取消</el-button>
          <el-button @click="modify">提交</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  export default {
    name: "TeacherAnnounceView",
  
    data() {
      return {
        announces: [],
        addDialogVisible: false,
        modifyDialogVisible: false,
        queryCondition: {
          courseId: 1,
          //实际运行时courseId需指定为对应的课程编号
          title: undefined,
          content: undefined,
        },
        addForm: {
          courseId: 1,
          title: undefined,
          content: undefined,
        },
        modifyForm: {
          courseId: undefined,
          title: undefined,
          content: undefined,
        },
        pageBean: {
          data: null,
          totalRows: -1,
          pageSize: 5,
          currentPage: 1,
        },
      };
    },
  
    mounted() {
      this.handleFind();
    },
  
    methods: {
      query() {
        this.pageBean.currentPage = 1;
        this.getCount();
      },
      handleFind() {
        this.pageBean.currentPage = 1;
        this.getCount();
      },
      handleAdd() {
        axios.post("/api/announce/addAnno", this.addForm).then((res) => {
          if (res.data.code != 200) {
            this.$message.error(res.data.msg);
          } else {
            this.addFormVisible = false;
            this.$message({
              type: "success",
              message: "添加成功",
            });
            this.addForm = {};
            this.handleFind();
          }
        });
      },
      handleModify(index, row) {
        this.modifyDialogVisible = true;
        this.axios
          .get("/api/announce/queryById/" + row.id)
          .then((res) => {
            if (res.data.code == 200) {
              this.modifyForm = res.data.data;
            } else {
              this.$message.error(res.data.msg);
            }
          });
      },
      modify() {
        this.axios
          .put("/api/announce/update", this.modifyForm)
          .then((res) => {
            if (res.data.code == 200) {
              this.modifyDialogVisible = false;
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
        this.$confirm("确认删除该公告？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.axios
              .delete("/api/announce/deleteAnno/" + row.id)
              .then((res) => {
                if (res.data.code == 200) {
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                  });
                  this.handleFind();
                } else {
                  this.$message.error("删除失败");
                }
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
      getPagination() {
        this.pageBean.data = this.queryCondition;
        axios
          .post("/api/announce/page", this.pageBean)
          .then((res) => {
            if (res.data.code == 200) {
              this.announces = res.data.data;
            } else {
              this.$message.error(res.data.msg);
            }
          });
      },
      getCount() {
        this.pageBean.data = this.queryCondition;
        axios
          .post("/api/announce/count", this.pageBean)
          .then((res) => {
            if (res.data.code == 200) {
              this.pageBean = res.data.data;
              this.getPagination();
            } else {
              this.$message.error(res.data.msg);
            }
          });
      },
      handleSizeChange(val) {
        this.pageBean.pageSize = val;
        this.getPagination();
      },
      handleCurrentChange(val) {
        this.pageBean.currentPage = val;
        this.getPagination();
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  </style>