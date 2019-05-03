import Vue from 'vue'
import App from './App.vue'

//导入全局基础样式
import './assets/less/base.less'

// 导入element
import ElementUI from 'element-ui'
Vue.use(ElementUI)





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
