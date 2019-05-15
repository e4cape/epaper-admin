<template>
  <div>

    <el-form :inline="true" :model="formInline">
      <el-form-item label="文章名" class="inputForm">
        <el-input v-model="formInline.postsName" placeholder="请输入文章名"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" class="inputForm">
        <el-select v-model="formInline.postsCate" placeholder="请选择文章分类">
          <el-option
            :label="item.acName"
            :value="item.acName"
            v-for="(item,index) in cateList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="首页推荐" class="inputForm">
        <el-select v-model="formInline.state" placeholder="是否首页推荐" class="my-input">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册日期">
        <el-date-picker
          v-model="formInline.dataValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="my-date-picker"
          value-format="timestamp"
          clearable
        ></el-date-picker>
      </el-form-item>
      <el-form-item class="mySearch">
        <!-- 清除按钮 -->
        <el-link
          type="primary"
          :underline="false"
          style="marginRight:30px"
          @click="clearCondition"
        >清除条件</el-link>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  data() {
    return {
      //搜索表单
      formInline: {
        postsName: "",
        postsCate: "",
        state: "",
        dataValue: []
      }
    };
  }
};
</script>

<style lang="less">
</style>