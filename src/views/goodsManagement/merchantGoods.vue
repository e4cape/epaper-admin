<template>
  <div id="merchantGoods">
    <!-- 头部搜索区域 -->
    <div class="search">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="商品名" class="inputForm">
          <el-input v-model="formInline.goodsName" placeholder="请输入商品名"></el-input>
        </el-form-item>
        <el-form-item label="所属店铺" class="inputForm">
          <el-select v-model="formInline.goodsStoreId" placeholder="请输入所属店铺">
            <el-option
              :label="item.storeName"
              :value="item.storeId"
              v-for="(item,index) in storeList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类" class="inputForm">
          <el-select v-model="formInline.goodsCateId" placeholder="请选择商品分类">
            <el-option
              :label="item.cateName"
              :value="item.cateId"
              v-for="(item,index) in goodsCateList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库存警戒" class="inputForm">
          <el-select v-model="formInline.goodsWarnState" placeholder="是否达到库存警戒" class="my-input">
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
          <el-button type="primary" @click="publishGoods" style="marginBottom:25px">发布商品</el-button>
          <el-table
            ref="singleTable"
            :data="sellingTable"
            highlight-current-row
            style="width: 100%"
            border
          >
            <el-table-column prop="goodsName" label="商品名" align="center"></el-table-column>
            <el-table-column prop="goodsSn" label="商品编码" align="center"></el-table-column>
            <el-table-column prop="goodsStoreName" label="所属店铺" align="center"></el-table-column>
            <el-table-column prop="goodsCateName" label="商品分类" align="center"></el-table-column>
            <el-table-column prop="goodsWarnState" label="库存警戒" align="center">
              <template slot-scope="scope">
                <el-link type="danger" :underline="false" v-if="scope.row.goodsWarnState==1">是</el-link>
                <el-link :underline="false" v-else>否</el-link>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="260" align="center">
              <template slot-scope="scope">
                <el-link type="primary" :underline="false" @click="editSellingGoods(scope.row)">编辑</el-link>
                <el-link
                  type="primary"
                  :underline="false"
                  @click="copySellingGoods(scope.row)"
                  style="margin:0 25px"
                >复制</el-link>
                <el-link type="primary" :underline="false" @click="getOutSellingGoods(scope.row)">下架</el-link>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页器 -->
          <el-pagination
            @current-change="handleCurrentChange1"
            :current-page="currentPage1"
            layout="total, prev, pager, next, jumper"
            :total="totalPages1"
            background
            class="my-page"
          ></el-pagination>
        </el-tab-pane>

        <el-tab-pane label="已售罄" name="second">
          <el-table
            ref="singleTable"
            :data="soldOutTable"
            highlight-current-row
            style="width: 100%"
            border
          >
            <el-table-column prop="goodsName" label="商品名" align="center"></el-table-column>
            <el-table-column prop="goodsSn" label="商品编码" align="center"></el-table-column>
            <el-table-column prop="goodsStoreName" label="所属店铺" align="center"></el-table-column>
            <el-table-column prop="goodsCateName" label="商品分类" align="center"></el-table-column>
            <el-table-column prop="goodsWarnState" label="库存警戒" align="center">
              <template slot-scope="scope">
                <el-link type="danger" :underline="false" v-if="scope.row.articleState==1">是</el-link>
                <el-link :underline="false" v-else>否</el-link>
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
            @current-change="handleCurrentChange2"
            :current-page="currentPage2"
            layout="total, prev, pager, next, jumper"
            :total="totalPages2"
            background
            class="my-page"
          ></el-pagination>
        </el-tab-pane>

        <el-tab-pane label="已下架" name="third">
          <el-button type="primary" @click="newPost" style="marginBottom:25px">上架</el-button>
          <el-button type="primary" @click="newPost" style="marginBottom:25px">删除</el-button>
          <el-table
            ref="multipleTable"
            :data="getOutTable"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            border
            class="my-table"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="goodsName" label="商品名" align="center"></el-table-column>
            <el-table-column prop="goodsSn" label="商品编码" align="center"></el-table-column>
            <el-table-column prop="goodsStoreName" label="所属店铺" align="center"></el-table-column>
            <el-table-column prop="goodsCateName" label="商品分类" align="center"></el-table-column>
            <el-table-column prop="goodsWarnState" label="库存警戒" align="center">
              <template slot-scope="scope">
                <el-link type="danger" :underline="false" v-if="scope.row.articleState==1">是</el-link>
                <el-link type="primary" :underline="false" v-else>否</el-link>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="260" align="center">
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
            @current-change="handleCurrentChange3"
            :current-page="currentPage3"
            layout="total, prev, pager, next, jumper"
            :total="totalPages3"
            background
            class="my-page"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 发布商品的弹窗 -->
    <el-dialog title="发布商品" :visible.sync="publishVisible" width="1300px">
      <el-form :model="publishForm">
        <el-form-item label="商品名" label-width="100px">
          <el-input v-model="publishForm.goodsName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属店铺" class="inputForm">
          <el-select v-model="publishForm.goodsStoreId" placeholder="请输入所属店铺">
            <el-option
              :label="item.storeName"
              :value="item.storeId"
              v-for="(item,index) in storeList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类" class="inputForm">
          <el-select v-model="publishForm.goodsCateId" placeholder="请选择商品分类">
            <el-option
              :label="item.cateName"
              :value="item.cateId"
              v-for="(item,index) in goodsCateList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品编码" label-width="100px">
          <el-input v-model="publishForm.goodsName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品主图" label-width="100px">
          <el-upload
            class="logo-uploader"
            :action="Action"
            :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload"
          >
            <img v-if="logoImageUrl" :src="logoImageUrl" class="logo">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品单位" label-width="100px">
          <el-radio-group v-model="publishForm.unit" size="medium">
            <el-radio-button label="吨"></el-radio-button>
            <el-radio-button label="方"></el-radio-button>
            <el-radio-button label="台"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规格项1" label-width="100px">
             <el-input v-for="(item, index) in publishForm.types" :key="index"></el-input>
             <el-button @click="addInput">新增规格</el-button>
        </el-form-item>
        <el-form-item label="规格项2" label-width="100px">
          <el-input v-for="(item, index) in publishForm.types2" :key="index"></el-input>
             <el-button @click="addInput2">新增规格</el-button>
        </el-form-item>
        <el-form-item label="规格项2" label-width="100px">
          
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="publishVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRemark">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "merchantGoods",
  data() {
    return {
      formInline: {
        goodsName: "",
        goodsStoreId: "",
        goodsCateId: "",
        goodsWarnState: ""
      },
      //表格绑定的数据
      sellingTable: [],
      soldOutTable: [],
      getOutTable: [],

      //下拉框的列表
      storeList: [],
      goodsCateList: [],

      activeName: "first",
      //页码
      currentPage1: 1,
      totalPages1: 0,
      currentPage2: 1,
      totalPages2: 0,
      currentPage3: 1,
      totalPages3: 0,

      //发布商品的对话框表单
      publishForm: {
        types:[1,1],
        types2:[1,1],
        unit:"吨",
      },

      //对话框的可见性
      publishVisible: false
    };
  },
  methods: {
    //获取商家商品列表
    async getmerchantGoods() {
      let res = await this.$axios.get(
        `admin/manager/goods/listPage?currentPage=${
          this.currentPage1
        }&pageSize=10&goodsName=${this.formInline.goodsName}&goodsStoreId=${
          this.formInline.goodsStoreId
        }&goodsCateId=${this.formInline.goodsCateId}&goodsWarnState=${
          this.formInline.goodsWarnState
        }`
      );
      console.log(res);
      if (res.data.code === 200) {
        this.sellingTable = res.data.data.list.filter(v => {
          if (v.goodsState == 1) {
            return v;
          }
        });
        this.soldOutTable = res.data.data.list.filter(v => {
          if (v.goodsState == 2) {
            return v;
          }
        });
        this.getOutTable = res.data.data.list.filter(v => {
          if (v.goodsState == 0) {
            return v;
          }
        });
        this.totalPages1 = this.sellingTable.length;
        this.totalPages2 = this.soldOutTable.length;
        this.totalPages3 = this.getOutTable.length;
      } else {
        this.$message.error(res.data.message);
      }
    },
    //获取所有正常状态的店铺
    async getStoreList() {
      let res = await this.$axios.get(`admin/sysStore/listAll`);

      if (res.data.code === 200) {
        this.storeList = res.data.data;
      }
    },
    //获取商品分类
    async getCateList() {
      let res = await this.$axios.get(`admin/manager/catelog/listAll`);
      console.log(res);
      if (res.data.code === 200) {
        this.goodsCateList = res.data.data;
      }
    },
    //点击发布商品按钮
    publishGoods() {
      this.publishVisible = true;
    },

    //清除搜索条件
    clearCondition() {
      for (var key in this.formInline) {
        this.formInline[key] = "";
      }
      this.getmerchantGoods();
    },
    search() {
      this.getmerchantGoods();
    },
    //新增输入框
    addInput(){
      this.publishForm.types.push(1);
    },
    addInput2(){
      this.publishForm.types2.push(1);
    },


    //页码切换事件
    handleCurrentChange1() {},
    handleCurrentChange2() {},
    handleCurrentChange3() {}
  },
  created() {
    this.getmerchantGoods();
    this.getStoreList();
    this.getCateList();
  }
};
</script>

<style lang="less">
#merchantGoods {
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