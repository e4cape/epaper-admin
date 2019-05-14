<template>
  <div id="shop">
    <el-button type="primary" @click="addShop" style="marginBottom:25px">添加店铺</el-button>
    <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%" border>
      <el-table-column prop="storeName" label="店铺名" align="center"></el-table-column>
      <el-table-column prop="cateName" label="挂钩分类" align="center"></el-table-column>
      <el-table-column prop="prefectureId" label="挂钩专区" align="center">
        <template slot-scope="scope">
          <el-link :underline="false" v-if="scope.row.prefectureId==1">成品纸</el-link>
          <el-link :underline="false" v-else-if="scope.row.prefectureId==2">辅料</el-link>
          <el-link :underline="false" v-else-if="scope.row.prefectureId==3">设备</el-link>
          <el-link :underline="false" v-else>废纸</el-link>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="editing(scope.row)"
            style="marginRight:25px"
          >编辑</el-link>
          <el-link type="primary" :underline="false" @click="deleteShop(scope.row)">删除</el-link>
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

    <!-- 开通店铺对话框 -->
    <el-dialog title="添加店铺" :visible.sync="addVisible" width="400px">
      <el-form :model="addForm">
        <el-form-item label="店铺名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.storeName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="挂钩分类" :label-width="formLabelWidth">
          <el-select v-model="addForm.cateId" placeholder="请选择挂钩分类">
            <el-option
              :label="item.cateName"
              :value="item.cateId"
              v-for="(item,index) in cateList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="挂钩专区" :label-width="formLabelWidth">
          <el-select v-model="addForm.prefectureId" placeholder="请选择挂钩专区">
            <el-option label="成品纸" :value="1"></el-option>
            <el-option label="辅料" :value="2"></el-option>
            <el-option label="设备" :value="3"></el-option>
            <el-option label="废纸" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth">
          <el-input v-model="addForm.contactsName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="addForm.contactsPhone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商" :label-width="formLabelWidth">
          <el-input v-model="addForm.supplier" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产地" :label-width="formLabelWidth">
          <el-input v-model="addForm.area" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="openConfirmAdd">确认添加</el-button>
      </div>
    </el-dialog>

    <!-- 编辑铺对话框 -->
    <el-dialog title="添加店铺" :visible.sync="editVisible" width="400px">
      <el-form :model="editForm">
        <el-form-item label="店铺名称" :label-width="formLabelWidth">
          <el-input v-model="editForm.storeName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="挂钩分类" :label-width="formLabelWidth">
          <el-select v-model="editForm.cateId" placeholder="请选择挂钩分类">
           <el-option
              :label="item.cateName"
              :value="item.cateId"
              v-for="(item,index) in cateList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="挂钩专区" :label-width="formLabelWidth">
          <el-select v-model="editForm.prefectureId" placeholder="请选择挂钩专区">
             <el-option label="成品纸" :value="1"></el-option>
            <el-option label="辅料" :value="2"></el-option>
            <el-option label="设备" :value="3"></el-option>
            <el-option label="废纸" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth">
          <el-input v-model="editForm.contactsName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="editForm.contactsPhone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商" :label-width="formLabelWidth">
          <el-input v-model="editForm.supplier" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产地" :label-width="formLabelWidth">
          <el-input v-model="editForm.area" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="editConfirmAdd">确认添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "shop",
  data() {
    return {
      //页码
      currentPage: 1,
      totalPages: 0,
      //开通店铺
      addVisible: false,
      editVisible: false,

      //表格数据
      tableData: [],

      //对话框
      addForm: {
        storeName: "",
        cateId: 0,
        prefectureId: "",
        contactsName: "",
        contactsPhone: "",
        area: "",
        supplier: ""
      },
      editForm: {
        storeName: "",
        cateId: 0,
        prefectureId: "",
        contactsName: "",
        contactsPhone: "",
        area: "",
        supplier: ""
      },
      //挂钩分类
      cateList: [],

      formLabelWidth: "80px"
    };
  },
  methods: {
    //获取平台店铺
    async getPlatformShop() {
      let res = await this.$axios.get(
        `admin/sysStore/storeList?currentPage=${this.currentPage}&pageSize=10`
      );
      console.log(res);
      if (res.data.code === 200) {
        //店铺类型为2就是平台店铺
        this.tableData = res.data.data.list.filter(v => {
          if (v.storeType == 2) {
            return v;
          }
        });
        console.log(this.tableData);
        this.totalPages = this.tableData.length;
      } else {
        this.$message.error(res.data.message);
      }
    },
    //获取挂钩分类
    async getCateList() {
      let res = await this.$axios.get(`admin/sysStore/query`);
      console.log(res);
      if (res.data.code === 200) {
        this.cateList = res.data.data;
      } else {
        this.$message.error(res.data.message);
      }
    },
    //点击添加店铺按钮
    addShop() {
      //每次都要清空输入
      for (let key in this.addForm) {
        this.addForm[key] = "";
      }

      this.addVisible = true;
    },
    //点击编辑店铺按钮
    editing(row) {
      this.editForm.storeName=row.storeName;
      this.editForm.cateId=row.cateId;
      this.editForm.prefectureId=row.prefectureId;
      this.editForm.contactsName=row.contactsName;
      this.editForm.contactsPhone=row.contactsPhone;
      this.editForm.area=row.area;
      this.editForm.supplier=row.supplier;
      this.editVisible = true;
    },
    //点击删除按钮
    deleteShop(row) {
        
    },
    //新增的提交
    async openConfirmAdd() {
      //给店铺加上类型为2
      this.addForm.storeType = 2;

      let res = await this.$axios.post(`admin/sysStore/storeAdd`, this.addForm);
      console.log(res);
      if (res.data.code === 200) {
        this.$message.success("新增店铺成功!");
        this.getPlatformShop();
      } else {
        this.$message.error(res.data.message);
      }

      this.addVisible = false;
    },
    //编辑的提交
    async editConfirmAdd() {
      this.editVisible = false;
    }
  },
  created() {
    this.getPlatformShop();
    this.getCateList();
  }
};
</script>

<style lang="">
</style>