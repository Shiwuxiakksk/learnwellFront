<template>
  <div class="navbar">
    <el-menu
        :default-active="activeIndex"
        class="menu"
        mode="horizontal"
        @select="handleSelect"
        background-color="#409EFF"
        text-color="#fff"
        active-text-color="#ffd04b">
      <el-menu-item index="1"><a href="" target="_blank" >明学在线学习平台</a></el-menu-item>
      <el-menu-item index="2"><a href="" target="_blank">公告信息</a></el-menu-item>
      <el-menu-item index="3" v-if="!isLogin"><a href="" target="_blank">后台管理</a></el-menu-item>
      <el-menu-item index="4" v-if="!isLogin"><a href="" target="_blank">马上登陆</a></el-menu-item>
      <el-menu-item index="5" v-if="!isLogin"><a href="" target="_blank">点击注册</a></el-menu-item>
      <el-menu-item index="3" v-if="isLogin&&!loginType"><a href="" target="_blank">课程学习</a></el-menu-item>
      <el-menu-item index="4" v-if="isLogin&&!loginType"><a href="" target="_blank">我的作业</a></el-menu-item>
      <el-submenu index="5" v-if="isLogin&&!loginType">
        <template slot="title">学生</template>
        <el-menu-item index="5-1">我的成绩</el-menu-item>
        <el-menu-item index="5-2">个人信息</el-menu-item>
        <el-menu-item index="5-3">退出登陆</el-menu-item>
      </el-submenu>
      <el-menu-item index="3" v-if="isLogin&&loginType"><a href="" target="_blank">发布课程</a></el-menu-item>
      <el-menu-item index="4" v-if="isLogin&&loginType"><a href="" target="_blank">发布作业</a></el-menu-item>
      <el-menu-item index="4" v-if="isLogin&&loginType"><a href="" target="_blank">批改作业</a></el-menu-item>
      <el-submenu index="5" v-if="isLogin&&loginType">
        <template slot="title" >教师</template>
        <el-menu-item index="5-1">修改成绩</el-menu-item>
        <el-menu-item index="5-2">个人信息</el-menu-item>
        <el-menu-item index="5-3">退出登陆</el-menu-item>
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