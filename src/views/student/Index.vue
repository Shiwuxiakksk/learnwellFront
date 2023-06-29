<template>
  <div>
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu @select="handleSelect" :default-openeds="['1']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-menu"></i>
              {{ course.name }}
            </template>
            <el-menu-item-group>
              <el-image style="width: 120px;height: 65px" :src="course.cover"/>
              <el-menu-item index="1-1">课程信息</el-menu-item>
              <el-menu-item index="1-2">章节学习</el-menu-item>
              <el-menu-item index="1-3">完成作业</el-menu-item>
              <el-menu-item index="1-4">成绩统计</el-menu-item>
              <el-menu-item index="1-5">评论</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <el-dropdown>
            <el-avatar size="medium" :src="avatar" style="margin-top: 15px"/>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>

        <el-main>
          <div v-if="currentMenu == '1-1'" style="min-height: 80vh;">
            <el-row :gutter="15">
              <el-form ref="elForm" size="medium" label-width="100px">
                <el-col :span="24">
                  <el-form-item label="课程名">
                    <el-input v-model="course.name" :disabled="true"
                              :style="{width: '100%'}"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="开始时间" prop="startTime">
                    <el-input v-model="course.startTime" :disabled="true"
                              :style="{width: '100%'}"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="结束时间" prop="endTime">
                    <el-input v-model="course.endTime" :disabled="true"
                              :style="{width: '100%'}"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="简介" prop="note">
                    <el-input v-model="course.intro" type="textarea" :disabled="true"
                              :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="公告" prop="note">
                    <el-table :data="announcesList" style="width: 100%">
                      <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                      <el-table-column prop="title" label="标题" width="180"></el-table-column>
                      <el-table-column prop="content" label="内容" width="180"></el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
              </el-form>


            </el-row>
          </div>

          <ResourceLearnView v-if="currentMenu == '1-2'" :course-id="courseId"
                             style="min-height: 80vh;"></ResourceLearnView>

          <div v-if="currentMenu == '1-3'">
            <el-table :data="homeworkList" style="width: 100%" :row-class-name="tableRowClassName">
              <el-table-column prop="title" label="名称" width="180"></el-table-column>
              <el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>
              <el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>
              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <el-button v-if="homeworkFinished[scope.$index]" @click="doHomework(scope.row.id)" type="text"
                             size="small">查看
                  </el-button>
                  <el-button v-else @click="doHomework(scope.row.id)" type="text" size="small">去完成</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <AuditComponent v-if="currentMenu == '1-4'" :description="description"/>

          <StudentCommentView v-if="currentMenu == '1-5'"  :type="courseId">

          </StudentCommentView>

        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
import axios from "axios";
import ResourceLearnView from "@/views/student/ResourceLearnView";
import AuditComponent from "@/views/student/AuditComponent";
import StudentCommentView from "@/views/student/StuComm";

export default {
  name: 'IndexView',
  components: {StudentCommentView, AuditComponent, ResourceLearnView},
  data() {
    return {
      courseId: 0,
      studentId: 0,
      avatar: null,
      course: {
        name: null,
        cover: null,
      },
      announcesList: [],
      homeworkList: [],
      homeworkFinished: [],
      currentMenu: '1-1',
      description: null,
    }
  },
  methods: {
    handleSelect(index) {
      this.currentMenu = index;
    },
    getCourse() {
      axios.get(`/api/course/${this.courseId}`)
          .then(resp => {
            if (resp.data.code === 200) {
              this.course = resp.data.data;
            } else {
              this.$message.error('查询失败！' + resp.data.msg);
            }
          }).catch((e) => {
        this.$message.error('发送了错误！' + resp.data.msg);
      })
    },
    getHomeworks() {
      axios.get(`/api/homework/bycourse/${this.courseId}`)
          .then(resp => {
            if (resp.data.code === 200) {
              this.homeworkList = resp.data.data;
              for (let hw of this.homeworkList) {
                axios.get(`/api/uh/exist?homeworkId=${hw.id}&userId=${this.studentId}`)
                    .then(resp => {
                      if (resp.data.code === 200) {
                        if (resp.data.data) {
                          this.homeworkFinished.push(true);
                        } else {
                          this.homeworkFinished.push(false);
                        }
                      } else {
                        this.$message.error('发送了错误！' + resp.data.msg);
                      }
                    })
              }
            } else {
              this.$message.error('查询失败！' + resp.data.msg);
            }
          }).catch((e) => {
        this.$message.error('发送了错误！' + resp.data.msg);
      })
    },
    getAnnounce() {
      axios.get(`/api/announce/bycourse/${this.courseId}`)
          .then(resp => {
            if (resp.data.code === 200) {
              this.announcesList = resp.data.data;
            } else {
              this.$message.error('查询错误：' + resp.data.msg);
            }
          }).catch((e) => {
        this.$message.error('发送了错误！' + resp.data.msg);
      })
    },
    tableRowClassName({row, rowIndex}) {
      console.log(row)
      if (!this.homeworkFinished[rowIndex]) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    doHomework(id) {
      console.log(id)
      this.$router.push(`/student/dohomework/${id}`)
    },
    getAudit() {
      axios.get(`/api/audit/student/description?courseId=${this.courseId}&studentId=${this.studentId}`)
          .then(resp => {
            if (resp.data.code === 200) {
              this.description = resp.data.data;
              console.log(this.description)
            } else {
              this.$message.error('查询错误：' + resp.data.msg);
            }
          }).catch((e) => {
        this.$message.error('发送了错误！' + resp.data.msg);
      })
    }
  },
  mounted() {
    this.courseId = this.$route.params.cid
    this.studentId = localStorage.getItem('studentId');
    // axios.get(`/user/getUser/${this.studentId}`)
    // .then(resp=>{
    //   if(resp.data.code === 200){
    //
    //   }
    // })
    this.avatar = localStorage.getItem('avatar');
    this.getCourse();
    this.getAnnounce();
    this.getHomeworks();
    this.getAudit();
  }

};
</script>
<style>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
