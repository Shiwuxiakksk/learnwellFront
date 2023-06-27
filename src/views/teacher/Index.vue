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
              <el-menu-item index="1-2">章节布置</el-menu-item>
              <el-menu-item index="1-3">学生管理</el-menu-item>
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
                    <el-input v-model="course.name"
                              :style="{width: '100%'}"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="开始时间" prop="startTime">
                    <el-input v-model="course.startTime"
                              :style="{width: '100%'}"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="结束时间" prop="endTime">
                    <el-input v-model="course.endTime"
                              :style="{width: '100%'}"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="简介" prop="note">
                    <el-input v-model="course.intro" type="textarea"
                              :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                  </el-form-item>
                  <el-button type="primary" @click="save">保存</el-button>
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
                <el-button type="primary" @click="addAnn">添加</el-button>
              </el-form>


            </el-row>
          </div>

          <ResourcePublishView v-else-if="currentMenu == '1-2'" :course-id="courseId"
                               style="min-height: 80vh;"></ResourcePublishView>

          <div v-if="currentMenu == '1-3'">
            <el-table :data="studentList" style="width: 100%">
              <el-table-column prop="uid" label="学号" width="180"></el-table-column>
              <el-table-column prop="name" label="姓名" width="180"></el-table-column>
              <el-table-column prop="sex" label="性别" width="180"></el-table-column>
              <el-table-column prop="updateTime" label="最近登录" width="180"></el-table-column>
              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <el-button @click="moveOut(scope.row)" type="text"
                             size="small">移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div v-if="currentMenu == '1-4'" :description="description">
            <el-select v-model="value" placeholder="请选择" @change="getAudit">
              <el-option label="全班" value="-1"/>
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
            <AuditComponent :description="description" :key="key"/>
          </div>

          <StudentCommentView v-if="currentMenu == '1-5'" :type="courseId" :user-id="teacherId"></StudentCommentView>

          <el-dialog title="添加公告" :visible.sync="dialogFormVisible">
            <el-form :model="annForm">
              <el-form-item label="标题" :label-width="50">
                <el-input v-model="annForm.title" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="内容" :label-width="50">
                <el-input type="textarea" v-model="annForm.content" autocomplete="off"></el-input>
              </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" @click="publishAnn">确定</el-button>
            </div>
          </el-dialog>

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
import ResourcePublishView from "@/views/teacher/ResourcePublishView";

export default {
  name: 'IndexView',
  components: {ResourcePublishView, StudentCommentView, AuditComponent, ResourceLearnView},
  data() {
    return {
      courseId: 0,
      teacherId: 0,
      avatar: null,
      course: {
        name: null,
        cover: null,
      },
      options: [],
      announcesList: [],
      studentList: [],
      homeworkFinished: [],
      currentMenu: '1-1',
      description: null,
      dialogFormVisible: false,
      annForm: {
        content: '',
        title: '',
      },
      value: '',
      key: new Date()
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
    getStudents() {
      axios.get(`/api/ucr/user/${this.courseId}`)
          .then(resp => {
            if (resp.data.code === 200) {
              this.studentList = resp.data.data;
            } else {
              this.$message.error('操作失败！' + resp.data.msg);
            }
          }).catch(e => {
        this.$message.error('操作失败！' + resp.data.msg);
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
    getAudit(id) {
      console.log(id);
      var showdate = (descr)=>{
        this.description =  descr;
        this.key = new Date();
      };
      if (id == -1) {
        axios.get(`api/audit/teacher/course/rank?courseId=${this.courseId}`)
            .then(resp => {
              if (resp.data.code === 200) {
                showdate(resp.data.data)
              } else {
                this.$message.error('操作失败！' + resp.data.msg);
              }
            })
      } else {
        axios.get(`/api/audit/teacher/homework/description?courseId=${this.courseId}&homeworkId=${id}`)
            .then(resp => {
              if (resp.data.code === 200) {
                showdate(resp.data.data);
              } else {
                this.$message.error('操作失败！' + resp.data.msg);
              }
            })
      }
    },
    getOptions() {
      axios.get(`/api/homework/bycourse/${this.courseId}`)
          .then(resp => {
            if (resp.data.code === 200) {
              let obj = resp.data.data;
              for (let hw of obj) {
                this.options.push({
                  value: hw.id,
                  label: hw.title
                })
              }
            } else {
              this.$message.error('查询失败！' + resp.data.msg);
            }
          }).catch((e) => {
        this.$message.error('发送了错误！' + e);
      })
    },
    moveOut(row) {
      this.$confirm('确定要移除吗？')
          .then(() => {
            axios.post('/api/ucr/deleteBy', {
              courseId: this.courseId,
              userId: row.id
            }).then(resp => {
              if (resp.data.code === 200) {
                this.$message.success('删除成功');
                this.getStudents()
              } else {
                this.$message.error('操作失败！' + resp.data.msg);
              }
            })
          }).catch(e => {
        this.$message.error('操作失败！' + resp.data.msg);
      })
    },
    save() {
      axios.put('/api/course', this.course)
          .then(resp => {
            if (resp.data.code === 200) {
              this.$message.success('保存成功');
            } else {
              this.$message.error('操作失败！' + resp.data.msg);
            }
          })
    },
    addAnn() {
      this.dialogFormVisible = true;
    },
    publishAnn() {
      axios.post('/api/announce/addAnno', {
        content: this.annForm.content,
        title: this.annForm.title,
        courseId: this.courseId
      }).then(resp => {
        if (resp.data.code === 200) {
          this.$message.success('保存成功');
          this.dialogFormVisible = false;
          this.getAnnounce();
        } else {
          this.$message.error('操作失败！' + resp.data.msg);
        }
      })
    },
  },
  mounted() {
    this.courseId = this.$route.params.cid
    this.teacherId = localStorage.getItem('teacherId');
    this.avatar = localStorage.getItem('avatar');
    this.getCourse();
    this.getAnnounce();
    this.getStudents();
    this.getOptions();
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
