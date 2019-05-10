<template>
  <div id="role">
    <el-button type="primary" @click="showAddRole">添加角色</el-button>
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
    <!-- <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      layout="total, prev, pager, next, jumper"
      :total="totalPages"
      background
      class="my-page"
    ></el-pagination>-->

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

    <!-- 树形菜单对话框 -->
    <el-dialog title="分配权限" :visible.sync="treeVisible" width="420px">
      <el-tree
        :data="rightList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedKeys"
        :props="defaultProps"
        ref="tree"
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="treeVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRole">确 定</el-button>
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
      treeVisible: false,
      //当前页码
      // currentPage: 1,
      // pageSize: 10,
      // totalPages: 0,
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
      // 树形菜单的数据
      rightList: [
        {
          id: 1,
          authName: "控制台",
          children: [
            {
              id: 2,
              authName: "数据分析"
            },
            {
              id: 3,
              authName: "平台流水"
            },
            {
              id: 4,
              authName: "平台设置"
            }
          ]
        },
        {
          id: 5,
          authName: "订单管理",
          children: [
            {
              id: 6,
              authName: "商城订单"
            },
            {
              id: 7,
              authName: "货源列表"
            }
          ]
        },
        {
          id: 8,
          authName: "客户管理",
          children: [
            {
              id: 9,
              authName: "会员列表"
            },
            {
              id: 10,
              authName: "商家列表"
            },
            {
              id: 11,
              authName: "平台店铺"
            }
          ]
        },
        {
          id: 12,
          authName: "平台运营",
          children: [
            {
              id: 13,
              authName: "管理员"
            },
            {
              id: 14,
              authName: "角色"
            },
            {
              id: 15,
              authName: "广告图"
            },
            {
              id: 16,
              authName: "文章列表"
            },
            {
              id: 17,
              authName: "文章分类"
            },
            {
              id: 18,
              authName: "审核列表"
            }
          ]
        },
        {
          id: 19,
          authName: "商品管理",
          children: [
            {
              id: 20,
              authName: "商家商品"
            },
            {
              id:21,
              authName: "活动商品"
            }
          ]
        },

      ],
      //树形菜单的设置
      defaultProps: {
        children: "children",
        label: "authName"
      },
      //选中的选项
      checkedKeys: [],

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
    //显示添加角色的对话框
    showAddRole() {
      this.form.roleName = "";
      this.form.remark = "";
      this.dialogFormVisible = true;
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
    //设置权限展示权限树形菜单事件
    async setRights(id) {
      let res = await this.$axios.get(
        `sysMenu/selectRoleId?roleId=${id}&token=${window.sessionStorage.getItem("token")}`
      );
      console.log(res);
      if (res.data.code === 200) {
        let rightsArray=res.data.data;
        //声明一个空数组,存放被选中的id
        let checkedRight=[];
        for(var i=0;i<rightsArray.length;i++) {
          if(rightsArray[i].checked=='true'){
            checkedRight.push(rightsArray[i].menuId);
          }
        }
        this.checkedKeys=checkedRight;
        console.log(checkedRight);
        
      } else {
        this.$message.error(res.data.message);
      }

      this.treeVisible = true;

    },
    //提交权限
    submitRole() {

      this.treeVisible = false;
    },
    //页码切换
    handleCurrentChange() {
      this.getRoleList();
    }
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