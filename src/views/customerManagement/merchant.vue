<template>
  <div id="merchant">
    <!-- 头部搜索区域 -->
    <div class="search">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="店铺名" class="inputForm">
          <el-input v-model="formInline.storeName" placeholder="请输入店铺名" style="width:140px"></el-input>
        </el-form-item>
        <el-form-item label="手机号" class="inputForm">
          <el-input v-model="formInline.contactsPhone" placeholder="请输入手机号" style="width:140px"></el-input>
        </el-form-item>
        <el-form-item label="主营品类" class="inputForm">
          <el-select v-model="formInline.cateId" placeholder="请选择主营品类">
            <el-option
              :label="item.cateName"
              :value="item.cateId"
              v-for="(item,index) in cateList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" class="inputForm">
          <el-select v-model="formInline.storeState" placeholder="请选择状态">
            <el-option label="开启" value="1"></el-option>
            <el-option label="关闭" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开通日期">
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
    <!-- 表格主体区域 -->
    <div class="main">
      <el-button type="primary" @click="openOneShop" style="marginBottom:25px">开通店铺</el-button>
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%"
        border
      >
        <el-table-column prop="storeName" label="店铺名" align="center" width="200"></el-table-column>
        <el-table-column prop="contactsPhone" label="手机号" align="center" width="200"></el-table-column>
        <el-table-column prop="createTime" label="开通日期" align="center" width="200">
          <template slot-scope="scope">{{ scope.row.createTime | formatTime('YYYY-MM-DD')}}</template>
        </el-table-column>
        <el-table-column prop="cateName" label="主营品类" align="center" width="200"></el-table-column>
        <el-table-column prop="storeState" label="状态" align="center" width="200">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" v-if="scope.row.storeState==1">开启</el-link>
            <el-link type="danger" :underline="false" v-else>关闭</el-link>
          </template>
        </el-table-column>
        <el-table-column prop label="商家备注" align="center"></el-table-column>
        <el-table-column porp="storeState" label="操作" align="center">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="remark(scope.row)">备注</el-link>
            <el-link
              type="primary"
              :underline="false"
              @click="editing(scope.row)"
              style="margin:0 25px"
            >编辑</el-link>
            <el-link
              type="primary"
              :underline="false"
              @click="policy(scope.row)"
              style="marginRight:25px"
            >政策</el-link>
            <el-link
              type="primary"
              :underline="false"
              @click="close(scope.row)"
              v-if="scope.row.storeState==1"
            >关闭</el-link>
            <el-link type="danger" :underline="false" @click="open(scope.row)" v-else>开启</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页器 -->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      layout="total, prev, pager, next, jumper"
      :total="totalPages"
      background
      class="my-page"
    ></el-pagination>

    <!-- 开通店铺对话框 -->
    <el-dialog title="添加商家" :visible.sync="openVisible" width="400px">
      <el-form :model="openForm">
        <el-form-item label="店铺名称" :label-width="formLabelWidth">
          <el-input v-model="openForm.storeName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="店铺描述" :label-width="formLabelWidth">
          <el-input v-model="openForm.desc" type="textarea" :rows="6" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="店铺logo" label-width="100px">
          <el-upload
            class="logo-uploader"
            :action="logoAction"
            :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload"
          >
            <img v-if="logoImageUrl" :src="logoImageUrl" class="logo">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="店铺banner" label-width="100px">
          <el-upload
            class="banner-uploader"
            :action="bannerAction"
            :on-success="handleBannerSuccess"
            :before-upload="beforeBannerUpload"
          >
            <img v-if="bannerImageUrl" :src="bannerImageUrl" class="banner">
            <i v-else class="el-icon-plus banner-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="主营品类" :label-width="formLabelWidth">
          <el-select v-model="openForm.cateId" placeholder="请选择分类">
            <el-option
              :label="item.cateName"
              :value="item.cateId"
              v-for="(item,index) in cateList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth">
          <el-input v-model="openForm.contactsName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="openForm.contactsPhone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" :label-width="formLabelWidth">
          <el-input v-model="openForm.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openVisible = false">取消</el-button>
        <el-button type="primary" @click="openShop">确认发布</el-button>
      </div>
    </el-dialog>

    <!-- 编辑店铺对话框 -->
    <el-dialog title="编辑文章" :visible.sync="editVisible" width="550px">
      <el-form :model="editForm"></el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="editShop">确认发布</el-button>
      </div>
    </el-dialog>

    <!-- 政策对话框 -->
    <el-dialog title="商家政策" :visible.sync="policyVisible" width="550px">
      <el-form :model="policyForm">
        <el-form-item label="促销政策" label-width="100px">
          <el-upload
            class="logo-uploader"
            :action="logoAction"
            :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload"
          >
            <img v-if="logoImageUrl" :src="logoImageUrl" class="logo">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
            <!-- <el-link type="primary" :underline="false" @click="addNew">新增</el-link> -->
          </el-upload>
        </el-form-item>
        <el-form-item label="质量指标" label-width="100px">
          <el-upload
            class="logo-uploader"
            :action="logoAction"
            :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload"
          >
            <img v-if="logoImageUrl" :src="logoImageUrl" class="logo">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
            <!-- <el-link type="primary" :underline="false" @click="addNew">新增</el-link> -->
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="policyVisible = false">取消</el-button>
        <el-button type="primary" @click="savePolicy">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "merchant",
  data() {
    return {
      formInline: {
        storeName: "",
        contactsPhone: "",
        cateName: "",
        storeState: "",
        dataValue: []
      },
      //页码
      currentPage: 1,
      totalPages: 0,
      //开通店铺
      openVisible: false,
      editVisible: false,
      policyVisible: false,
      //表格数据
      tableData: [],

      //对话框
      openForm: {
        storeName: "",
        desc: "",
        cateId: "",
        contactsName: "",
        contactsPhone: "",
        address: ""
      },
      editForm: {},
      policyForm: {},

      //上传头像的
      //上传地址
      logoAction: "",
      bannerAction: "",
      //上传图片
      bannerImageUrl: "",
      logoImageUrl: "",
      formLabelWidth: "80px",

      cateList: []
    };
  },
  methods: {
    //获取商家列表
    async getMerchant() {
      let res = await this.$axios.get(
        `admin/sysStore/storeList?currentPage=${
          this.currentPage
        }&pageSize=10&storeName=${this.formInline.storeName}&contactsPhone=${
          this.formInline.contactsPhone
        }&cateName=${this.formInline.cateName}&storeState=${
          this.formInline.storeState
        }&startTime=${this.formInline.dataValue[0] || ""}&endTime=${this
          .formInline.dataValue[1] || ""}`
      );
      console.log(res);
      if (res.data.code === 200) {
        //店铺类型为1就是商家店铺
        this.tableData = res.data.data.list.filter(v=>{
            if(v.storeType==1) {
              return v;
            }
        })
        this.totalPages = this.tableData.length;
      } else {
        this.$message.error(res.data.message);
      }
    },
    //获取主营品类
    async getCateList() {
      let res = await this.$axios.get(`admin/sysStore/query`);
      console.log(res);
      if (res.data.code === 200) {
        this.cateList = res.data.data;
      } else {
        this.$message.error(res.data.message);
      }
    },
    //清除条件
    clearCondition() {
      this.formInline.storeName = "";
      this.formInline.contactsPhone = "";
      this.formInline.cateName = "";
      this.formInline.storeState = "";
      this.formInline.dataValue = [];
      this.getMerchant();
    },
    //搜索
    search() {
      this.getMerchant();
    },
    //新增店铺的
    openOneShop() {
      this.openForm.storeName="";
      this.openForm.desc="";
      this.openForm.cateId="";
      this.openForm.contactsName="";
      this.openForm.contactsPhone="";
      this.openForm.address="";
      this.openVisible = true;
    },
    //上传头像的事件
    handleLogoSuccess(res, file) {
      this.logoImageUrl = URL.createObjectURL(file.raw);
    },
    beforeLogoUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleBannerSuccess(res, file) {
      this.bannerImageUrl = URL.createObjectURL(file.raw);
    },
    beforeBannerUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //备注事件
    remark(row) {},
    editing(row) {},
    policy(row) {
      this.policyVisible = true;
    },
    open(row) {},
    close(row) {},
    //切换页码
    handleCurrentChange() {
      this.getMerchant();
    }
  },
  created() {
    this.getMerchant();
    this.getCateList();
  }
};
</script>

<style lang="less">
#merchant {
  position: relative;
  height: 100%;
  .search {
    position: relative;
    .inputForm {
      margin-right: 20px;
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
    position: absolute;
    left: 50%;
    margin-left: -180px;
    bottom: 60px;
  }

  //logo上传区域
  .logo-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .banner-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .logo-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .banner-uploader:hover {
    border-color: #409eff;
  }
  .logo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .banner-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 300px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .logo {
    width: 80px;
    height: 80px;
    display: block;
  }
  .banner {
    width: 300px;
    height: 120px;
    display: block;
  }
}
</style>