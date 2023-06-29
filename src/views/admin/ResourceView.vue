<template>
  <div>
    <el-form :model="queryForm" inline>
      <el-form-item label="资源类型">
        <el-radio-group v-model="queryForm.type">
          <el-radio label="text">文本</el-radio>
          <el-radio label="video">视频</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="章节">
        <el-input v-model="queryForm.name"></el-input>
      </el-form-item>
      <el-button @click="query">查询</el-button>
    </el-form>
    <el-table :data="resource" style="width: 100%">
      <el-table-column prop="name" label="资源名称"></el-table-column>
      <el-table-column prop="url" label="内容链接"></el-table-column>
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


    <el-dialog :visible.sync="modifyFormVisible" title="修改资源信息">
      <el-form :model="modifyForm">
        <el-form-item label="资源名称">
          <el-input v-model="modifyForm.name"></el-input>
        </el-form-item>
        <el-form-item label="文件">
          <el-upload ref="picture"
                     class="upload-demo"
                     :action="resourceAction"
                     :multiple="false"
                     name="file"
                     :data="dataPart"
                     :on-success="afterUpload"
                     list-type="picture"
                     :file-list="fileList"
                     accept="image/*">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
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
  name: "ResourceView",

  data() {
    return {
      addFormVisible: false,
      modifyFormVisible: false,
      resource: [],
      fileList: [],
      pageBean: {
        data: null,
        totalRows: -1,
        pageSize: 5,
        currentPage: 1,
      },
      dataPart: {
        'bucketName': 'resourcebucket'
      },
      addForm: {
        name: undefined,
        type: undefined,
        url: undefined,
      },
      modifyForm: {
        name: undefined,
        type: undefined,
        url: undefined,
      },
      queryForm: {
        name: undefined,
        type: undefined,
      },
      resourceAction: null,
    };
  },

  mounted() {
    this.resourceAction = `${axios.defaults.baseURL}/api/file/upload`;
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
    handleModify(index, row) {
      this.modifyFormVisible = true;
      axios.get("/api/resource/queryById/" + row.id).then((res) => {
        if (res.data.code == 200) {
          console.log(res.data.data);
          this.modifyForm = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    modify() {
      axios.put("/api/resource", this.modifyForm).then((res) => {
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
    handleAdd() {
      axios.post("/api/resource/addResource", this.addForm).then((res) => {
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
    handleDelete(index, row) {
      this.$confirm("确认删除该资源？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios.delete("/api/resource/deleteResource/" + row.id).then((res) => {
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
        .post("/api/resource/count", this.pageBean)
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
      axios.post("/api/resource/page", this.pageBean).then((res) => {
        if (res.data.code == 200) {
          this.resource = res.data.data;
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
    afterUpload(res){
      if(res.data.code==200){
        this.fileList=res.data
      }
    },

  },
};
</script>

<style lang="scss" scoped>
</style>
