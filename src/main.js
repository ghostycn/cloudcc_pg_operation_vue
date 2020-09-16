import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import axios from 'axios'
Vue.prototype.$axios = axios
Vue.use(ElementUI);

Vue.config.productionTip = false;
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css'
new Vue({
  el: '#app',
  render: h => h(App)
})
