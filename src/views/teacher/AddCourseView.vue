<template>
  <div>
    <NavBar></NavBar>
    <div class="add-course-form">
      <el-form ref="courseForm" :model="formData" label-width="120px">
        <el-form-item label="课程名称">
          <el-input v-model="formData.name" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="课程封面" >
          <el-upload ref="picture"
                     class="upload-demo"
                     :action="pictureAction"
                     :before-upload="pictureBeforeUpload"
                     :multiple="false"
                     name="file"
                     :data="dataPart"
                     :on-success="afterUpload"
                     list-type="picture"
                     :file-list="picturefileList"
                     accept="image/*">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过15MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程描述">
          <el-input type="textarea" v-model="formData.intro" placeholder="请输入课程描述"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="formData.start_date" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker placeholder="选择时间" v-model="formData.startTime" style="width: 100%;"></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="formData.end_date" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker placeholder="选择时间" v-model="formData.endTime" style="width: 100%;"></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import NavBar from "@/views/frontpage/NavBarView.vue"
import axios from "axios";
import moment from 'moment';
export default {
  name: "AddCourseView",
  data() {
    return {
      dataPart: {
        'bucketName': 'coursebucket'
      },
      pictureAction: '',
      picturefileList: [],
      formData: {
        name: '',
        cover:'',
        intro:'',
        start_date:'',
        startTime:'',
        end_date:'',
        endTime:'',
      },
      courseTeacher:{
        userId: '',
        courseId: '',
      }
    }
  },
  methods: {
    /** 文件上传后处理 */
    afterUpload(resp) {
      console.log(resp);
      if (resp.code === 200) {
        this.formData.cover = resp.data
      } else {
        this.$message.error(resp.data.msg)
      }
    },
    /** 文件拦截处理 */
    pictureBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 15
      if (!isRightSize) {
        this.$message.error('文件大小超过 15MB')
      }
      let isAccept = new RegExp('image/*').test(file.type)
      if (!isAccept) {
        this.$message.error('应该选择image/*类型的文件')
      }
      return isRightSize && isAccept
    },
    submitForm() {
      // Convert start_time and end_time to datetime format
      const startDate = moment(this.formData.start_date, 'YYYY-MM-DD');
      const startTime = moment(this.formData.startTime, 'HH:mm:ss');
      const endDate = moment(this.formData.end_date, 'YYYY-MM-DD');
      const endTime = moment(this.formData.endTime, 'HH:mm:ss');

      // Combine date and time
      const startDateTime = moment(startDate).set({
        hour: startTime.hours(),
        minute: startTime.minutes(),
        second: startTime.seconds()
      });
      const endDateTime = moment(endDate).set({
        hour: endTime.hours(),
        minute: endTime.minutes(),
        second: endTime.seconds()
      });

      // Format datetime values
      const formattedStartDateTime = startDateTime.format('YYYY-MM-DD HH:mm:ss');
      const formattedEndDateTime = endDateTime.format('YYYY-MM-DD HH:mm:ss');

      // Update formData with formatted datetime values
      this.formData.startTime = formattedStartDateTime;
      this.formData.endTime = formattedEndDateTime;

      axios.post("/api/course", this.formData)
          .then(resp => {
            if (resp.data.code === 200) {
              this.courseTeacher.courseId = resp.data.data;

              // Retrieve the userId from the current route's parameters
              this.courseTeacher.userId = this.$route.params.tid;
              axios.post("/api/ucr", this.courseTeacher)
                  .then(response => {
                    if (response.data.code === 200) {
                      this.$message.success('添加成功！');
                    } else {
                      this.$message.error('课程关联添加失败：' + response.data.msg);
                    }
                  })
                  .catch(error => {
                    this.$message.error('课程关联添加请求失败' + error.message);
                  });

            } else {
              this.$message.error('课程添加失败：' + resp.data.msg);
            }
          })
          .catch(error => {
            this.$message.error('课程添加请求失败：' + error.message);
          });
    },
  },
  components: { NavBar
  },
  mounted() {
    this.pictureAction = `${axios.defaults.baseURL}/api/file/upload`;
  },

}
</script>
<style>
.add-course-form {
  position: fixed;
  top: 80px;
  left:32%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
</style>