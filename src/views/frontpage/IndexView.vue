<template>
  <div>
    <NavBar></NavBar>
    <el-carousel>
      <el-carousel-item v-for="(item,idx) in imgwrap" :key="idx">
        <el-image :src="item" ></el-image>
      </el-carousel-item>
    </el-carousel>
    <el-row>
      <el-col :span="8" v-for="(o, index) in imgwrap1" :key="o" :offset="index > 0 ? 2 : 0">
        <el-card :body-style="{ padding: '0px' }">
          <el-image :src="imgwrap1[index]" class="image"></el-image>
          <div style="padding: 14px;">
            <span>好吃的汉堡</span>
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
              <el-button type="text" class="button">了解详情</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import NavBar from "@/views/frontpage/NavBarView.vue"
export default {
  name: "IndexView",
  data() {
    return {
      activeIndex: '1',
      isLogin:true,
      loginType:true,
      imgwrap:[
        'http://1.15.248.74:9000/questionbucket/12471769252233230.jpg',
          'http://1.15.248.74:9000/coursebucket/7367572056151466.jpg'
      ],
      imgwrap1:[
        'http://1.15.248.74:9000/questionbucket/12471769252233230.jpg',
        'http://1.15.248.74:9000/coursebucket/7367572056151466.jpg'
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
  components: { NavBar
  },

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