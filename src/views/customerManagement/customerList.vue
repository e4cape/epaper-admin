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
      <el-button type="primary">批量备注</el-button>
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
        <el-table-column prop="count" label="账号" width="160"></el-table-column>
        <el-table-column prop="phone" label="手机" width="160"></el-table-column>
        <el-table-column prop="pay" label="消费金额" width="160"></el-table-column>
        <el-table-column prop="source" label="注册来源" width="160"></el-table-column>
        <el-table-column label="注册日期" width="160">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="ComCount" label="企业账号" width="160"></el-table-column>
        <el-table-column prop="forwarding" label="承运商" width="160"></el-table-column>
        <el-table-column prop="comment" label="用户备注" show-overflow-tooltip></el-table-column>
        <el-table-column prop="option" label="操作" show-overflow-tooltip width="120">
          <el-link type="primary" :underline="false" @click="preview">查看</el-link>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
        background
        class="my-page"
      ></el-pagination>
    </div>

    <!-- 对话框 -->
    <el-dialog title="会员资料" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div>
        <h5>企业资料</h5>
        <img
          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          style="width:120px"
        >
        <img
          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          style="width:120px"
        >
      </div>
      <div>
        <h5>承运商资料</h5>
        <img
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
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "customerList",
  data() {
    return {
      //表单数据
      formInline: {
        user: "",
        region: "",
        dataValue: ""
      },
      //表格数据
      tableData: [
        {
          count: "13733411106",
          phone: "13733411106",
          pay: "54888",
          source: "PC端",
          date: "2016-05-03",
          ComCount: "是",
          forwarding: "否",
          comment: "大客户"
        },
        {
          count: "13733411106",
          phone: "13733411106",
          pay: "54888",
          source: "PC端",
          date: "2016-05-03",
          ComCount: "是",
          forwarding: "否",
          comment: "大客户"
        },
        {
          count: "13733411106",
          phone: "13733411106",
          pay: "54888",
          source: "PC端",
          date: "2016-05-03",
          ComCount: "是",
          forwarding: "否",
          comment: "大客户"
        },
        {
          count: "13733411106",
          phone: "13733411106",
          pay: "54888",
          source: "PC端",
          date: "2016-05-03",
          ComCount: "是",
          forwarding: "否",
          comment: "大客户"
        },
        {
          count: "13733411106",
          phone: "13733411106",
          pay: "54888",
          source: "PC端",
          date: "2016-05-03",
          ComCount: "是",
          forwarding: "否",
          comment: "大客户"
        }
      ],
      multipleSelection: [],
      //对话框的可见性
      dialogVisible: false,
      //当前页码
      currentPage:1,
    };
  },
  methods: {
    //查询事件
    search() {},
    //多选框选择事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //查看事件
    preview() {
      this.dialogVisible = true;
    },
    //页码改变事件
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
  .my-page{
    margin-top: 30px;

  }
}
</style>