<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item prop="name">
          <el-input
              v-model="queryParams.name"
              placeholder="请输入姓名"
          />
        </el-form-item>
        <el-form-item prop="uid">
          <el-input
              v-model="queryParams.uid"
              placeholder="请输入uid"
          />
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
  
      <el-table v-loading="loading" :data="userList">
        <el-table-column label="uid" align="center" prop="uid" ></el-table-column>
        <el-table-column label="姓名" align="center" prop="name" ></el-table-column>
        <el-table-column label="密码" align="center" prop="password" ></el-table-column>
        <el-table-column label="性別" align="center" prop="sex" ></el-table-column>
        <el-table-column label="年齡" align="center" prop="age" ></el-table-column>
        <el-table-column label="权限" align="center" prop="type" ></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleSelect(scope.row)"
            >选课
            </el-button>
            <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
            >退课
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
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
  
      <el-dialog title="弹窗" :visible.sync="Visiable" width="35%" append-to-body>
            <el-select v-model="value" filterable placeholder="请选择">
                <el-option
                  v-for="item in courseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
            </el-select>
            <el-button @click="add(value)">添加</el-button>
            <el-button @click="Visiable = false">确定</el-button>
      </el-dialog>

      <el-dialog title="弹窗" :visible.sync="Visiable2" width="35%" append-to-body>
        <el-table v-loading="loading" :data="userCourseList">
            <el-table-column label="课程id" align="center" prop="courseId" ></el-table-column>
            <el-table-column label="课程名" align="center" prop="courseName" ></el-table-column>
            <el-table-column label="开始时间" align="center" prop="startTime" ></el-table-column>
            <el-table-column label="结束时间" align="center" prop="endTime" ></el-table-column>
            <el-table-column label="操作" align="center" >
              <template slot-scope="scope">
              <el-button @click="deleted(scope.row)">退课</el-button>
              </template>
            </el-table-column>
            <el-button @click="Visiable2 = false">确定</el-button>
        </el-table>
      </el-dialog>

    </div>
</template>
  
<script>
  
  import axios from "axios";
  
  export default {
    name: "StudentCourseView",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 【请填写功能名称】表格数据
        userList: [],
        courseList: [],
        userCourseList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        Visiable: false,
        value:"",
        // 查询参数
        queryParams: {
          name:null,
          uid:null,
        },
        pageBean: {
            data: null,
            totalRows: -1,
            pageSize: 5,
            currentPage: 1,
        },
        // 表单参数
        form: {},
        dataForm:{
            userId:"",
            courseId:"",
        },
        Visiable:false,
        Visiable2:false,
        rules: {
          type: [{
            required: true,
            message: '问题类型不能为空',
            trigger: 'change'
          }],
          explain: [],
        },
      };
    },
    methods: {
      // 取消按钮
      cancel() {
        this.Visiable = false;
        this.Visiable2=false;
      },
      // 表单重置
      /** 搜索按钮操作 */
      handleQuery() {
        this.pageBean.currentPage = 1
        this.getPagination();
      },
      /** 新增按钮操作 */
      handleSelect(row) {
        this.dataForm.userId=parseInt(row.id);
        axios.get(`/api/course/getAll`)
        .then(resp=>{
          console.log(resp.data.data)
          if(resp.data.code === 200){
            this.courseList = resp.data.data;
            console.log(this.courseList);
            this.Visiable = true;
            this.title = "选择课程";
          } else {
            this.$message.error('根据id查询错误：'+resp.data.msg)
          }
        })
      },
      handleDelete(row) {
        this.dataForm.userId=parseInt(row.id);
        axios.get(`/user/getCourseByUser/${row.id}`)
        .then(resp=>{
          console.log(resp.data.data)
          if(resp.data.code === 200){
            this.userCourseList = resp.data.data;
            console.log(this.userCourseList);
            this.Visiable2 = true;
             this.title = "退出课程";
          } else {
            this.$message.error('根据id查询错误：'+resp.data.msg)
          }
        })
      },
      /** 选择按钮操作 */
      add() {
        this.dataForm.courseId=parseInt(this.value);
        console.log(this.dataForm)
        axios.post(`/api/ucr/addCourse`,this.dataForm)
        .then(resp=>{
          if(resp.data.code === 200){
            console.log(this.dataForm)
            this.Visiable = false;
            this.dataForm.userId=null;
            this.dataForm.courseId=null;
            this.$message.error('选课成功')
          } else {
            this.$message.error('选课失败'+resp.data.msg)
          }
        })
      },
      /** 退课按钮操作 */
      deleted(row) {
        this.$confirm('确定要退课吗？')
            .then(() => {
              axios.delete(`/api/ucr/${row.id}`)
                  .then(resp => {
                    if (resp.data.code === 200) {
                      this.$message.success('退课成功')
                    } else {
                      this.$message.error('退课失败：' + resp.data.data);
                    }
                  })
              this.getPagination();
            })
            .catch(() => {
              this.$message.warning("取消了操作")
            });
      },
      /** 导出按钮操作 */
      handleExport() {
  
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
        axios.post("/user/getUserList/page", this.pageBean).then(resp => {
            console.log(resp.data.data);
          if (resp.data.code === 200) {
            this.pageBean.totalRows = resp.data.data.total;
            this.pageBean.pageSize = resp.data.data.size;
            this.pageBean.currentPage = resp.data.data.current;
            this.userList = resp.data.data.records
            this.loading = false
          } else {
            this.$message.error(resp.data.msg)
          }

        })
      },
    },
    mounted() {
      this.getPagination();
    }
  }
</script>
<style scoped>
  .pagination-wrapper {
    position: fixed;
    bottom: 30px;
    left: 40%;
  }
</style>
  