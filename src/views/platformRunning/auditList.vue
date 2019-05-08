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
              <el-link type="primary" :underline="false" v-if="scope.row.carrierState ==2" @click="getCarrierId(scope.row.carrierId)">审核</el-link>
              <el-link type="info" :underline="false" v-else>无</el-link>
            </template>
          </el-table-column>
        </el-table>
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
              <el-link type="primary" :underline="false" v-if="scope.row.memberCompany.state ==1">审核</el-link>
              <el-link type="info" :underline="false" v-else>无</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 分页器 -->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      layout="total, prev, pager, next, jumper"
      :total="totalPages"
      background
      class="my-page"
    ></el-pagination>

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
      //三个审核对话框的可见性
      auditVisible: false,
      carrierVisible: false,
      companyVisible: false,
      auditForm: {
        auditRadio: "1",
        auditText:'',
        guidePrice:''
      },
      carrierForm:{
        carrierRadio: "1",
        carrierText:''
      },
      companyForm:{

      },
      //货源审核发请求的数据
      checkList:{
        routeCheckReason:'',
        routeCheckUser:'',
        routeGuidePrice:'',
        routeId:0,
        //默认让通过,填1,不通过就传2
        routeState:1
      },
      //承运商审核发请求的数据
      carrierList:{
        carrierCheck:'',
        carrierId:0,
        //默认让通过,填1,不通过就传0
        carrierState:1
      },
      //表单校验规则
      rules:{
        guidePrice: [
            { required: true, message: '请输入指导价格', trigger: 'blur' },
            // { min: 1, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
      }
      
    };
  },
  methods: {
    //获取货源审核列表事件
    async getAuditCheck() {
      let res = await this.$axios.get(
        `sysUser/pageList?currentPage=${this.currentPage}&pageSize=10`
      );
      // console.log(res);
      if (res.data.code === 200) {
        this.auditData = res.data.data.items;
        this.totalPages = res.data.data.items.length;
      }
    },
    //tab栏切换事件
    async handleClick(tab) {
      if (tab.name == "second") {
        //获取承运商列表事件
        let res = await this.$axios.get(
          `sysUser/carrierList?currentPage=${this.currentPage}&pageSize=10`
        );
        // console.log(res);
        if (res.data.code === 200) {
          this.carrierData = res.data.data.items;
          this.totalPages = res.data.data.items.length;
        }
      }

      if (tab.name == "third") {
        //获取公司列表事件
        let res = await this.$axios.get(
          `sysUser/companyList?currentPage=${this.currentPage}&pageSize=10`
        );
        // console.log(res);
        if (res.data.code === 200) {
          this.companyData = res.data.data.items;
          this.totalPages = res.data.data.items.length;
        }
      }
    },
    //获取RouteId事件
    getRouteId(id){
        this.checkList.routeId=id;
        console.log(this.checkList.routeId);
        this.auditVisible = true;
    },
    //获取carrierId事件
    getCarrierId(id){
        this.carrierList.carrierId=id;
        console.log(this.carrierList.carrierId);
        this.carrierVisible = true;
    },
    //获取carrierId事件
    
    //货源审核事件
    async auditCheck(){
      if(this.auditForm.auditRadio == '2'){
        this.checkList.routeState=2
      }

      //拿到要传的参数
      //审核原因
      this.checkList.routeCheckReason=this.auditForm.auditText;
      //审核人
      this.checkList.routeCheckUser=window.sessionStorage.getItem("roleName");
      //审核指导价
      this.checkList.routeCheckReason=this.auditForm.guidePrice;

      let res = await this.$axios.post("sysUser/checkRoute", this.checkList);
      console.log(res);

      this.auditVisible = false;
      this.getAuditCheck();
    },
    //承运商审核事件
    async carrierCheck(){
      if(this.carrierForm.carrierRadio == '0'){
        this.carrierList.carrierState=0
      }

      //拿到要传的参数
      //审核原因
      this.carrierList.carrierCheck=this.carrierForm.carrierText;
      
      let res = await this.$axios.post("sysUser/carrierAudit", this.carrierList);
      console.log(res);

      this.carrierVisible = false;
      this.getAuditCheck();
    },
    //公司审核事件
    async companyCheck(){

    },
    //页码改变事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  },
  created() {
    this.getAuditCheck();
  }
};
</script>

<style lang="less">
#auditList {
  position: relative;
  height: 100%;
  .my-page {
    position: absolute;
    left: 50%;
    margin-left: -180px;
    bottom: 60px;
  }
}
</style>