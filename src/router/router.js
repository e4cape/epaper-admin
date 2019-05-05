import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

// 使用懒加载的方式载入组件 用到再加载
const login = () => import("../views/login.vue");
const index = () => import("../views/index.vue");

// 统一的错误页
const error = () => import("../views/error.vue");

//控制台模块
const dataStatistics = () => import("../views/console/dataStatistics.vue");
const platformAccount = () => import("../views/console/platformAccount.vue");


//会员管理模块
const customerList = () => import("../views/customerManagement/customerList.vue");


//路由规则
let routes = [
  {
    path: "/error",
    component: error
  },
  {
    path: "/login",
    component: login,
    //路由元信息
    meta:{
        noLogin:true
    }
  },
  {
    path: "/",
    component: index,

    //嵌套的路由
    children:[
        {
            path:'dataStatistics',
            component:dataStatistics
        },
        {
            path:'platformAccount',
            component:platformAccount
        },
        {
            path:'customerList',
            component:customerList
        },

    ]
  }
];

//实例化路由对象
let router = new VueRouter({
    routes
})


// 全局路由导航守卫
router.beforeEach((to,from,next)=>{
    if(to.matched.length ===0) {
        //提示错误信息
        Vue.prototype.$message.error('地址不正确,没有该页面')
        next('/error')
    }
    //如果是登录页
    if(to.meta.noLogin === true) {
        next()
    }else {
        //不是登录页
        if(window.sessionStorage.getItem('token')) {
            next()
        }else {
            //未登录
            Vue.prototype.$message.error('未登录,请输入账号和密码')
            next('/login')
        }
    }
})


export default router