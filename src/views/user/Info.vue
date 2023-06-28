<template>
    <div>
      <el-card>
        <el-descriptions class="margin-top" title="简介" :column="2" border>
          <template slot="extra">
            <el-button type="button" v-if="$route.params.id==this.data.id" size="small" @click="Visiable = true">修改</el-button>
          </template>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-picture-outline"></i>
              头像
            </template>
            <img class="img" :src="data.avatar" alt="" />
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              uid
            </template>
            {{ data.uid }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-custom"></i>
              昵称
            </template>
            {{ data.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-odometer"></i>
              年龄
            </template>
            {{ data.age }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-male"></i>
              <i class="el-icon-female"></i>
              性别
            </template>
            <el-tag size="small">{{ data.sex }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              权限
            </template>
            {{ data.type }}
          </el-descriptions-item>
  
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-date"></i>
              注册日期
            </template>
            {{ data.createDate}}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-dialog title="弹窗" :visible.sync="Visiable" width="35%"  append-to-body>
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
              <el-form-item label="password">
                <el-input v-model="dataForm.password" type="text" placeholder="请输入新密码"></el-input>
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
            <el-button @click="Visiable = false">取消</el-button>
            <el-button type="primary" @click="submitForm">确定</el-button>
      </el-form>
        </el-dialog>
    </div>
</template> 
  
<script>
import axios from "axios";
  export default {
    name: "Info",
    data() {
      return {
        pictureAction: null,
        dataPart: {
        'bucketName': 'userbucket'
        },
        picturefileList: [],
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
          password:""
        },
        sex:[{
          value: '男',
          label: '男'
        }, {
          value: '女',
          label: '女'
        }],
        value:"",
        Visiable: false,
      };
    },
    mounted() {
      this.pictureAction = `${axios.defaults.baseURL}/api/file/upload/`;
      this.load();
    },
    methods: {
      load() {
        axios.get('/user/getUser/'+this.$route.params.id)
          .then((res) => {
            this.data.id=res.data.data.id;
            this.data.avatar = res.data.data.avatar;
            this.data.uid = res.data.data.uid;
            this.data.age = res.data.data.age;
            this.data.createDate = res.data.data.createTime;
            this.data.name = res.data.data.name;
            this.data.sex = res.data.data.sex;
            this.data.type = res.data.data.type;
            if(res.data.data.type===0) this.data.type="管理员";
            else if (res.data.data.type===1)this.data.type="学生";
            else this.type="老师";

            this.dataForm.id=res.data.data.id;
            this.dataForm.avatar = res.data.data.avatar;
            this.dataForm.uid = res.data.data.uid;
            this.dataForm.age = res.data.data.age;
            this.dataForm.name = res.data.data.name;
            this.dataForm.sex = res.data.data.sex;

          })
          .catch((err) => {
            console.log(err);
          });
      },
      handleClick(){
          this.Visiable=true;
        },
      submitForm() {
        axios.put("/user/updateUser", this.dataForm)
            .then(resp => {
              if (resp.data.code === 200) {
                this.$message.success('修改成功！');
                this.Visiable = false;
              } else {
                this.$message.error('修改失败：' + resp.data.msg)
              }
              this.load();
        })
      },
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
        this.$message.error(resp.data.data)
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
    },
  
}
    
</script>
  
<style scoped>
  .img {
    width: 80px;
    height: 80px;
  }
</style>
  