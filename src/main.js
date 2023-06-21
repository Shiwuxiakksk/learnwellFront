import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI)
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

new Vue({
  router,
  axios,
  render: h => h(App)
}).$mount('#app')
