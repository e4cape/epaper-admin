<template>
  <div id="postsCategory">
    <el-button type="primary" @click="showDialog" style="marginBottom:25px">添加分类</el-button>
    <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%" border>
      <el-table-column type="index" width="260" label="排序" align="center"></el-table-column>
      <el-table-column prop="acName" label="分类" align="center"></el-table-column>
      <el-table-column label="操作" width="260" align="center">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="editingCat(scope.row)">编辑</el-link>
          <el-link
            type="primary"
            :underline="false"
            @click="deleteCat(scope.row)"
            style="marginLeft:25px"
          >删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible" width="320px">
      <el-form :model="form">
        <el-form-item label="分类名称">
          <el-input v-model="form.cateName" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addCate">确认添加</el-button>
      </div>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editVisible" width="320px">
      <el-form :model="editForm">
        <el-form-item label="分类名称">
          <el-input v-model="editForm.cateName" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="updateCate">确认添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "postsCategory",
  data() {
    return {
      //表格数据
      tableData: [],
      //添加分类的表单
      form: {
        cateName: ""
      },
      //编辑分类的表单
      editForm: {
        cateName: ""
      },
      //编辑的那一行的id
      editId:0,
      //页码
      currentPage: 1,
      pageSize: 10,
      //对话框的可见性
      dialogFormVisible: false,
      editVisible: false
    };
  },
  methods: {
    //获取分类列表的接口
    async getCate() {
      let res = await this.$axios.get(
        `informationController/queryArticleCatelog?currentPage=${
          this.currentPage
        }&pageSize=10`
      );
      console.log(res);
      if (res.data.code === 200) {
        this.tableData = res.data.data.list;
      } else {
        this.$message.error(res.data.message);
      }
    },
    //显示新增分类对话框
    showDialog() {
      this.form.cateName = "";
      this.dialogFormVisible = true;
    },
    //显示编辑的对话框
    async editingCat(row) {
      this.editForm.cateName = "";

      //根据row拿到需要的数据
      this.editForm.cateName = row.acName;
      this.editId=row.acId;

      this.editVisible = true;


    },
    //更新分类
    async updateCate(){
      let res = await this.$axios.post(
        `informationController/updateArticleCatelog`,
        { acId:this.editId,acName: this.editForm.cateName }
      );
      console.log(res);
      if (res.data.code === 200) {
        this.getCate();
      } else {
        this.$message.error(res.data.message);
      }

      this.editVisible = false;
    },
    //添加分类的接口
    async addCate() {
      let res = await this.$axios.post(
        `informationController/addArticleCatelog`,
        { acName: this.form.cateName }
      );
      console.log(res);
      if (res.data.code === 200) {
        this.getCate();
      } else {
        this.$message.error(res.data.message);
      }

      this.dialogFormVisible = false;
    },
    //删除分类
    deleteCat(row) {
      this.$confirm("确认删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //调删除接口
          let res = await this.$axios.post(`informationController/delArticleCatelog`,{acId:row.acId});
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
           this.getCate();
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
    }
  },
  created() {
    this.getCate();
  }
};
</script>

<style lang="">
</style>