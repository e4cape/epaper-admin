import Vue from 'vue'
import App from './App.vue'

//导入全局基础样式
import './assets/less/base.less'

// 导入element
import ElementUI from 'element-ui'
Vue.use(ElementUI)


// 全局过滤器
// 导入moment
// import moment from 'moment'
// Vue.filter('formatTime', (value, formatTem) => {
//   // 使用过滤器的参数 来格式化时间
//   return moment(value).format(formatTem)
// })

//注册全局过滤器,使用day.js
import dayjs from 'dayjs'
Vue.filter('formatTime',(value,formatTem) =>{
  return dayjs(value).format(formatTem)
})

// 导入我的axios插件
import myaxios from './API/my-axios'
// use一下 调用了 插件的install方法
Vue.use(myaxios)


// 导入路由
import router from './router/router'

// 导入仓库
import store from './store/store'


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
