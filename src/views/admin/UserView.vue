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
  
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
          >新增
          </el-button>
        </el-col>
      </el-row>
  
      <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
        <el-table-column label="uid" align="center" prop="uid" ></el-table-column>
        <el-table-column label="姓名" align="center" prop="name" ></el-table-column>
        <el-table-column label="密码" align="center" prop="password" ></el-table-column>
        <el-table-column label="性別" align="center" prop="sex" ></el-table-column>
        <el-table-column label="年齡" align="center" prop="age" ></el-table-column>
        <el-table-column label="权限" align="center" prop="type" >
          <template slot-scope="scope">
            <span v-if="scope.row.type == '1'">学生</span>
            <span  v-else-if="scope.row.type == '2'">教师</span>
            <span  v-else-if="scope.row.type == '0'">管理员</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
            >修改
            </el-button>
            <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
            >删除
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
  
      <el-dialog title="弹窗" :visible.sync="Visiable" width="35%" :data="userList"  append-to-body>
        <el-form>
            <el-form-item label="图片" prop="picture">
              <el-image :src="dataForm.avatar"
                        style="width: 100px; height: 100px">
              </el-image>
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
              </el-upload>
            </el-form-item>
              <el-form-item label="uid" prop="uid">
                <el-input v-model="dataForm.uid" type="text" placeholder="请输入uid"></el-input>
              </el-form-item>
              <el-form-item label="name" prop="name">
                <el-input v-model="dataForm.name" type="text" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="age" prop="age">
                <el-input v-model="dataForm.age" type="text" placeholder="请输入年龄"></el-input>
              </el-form-item>
              <el-form-item label="sex" prop="sex">
                <el-select v-model="dataForm.sex" placeholder="请选择">
                  <el-option
                    v-for="item in sex"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="type" prop="type">
                <el-select v-model="dataForm.type" placeholder="请选择">
                  <el-option
                    v-for="item in auths"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            <el-button @click="Visiable = false">取消</el-button>
            <el-button type="primary" @click="submitForm">确定</el-button>
      </el-form>
        </el-dialog>

    </div>
</template>
  
<script>
  
  import axios from "axios";
  
  export default {
    name: "UserView",
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
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        Visiable: false,
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
        sex:[{
          value: '男',
          label: '男'
        }, {
          value: '女',
          label: '女'
        }],
        auths:[{
          value: '0',
          label: '管理员'
        }, {
          value: '1',
          label: '学生'
        },{
          value: '2',
          label: '教师'
        }
      ],
        value:"",
        // 表单参数
        form: {},
        data:{
          id:String,
          uid: String,
          avatar: String,
          account: String,
          age: Number,
          createDate: String,
          name: String,
          sex: String,
          type: String,
        },
        dataForm:{
          id:String,
          uid: String,
          avatar: String,
          age: Number,
          name: String,
          sex:String,
        },
        Visiable:false,
        isAdd:false,
        rules: {
          type: [{
            required: true,
            message: '问题类型不能为空',
            trigger: 'change'
          }],
          content: [{
            required: true,
            message: '请输入内容',
            trigger: 'blur'
          }],
          answer: [{
            required: true,
            message: '请输入答案',
            trigger: 'blur'
          }],
          explain: [],
        },
        pictureAction: null,
        dataPart: {
          'bucketName': 'userbucket'
        },
        isAdd: true,
        picturefileList: [],
      };
    },
    methods: {
      // 取消按钮
      cancel() {
        this.Visiable = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.dataForm = {
          id:null,
          uid: null,
          avatar: null,
          age: null,
          name: null,
          sex:null,
        };
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.pageBean.currentPage = 1
        this.getPagination();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm") ;
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.Visiable = true;
        this.isAdd = true;
        this.title = "新增题目";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        axios.get(`/user/getUser/${row.id}`)
        .then(resp=>{
          if(resp.data.code === 200){
            this.dataForm = resp.data.data;
            console.log(this.dataForm)
            this.title = "修改题目"
            this.Visiable = true;
            this.isAdd=false;
          } else {
            this.$message.error('根据id查询错误：'+resp.data.msg)
          }
        })
  
      },
      /** 提交按钮 */
      submitForm() {
        if (this.isAdd) {
          axios.post("/user/insertUser", this.dataForm)
              .then(resp => {
                if (resp.data.code === 200) {
                  this.$message.success('添加成功！');
                  this.cancel()
                } else {
                  this.$message.error('添加失败：' + resp.data.msg)
                }
              })
        } else {
          axios.put("/user/updateUser", this.dataForm)
              .then(resp => {
                if (resp.data.code === 200) {
                  this.$message.success('修改成功！');
                  this.cancel()
                } else {
                  this.$message.error('修改失败：' + resp.data.msg)
                }
              })
        }
        this.getPagination();
        console.log(this.dataForm)
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$confirm('确定要删除吗？')
            .then(() => {
              axios.delete(`/user/deleteUser/${row.id}`)
                  .then(resp => {
                    if (resp.data.code === 200) {
                      this.$message.success('删除成功')
                    } else {
                      this.$message.error('删除失败：' + resp.data.data);
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
      /** 文件上传后处理 */
      afterUpload(resp) {
        console.log(resp);
        if (resp.code === 200) {
          this.dataForm.avatar = resp.data
        } else {
          this.$message.error(resp.data.msg)
        }
      }
      ,
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
      this.pictureAction = `${axios.defaults.baseURL}/api/file/upload/`;
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
  