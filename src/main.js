import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios";

/*element ui*/
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

/* v-charts */
import VeLine from "v-charts/lib/line.common";
import VePie from "v-charts/lib/pie.common";
import VeHistogram from "v-charts/lib/histogram.common";

import { ElementTiptapPlugin } from 'element-tiptap';
import 'element-tiptap/lib/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(ElementTiptapPlugin, {
  lang: 'zh', // 设置语言为中文
});


Vue.component(VeLine.name,VeLine)
Vue.component(VePie.name,VePie)
Vue.component(VeHistogram.name,VeHistogram)

Vue.prototype.$http=axios
Vue.use(axios)
axios.defaults.baseURL = 'http://localhost:8081';
// axios.defaults.withCredentials = true;
axios.interceptors.request.use(function(config) {
  // config.headers.authorization = localStorage.getItem("token");
  config.headers.authorization = 'admin'
  return config;
}, function(error) {
  console.log('err', error);
})
//
localStorage.setItem('studentId','100000')
localStorage.setItem('avatar','http://1.15.248.74:9000/userbucket/6272642029977633.jpg')

new Vue({
  router,
  axios,
  render: h => h(App)
}).$mount('#app')
