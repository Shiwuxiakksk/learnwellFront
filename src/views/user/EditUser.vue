<template>
    <el-dialog title="弹窗" :visible.sync="detailVisible" width="35%">
    <el-card>
      <el-descriptions class="margin-top" title="简介" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-picture-outline"></i>
            头像
          </template>
          <img class="img" :src="data.avatar" alt="" />
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            uid
          </template>
          {{ data.uid }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-custom"></i>
            昵称
          </template>
          {{data. name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-odometer"></i>
            年龄
          </template>
          {{ data.age }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-male"></i>
            <i class="el-icon-female"></i>
            性别
          </template>
          <el-tag size="small">{{ data.sex }}</el-tag>
        </el-descriptions-item>

      </el-descriptions>
    </el-card>
    <div slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </div>
    </el-dialog>
</template>

<script>
import axios from "axios";
export default {
  name: "dialogComponent",
  data() {
    return {
      data:{
        id:"",
        uid: "",
        avatar:"",
        account:"",
        age: "",
        name: "",
        sex: "",
      } ,
      detailVisible:false
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      axios.get('/user/getUser/'+this.$route.params.id)
        .then((res) => {
          this.data.id=res.data.data.id;
          this.data.avatar = res.data.data.avatar;
          this.data.uid = res.data.data.uid;
          this.data.age = res.data.data.age;
          this.data.name = res.data.data.name;
          this.data.sex = res.data.data.sex == 1 ? "男" : "女";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    submitForm() {
        axios.post("/user/updateUser", this.data)
            .then(resp => {
              if (resp.data.code === 200) {
                this.$message.success('修改成功！');
                this.cancel()
              } else {
                this.$message.error('修改失败：' + resp.data.msg)
              }
        })
  },
  }

}
  

</script>

<style scoped>
.img {
  width: 80px;
  height: 80px;
}
</style>
