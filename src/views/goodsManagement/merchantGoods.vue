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
                <el-link
                  type="primary"
                  :underline="false"
                  @click="editSoldOut(scope.row)"
                  style="marginRight:15px"
                >编辑</el-link>
                <el-link type="primary" :underline="false" @click="getOutSoldOut(scope.row)">下架</el-link>
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
          <el-button type="primary" @click="getOutSomeGetOut" style="marginBottom:25px">批量上架</el-button>
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
                <el-link :underline="false" v-else>否</el-link>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="260" align="center">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="editGetOut(scope.row)"
                  style="marginRight:15px;"
                >编辑</el-link>
                <el-link type="primary" :underline="false" @click="getOutGetOut(scope.row)">上架</el-link>
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
    <el-dialog title="发布商品" :visible.sync="publishVisible" class="publishDialog">
      <el-form :model="publishForm">
        <el-form-item label="商品名" class="publishFormItem">
          <el-input v-model="publishForm.goodsName" autocomplete="off" class="publishInput"></el-input>
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
        types1: [],
        types2: [],
        unit: "吨",
        typeTable: []
      },

      //全选框的选择项
      multipleSelection: [],

      //图片上传地址
      Action: "https://szyizhitong.com:443/basics/goods/good/uploadimg",
      mainImageUrl: "",
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
    //图片上传的钩子
    handleMainSuccess(res, file) {
      this.mainImageUrl = URL.createObjectURL(file.raw);
    },
    //上传前的验证
    beforeMainUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return (isJPG || isPNG) && isLt2M;
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
    //在售中
    //编辑
    editSellingGoods() {},
    //复制
    async copySellingGoods(row) {
      let res = await this.$axios.post(
        `admin/manager/goods/copy?goodsId=${row.goodsId}`
      );

      if (res.data.code === 200) {
        this.$message.success("复制成功!");
        this.getmerchantGoods();
      } else {
        this.$message.success("复制失败!");
      }
    },
    //下架
    async getOutSellingGoods(row) {
      //下架状态为0
      let res = await this.$axios.post(`admin/manager/goods/updateGoodsState`, {
        goodsId: row.goodsId,
        goodsState: 0
      });
      if (res.data.code === 200) {
        this.$message.success("下架成功!请到已下架列表中查看");
        this.getmerchantGoods();
      } else {
        this.$message.success("下架失败!");
      }
    },

    //已售罄
    editSoldOut() {},
    async getOutSoldOut(row) {
      //下架状态为0
      let res = await this.$axios.post(`admin/manager/goods/updateGoodsState`, {
        goodsId: row.goodsId,
        goodsState: 0
      });
      if (res.data.code === 200) {
        this.$message.success("下架成功!请到已下架列表中查看");
        this.getmerchantGoods();
      } else {
        this.$message.success("下架失败!");
      }
    },

    //已下架
    editGetOut() {},
    deleteGetOut() {},
    //单击上架
    async getOutGetOut(row) {
      //上架状态为1
      let res = await this.$axios.post(`admin/manager/goods/updateGoodsState`, {
        goodsId: row.goodsId,
        goodsState: 1
      });
      if (res.data.code === 200) {
        this.$message.success("上架成功!请到在售中列表查看");
        this.getmerchantGoods();
      } else {
        this.$message.success("上架失败!");
      }
    },
    //批量上架功能
    async getOutSomeGetOut() {
      //拿到选择的id们
      let goodsId=[];
      this.multipleSelection.forEach(v=>{
          goodsId.push(v.goodsId);
      })
      console.log(goodsId);

      let res = await this.$axios.post(`admin/manager/goods/updateGoodsState`, {
        goodsIds: goodsId,
        goodsState: 1
      });
      if (res.data.code === 200) {
        this.$message.success("批量上架成功!请到在售中列表查看");
        this.getmerchantGoods();
      } else {
        this.$message.success("批量上架失败!");
      }
    },
    //多选框多选事件
    handleSelectionChange(val) {
      //获取到的是选中的那一行的所有
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },

    //发布商品弹框里的
    //确认规格
    confirmType() {
      console.log(this.publishForm.types1);
      console.log(this.publishForm.types2);
      this.publishForm.typeTable.length =
        this.publishForm.types1.length * this.publishForm.types2.length;
      console.log(this.publishForm.typeTable.length);

      for (let i = 0; i < this.publishForm.typeTable.length; i++) {
        this.publishForm.typeTable[i].type =
          this.publishForm.types1[i] + "/" + this.publishForm.types2[i];
      }
    },
    //新增输入框
    addInput() {
      this.publishForm.types1.push("");
      // console.log(this.publishForm.types1);
    },
    addInput2() {
      this.publishForm.types2.push("");
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
  .my-page {
    // position: absolute;
    // left: 50%;
    // margin-left: -180px;
    // bottom: 60px;
    margin-top: 25px;
  }

  .publishDialog {
    //一般输入框
    .publishInput {
      width: 200px;
    }
    //规格的输入框
    .typeInput {
      width: 80px;
      margin: 10px;
    }
    .publishFormItem {
      // margin: 0 auto;
      // width: 500px;
    }
    .main-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .main-uploader .el-upload:hover {
      border-color: #409eff;
    }

    .main-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 80px;
      height: 80px;
      line-height: 80px;
      text-align: center;
    }

    .main {
      width: 80px;
      height: 80px;
      display: block;
    }
  }
}
</style>