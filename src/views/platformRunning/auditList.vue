<template>
  <div id="auditList">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="货源审核" name="first">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="提交日期" width="180"></el-table-column>
          <el-table-column prop="name" label="发布者" width="180"></el-table-column>
          <el-table-column prop="address" label="承运单号"></el-table-column>
          <el-table-column prop="address" label="联系人"></el-table-column>
          <el-table-column prop="address" label="联系电话"></el-table-column>
          <el-table-column prop="address" label="操作">
            <el-link type="primary" :underline="false">审核</el-link>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="承运商审核" name="second">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="提交日期" width="180"></el-table-column>
          <el-table-column prop="name" label="发布者" width="180"></el-table-column>
          <el-table-column prop="address" label="承运单号"></el-table-column>
          <el-table-column prop="address" label="联系人"></el-table-column>
          <el-table-column prop="address" label="联系电话"></el-table-column>
          <el-table-column prop="address" label="操作">
            <el-link type="primary" :underline="false">审核</el-link>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="企业审核" name="third">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="提交日期" width="180"></el-table-column>
          <el-table-column prop="name" label="发布者" width="180"></el-table-column>
          <el-table-column prop="address" label="承运单号"></el-table-column>
          <el-table-column prop="address" label="联系人"></el-table-column>
          <el-table-column prop="address" label="联系电话"></el-table-column>
          <el-table-column prop="address" label="操作">
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
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      //当前页码
      currentPage:1,
      pageSize:10,
      totalPages:0
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //页码改变
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
  }
};
</script>

<style lang="less">
#auditList {
  .my-page {
    margin-top: 20px;
  }
}
</style>