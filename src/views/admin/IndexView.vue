<template>
  <el-container style="overflow-y: hidden">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246); height: 95vh">
      <el-menu @select="handleSelect" :default-openeds="['1', '2']">
        <el-submenu index="1" style="background-color: #D3DCE6;">
          <template slot="title"><i class="el-icon-menu"></i>资源管理</template>
          <el-menu-item index="1-1">问题管理</el-menu-item>
          <el-menu-item index="1-2">错题管理</el-menu-item>
          <el-menu-item index="1-3">课程管理</el-menu-item>
          <el-menu-item index="1-4">公告管理</el-menu-item>
          <el-menu-item index="1-5">评论管理</el-menu-item>
          <el-menu-item index="1-6">选课/授课管理</el-menu-item>
          <el-menu-item index="1-7">资源管理</el-menu-item>
        </el-submenu>
        <el-submenu index="2" style="background-color: #D3DCE6;">
          <template slot="title"><i class="el-icon-setting"></i>。。。</template>
          <el-menu-item index="2-1">选课管理</el-menu-item>
          <el-menu-item index="2-2">。。。</el-menu-item>
          <el-menu-item index="2-3">用戶管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>


    <el-container>
      <el-header style="font-size: 12px">
        <div style="float: left;margin-top: -10px"><h2>明学在线学习平台——后台</h2></div>
        <div style="float: right;">
          <el-dropdown @command="handleCommand">
<!--            <el-avatar style="margin-top: 10px" src="http://localhost:8081/jfinal/user/2.jpg"></el-avatar>-->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <el-main>
        <component :is="currentComponent"></component>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import axios from "axios";
export default {
  name: "AdminView",
  data() {
    return {
      subpages: new Map([
        ["2-3", 'UserView'],
        ["2-2","AnnounceView"],
        ["2-1", 'StudentCourseView'],
        ["1-5",'CommentView'],
        ["1-4",'AnnounceView'],
        ["1-7",'ResourceView'],
        ["1-6", 'UserCourseView'],
        ["1-3", 'CourseView'],
        ["1-2", 'UserQuestView'],
        ["1-1", 'QuestionView'],
        ["0-1", 'QuestionView'],
      ]),
      currentMenu: "2-2",
      currentComponent: null
    }
  },
  methods: {
    handleSelect(index) {
      this.currentMenu = index;
      const component = this.subpages.get(index);
      this.currentComponent = component ? () => import(`./${component}.vue`) : null;
    },
    handleCommand(){
      this.$confirm('确定要退出吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('auth/api/logOut')
            .then(resp=>{
              if(resp.data.code===0){
                this.$message.success('成功登出')
                setInterval(()=>{
                  window.location.href='/auth/login'
                },1000)
              }
            })
      }).catch((e) => {
        console.log(e)
      });
    },
    logout(){

    },
  },
  mounted(){
    axios.post(`/user/authCheck/0`).then(res=>{
      console.log(res.data)
         if(res.data.code!=200){
            this.$message.error(res.data.msg)
            this.$router.push("/login");
         }
      })
  }
}
</script>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.page-frame {
  width: 100%;
  height: 100%;
  border: none;
  overflow: hidden;
}

.main-menu {
  background-color: #bbbbbb;
}
</style>
