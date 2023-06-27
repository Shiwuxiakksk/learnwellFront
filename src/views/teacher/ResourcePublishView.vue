<template>
  <div>
    <el-steps :active="active" finish-status="success">
      <el-step v-for="(res,idx) in resourceList" :key="idx" :title="res.resourceName">
        123
      </el-step>
    </el-steps>
    <div>
      <el-button icon="el-icon-arrow-left" @click="back" circle/>
      <el-button icon="el-icon-arrow-right" @click="next" circle/>
      <el-button icon="el-icon-plus" @click="showEdit"/>
    </div>
    <div>
      <iframe v-if="!edit" :key="key" style="width: 100%;min-height: 65vh" :src="resourceList[active].url"></iframe>
      <RichTextComponent v-else :key="key"></RichTextComponent>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import RichTextComponent from "@/views/teacher/RichTextComponent";

export default {
  name: "ResourcePublishView",
  components: {RichTextComponent},
  props: {
    courseId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      resourceList: [],
      active: 0,
      edit: false,
      key: new Date(),
      formData: {
        name: null,
        url: null,
      }
    }
  },
  methods: {
    getResources() {
      axios.get(`/api/cr/resource/${this.courseId}`)
          .then(resp => {
            if (resp.data.code === 200) {
              this.resourceList = resp.data.data;
            } else {
              this.$message.error('查询失败！' + resp.data.msg);
            }
          }).catch((e) => {
        this.$message.error('发送了错误！' + resp.data.msg);
      })
    },
    next() {
      if (this.active++ > this.resourceList.length) this.active = this.resourceList.length;
    },
    back() {
      if (this.active > 0) this.active -= 1;
    },
    showEdit(){
      this.edit = true;
    },
    setUrl(name,str){
      this.formData.name = name;
      this.formData.url = str;
      axios.post('/api/resource/addResource',this.formData)
      .then(resp=>{
        if(resp.data.code === 200){
          axios.post("/api/cr",{
            resourceId: resp.data.data,
            courseId: this.courseId
          }).then(resp2=>{
            if(resp2.data.code === 200){
              this.$message.success('操作成功！');
              this.edit = false;
              this.getResources();
            } else {
              this.$message.error('操作失败！'+resp.data.msg);
            }
          })
        } else {
          this.$message.error('操作失败！'+resp.data.msg);
        }
      })
    }
  },
  mounted() {
    this.getResources();
  }
}
</script>

<style scoped>

</style>
