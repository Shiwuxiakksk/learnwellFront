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
      <el-menu-item index="1"><a href="" target="_blank" >明学在线学习平台</a></el-menu-item>
      <el-menu-item index="2"><a href="" target="_blank">公告信息</a></el-menu-item>
      <el-menu-item index="3" v-if="!isLogin"  @click="toAdmin">后台管理</el-menu-item>
      <el-menu-item index="4" v-if="!isLogin" @click="toLogin">马上登陆</el-menu-item>
      <el-menu-item index="5" v-if="!isLogin" @click="toReg">点击注册</el-menu-item>
      <el-menu-item index="3" v-if="isLogin&&!loginType"><a href="" target="_blank">课程学习</a></el-menu-item>
      <el-menu-item index="4" v-if="isLogin&&!loginType"><a href="" target="_blank">我的作业</a></el-menu-item>
      <el-menu-item index="5" v-if="isLogin&&!loginType"><a href="" target="_blank">我的成绩</a></el-menu-item>
      <el-submenu index="6" v-if="isLogin&&!loginType">
        <template slot="title">学生</template>
        <el-menu-item index="6-1">个人信息</el-menu-item>
        <el-menu-item index="6-2">退出登陆</el-menu-item>
      </el-submenu>
      <el-submenu index="3" v-if="isLogin&&loginType">
        <template slot="title" >课程</template>
        <el-menu-item index="3-1">发布课程</el-menu-item>
        <el-menu-item index="3-2">管理课程</el-menu-item>
      </el-submenu>
      <el-submenu index="4" v-if="isLogin&&loginType">
        <template slot="title" >作业</template>
        <el-menu-item index="4-1">发布作业</el-menu-item>
        <el-menu-item index="4-2">管理作业</el-menu-item>
      </el-submenu>
      <el-menu-item index="5" v-if="isLogin&&loginType"><a href="" target="_blank">数据统计</a></el-menu-item>
      <el-submenu index="6" v-if="isLogin&&loginType">
        <template slot="title" >教师</template>
        <el-menu-item index="6-1">个人信息</el-menu-item>
        <el-menu-item index="6-2">退出登陆</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>

export default {
  name: "IndexView",
  data() {
    return {
      activeIndex: '1',
      isLogin:false,
      loginType:false,
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    toAdmin(){
      this.$router.push("/admin");
    },
    toReg(){
      this.$router.push("/register");
    },
    toLogin(){
      this.$router.push("/login");
    },
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