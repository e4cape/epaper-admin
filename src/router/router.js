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

//订单管理模块
const orders = () => import("../views/orderManagement/orders.vue");
const supplyGoods = () => import("../views/orderManagement/supplyGoods.vue");

//客户管理模块
const customerList = () => import("../views/customerManagement/customerList.vue");
const merchant = () => import("../views/customerManagement/merchant.vue");
const shop = () => import("../views/customerManagement/shop.vue");


//平台运营模块
const auditList = () => import("../views/platformRunning/auditList.vue");
const ads = () => import("../views/platformRunning/ads.vue");
const postsList = () => import("../views/platformRunning/postsList.vue");
const postsCategory = () => import("../views/platformRunning/postsCategory.vue");
const manager = () => import("../views/platformRunning/manager.vue");
const role = () => import("../views/platformRunning/role.vue");


//商品管理模块
const merchantGoods = () => import("../views/goodsManagement/merchantGoods.vue");
const activityGoods = () => import("../views/goodsManagement/activityGoods.vue");


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

        //控制台
        //数据统计
        {
            path:'dataStatistics',
            component:dataStatistics
        },
        //平台流水
        {
            path:'platformAccount',
            component:platformAccount
        },


        //订单管理
        //商城订单
        {
            path:'orders',
            component:orders
        },
        //货源列表
        {
            path:'supplyGoods',
            component:supplyGoods
        },


        //客户管理
        //会员列表
        {
            path:'customerList',
            component:customerList
        },
        //商家列表
        {
            path:'merchant',
            component:merchant
        },
        //平台店铺
        {
            path:'shop',
            component:shop
        },


        //平台运营
        //审核列表
        {
            path:'auditList',
            component:auditList
        },
        {
            path:'ads',
            component:ads
        },
        {
            path:'postsList',
            component:postsList
        },
        {
            path:'postsCategory',
            component:postsCategory
        },
        {
            path:'manager',
            component:manager
        },
        {
            path:'role',
            component:role
        },


        //商品管理
        //商家商品
        {
            path:'merchantGoods',
            component:merchantGoods
        },
        //活动商品
        {
            path:'activityGoods',
            component:activityGoods
        }
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