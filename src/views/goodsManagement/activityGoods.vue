<template>
  <div id="activityGoods">
    <!-- 头部搜索区域 -->
    <div class="search">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="商品名" class="inputForm">
          <el-input v-model="formInline.goodsName" placeholder="请输入商品名"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" class="inputForm">
          <el-input v-model="formInline.goodsSn" placeholder="请输入商品编码"></el-input>
        </el-form-item>
        <el-form-item label="所属店铺" class="inputForm">
          <el-input v-model="formInline.goodsStoreId" placeholder="请输入所属店铺"></el-input>
        </el-form-item>
        <el-form-item label="促销专区" class="inputForm">
          <el-select v-model="formInline.postsCate" placeholder="请选择促销专区">
            <!-- <el-option
              :label="item.acName"
              :value="item.acName"
              v-for="(item,index) in cateList"
              :key="index"
            ></el-option>-->
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
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="抢购中" name="first">
          <el-button type="primary" @click="backOutPurchase" >下线</el-button>
          <el-table
            ref="multipleTable"
            :data="purchaseTable"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="someSelect1"
            border
            class="my-table"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="goodsName" label="活动商品" align="center"></el-table-column>
            <el-table-column prop="goodsSn" label="商品编码" align="center"></el-table-column>
            <el-table-column prop="" label="商品规格" align="center"></el-table-column>
            <el-table-column prop="promotionArea" label="促销专区" align="center"></el-table-column>
            <el-table-column prop="sdGoodsMarketPrice " label="原价" align="center"></el-table-column>
            <el-table-column prop="sdGoodsSellPrice " label="活动价" align="center"></el-table-column>
            <el-table-column prop="{remainingStock/activityStock}" label="剩余/活动库存" align="center"></el-table-column>
            <el-table-column prop="{activityBeginTime,activityEndTime}" label="活动期" align="center">
              <template
                slot-scope="scope"
              >{{ scope.row.activityBeginTime | formatTime('YYYY-MM-DD')}}~{{ scope.row.activityEndTime | formatTime('YYYY-MM-DD')}}</template>
            </el-table-column>
            <el-table-column label="操作" width="260" align="center">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="editPurchase(scope.row)"
                  style="marginRight:15px;"
                >编辑</el-link>
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

        <el-tab-pane label="未开始" name="second">
          <el-button type="primary" @click="backOutUnstarted" >下线</el-button>
          <el-table
            ref="multipleTable"
            :data="unstartedTable"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="someSelect2"
            border
            class="my-table"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop label="活动商品" align="center"></el-table-column>
            <el-table-column prop label="商品编码" align="center"></el-table-column>
            <el-table-column prop label="商品规格" align="center"></el-table-column>
            <el-table-column prop label="促销专区" align="center"></el-table-column>
            <el-table-column prop label="原价" align="center"></el-table-column>
            <el-table-column prop label="活动价" align="center"></el-table-column>
            <el-table-column prop label="剩余/活动库存" align="center"></el-table-column>
            <el-table-column prop label="活动期" align="center"></el-table-column>
            <el-table-column label="操作" width="260" align="center">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="editUnstarted(scope.row)"
                  style="marginRight:15px;"
                >编辑</el-link>
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

        <el-tab-pane label="已下线" name="third">
          <el-button type="primary" @click="restartXia" >重启</el-button>
          <el-button type="primary" @click="deleteXia" >删除</el-button>
          <el-table
            ref="multipleTable"
            :data="xiaTable"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="someSelect3"
            border
            class="my-table"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="goodsName" label="活动商品" align="center"></el-table-column>
            <el-table-column prop="goodsSn" label="商品编码" align="center"></el-table-column>
            <el-table-column prop           label="商品规格" align="center"></el-table-column>
            <el-table-column prop="promotionArea" label="促销专区" align="center"></el-table-column>
            <el-table-column prop="sdGoodsMarketPrice" label="原价" align="center"></el-table-column>
            <el-table-column prop="sdGoodsSellPrice " label="活动价" align="center"></el-table-column>
            <el-table-column prop="{remainingStock,activityStock}" label="剩余/活动库存" align="center" >{{remainingStock/activityStock}}</el-table-column>
            <el-table-column prop="{activityBeginTime,activityEndTime}" label="活动期" align="center" width="250">
              <template
                slot-scope="scope"
              >{{ scope.row.activityBeginTime | formatTime('YYYY.MM.DD')}}~{{ scope.row.activityEndTime | formatTime('YYYY.MM.DD')}}</template>
            </el-table-column>
            <el-table-column label="操作" width="260" align="center">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="restartXiaOne(scope.row)"
                  style="marginRight:15px;"
                >重启</el-link>
                <el-link
                  type="primary"
                  :underline="false"
                  @click="editXiaOne(scope.row)"
                  style="marginRight:15px;"
                >编辑</el-link>
                <el-link
                  type="primary"
                  :underline="false"
                  @click="deleteXiaOne(scope.row)"
                  style="marginRight:15px;"
                >删除</el-link>
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

        <el-tab-pane label="商品库" name="fourth">
          <el-button type="primary" @click="publishGoods" >发布商品</el-button>
          <el-button type="danger" @click="addActivity" >添加活动</el-button>
          <el-table
            ref="multipleTable"
            :data="goodsTable"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="someSelect4"
            border
            class="my-table"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop label="商品名" align="center"></el-table-column>
            <el-table-column prop label="商品编码" align="center"></el-table-column>
            <el-table-column prop label="商品规格" align="center"></el-table-column>
            <el-table-column prop label="商品分类" align="center"></el-table-column>
            <el-table-column prop label="原价" align="center"></el-table-column>
            <el-table-column prop label="库存" align="center"></el-table-column>
            <el-table-column prop label="活动状态" align="center"></el-table-column>
            <el-table-column label="操作" width="260" align="center">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="editGoods(scope.row)"
                  style="marginRight:15px;"
                >编辑</el-link>
                <el-link type="primary" :underline="false" @click="copyGoods(scope.row)">复制</el-link>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页器 -->
          <el-pagination
            @current-change="handleCurrentChange4"
            :current-page="currentPage4"
            layout="total, prev, pager, next, jumper"
            :total="totalPages4"
            background
            class="my-page"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 发布商品的弹窗 -->
    <el-dialog title="发布商品" :visible.sync="publishVisible" class="publishDialog">
      <el-form :model="publishForm">
        <el-form-item label="商品名" class="publishFormItem">
          <el-input v-model="publishForm.goodsName" autocomplete="off" class="publishInput"></el-input>
        </el-form-item>
        <el-form-item label="平台店铺" class="inputForm">
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
        <el-form-item label="促销专区" class="inputForm">
          <el-select v-model="publishForm.goodsCateId" placeholder="请选择商品分类">
            <el-option
              :label="item.cateName"
              :value="item.cateId"
              v-for="(item,index) in goodsCateList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="publishForm.goodsName" autocomplete="off" class="publishInput"></el-input>
        </el-form-item>
        <el-form-item label="商品主图">
          <el-upload
            class="main-uploader"
            :action="Action"
            :on-success="handleMainSuccess"
            :before-upload="beforeMainUpload"
          >
            <img v-if="mainImageUrl" :src="mainImageUrl" class="main">
            <i v-else class="el-icon-plus main-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品单位">
          <el-radio v-model="publishForm.unit" label="吨" border></el-radio>
          <el-radio v-model="publishForm.unit" label="方" border></el-radio>
          <el-radio v-model="publishForm.unit" label="台" border></el-radio>
        </el-form-item>
        <el-form-item label="规格项1">
          <el-input
            v-model="publishForm.types1[index]"
            v-for="(item, index) in publishForm.types1"
            :key="index"
            class="typeInput"
          ></el-input>
          <el-button @click="addInput" type="primary" style="margin:10px">新增规格</el-button>
        </el-form-item>
        <el-form-item label="规格项2">
          <el-input
            v-model="publishForm.types2[index]"
            v-for="(item, index) in publishForm.types2"
            :key="index"
            class="typeInput"
          ></el-input>
          <el-button @click="addInput2" type="primary" style="margin:15px">新增规格</el-button>
          <el-button @click="confirmType" type="primary" style="margin:15px">确认规格</el-button>
        </el-form-item>
        <el-form-item>
          <el-table
            ref="singleTable"
            :data="publishForm.typeTable"
            highlight-current-row
            style="width: 100%;marginTop:30px;"
            border
          >
            <el-table-column prop="type" label="规格" align="center"></el-table-column>
            <el-table-column prop="salePrice" label="销售价(元/吨)" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.salePrice"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="oldPrice" label="原价(元/吨)" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.salePrice"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="storeSave" label="库存(吨)" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.salePrice"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-link type="primary" :underline="false" @click="deleteRow(scope.row)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="publishVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpload">确认上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "activityGoods",
  data() {
    return {
      formInline: {
        postsName: "",
        postsCate: "",
        state: "",
        dataValue: []
      },

      //表格数据
      purchaseTable: [],
      unstartedTable: [],
      xiaTable: [],
      goodsTable: [],

      //页码
      currentPage1: 1,
      totalPages1: 0,
      currentPage2: 1,
      totalPages2: 0,
      currentPage3: 1,
      totalPages3: 0,
      currentPage4: 1,
      totalPages4: 0,

      activeName: "first",
      Action: "",
      mainImageUrl: "",
      //对话框的表单
      publishForm: {},
      //对话框
      publishVisible: false
    };
  },
  methods: {
    //获取活动商品列表
    async getActivityGoods() {
      let res = await this.$axios.post(`admin/manager/promotion/list`, {});

      if (res.data.code === 200) {
        var resArr = res.data.data.list;
        console.log(resArr);
        this.purchaseTable = resArr.filter(v => {
          if (v.activityState == 20) {
            return v;
          }
        });

        this.unstartedTable = resArr.filter(v => {
          if (v.activityState == 10) {
            return v;
          }
        });

        this.xiaTable = resArr.filter(v => {
          if (v.activityState === 30) {
            return v;
          }
        });

        this.goodsTable = resArr.filter(v => {
          if (v.activityState == 1) {
            return v;
          }
        });

        //数据总条数
        this.totalPages1=this.purchaseTable.length;
        this.totalPages2=this.unstartedTable.length;
        this.totalPages3=this.xiaTable.length;
        this.totalPages4=this.goodsTable.length;
      } else {
        this.$message.error(res.data.message);
      }
    },

    // 选择框多选事件
    someSelect1() {},
    someSelect2() {},
    someSelect3() {},
    someSelect4() {},

    //每个表格上面的按钮
    backOutPurchase() {},
    backOutUnstarted() {},
    restartXia() {},
    deleteXia() {},
    publishGoods() {},
    addActivity() {},

    //每一行里面的事件
    editPurchase() {},
    editUnstarted() {},
    restartXiaOne() {},
    editXiaOne() {},
    deleteXiaOne() {},
    editGoods() {},
    copyGoods() {},

    //清除条件
    clearCondition() {
      console.log(this.purchaseTable);
      console.log(this.unstartedTable);
      console.log(this.xiaTable);
      console.log(this.goodsTable);
    },
    search() {},

    //主图上传事件
    handleMainSuccess() {},
    beforeMainUpload() {},

    // 页码
    handleCurrentChange1() {},
    handleCurrentChange2() {},
    handleCurrentChange3() {},
    handleCurrentChange4() {}
  },
  created() {
    this.getActivityGoods();
  }
};
</script>

<style lang="less">
#activityGoods {
  position: relative;
  height: 100%;
  .search {
    position: relative;
    .inputForm {
      margin-right: 15px;
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
  .my-page {
    margin-top: 25px;
    // position: absolute;
    // left: 50%;
    // margin-left: -180px;
    // bottom: 60px;
  }
}
</style>