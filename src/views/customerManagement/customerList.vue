<template>
  <div id="customerList">
    <!-- 头部搜索区域 -->
    <div class="search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="会员账号">
          <el-input v-model="formInline.user" placeholder="请输入会员账号" class="my-input"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formInline.phoneNum" placeholder="请输入手机号" class="my-input"></el-input>
        </el-form-item>
        <el-form-item label="注册来源">
          <el-select v-model="formInline.source" placeholder="注册来源" class="my-input">
            <el-option label="PC端" value="pc"></el-option>
            <el-option label="小程序端" value="miniPro"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.source" placeholder="请选择状态" class="my-input">
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
            class="my-date-picker"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <!-- 清除按钮 -->
          <el-link type="primary" :underline="false" style="marginRight:30px">清除条件</el-link>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item label="企业账号">
          <el-select placeholder="是否企业账号" class="my-input">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="承运商">
          <el-select placeholder="是否承运商" class="my-input">
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 主体区域 -->
    <div class="main">
      <el-button type="primary" @click="dialogFormVisible = true">批量备注</el-button>
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
        <el-table-column prop="memberAccount" label="账号" width="160" align="center"></el-table-column>
        <el-table-column prop="memberPhone" label="手机" width="160" align="center"></el-table-column>
        <el-table-column prop="amount" label="消费金额" width="160" align="center"></el-table-column>
        <el-table-column label="注册来源" width="160" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.memberSource | getSource}}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册日期" width="160" align="center">
          <template
            slot-scope="scope"
          >{{ scope.row.memberCreate | formatTime('YYYY-MM-DD HH:mm:ss')}}</template>
        </el-table-column>
        <el-table-column prop label="企业账号" width="160" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.memberType | getMember}}</span>
          </template>
        </el-table-column>
        <el-table-column label="承运商" width="160" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.carrierState | getCarrier}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="用户备注" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="120" align="center">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="preview(scope.row.memberCompany)">查看</el-link>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalPages"
        background
        class="my-page"
      ></el-pagination>
    </div>

    <!-- 对话框 -->
    <el-dialog title="会员资料" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div>
        <h5>企业资料</h5>
        <img :src="businessLicenseUrl" style="width:120px">
        <img :src="openBankCertificateUrl" style="width:120px">
      </div>
      <div>
        <h5>承运商资料</h5>
        <!-- <img
          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          style="width:120px"
        >
        <img
          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          style="width:120px"
        >
        <img
          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          style="width:120px"
        >-->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量备注对话框 -->
    <el-dialog title="批量备注" :visible.sync="dialogFormVisible" width="800px">
      <el-form :model="form">
        <el-form-item label="备注内容" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { log } from "util";
import loginVue from "../login.vue";
export default {
  name: "customerList",
  data() {
    return {
      //表单数据
      formInline: {
        account: "",
        phoneNum: "",
        source: "",
        
      },
      //表格数据
      tableData: [],
      multipleSelection: [],
      //对话框的可见性
      dialogVisible: false,
      //当前页码
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      //备注对话框的可见性
      dialogFormVisible: false,
      form: {
        name: ""
      },
      formLabelWidth: "120px",
      //企业资料
      businessLicenseUrl: "",
      openBankCertificateUrl: ""
    };
  },
  methods: {
    //查询事件
    search() {},
    //多选框选择事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //查看资料事件
    preview(url) {
      if (!url) {
        this.$message.error('该用户无资料');
        return;
      }
      //赋给图片路径
      console.log(url);
      //转json
      var newUrl=JSON.parse(url); 
      this.businessLicenseUrl = newUrl.businessLicenseUrl;
      this.openBankCertificateUrl = newUrl.openBankCertificateUrl;
      console.log(newUrl.businessLicenseUrl,newUrl.openBankCertificateUrl);
      this.dialogVisible = true;
    },
    //页码改变事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    //获取会员列表
    async getCustomerLists() {
      let res = await this.$axios.get(
        `sysUser/memberLists?currentPage=${this.currentPage}&pageSize=10`
      );
      console.log(res);
      if (res.data.code === 200) {
        this.tableData = res.data.data.list;
        this.totalPages = res.data.data.list.length;
      }
    }
  },
  created() {
    this.getCustomerLists();
  },
  //过滤器
  filters: {
    //过滤承运商
    getCarrier(value) {
      return value == 1 ? "是" : "否";
    },
    //过滤企业账号
    getMember(value) {
      return value == 2 ? "是" : "否";
    },
    //过滤来源
    getSource(value) {
      return value == 1 ? "PC端" : "小程序";
    }
  }
};
</script>

<style lang="less">
.search {
  .my-input {
    width: 160px;
    margin-right: 25px;
  }
  .my-date-picker {
    margin-right: 25px;
  }
}
.main {
  margin-top: 20px;
  .my-table {
    margin-top: 20px;
  }
  .my-page {
    margin-top: 30px;
  }
}
</style>