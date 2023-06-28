<template>
  <div class="navbar">
    <el-menu
        :default-active="activeIndex"
        class="menu"
        mode="horizontal"
        @select="handleSelect"
        background-color="#606266"
        text-color="#fff"
        active-text-color="#ffd04b">
      <el-menu-item index="1" @click="toIndex">明学在线学习平台</el-menu-item>
      <el-menu-item index="2" v-if="!isLogin"  @click="toAdmin">后台管理</el-menu-item>
      <el-menu-item index="3" v-if="!isLogin" @click="toLogin">马上登陆</el-menu-item>
      <el-menu-item index="4" v-if="!isLogin" @click="toReg">点击注册</el-menu-item>
      <el-menu-item index="2" v-if="isLogin&&!loginType"@click="toCourse">课程学习</el-menu-item>
      <el-menu-item index="3" v-if="isLogin&&!loginType" @click="toSelect">课程选修</el-menu-item>
      <el-submenu index="4" v-if="isLogin&&!loginType">
        <template slot="title">学生</template>
        <el-menu-item index="4-1" @click="toInfo">个人信息</el-menu-item>
        <el-menu-item index="4-2" v-if="isLogin" @click="loginOut">退出登陆</el-menu-item>
      </el-submenu>
      <el-submenu index="2" v-if="isLogin&&loginType" >
        <template slot="title" >课程</template>
        <el-menu-item index="2-1" @click="toAddCourse">发布课程</el-menu-item>
        <el-menu-item index="2-2" @click="toTeacherCourse">管理课程</el-menu-item>
      </el-submenu>
      <el-menu-item index="3" v-if="isLogin&&loginType" @click="toTeacherHomework">作业</el-menu-item>
      <el-submenu index="4" v-if="isLogin&&loginType">
        <template slot="title" >教师</template>
        <el-menu-item index="4-1" @click="toInfo">个人信息</el-menu-item>
        <el-menu-item index="4-2" v-if="isLogin" @click="loginOut">退出登陆</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "IndexView",
  data() {
    return {
      activeIndex: '1',
      isLogin:false,
      loginType:false,

    }
  },
  created() {
    this.setActiveIndex(); // 在组件创建时设置初始的activeIndex
  },
  watch: {
    $route(to, from) {
      this.setActiveIndex(); // 监听路由变化，更新activeIndex
    }
  },
  mounted(){
    console.log(localStorage.getItem("type"))
    if(localStorage.getItem("type")===""){
      this.isLogin=false;
    }
    else this.isLogin=true;

    if(localStorage.getItem("type")==2) this.loginType=true;
    else this.loginType=false;
  },
  methods: {
    toTeacherHomework(){
      const targetRoute = "/teacher/homework";
      if (this.$route.path !== targetRoute) {
        this.$router.push(targetRoute);
      }
    },
    toTeacherCourse() {
      const targetRoute = "/teacher/Course/"+localStorage.getItem("id");
      if (this.$route.path !== targetRoute) {
        this.$router.push(targetRoute);
      }
    },
    toSelect(){
      const targetRoute = "/course/selectCourse";
      if (this.$route.path !== targetRoute) {
        this.$router.push(targetRoute);
      }
    },
    toAddCourse(){
      const targetRoute = "/teacher/addCourse/"+localStorage.getItem("id");
      if (this.$route.path !== targetRoute) {
        this.$router.push(targetRoute);
      }
    },
    setActiveIndex() {
      const routePath = this.getCurrentRoute || this.$route.path; // 如果你使用了Vuex，使用getter获取当前路由路径；否则，使用$route.path获取当前路由路径
      if (routePath.includes('/student/course')) {
        this.activeIndex = '2';
      } else if (routePath.includes('/admin')) {
        this.activeIndex = '2';
      } else if (routePath.includes('/login')) {
        this.activeIndex = '3';
      } else if (routePath.includes('/register')) {
        this.activeIndex = '4';
      } else if (routePath.includes('/student/selectCourse')) {
        this.activeIndex = '3';
      } else if (routePath.includes('/teacher/addCourse')) {
        this.activeIndex = '2-1';
      } else if (routePath.includes('/teacher/Course')) {
        this.activeIndex = '2-2';
      } else {
        this.activeIndex = '1';
      }
    },
    loginOut(){
      axios.post("/user/loginOut").then(res=>{
        console.log(res.data);
        if(res.data.code==200){
          this.$message.success('退出成功')
          localStorage.setItem("token","");
          localStorage.setItem("id","");
          localStorage.setItem("type","");
          this.$router.push("/login");
        }
      })
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    toIndex(){
      const targetRoute = "/";
      if (this.$route.path !== targetRoute) {
        this.$router.push(targetRoute);
      }
    },
    toAdmin(){
      const targetRoute = "/admin";
      if (this.$route.path !== targetRoute) {
        this.$router.push(targetRoute);
      }
    },
    toReg(){
      const targetRoute = "/register";
      if (this.$route.path !== targetRoute) {
        this.$router.push(targetRoute);
      }
    },
    toLogin(){
      const targetRoute = "/login";
      if (this.$route.path !== targetRoute) {
        this.$router.push(targetRoute);
      }
    },
    toInfo(){
      const targetRoute = "/user/information/"+localStorage.getItem("id");
      if (this.$route.path !== targetRoute) {
        this.$router.push(targetRoute);
      }
    },
    toCourse(){
      const targetRoute = "/student/course/"+localStorage.getItem("id");
      if (this.$route.path !== targetRoute) {
        this.$router.push(targetRoute);
      }
    }
  }
}
</script>
<style>
a{
  text-decoration: none;
}
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
.menu {
  display: flex;
  justify-content: center;
}
</style>