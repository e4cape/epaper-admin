<template>
  <div id="merchantGoods">
    <!-- 头部搜索区域 -->
    <div class="search">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="商品名" class="inputForm">
          <el-input v-model="formInline.postsName" placeholder="请输入商品名"></el-input>
        </el-form-item>
        <el-form-item label="所属店铺" class="inputForm">
          <el-input v-model="formInline.postsName" placeholder="请输入所属店铺"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" class="inputForm">
          <el-select v-model="formInline.postsCate" placeholder="请选择商品分类">
            <el-option
              :label="item.acName"
              :value="item.acName"
              v-for="(item,index) in cateList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库存警戒" class="inputForm">
          <el-select v-model="formInline.state" placeholder="是否达到库存警戒" class="my-input">
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

    <!-- 表格主体区域 -->
    <div class="main">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="在售中" name="first">
          <el-button type="primary" @click="newPost" style="marginBottom:25px">发布商品</el-button>
          <el-table
            ref="singleTable"
            :data="sellingTable"
            highlight-current-row
            style="width: 100%"
            border
          >
            <el-table-column prop label="商品名" align="center"></el-table-column>
            <el-table-column prop label="商品编码" align="center"></el-table-column>
            <el-table-column prop label="所属店铺" align="center"></el-table-column>
            <el-table-column prop label="商品分类" align="center"></el-table-column>
            <el-table-column prop label="库存警戒" align="center">
              <template slot-scope="scope">
                <el-link type="danger" :underline="false" v-if="scope.row.articleState==1">是</el-link>
                <el-link type="primary" :underline="false" v-else>否</el-link>
              </template>
            </el-table-column>
            <el-table-column porp label="操作" width="260" align="center">
              <template slot-scope="scope">
                <el-link type="primary" :underline="false" @click="showAmendPost(scope.row)">编辑</el-link>
                <el-link
                  type="primary"
                  :underline="false"
                  @click="deletePost(scope.row)"
                  style="margin:0 25px"
                >复制</el-link>
                <el-link type="primary" :underline="false" @click="recommendAndNo(scope.row)">下架</el-link>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页器 -->
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            layout="total, prev, pager, next, jumper"
            :total="totalPages"
            background
            class="my-page"
          ></el-pagination>
        </el-tab-pane>

        <el-tab-pane label="已售罄" name="second">
          <el-table
            ref="singleTable"
            :data="sellingTable"
            highlight-current-row
            style="width: 100%"
            border
          >
            <el-table-column prop label="商品名" align="center"></el-table-column>
            <el-table-column prop label="商品编码" align="center"></el-table-column>
            <el-table-column prop label="所属店铺" align="center"></el-table-column>
            <el-table-column prop label="商品分类" align="center"></el-table-column>
            <el-table-column prop label="库存警戒" align="center">
              <template slot-scope="scope">
                <el-link type="danger" :underline="false" v-if="scope.row.articleState==1">是</el-link>
                <el-link type="primary" :underline="false" v-else>否</el-link>
              </template>
            </el-table-column>
            <el-table-column porp label="操作" width="260" align="center">
              <template slot-scope="scope">
                <el-link type="primary" :underline="false" @click="showAmendPost(scope.row)">编辑</el-link>
                <el-link type="primary" :underline="false" @click="recommendAndNo(scope.row)">下架</el-link>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页器 -->
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            layout="total, prev, pager, next, jumper"
            :total="totalPages"
            background
            class="my-page"
          ></el-pagination>
        </el-tab-pane>

        <el-tab-pane label="已下架" name="third">
          <el-button type="primary" @click="newPost" style="marginBottom:25px">上架</el-button>
          <el-button type="primary" @click="newPost" style="marginBottom:25px">删除</el-button>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            border
            class="my-table"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop label="商品名" align="center"></el-table-column>
            <el-table-column prop label="商品编码" align="center"></el-table-column>
            <el-table-column prop label="所属店铺" align="center"></el-table-column>
            <el-table-column prop label="商品分类" align="center"></el-table-column>
            <el-table-column prop label="库存警戒" align="center">
              <template slot-scope="scope">
                <el-link type="danger" :underline="false" v-if="scope.row.articleState==1">是</el-link>
                <el-link type="primary" :underline="false" v-else>否</el-link>
              </template>
            </el-table-column>
            <el-table-column porp label="操作" width="260" align="center">
              <template slot-scope="scope">
                <el-link type="primary" :underline="false" @click="showAmendPost(scope.row)">编辑</el-link>
                <el-link
                  type="primary"
                  :underline="false"
                  @click="deletePost(scope.row)"
                  style="margin:0 25px"
                >删除</el-link>
                <el-link type="primary" :underline="false" @click="recommendAndNo(scope.row)">下架</el-link>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页器 -->
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            layout="total, prev, pager, next, jumper"
            :total="totalPages"
            background
            class="my-page"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "merchantGoods",
  data() {
    return {
      formInline: {
        postsName: "",
        postsCate: "",
        state: "",
        dataValue: []
      },

      activeName: "first",
      //页码
      currentPage: 1,
      totalPages: 0,
    };
  },
  methods: {}
};
</script>

<style lang="less">
#merchantGoods{
  position: relative;
  height: 100%;
  .search {
    position: relative;
    .inputForm {
      margin-right: 35px;
    }
    .mySearch {
      position: absolute;
      right: 50px;
    }
  }
  .main {
    margin-top: 20px;
    .my-table {
      margin-top: 20px;
    }
  }
  // .my-page {
  //   position: absolute;
  //   left: 50%;
  //   margin-left: -180px;
  //   bottom: 60px;
  // }
}
</style>