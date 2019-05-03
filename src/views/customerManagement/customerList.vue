<template>
  <div id="customerList">
    <!-- 头部搜索区域 -->
    <div class="search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="会员账号" >
          <el-input v-model="formInline.user" placeholder="请输入会员账号" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formInline.phoneNum" placeholder="请输入手机号" ></el-input>
        </el-form-item>
        <el-form-item label="注册来源">
          <el-select v-model="formInline.source" placeholder="注册来源">
            <el-option label="PC端" value="pc"></el-option>
            <el-option label="小程序端" value="miniPro"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.source" placeholder="请选择状态">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册日期">
          <el-date-picker
            v-model="formInline.dataValue"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
        <el-form-item label="企业账号">
          <el-select  placeholder="是否企业账号">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="承运商">
          <el-select  placeholder="是否承运商">
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="main"></div>
  </div>
</template>

<script>
export default {
  name: "customerList",
  data() {
    return {
        //表单数据
      formInline: {
        user: "",
        region: "",
        dataValue:""
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>

<style lang="less">
</style>