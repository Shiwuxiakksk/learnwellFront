<template>
  <div>
    <NavBar></NavBar>
    <div class="navbar1">
      <el-col :span="12">
        <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#909399"
            text-color="#fff"
            align-text="left"
            active-text-color="#ffd04b">
          <div v-for="(item, idx) in selectedResource.data" :key="idx">
            <el-menu-item class="el-menu-item1">
              <span slot="title" @click="changeResource(item)">{{ item.resourceName }}</span>
            </el-menu-item>
          </div>
        </el-menu>
      </el-col>
    </div>
      <div v-if="file.type === 'text'" class="text1">
        <iframe :src="file.url + '#page=1'" frameborder="0" class="text-iframe"></iframe>
      </div>
      <div v-else-if="file.type === 'video'">
        <video :src="file.url" controls></video>
      </div>
  </div>
</template>

<script>
import NavBar from "@/views/frontpage/NavBarView.vue";
import axios from "axios";

export default {
  name: "CourseLearnView",
  data() {
    return {
      selectedResource: [], // 存放所选资源的数组
      type: "text",
      file: {
        type: "text", // 文件类型 ('text' 或 'video')
        url: "http://1.15.248.74:9000/resourcebucket/1111.pdf", // 文件的URL
      },
    };
  },
  mounted() {
    // 在这里获取课程资源的数据
    const courseId = this.$route.params.cid;
    this.fetchResource(courseId);
  },
  methods: {
    changeResource(item){//根据资源选项加载
      this.file.type=item.resourceType;
      this.file.url=item.url;
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    fetchResource(courseId) {
      // 使用课程ID查询资源数据
      axios
          .get(`/api/cr/resource/${courseId}`)
          .then((response) => {
            this.selectedResource = response.data;
          })
          .catch((error) => {
            console.error(error);
          });
    },
  },
  components: { NavBar },
};
</script>

<style>
.navbar1 {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  width: 5%;
  display: block;
  height: 100%;
  z-index: 999;
  background-color: #909399;
}

.el-menu-item1 {
  width: 100%;
}

.text1 {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 60px;
  left: 80px;
  width: 100%;
  height: 100%;
}

.text-iframe {
  width: 100%;
  height: 100%;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

}
</style>
