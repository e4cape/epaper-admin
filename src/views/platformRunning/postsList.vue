<template>
  <div id="postsList">
    <!-- 头部搜索区域 -->
    <div class="search">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="文章名" class="inputForm">
          <el-input v-model="formInline.postsName" placeholder="请输入文章名" class="my-input"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" class="inputForm">
          <el-select v-model="formInline.postsCate" placeholder="请选择文章分类" class="my-input">
            <el-option
              :label="item.role"
              :value="item.role"
              v-for="(item,index) in roleList"
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

    <!-- 主体区域 -->
    <div class="main">
      <el-button type="primary" @click="showDialog" style="marginBottom:25px">发布文章</el-button>
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%"
        border
      >
        <el-table-column type="index" width="260" label="排序" align="center"></el-table-column>
        <el-table-column prop="acName" label="分类" align="center"></el-table-column>
        <el-table-column label="操作" width="260" align="center">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="editingCat(scope.row)">编辑</el-link>
            <el-link
              type="primary"
              :underline="false"
              @click="deleteCat(scope.row)"
              style="marginLeft:25px"
            >删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "postsList",
  data() {
    return {
      formInline: {
        postsName: "",
        postsCate: "",
        state: ""
      }
    };
  },
  methods: {}
};
</script>

<style lang="less">
</style>