<template>
  <div class="container">
    <div v-for="(cm,idx) in comments" :key="idx">
      <div style="width: 100%;padding:10px">
        <div style="float: left">
          <el-avatar size="medium" :src="cm.avatar"/>
          <span >{{cm.name}}</span>
        </div>

        <div>
          <span style="color: #B3C0D1;float: right">{{cm.createTime}}</span>
          <div class="ct">
            <span style="float: left">{{cm.content}}</span></div>
        </div>
      </div>
    </div>
    <el-pagination
        class="pagination-wrapper"
        background
        layout="sizes, prev, pager, next"
        :total="pageBean.totalRows"
        :page-size="pageBean.pageSize"
        :page-sizes="[3, 5, 10, 20]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    ></el-pagination>
    <el-form :model="addForm" :rules="rules">
      <el-form-item label="内容" >
        <el-input type="textarea" rows="4" v-model="addForm.content" prop="content"></el-input>
      </el-form-item>
      <el-button @click="handleAdd">评论</el-button>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "StudentCommentView",
  props: {
    userId: {
      type: Number
    },
    type: {
      type: Number
    }
  },
  data() {
    return {
      addFormVisible: false,
      comments: [],
      addForm: {
        //实际运行时需改为对应的课程编号
        type: 200001,
        content: undefined,
        //实际运行时需改为对应的用户编号
        userId: 23,
      },
      queryForm: {
        courseName: undefined,
        content: undefined,
      },
      pageBean: {
        data: null,
        totalRows: -1,
        pageSize: 3,
        currentPage: 1,
      },
      rules:{
        content:[{
          required:true,
          message:'评论不能为空',
          trigger:'blur'
        }]
      }
    };
  },

  mounted() {

    this.handleFind();
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
    getCount() {
      this.pageBean.data = this.queryForm;
      axios
          .post("http://localhost:8081/api/uc/count", this.pageBean)
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
      axios
          .post("http://localhost:8081/api/uc/page", this.pageBean)
          .then((res) => {
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
    handleAdd() {
      axios.post("http://localhost:8081/api/uc", this.addForm).then((res) => {
        if (res.data.code == 200) {
          this.addFormVisible = false;
          this.$message({
            type: "success",
            message: "添加成功",
          });
          this.addForm.content = undefined;
        }
      });
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
  padding: 10px;
  text-align-all: left;
}

.ct {
  margin-top: 40px;
  min-height: 40px;
  min-width: 80vh;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
