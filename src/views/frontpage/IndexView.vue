<template>
  <div>
    <NavBar></NavBar>
    <el-carousel>
      <el-carousel-item v-for="(item,idx) in imgwrap" :key="idx">
        <el-image :src="item" ></el-image>
      </el-carousel-item>
    </el-carousel>
    <h1>热门课程</h1>
    <el-row>
      <el-col :span="8" :offset="2">
        <el-card :body-style="{ padding: '0px' }">
          <img src='http://1.15.248.74:9000/coursebucket/2023-06-25_225217.jpg' class="image">
          <div style="padding: 14px;">
            <h3>操作系统</h3>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" :offset="2">
        <el-card :body-style="{ padding: '0px' }">
          <img src='http://1.15.248.74:9000/coursebucket/2023-06-25_225304.jpg' class="image">
          <div style="padding: 14px;">
            <h3>计算机网络</h3>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" :offset="2">
        <el-card :body-style="{ padding: '0px' }">
          <img src='http://1.15.248.74:9000/coursebucket/2023-06-25_225329.jpg' class="image">
          <div style="padding: 14px;">
            <h3>计算机组成原理</h3>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" :offset="2">
        <el-card :body-style="{ padding: '0px' }">
          <img src='http://1.15.248.74:9000/coursebucket/Snipaste_2023-06-27_14-52-24.jpg' class="image">
          <div style="padding: 14px;">
            <h3>数据结构</h3>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import NavBar from "@/views/frontpage/NavBarView.vue";
import axios from "axios";
import { duration } from "moment";
export default {
  name: "IndexView",
  data() {
    return {
      activeIndex: '1',
      isLogin:true,
      // loginType:true,
      loginType:true,
      imgwrap:[
        'http://1.15.248.74:9000/frontpagebucket/lunbo1.jpg',
        'http://1.15.248.74:9000/frontpagebucket/lunbo2.jpg',
        'http://1.15.248.74:9000/frontpagebucket/lunbo3.jpg',

      ],
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    toAdmin(){
      this.$router.push("/admin");
    },
  },
  mounted() {
    axios.get("/api/announce/getEarliestGlobalAnno").then((res) => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        const date = new Date(res.data.data.createTime);
        const formattedTime = `${date.getFullYear()}-${padZero(
          date.getMonth() + 1
        )}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(
          date.getMinutes()
        )}:${padZero(date.getSeconds())}`;
        this.$notify({
          title: "最新公告",
          message: `
          <p>${res.data.data.title}: ${res.data.data.content}</p>
          <p style="font-size: 12px; color: #999">${formattedTime}</p>
        `,
          dangerouslyUseHTMLString: true,
          duration: 20000,
          position: "bottom-right",
        });

      } else {
        this.$message.error("无法获取最新公告");
      }
    });
  },
  components: { NavBar },
};
function padZero(num) {
  return num < 10 ? `0${num}` : num;
}
</script>
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>
