<template>
  <div id="login">
    <!-- 登录的大盒子 -->
    <div class="loginBox">
      <div class="left">
        <img
          src="https://img20.360buyimg.com/mobilecms/s180x260_jfs/t1/41903/3/1522/66228/5cc6b2a0E7d5fea9f/815fced24b2d7112.jpg!q90!cc_180x260"
          alt
        >
      </div>
      <div class="right">
        <!-- 标题 -->
        <h3>易纸通后台登录</h3>
        <!-- element的form -->
        <el-form
        label-position="top"
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        class="my-form"
      >
        <el-form-item  prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入登录账号" ></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('loginForm')" style="background:#dd2b2b" class="my-btn">登录</el-button>
          <el-button type="success" @click="resetForm('loginForm')" class="my-btn">重置</el-button>
        </el-form-item>
      </el-form>
      </div>
    </div>
  </div>
</template>


<script>
// import Login from '../API/login.js'
export default {
  name: "login",
  data() {
    return {
      // 表单数据
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 表单验证 规则
      rules: {
        /*
          required 必须
          message 提示信息
          trigger 触发 触发方式
          min 最短
          max 最长
        * */

        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 4, max: 16, message: "长度在4-16个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 16, message: "长度在6-16个字符", trigger: "blur" }
        ]
      }
    };
  },
  // 方法
  methods: {
    // 表单提交
    submit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // 成功 提交数据
          let res = await this.$axios.post("admin/sysUser/login", this.loginForm);
          console.log(res);
          //另外一种封装的api
          // let res = await Login.login(this.loginForm)
          // console.log(res);
          
          //登陆成功
          if(res.data.code ===200) {
            this.$message.success(res.data.message);
            //设置token
            window.sessionStorage.setItem("token", res.data.data.token);
            this.$router.push("/")
          } else {
            this.$message.error(res.data.message);
          }
        } 
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less">
@import "../assets/less/base.less";
#login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: 100%;
  overflow: hidden;
  background-color: @aside-color;
  .loginBox {
    background-color: #fff;
    width: 550px;
    height: 330px;
    display: flex;
    .left {
      width: 40%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .right {
      flex: 1;
      height: 100%;
      text-align: center;
      h3{
          margin: 40px 0;
      }
      .my-form{
        width: 80%;
        margin: 0 auto;
        .my-btn {
          border:none;
          margin-right: 30px;
        }
      }
    }
  }
}
</style>