<template>
  <!-- 首页大盒子 -->
  <div id="index">
    <!-- element布局容器 -->
    <el-container class="index-container">
      <!-- 头部 -->
      <el-header class="my-header">
        <el-row>
          <el-col :span="21" class="header-title">
            <div>易纸通管理后台</div>
          </el-col>
          <el-col :span="3" class="header-role">
            <div>
              <span>{{roleRemark}}</span> &nbsp;&nbsp;|&nbsp;&nbsp;
              <a href="#" @click="logout">退出</a>
            </div>
          </el-col>
        </el-row>
      </el-header>

      <el-container class="my-container">
        <!-- 侧边栏 -->
        <el-aside width="200px" class="my-aside">
          <el-menu
            :default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            router
            background-color="#324157"
            text-color="#fff"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-monitor"></i>
                <span>控制台</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="dataStatistics">数据统计</el-menu-item>
                <el-menu-item index="platformAccount">平台流水</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="orders">商城订单</el-menu-item>
                <el-menu-item index="supplyGoods">货源列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-s-custom"></i>
                <span>客户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="customerList">会员列表</el-menu-item>
                <el-menu-item index="merchant">商家列表</el-menu-item>
                <el-menu-item index="shop">平台店铺</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>平台运营</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="auditList">审核列表</el-menu-item>
                <el-menu-item index="ads">广告图</el-menu-item>
                <el-menu-item index="postsList">文章列表</el-menu-item>
                <el-menu-item index="postsCategory">文章分类</el-menu-item>
                <el-menu-item index="manager">管理员</el-menu-item>
                <el-menu-item index="role">角色</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-shopping-bag-1"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="merchantGoods">商家商品</el-menu-item>
                <el-menu-item index="activityGoods">活动商品</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体区域 -->
        <el-main class="my-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      roleRemark:''
    };
  },
  methods:{
    reload(){
      // window.location.reload;
      // console.log('页面刷新啦');
      // this.$message.success('页面刷新啦');
      this.$router.go(0);
    },
    //退出功能
    async logout(){
       console.log('点退出了');
      console.log(window.sessionStorage.getItem("token"));
      let res = await this.$axios.get(`admin/sysUser/logout?token=${window.sessionStorage.getItem("token")}`);
      console.log(res);
      
      if (res.data.code === 200) {
        this.$message.success(res.data.message);
       // 删除token
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("roleName");
      window.sessionStorage.removeItem("remark");
      // 编程式导航 去登录页
      this.$router.push("/login");
      } else {
        this.$message.error(res.data.message);
      }
    }
  },
  async created(){
      
      window.sessionStorage.removeItem("remark");

      //查询角色的接口
      let res = await this.$axios.get(`admin/sysRole/selectRole?token=${window.sessionStorage.getItem("token")}`);
      console.log(res);
      if (res.data.code === 200) {
        //显示右上角的角色名字
        this.roleRemark=res.data.data[0].remark;
        //同时将roleName存在sessionStorage中,方便其他页面调用
        window.sessionStorage.setItem("roleName",res.data.data[0].roleName);
        window.sessionStorage.setItem("remark",res.data.data[0].remark)
      }
  }
  
};
</script>

<style lang='less'>
@import "../assets/less/base.less";
#index {
  height: 100%;

  .index-container {
    height: 100%;
    .my-header {
      background-color: @aside-color;
      color: #fff;
      text-align: center;
      line-height: 60px;
      .header-title {
        font-size: 30px;
      }
      .header-role {
        font-size: 18px;
        a {
          text-decoration: none;
          color: #fff;
        }
      }
    }
    .my-aside {
      background-color: @aside-color;
    }
    .my-main {
      margin-top: 15px;
      margin-left: 15px;
    }
  }
}
</style>