<template>
  <div>
    <NavBar></NavBar>
    <div class="course-list">
      <h2 class="course-heading">所教课程列表</h2>
      <div class="course-container">
        <ul class="course-items" v-for="(course, idx) in selectedCourses.data" :key="idx">
          <li class="course-item">
            <div class="course-item-inner">
              <div class="course-cover">
                <img :src="course.cover" alt="课程封面" @click="toCourseLearn(course.courseId)">
              </div>
              <div class="course-details">
                <h3 class="course-title" @click="toCourseLearn(course.courseId)">{{ course.courseName }}</h3>
              </div>
            </div>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
import NavBar from "@/views/frontpage/NavBarView.vue";
import axios from "axios";
export default {
  name: "CourseView",
  data() {
    return {
      selectedCourses: [] // 存放所选课程的数组
    }
  },
  mounted() {
    // 在这里获取教师所选课程的数据
    const studentId = this.$route.params.id;
    this.fetchSelectedCourses(studentId);
  },
  methods: {
    toCourseLearn(courseId){
      this.$router.push(`/teacher/manage/${courseId}`);
    },
    fetchSelectedCourses(studentId) {
      // 使用学生ID查询所选课程数据
      axios.get(`/api/ucr/course/${studentId}`)
          .then(response => {
            this.selectedCourses = response.data;
          })
          .catch(error => {
            console.error(error);
          });
    },

  },
  components: { NavBar
  },

}
</script>
<style>
.course-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 每行三个课程项 */
  grid-gap: 20px; /* 课程项之间的间距 */
}
.course-list {
  padding: 20px;
}
.course-heading {
  margin-top: 50px; /* Add top margin to create space */
}
.course-items {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.course-item {
  width: 300px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.course-cover img {
  width: 100%;
  height: auto;
}

.course-details {
  margin-left: 10px;
}

.course-title {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: bold;
}


</style>