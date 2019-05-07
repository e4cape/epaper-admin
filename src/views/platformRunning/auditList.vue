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
          <el-table-column prop="routeState" label="操作" align="center">
             <template slot-scope="scope">
               <el-link type="primary" :underline="false" v-if="scope.row.routeState ==0">审核</el-link>
            <el-link type="info" :underline="false" v-else>无</el-link>
            </template>
            
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="承运商审核" name="second">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="提交日期" width="180" align="center">
            <template slot-scope="scope">{{ scope.row.routeCreateTime | formatTime('YYYY-MM-DD')}}</template>
          </el-table-column>
          <el-table-column prop="name" label="发布者" width="180" align="center"></el-table-column>
          <el-table-column prop="address" label="承运单号" align="center"></el-table-column>
          <el-table-column prop="address" label="联系人" align="center"></el-table-column>
          <el-table-column prop="address" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="address" label="操作" align="center">
            <el-link type="primary" :underline="false">审核</el-link>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="企业审核" name="third">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="提交日期" width="180" align="center">
            <template slot-scope="scope">{{ scope.row.routeCreateTime | formatTime('YYYY-MM-DD')}}</template>
          </el-table-column>
          <el-table-column prop="name" label="发布者" width="180" align="center"></el-table-column>
          <el-table-column prop="address" label="承运单号" align="center"></el-table-column>
          <el-table-column prop="address" label="联系人" align="center"></el-table-column>
          <el-table-column prop="address" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="address" label="操作" align="center">
            <el-link type="primary" :underline="false">审核</el-link>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

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
</template>

<script>
export default {
  name: "auditList",
  data() {
    return {
      activeName: "first",
      auditData: [],
      //当前页码
      currentPage: 1,
      pageSize: 10,
      totalPages: 0
    };
  },
  methods: {
    //获取货源审核列表事件
    async getAuditCheck() {
      let res = await this.$axios.get(
        `sysUser/pageList?currentPage=${this.currentPage}&pageSize=10`
      );
      console.log(res);
      if (res.data.code === 200) {
        this.auditData = res.data.data.items;
        this.totalPages = res.data.data.items.length;
      }
    },
    //tab栏切换事件
    handleClick(tab, event) {
      console.log(tab, event);
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