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
    </div>
    <div>
      <iframe v-if="resourceList.length>0" style="width: 100%;min-height: 65vh" :src="resourceList[active].url"></iframe>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ResourceLearnView",
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
    }
  },
  mounted() {
    this.getResources();
  }
}
</script>

<style scoped>

</style>
