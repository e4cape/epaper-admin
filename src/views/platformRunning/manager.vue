<template>
  <div id="manager">
    <!-- 头部搜索区域 -->
    <div class="search">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="账号名" class="inputForm">
          <el-input v-model="formInline.account" placeholder="请输入会员账号" class="my-input"></el-input>
        </el-form-item>
        <el-form-item label="角色" class="inputForm">
          <el-select v-model="formInline.role" placeholder="请选择角色" class="my-input">
            <el-option
              :label="item.role"
              :value="item.role"
              v-for="(item,index) in roleList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" class="inputForm">
          <el-select v-model="formInline.state" placeholder="请选择状态" class="my-input">
            <el-option label="已开启" value="1"></el-option>
            <el-option label="已关闭" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="mySearch">
          <!-- 清除按钮 -->
          <el-link type="primary" :underline="false" style="marginRight:30px" @click="clearCondition">清除条件</el-link>
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
        <el-table-column prop="username" label="账号" width align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色" width align="center"></el-table-column>
        <el-table-column prop="status" label="状态" width align="center">
          <template slot-scope="scope">
            <el-link :underline="false" v-if="scope.row.status==1">已开启</el-link>
            <el-link type="danger" :underline="false" v-else>已关闭</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width align="center"></el-table-column>
        <el-table-column prop="status" label="操作" show-overflow-tooltip width align="center">
          <template slot-scope="scope">
            <el-link
              type="primary"
              :underline="false"
              @click="openAndClose(scope.row)"
              v-if="scope.row.status==1"
            >关闭</el-link>
            <el-link type="danger" :underline="false" @click="openAndClose(scope.row)" v-else>开启</el-link>
            <el-link
              type="primary"
              :underline="false"
              @click="deleteAccount(scope.row)"
              style="marginLeft:20px"
            >删除</el-link>
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

    <!-- 添加账号对话框 -->
    <el-dialog title="添加账号" :visible.sync="dialogFormVisible" width="360px">
      <el-form :model="form">
        <el-form-item label="登录账号" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号角色" :label-width="formLabelWidth">
          <el-select v-model="form.roleId" placeholder="请选择角色">
            <el-option
              :label="item.role"
              :value="item.roleId"
              v-for="(item,index) in roleList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addAccount">确认添加</el-button>
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
      tableData: [],
      //对话框的可见性
      dialogFormVisible: false,
      //当前页码
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      //弹出框的表单
      form: {
        username: "",
        password: "",
        nickname: "",
        remark: "",
        roleId: "",
        //新增账号默认为开启,就是1
        status: 1
      },
      //角色下拉框存角色的数组
      roleList: [],
      //存放roleId和roleName对应的对象
      roleObj: {},
      formLabelWidth: "80px"
    };
  },
  methods: {
    //获取管理员列表的事件
    async getManagerList() {
      let res = await this.$axios.get(
        `sysUser/sysUserList?currentPage=${
          this.currentPage
        }&pageSize=10&status=${this.formInline.state}&username=${
          this.formInline.account
        }&roleName=${
          this.formInline.role
        }&token=${window.sessionStorage.getItem("token")}`
      );

      console.log(res);
      if (res.data.code === 200) {
        if (res.data.data.list) {
          this.tableData = res.data.data.list;
          this.totalPages = res.data.data.list.length;
          this.$message.success(res.data.message);
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    //角色下拉框获取角色的事件
    async getRoleList() {
      let res = await this.$axios.get(`sysRole/selectRole`);
      console.log(res);
      if (res.data.code === 200) {
        res.data.data.forEach(v => {
          this.roleList.push({ role: v.roleName, roleId: v.roleId });
        });
        console.log(this.roleList);
      }
    },
    //页码改变事件
    handleCurrentChange() {
      this.getManagerList();
    },
    //添加账号的事件
    async addAccount() {
      //添加账号的接口
      let res = await this.$axios.post(`sysUser/addSysUser`, this.form);
      if (res.data.code == 200) {
        this.$message.success(res.data.message);
        this.getManagerList();
      } else {
        this.$message.error(res.data.message);
      }
      this.dialogFormVisible = false;
    },
    //启用或者禁用账号
    async openAndClose(row) {
      let myStatus;

      //如果账号目前是关闭状态,就要开启它
      row.status == 0 ? (myStatus = 1) : (myStatus = 0);

      let res = await this.$axios.post(`sysUser/addSysUsers`, {
        userId: row.userId,
        status: myStatus
      });

      if (res.data.code == 200) {
        this.getManagerList();
      } else {
        this.$message.error(res.data.message);
      }
    },
    //删除账号
    deleteAccount(row) {
      this.$confirm("确认删除该账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //调删除接口
          let res = await this.$axios.get(
            `sysUser/delSysUser?userId=${row.userId}`
          );
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
           this.getManagerList();
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
    //清除条件
    clearCondition(){
      this.formInline.account="";
      this.formInline.role="";
      this.formInline.state="";
      this.getManagerList();
    },
    //搜索事件
    search(){
      this.getManagerList();
    }
  },
  created() {
    this.getManagerList();
    this.getRoleList();
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