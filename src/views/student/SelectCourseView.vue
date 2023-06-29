<template>
    <div>
    <nav-bar-view></nav-bar-view>
    <el-form :model="queryParams" style="margin-top:100px" ref="queryForm" size="small" :inline="true" label-width="68px">
        <el-form-item label="课程名">
          <el-input
              v-model="queryParams.name"
              placeholder="请输入课程名"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        </el-form-item>
    </el-form>

    <ul class="course-items" style="margin-top:100px">
        <li v-for="(course, idx) in courseList" :key="idx" class="course-item">
          <div class="course-item-inner">
            <div class="course-cover">
               <h3>{{course.name}}</h3>
              <img :src="course.cover" alt="课程封面" @click="toCourseLearn(course.id)">
            </div>
            <div class="course-details">
              <h4 class="double-line">{{course.intro}}</h4>
              <el-button @click="addCourse(course.id)">学习</el-button>
            </div>
          </div>
        </li>
      </ul>

      <el-pagination class="pagination-wrapper"
                   background
                   layout="sizes, prev, pager, next"
                   :total="pageBean.totalRows"
                   :page-size="pageBean.pageSize"
                   :page-sizes="[5, 10, 20, 100]"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
    >
    </el-pagination>
    </div>
</template> 

<script>

import axios from "axios";
import NavBarView from '../frontpage/NavBarView.vue';
export default {
    components: { NavBarView },
    name:"CourseView",
    data(){
        return{
            courseList:[],
            dataForm:{
                courseId:"",
                userId:""
            },
            pageBean: {
                data: null,
                totalRows: -1,
                pageSize: 8,
                currentPage: 1,
            },
            queryParams: {
                name: '',
                intro: ''
            },
        }
    },
    mounted(){
        this.getPagination();
        this.getCount();
    },
    methods:{
        handleQuery() {
            this.pageBean.data = this.queryParams;
            this.getCount();
        },
        toCourseLearn(courseId){
          this.$router.push(`/student/courseLearn/${courseId}`);
        },
        addCourse(id){
            this.dataForm.courseId=parseInt(id);
            this.dataForm.userId=parseInt(localStorage.getItem("studentId"))
            console.log(this.dataForm)
            this.$confirm('确定要选择这门课程吗').then(()=>{
                axios.post('/api/ucr/addCourse',this.dataForm).then(res=>{
                  if(res.data.code==200){
                      this.getPagination();
                      this.$message.success('选择成功')
                  }
                  else this.$message.error(res.data.msg)
                })
            }).catch(()=>{
            })
        },
        handleSizeChange(val) {
            this.pageBean.pageSize = val
            this.getPagination()
        }
        ,
        handleCurrentChange(val) {
            this.pageBean.currentPage = val
            this.getPagination()
        }
        ,
        getPagination() {
            this.pageBean.data = this.queryParams
            axios.post("/api/course/page", this.pageBean).then(resp => {
                if (resp.data.code === 200) {
                    this.courseList = resp.data.data
                } 
                else {
                this.$message.error(resp.data.msg)
            }
         })
        },
        getCount() {
        this.pageBean.data = this.queryParams
        axios.post('/api/course/count', this.pageBean).then(resp => {
            if (resp.data.code === 200) {
            this.pageBean = resp.data.data
            this.getPagination()
            } else {
            this.$message.error(resp.data.msg)
            }
         })
        },
    }
}
</script>
<style>
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
  .double-line {
    word-break: break-all;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
</style>