<template>
  <div class="container">
    <div class="up" v-if="courseList.length>0">
      <el-button v-for="(course,idx) in courseList" type="primary" plain
                 :key="idx" @click="getHomeworkList(course.courseId)">
        {{ course.courseName }}
      </el-button>
    </div>
    <div class="up" v-else>
      <span style="color: #B3C0D1">您还未开设授课</span>
    </div>
    <div class="down" v-if="openList">
      <el-timeline class="down-left" style="width: 100px">
        <el-timeline-item v-for="(hw,idx) in homeworkList" :key="idx" type="primary"
                          :timestamp="hw.startTime" placement="top"
                          style="width: 100px">
          <el-card align="center" style="width: 150px;max-height: 60px" shadow="hover">
            <div class="card-content" @click="showEdit(hw.id)">
              {{ hw.title }}
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <div class="down-right">
        <HomeworkManageView v-if="openView" :homework-id="homeworkId" :key="key"
        style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);"></HomeworkManageView>
      </div>
    </div>
  </div>
</template>

<script>
import Personal from "@/views/user/InformationView";
import axios from "axios";
import HomeworkManageView from "@/views/teacher/HomeworkManageView";

export default {
  name: "HomeworkListView",
  components: {HomeworkManageView, Personal},
  data() {
    return {
      userId: 100000,
      openList: false,
      openView: false,
      homeworkList: [],
      courseList: [],
      key: new Date(),
      homeworkId: -1,
      courseId: -1,
    }
  },
  methods: {
    getCourseList() {
      axios.get(`/api/ucr/course/${this.userId}`)
          .then(resp => {
            if (resp.data.code === 200) {
              this.courseList = resp.data.data;
            } else {
              this.$message('发生了错误：' + resp.data.msg);
            }
          })
    },
    getHomeworkList(id) {
      this.courseId = id;
      axios.get(`/api/homework/bycourse/${id}`)
          .then(resp => {
            if (resp.data.code === 200) {
              this.homeworkList = resp.data.data;
              this.homeworkList.push({
                id: -1,
                title: '添加新作业'
              })
              this.openList = true;
            } else {
              this.$message.error('发生了错误：' + resp.data.msg);
            }
          })
    },
    aoo() {
      alert('aoo!')
    },
    showEdit(id) {
      if(id === -1){
        axios.post('/api/homework',{
          title: 'new homework',
          startTime: '2000-01-01 00:00:00',
          endTime: '2020-01-01 00:00:00',
          courseId: this.courseId
        })
        .then(resp=>{
          if(resp.data.code === 200){
            this.homeworkId = id = resp.data.data;
            this.key = new Date()
            this.openView = true;
          } else {
            this.$message.error('创建新作业出现错误：'+resp.data.data);
          }
        })
      } else {
        this.homeworkId = id;
        this.key = new Date()
        this.openView = true;
      }

    }
  },
  mounted() {
    this.userId = localStorage.getItem('teacherId')
    this.getCourseList()
  }
}
</script>

<style scoped>
.container {
  display: flex;
  padding: 10px;
  flex-direction: column;
  flex-wrap: wrap;
}

.up {
  height: 20%;
  box-sizing: border-box;
}

.down {
  display: flex;
  flex: 1;
}

.down-left {
  flex: 1;
  max-width: 200px;
}

.down-right {
  flex: 1;
  width: 80%;
}


</style>
