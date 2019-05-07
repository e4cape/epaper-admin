<template>
  <div id="role">
    <el-button type="primary" @click="dialogFormVisible = true">添加角色</el-button>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      border
      class="my-table"
    >
      <el-table-column prop="account" label="角色名" width align="center"></el-table-column>
      <el-table-column prop="comment" label="备注" width align="center"></el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width align="center">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="preview(scope.row.memberCompany)">权限</el-link>
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

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisible" width="320px">
      <el-form :model="form">
        <el-form-item label="角色名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色备注" :label-width="formLabelWidth">
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
  name: "role",
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
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "80px"
    };
  },
  methods: {}
};
</script>

<style lang="less">
#role {
  position: relative;
  height: 100%;
  .my-table {
    margin-top: 20px;
  }
  .my-page {
    position: absolute;
    left: 50%;
    margin-left: -180px;
    bottom: 60px;
  }
}
</style>