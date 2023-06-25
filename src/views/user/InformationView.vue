<template>
    <div>
      <div class="PersonTop">
        <div class="PersonTop_img">
          <img :src="user.avatar" />
        </div>
        <div class="PersonTop_text">
          <div class="user_text">
            <div class="user_name">
              <span style="margin-right: 400px"> {{ user.name }} </span>
            </div>
          </div>
        </div>
      </div>
      <div class="person_body">
        <div class="person_body_left">
          <el-card class="box-card" :body-style="{ padding: '0px' }">
            <div slot="header" class="clearfix">
              <span class="person_body_list" style="border-bottom: none">个人中心</span>
            </div>
            <el-menu
              active-text-color="#00c3ff"
              class="el-menu-vertical-demo">
              <el-menu-item
                index="info">
                <i class="el-icon-user"></i>
                <span slot="title">个人简介</span>
              </el-menu-item>
             <!-- <el-menu-item
                index="myarticle">
                <i class="el-icon-edit-outline"></i>
                <span slot="title">我的课程</span>
              </el-menu-item>
              <el-menu-item
                index="mycollect">
                <i class="el-icon-document"></i>
                <span slot="title">我的评论</span>
              </el-menu-item>
              <el-menu-item
                index="student" v-if="user.type==2">
                <i class="el-icon-document"></i>
                <span slot="title">我的学生</span>
              </el-menu-item>
            -->
            </el-menu>
          </el-card>
        </div>
        <div class="person_body_right">
          <component :is='comName'></component>
        </div>
      </div>
    </div>
</template>
  
<script>
import axios from "axios";
import info from "./Info.vue";
export default {
  components: {info},
  name: "Personal",
  data() {
    return {
      comName:"info",
      user:{
        id:"",
        uid:"",
        name:"",
        avatar:"",
        type:"",
      }
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      axios.get('/user/getUser/'+this.$route.params.id)
        .then((res) => {
          console.log(res);
          this.user.id=res.data.data.id;
          this.user.name=res.data.data.name;
          this.user.uid=res.data.data.uid;
          this.user.avatar=res.data.avatar;
          this.user.type=res.data.data.type;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    edit() {
      this.$refs.dia.open();
    },
}
}
</script>
  
<style scoped>
  .me-video-player {
    background-color: transparent;
    width: 100%;
    height: 100%;
    object-fit: fill;
    display: block;
    position: fixed;
    left: 0;
    z-index: 0;
    top: 0;
  }
  .PersonTop {
    width: 1000px;
    height: 140px;
    padding-top: 20px;
    background-color: white;
    margin-top: 30px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    border-radius: 5px;
  }
  
  .PersonTop_img {
    width: 150px;
    height: 120px;
    background-color: #8c939d;
    margin-right: 24px;
    margin-left: 20px;
    overflow: hidden;
    border-radius: 20px;
  }
  
  .PersonTop_img img {
    width: 100%;
    height: 100%;
    border-radius: 20px;
  }
  
  .PersonTop_text {
    height: 120px;
    width: 880px;
    display: flex;
  }
  
  .user_text {
    width: 60%;
    height: 100%;
    line-height: 30px;
  }
  
  .user_name {
    font-weight: bold;
  }
  .user-v {
    margin-bottom: -5px;
  }
  .user-v-img {
    width: 15px;
    height: 15px;
  }
  .user-v-font {
    font-size: 15px;
    color: #00c3ff;
  }
  .user_qianming {
    font-size: 14px;
    color: #999;
  }
  
  .user_num {
    width: 40%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  
  .user_num > div {
    text-align: center;
    border-right: 1px dotted #999;
    box-sizing: border-box;
    width: 80px;
    height: 40px;
    line-height: 20px;
  }
  
  .num_text {
    color: #999;
  }
  
  .num_number {
    font-size: 20px;
    color: #333;
  }
  .el-menu-item>span {
    font-size: 16px;
    color: #999;
  }
  
  /*下面部分样式*/
  .person_body {
    width: 1000px;
    margin-top: 210px;
    display: flex;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;
  }
  
  .person_body_left {
    width: 27%;
    height: 600px;
    border-radius: 5px;
    margin-right: 3%;
    text-align: center;
  }
  
  .person_body_list {
    width: 100%;
    height: 50px;
    margin-top: 25px;
    font-size: 22px;
    border-bottom: 1px solid #f0f0f0;
    background-image: -webkit-linear-gradient(
      left,
      rgb(42, 134, 141),
      #e9e625dc 20%,
      #3498db 40%,
      #e74c3c 60%,
      #09ff009a 80%,
      rgba(82, 196, 204, 0.281) 100%
    );
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-background-size: 200% 100%;
    -webkit-animation: masked-animation 4s linear infinite;
  }
  
  .el-menu-item {
    margin-top: 22px;
  }
  
  .person_body_right {
    width: 70%;
    /* height: 500px; */
    border-radius: 5px;
    background-color: white;
  }
  
  .box-card {
    height: 500px;
  }
  
  /*ui样式*/
  .el-button {
    width: 84px;
  }
</style>
  