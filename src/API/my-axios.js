// 导入axios
import axios from "axios";
// 导入router
import router from "../router/router";

export default {
  install(Vue) {
    //设置基地址
    axios.defaults.baseURL = "http://192.168.2.174:8787";

    // 设置axios拦截器
    // 请求拦截器 请求之前统一设置一些内容 比如 token
    axios.interceptors.request.use(
      function(config) {
        // Do something before request is sent
        // 统一设置token
        config.headers.Authorization = window.sessionStorage.getItem("token");
        return config;
      },
      function(error) {
        // Do something with request error
        return Promise.reject(error);
      }
    );

    // 响应拦截器 统一处理响应
    axios.interceptors.response.use(
      function(response) {
        // Do something with response data
        // console.log("响应拦截");
        // console.log(response);
        // 非法 token判断
        if (
          response.data.meta.msg === "无效token" &&
          response.data.meta.status === 400
        ) {
          // 打会登录页
          Vue.prototype.$message.warning(
            "哥们 ，伪造token哦，牛逼！滚去登录页"
          );
          // 删除伪造的token
          window.sessionStorage.removeItem("token");
          // 去登录页
          router.push("/login");
          // 用return的 方式 阻断执行
          return;
        }
        // 统一进行弹框
        if ([200, 201, 204].indexOf(response.data.meta.status) != -1) {
          Vue.prototype.$message.success(response.data.meta.msg);
        } else {
          Vue.prototype.$message.warning(response.data.meta.msg);
        }
        return response;
      },
      function(error) {
        // Do something with response error
        return Promise.reject(error);
      }
    );
    // 设置到原型上
    Vue.prototype.$axios = axios;
  }
};
