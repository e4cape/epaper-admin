<template>
  <div id="manager">
    <!-- 头部搜索区域 -->
    <div class="search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="账号名" class="inputForm">
          <el-input v-model="formInline.account" placeholder="请输入会员账号" class="my-input"></el-input>
        </el-form-item>
        <el-form-item label="角色" class="inputForm">
          <el-input v-model="formInline.role" placeholder="请输入手机号" class="my-input"></el-input>
        </el-form-item>
        <el-form-item label="状态" class="inputForm">
          <el-select v-model="formInline.state" placeholder="请选择状态" class="my-input">
            <el-option label="已开启" value="pc"></el-option>
            <el-option label="已关闭" value="miniPro"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" class="inputForm">
          <el-select v-model="formInline.state" placeholder="请选择状态" class="my-input">
            <el-option label="已开启" value="1"></el-option>
            <el-option label="已关闭" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="mySearch">
          <!-- 清除按钮 -->
          <el-link type="primary" :underline="false" style="marginRight:30px">清除条件</el-link>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 主体区域 -->
    <div class="main">
      <el-button type="primary" @click="dialogFormVisible = true">添加账号</el-button>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
        class="my-table"
      >
        <el-table-column prop="account" label="账号" width align="center"></el-table-column>
        <el-table-column prop="role" label="角色" width align="center"></el-table-column>
        <el-table-column prop="state" label="状态" width align="center"></el-table-column>
        <el-table-column prop="comment" label="备注" width align="center"></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width align="center">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="preview(scope.row.memberCompany)">关闭</el-link>
            <el-link
              type="primary"
              :underline="false"
              @click="preview(scope.row.memberCompany)"
              style="margin: 0 20px;"
            >编辑</el-link>
            <el-link type="primary" :underline="false" @click="preview(scope.row.memberCompany)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

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

    <!-- 添加账号对话框 -->
    <el-dialog title="添加账号" :visible.sync="dialogFormVisible" width="320px">
      <el-form :model="form">
        <el-form-item label="登录账号" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号角色" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择角色">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号备注" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确认添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "manager",
  data() {
    return {
      //表单数据
      formInline: {
        account: "",
        role: "",
        state: ""
      },
      //表格数据
      tableData: [
        {
          account: "财务-小张",
          role: "财务",
          state: "已开启",
          comment: "财务小张使用"
        }
      ],
      //对话框的可见性
      dialogFormVisible: false,
      //当前页码
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      //弹出框的表单
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '80px'
    };
  }
};
</script>

<style lang="less">
#manager {
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
    position: absolute;
    left: 50%;
    margin-left: -180px;
    bottom: 60px;
  }
}
</style>