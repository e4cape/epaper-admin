<template>
  <div id="role">
    <el-button type="primary" @click="dialogFormVisible = true;">添加角色</el-button>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      border
      class="my-table"
    >
      <el-table-column prop="roleName" label="角色名" width align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" width align="center"></el-table-column>
      <el-table-column prop="roleId" label="操作" show-overflow-tooltip width align="center">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="setRights(scope.row.roleId)">设置权限</el-link>
          <el-link
            type="primary"
            :underline="false"
            @click="editRole(scope.row.roleId)"
            style="margin: 0 20px;"
          >编辑</el-link>
          <el-link type="primary" :underline="false" @click="deleteRole(scope.row.roleId)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      layout="total, prev, pager, next, jumper"
      :total="totalPages"
      background
      class="my-page"
    ></el-pagination>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisible" width="320px">
      <el-form :model="form">
        <el-form-item label="角色名" :label-width="formLabelWidth">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addRole">确认添加</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editVisible" width="320px">
      <el-form :model="editForm">
        <el-form-item label="角色名" :label-width="formLabelWidth">
          <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色备注" :label-width="formLabelWidth">
          <el-input v-model="editForm.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="updateRole">确认添加</el-button>
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
      tableData: [],
      //对话框的可见性
      dialogFormVisible: false,
      editVisible: false,
      //当前页码
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      //添加角色弹出框的表单
      form: {
        roleName: "",
        remark: ""
      },
      //编辑角色弹出框的表单
      editForm: {
        roleId: "",
        roleName: "",
        remark: ""
      },
      formLabelWidth: "80px"
    };
  },
  methods: {
    //查询角色列表的事件
    async getRoleList() {
      let res = await this.$axios.get(`sysRole/selectRole`);
      console.log(res);
      if (res.data.code === 200) {
        this.tableData = res.data.data;
        this.totalPages = res.data.data.length;
      } else {
        this.$message.error(res.data.message);
      }
    },
    //编辑角色的事件
    async editRole(id) {
      //拿到Id给更新角色使用
      this.editForm.roleId = id;

      //参数是每一行的roleId
      let res = await this.$axios.get(`sysRole/selectRole`);
      if (res.data.code === 200) {
        console.log(res.data.data);
        console.log(id);
        for (var i = 0; i < res.data.data.length; i++) {
          //判断Id,拿到该角色的信息
          if (id === res.data.data[i].roleId)
            this.editForm.roleName = res.data.data[i].roleName;
          for (var j = 0; j < res.data.data.length; j++) {
            //判断Id,拿到该角色的信息
            if (id === res.data.data[j].roleId)
              this.editForm.remark = res.data.data[j].remark;
          }
        }
        // for (var i = 0; i < res.data.data.length; i++) {
        //   //判断Id,拿到该角色的信息
        //   if (id === res.data.data[i].roleId)
        //   this.editForm.remark = res.data.data[i].remark;
        // }
      } else {
        this.$message.error(res.data.message);
      }

      this.editVisible = true;
    },
    //添加角色的事件
    async addRole() {
      //添加角色必须带token
      let res = await this.$axios.post(
        `sysRole/addRole?token=${window.sessionStorage.getItem("token")}`,
        this.form
      );
      if (res.data.code === 200) {
        this.$message.success(res.data.message);
        this.getRoleList();
      } else {
        this.$message.error(res.data.message);
      }
      this.dialogFormVisible = false;
    },
    //编辑更新角色的事件
    async updateRole() {
      let res = await this.$axios.post(
        `sysRole/updateRole?token=${window.sessionStorage.getItem("token")}`,
        this.editForm
      );
      if (res.data.code === 200) {
        this.$message.success(res.data.message);
        this.getRoleList();
      } else {
        this.$message.error(res.data.message);
      }

      this.editVisible = false;
    },
    //删除角色的事件
    deleteRole(id) {
      this.$confirm("确认删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //调删除接口
          let res = await this.$axios.post(
            `sysRole/delMenu?token=${window.sessionStorage.getItem("token")}`,
            { roleId: id }
          );
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getRoleList();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //页码切换
    handleCurrentChange() {}
  },
  created() {
    this.getRoleList();
  }
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