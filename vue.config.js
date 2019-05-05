let path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  chainWebpack: config => {
    //设置别名
    config.resolve.alias.set("@", resolve("src"));
  },
  devServer: {
    open: true //打开浏览器窗口
  },
  // 跟webpack的配置合并
  configureWebpack: {
    // 忽略的模块名
    externals: {
      // 左边是模块的名字 标准名字
      // 右边是在代码中使用的名字
      vue: "Vue",
      vuex: "Vuex",
      "vue-router": "VueRouter",
      // 饿了ui的 内部的使用的名字 ELEMENT
      "element-ui": "ELEMENT",
      axios: "axios",
      moment: "moment"
    }
  }
};
