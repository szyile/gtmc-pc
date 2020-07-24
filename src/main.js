// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import "../static/css/global.less"; // 公用css文件

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(Vuex);

/* eslint-disable no-new */
var vue = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});

router.beforeEach((to,from,next)=>{
  document.title = to.meta.title
    if(!to.meta.needLogin){
      next()
    }else{
      let localToken = localStorage.getItem('token')
      if(localToken){
        next()
      }else{
        //没登录，走登录逻辑
        next({
          path:'/login',
        })
      }
    }
});

export default vue;
