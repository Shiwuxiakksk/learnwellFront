<template>
  <div>
    <h1>公告栏管理</h1>
    <el-form inline="true" :model="queryForm">
      <el-form-item label="课程名称">
        <el-input v-model="queryForm.name"></el-input>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="queryForm.title"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="queryForm.content"></el-input>
      </el-form-item>
      <el-button @click="query">查找</el-button>
    </el-form>
    <el-button @click="addDialogVisible = true">添加新公告</el-button>
    <el-table :data="announces" style="width: 100%">
      <!-- <el-table-column prop="id" label="编号" width="180"> </el-table-column> -->
      <el-table-column prop="name" label="所属课程"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="content" label="简介"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="info" @click="handle">查看详情</el-button> -->
          <el-button
            type="primary"
            @click="handleModify(scope.$index, scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
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

    <el-dialog :visible.sync="addDialogVisible" title="新增公告">
      <el-form :model="addForm" rules="rules">
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
  name: "AnnounceView",

  data() {
    return {
      addDialogVisible: false,
      modifyDialogVisible: false,
      announces: [],
      pageBean: {
        data: null,
        totalRows: -1,
        pageSize: 5,
        currentPage: 1,
      },
      addForm: {
        courseId: 0,
        title: undefined,
        content: undefined,
      },
      modifyForm: {
        courseId: undefined,
        title: undefined,
        content: undefined,
      },
      queryForm: {
        name: undefined,
        title: undefined,
        content: undefined,
      },
      rules: {
        courseId: [
          { required: true, message: "请指定所属课程", trigger: "blur" },
        ],
        title: [{ required: true, message: "请输入公告标题", trigger: "blur" }],
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
      axios
        .post("/api/announce/addAnno", this.addForm)
        .then((res) => {
          if (res.data.code != 200) {
            this.$message.error(res.data.msg);
          } else {
            this.addDialogVisible = false;
            this.$message({
              type: "success",
              message: "添加成功",
            });
            this.addForm = {};
            this.handleFind();
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
          axios
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
    handleModify(index, row) {
      this.modifyDialogVisible = true;
      axios
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
      axios
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
    getPagination() {
      this.pageBean.data = this.queryForm;
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
      this.pageBean.data = this.queryForm;
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
      console.log(this.pageBean.pageSize);
      this.getPagination();
    },
    handleCurrentChange(val) {
      this.pageBean.currentPage = val;
      this.getPagination();
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
