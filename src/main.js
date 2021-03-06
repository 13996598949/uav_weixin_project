// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import Vant from 'vant';
import 'vant/lib/vant-css/index.css';
import base from "././components/base/base"

Vue.prototype.global = base
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(Vant);
import '@/assets/css/reset.css'
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
