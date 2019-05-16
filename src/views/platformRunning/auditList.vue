<template>
  <div id="auditList">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="货源审核" name="first">
        <el-table :data="auditData" border style="width: 100%">
          <el-table-column prop="routeCreateTime" label="提交日期" width="180" align="center">
            <template slot-scope="scope">{{ scope.row.routeCreateTime | formatTime('YYYY-MM-DD')}}</template>
          </el-table-column>
          <el-table-column prop="routeCreateUser" label="发布者" width="180" align="center"></el-table-column>
          <el-table-column prop="routeId" label="承运单号" align="center"></el-table-column>
          <el-table-column prop="routeContactName" label="联系人" align="center"></el-table-column>
          <el-table-column prop="routeContactPhone" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="routeState" label="审核状态" align="center">
            <template slot-scope="scope">
              <el-link type="info" :underline="false" v-if="scope.row.routeState ==0">待审核</el-link>
              <el-link type="info" :underline="false" v-else-if="scope.row.routeState ==1">已审核通过</el-link>
              <el-link type="info" :underline="false" v-else-if="scope.row.routeState ==2">审核未通过</el-link>
              <el-link type="info" :underline="false" v-else-if="scope.row.routeState ==3">已中标</el-link>
              <el-link type="info" :underline="false" v-else-if="scope.row.routeState ==4">投标结束</el-link>
              <el-link type="info" :underline="false" v-else-if="scope.row.routeState ==5">已付款</el-link>
              <el-link type="info" :underline="false" v-else>已失效</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="routeState" label="操作" align="center">
            <template slot-scope="scope">
              <el-link
                type="primary"
                :underline="false"
                v-if="scope.row.routeState ==0"
                @click="getRouteId(scope.row.routeId)"
              >审核</el-link>
              <el-link type="info" :underline="false" v-else>无</el-link>
            </template>
          </el-table-column>
        </el-table>

        <!-- 货源审核的分页器 -->
        <el-pagination
          @current-change="auditPageChange"
          :current-page="auditPage"
          layout="total, prev, pager, next, jumper"
          :total="auditTotals"
          background
          class="my-page"
        ></el-pagination>
      </el-tab-pane>

      <el-tab-pane label="承运商审核" name="second">
        <el-table :data="carrierData" border style="width: 100%">
          <el-table-column prop="carrierTime" label="提交日期" align="center">
            <template slot-scope="scope">{{ scope.row.carrierTime | formatTime('YYYY-MM-DD')}}</template>
          </el-table-column>
          <el-table-column prop="carrierName" label="申请者" align="center"></el-table-column>
          <el-table-column prop="carrierState" label="审核状态" align="center">
            <template slot-scope="scope">
              <el-link type="info" :underline="false" v-if="scope.row.carrierState ==0">驳回</el-link>
              <el-link type="info" :underline="false" v-else-if="scope.row.carrierState ==1">正常</el-link>
              <el-link type="info" :underline="false" v-else>申请中</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="carrierState" label="操作" align="center">
            <template slot-scope="scope">
              <el-link
                type="primary"
                :underline="false"
                v-if="scope.row.carrierState ==2"
                @click="getCarrierId(scope.row)"
              >审核</el-link>
              <el-link type="info" :underline="false" v-else>无</el-link>
            </template>
          </el-table-column>
        </el-table>
        <!-- 承运商审核的分页器 -->
        <el-pagination
          @current-change="carrierPageChange"
          :current-page="carrierPage"
          layout="total, prev, pager, next, jumper"
          :total="carrierTotal"
          background
          class="my-page"
        ></el-pagination>
      </el-tab-pane>

      <el-tab-pane label="企业审核" name="third">
        <el-table :data="companyData" border style="width: 100%">
          <el-table-column prop="memberCompany" label="提交日期" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.memberCompany.createTime | formatTime('YYYY-MM-DD')}}</template>
          </el-table-column>
          <el-table-column prop="memberCompany.createName" label="申请者" align="center"></el-table-column>
          <el-table-column prop="memberCompany.companyName" label="企业名称" align="center"></el-table-column>
          <el-table-column prop="memberCompany" label="审核状态" align="center">
            <template slot-scope="scope">
              <el-link type="info" :underline="false" v-if="scope.row.memberCompany.state ==1">审核中</el-link>
              <el-link
                type="info"
                :underline="false"
                v-else-if="scope.row.memberCompany.state ==0"
              >已驳回</el-link>
              <el-link type="info" :underline="false" v-else>已开通</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="memberCompany" label="操作" align="center">
            <template slot-scope="scope">
              <el-link
                type="primary"
                :underline="false"
                v-if="scope.row.memberCompany.state ==1"
                @click="getMemberId(scope.row)"
              >审核</el-link>
              <el-link type="info" :underline="false" v-else>无</el-link>
            </template>
          </el-table-column>
        </el-table>
        <!-- 公司审核的分页器 -->
        <el-pagination
          @current-change="companyPageChange"
          :current-page="companyPage"
          layout="total, prev, pager, next, jumper"
          :total="companyTotal"
          background
          class="my-page"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>

    <!-- 货源审核弹出框 -->
    <el-dialog title="审核详情" :visible.sync="auditVisible" width="400px">
      <el-form :model="auditForm" :rules="rules" ref="ruleForm">
        <el-form-item label="是否通过">
          <el-radio v-model="auditForm.auditRadio" label="1">通过</el-radio>
          <el-radio v-model="auditForm.auditRadio" label="2">驳回</el-radio>
        </el-form-item>
        <el-form-item label="审核理由">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="auditForm.auditText"></el-input>
        </el-form-item>
        <el-form-item label="指导价格" v-if="auditForm.auditRadio==1" prop="guidePrice">
          <el-input v-model="auditForm.guidePrice" placeholder="请输入指导价格"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="auditVisible = false">取 消</el-button>
        <el-button type="primary" @click="auditCheck">确定</el-button>
      </div>
    </el-dialog>

    <!-- 承运商审核弹出框 -->
    <el-dialog title="审核详情" :visible.sync="carrierVisible" width="400px">
      <el-form :model="carrierForm">
        <el-form-item label="是否通过">
          <el-radio v-model="carrierForm.carrierRadio" label="1">通过</el-radio>
          <el-radio v-model="carrierForm.carrierRadio" label="0">驳回</el-radio>
        </el-form-item>
        <el-form-item label="审核理由">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="carrierForm.carrierText"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="carrierVisible = false">取 消</el-button>
        <el-button type="primary" @click="carrierCheck">确定</el-button>
      </div>
    </el-dialog>

    <!-- 企业审核弹出框 -->
    <el-dialog title="审核详情" :visible.sync="companyVisible" width="400px">
      <el-form :model="companyForm">
        <el-form-item label="是否通过">
          <el-radio v-model="companyForm.companyRadio" label="1">通过</el-radio>
          <el-radio v-model="companyForm.companyRadio" label="0">驳回</el-radio>
        </el-form-item>
        <el-form-item label="审核理由">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="companyForm.companyText"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="companyVisible = false">取 消</el-button>
        <el-button type="primary" @click="companyCheck">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "auditList",
  data() {
    return {
      activeName: "first",
      //tab栏中的表格数据
      auditData: [],
      carrierData: [],
      companyData: [],
      //当前页码
      currentPage: 1,
      totalPages: 0,
      //货源审核的页码
      auditPage: 1,
      auditTotals: 0,
      //承运商审核的页码
      carrierPage: 1,
      carrierTotal: 0,
      //公司审核的页码
      companyPage: 1,
      companyTotal: 0,
      //三个审核对话框的可见性
      auditVisible: false,
      carrierVisible: false,
      companyVisible: false,
      auditForm: {
        auditRadio: "1",
        auditText: "",
        guidePrice: ""
      },
      carrierForm: {
        carrierRadio: "1",
        carrierText: ""
      },
      companyForm: {
        companyRadio: "1",
        companyText: ""
      },
      //货源审核发请求的数据
      checkList: {
        routeCheckReason: "",
        routeCheckUser: "",
        routeGuidePrice: "",
        routeId: 0,
        //默认让通过,填1,不通过就传2
        routeState: 1
      },
      //承运商审核发请求的数据
      carrierList: {
        carrierCheck: "",
        carrierId: 0,
        //默认让通过,填1,不通过就传0
        carrierState: 1,
        carrierMemberId: 0,
        memberType:0
      },
      //公司审核发请求的数据
      companyList: {
        memberCompany: {
          check: "",
          //2是开通,0是驳回
          state: 2
        },
        memberId: 0,
        memberType:0
      },
      //表单校验规则
      rules: {
        guidePrice: [
          { required: true, message: "请输入指导价格", trigger: "blur" }
          // { min: 1, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    //获取货源审核列表事件
    async getAuditCheck() {
      let res = await this.$axios.get(
        `admin/sysUser/pageList?currentPage=${this.auditPage}&pageSize=10`
      );
      // console.log(res);
      if (res.data.code === 200) {
        this.auditData = res.data.data.items;
        this.auditTotals = res.data.data.items.length;
      }
    },
    //获取承运商列表事件
    async getCarrierList() {
      let res = await this.$axios.get(
        `admin/sysUser/carrierList?currentPage=${this.carrierPage}&pageSize=10`
      );
      // console.log(res);
      if (res.data.code === 200) {
        this.carrierData = res.data.data.list;
        this.carrierTotal = res.data.data.list.length;
      }
    },
    //获取公司列表事件
    async getCompanyList() {
      let res = await this.$axios.get(
        `admin/sysUser/companyList?currentPage=${this.companyPage}&pageSize=10`
      );
      // console.log(res);
      if (res.data.code === 200) {
        this.companyData = res.data.data.list;
        this.companyTotal = res.data.data.list.length;

        //返回的memberCompany是json格式
        this.companyData.forEach(v => {
          if (v.memberCompany) {
            console.log(v.memberCompany);
            v.memberCompany = JSON.parse(v.memberCompany);
            console.log(v.memberCompany);
          }
        });
      }
    },
    //tab栏切换事件
    async handleClick(tab) {
      if (tab.name == "first") {
        //获取货源列表
        this.getAuditCheck();
      }
      if (tab.name == "second") {
        //获取承运商列表
        this.getCarrierList();
      }
      if (tab.name == "third") {
        //获取公司列表
        this.getCompanyList();
      }
    },
    //获取RouteId事件
    getRouteId(id) {
      this.checkList.routeId = id;
      console.log(this.checkList.routeId);
      this.auditVisible = true;
    },
    //获取carrierId事件
    getCarrierId(row) {
      this.carrierList.carrierId = row.carrierId;
      this.carrierList.memberType = row.memberType;
      this.carrierList.carrierMemberId = row.carrierMemberId;
      
      console.log(this.carrierList.carrierId);
      this.carrierVisible = true;

    },
    //获取memberId事件
    getMemberId(row) {
      this.companyList.memberId = row.memberId;
      this.companyList.memberType = row.memberType;
      this.companyVisible = true;
    },

    //货源审核事件
    async auditCheck() {
      if (this.auditForm.auditRadio == "2") {
        this.checkList.routeState = 2;
      }
      //拿到要传的参数
      //审核原因
      this.checkList.routeCheckReason = this.auditForm.auditText;
      //审核人
      this.checkList.routeCheckUser = window.sessionStorage.getItem("roleName");
      //审核指导价
      this.checkList.routeCheckReason = this.auditForm.guidePrice;

      let res = await this.$axios.post(
        "admin/sysUser/checkRoute",
        this.checkList
      );
      console.log(res);
      if (res.data.code == 200) {
        this.getAuditCheck();
      } else {
        this.$message.error(res.data.message);
      }

      this.auditVisible = false;
    },
    //承运商审核事件
    async carrierCheck() {
      if (this.carrierForm.carrierRadio == "0") {
        this.carrierList.carrierState = 0;
      }

      //拿到要传的参数
      //审核原因
      this.carrierList.carrierCheck = this.carrierForm.carrierText;

      let res = await this.$axios.post(
        "admin/sysUser/carrierAudit",
        this.carrierList
      );
      console.log(res);

      if (res.data.code == 200) {
        this.getCarrierList();
      } else {
        this.$message.error(res.data.message);
      }
      this.carrierVisible = false;
    },
    //公司审核事件
    async companyCheck() {
      //如果不通过,传状态为0
      if (this.companyForm.companyRadio == "0") {
        this.companyList.memberCompany.state = 0;
      }
      //审核原因
      this.companyList.memberCompany.check = this.companyForm.companyText;

      //memberCompany要转成json字符串
      this.companyList.memberCompany = JSON.stringify(
        this.companyList.memberCompany
      );

      let res = await this.$axios.post("admin/sysUser/aduit", this.companyList);
      console.log(res);
      if (res.data.code == 200) {
        this.getCompanyList();
      } else {
        this.$message.error(res.data.message);
      }

      this.companyVisible = false;
    },

    //货源审核列表页码改变事件
    auditPageChange() {
      this.getAuditCheck();
    },
    //承运商审核列表页码改变事件
    carrierPageChange() {
      this.getCarrierList();
    },
    //公司审核列表页码改变事件
    companyPageChange() {
      this.getCompanyList();
    }
  },
  created() {
    this.getAuditCheck();
  }
};
</script>

<style lang="less">
#auditList {
  // position: relative;
  height: 100%;
  .my-page {
    // position: absolute;
    // left: 50%;
    // margin-left: -180px;
    // bottom: 60px;
    margin-top: 30px;
  }
}
</style>