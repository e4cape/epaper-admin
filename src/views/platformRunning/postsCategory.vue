<template>
  <div id="postsCategory">
    <el-button type="primary" @click="dialogFormVisible=true" style="marginBottom:25px">添加分类</el-button>
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
      border
    >
      <el-table-column type="index" width="260" label="排序" align="center"></el-table-column>
      <el-table-column property="date" label="分类" align="center"></el-table-column>
      <el-table-column property="name" label="操作"  width="260" align="center"></el-table-column>
      
    </el-table>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible" width="320px">
      <el-form :model="form">
        <el-form-item label="分类名称" >
          <el-input v-model="form.cateName" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addCate">确认添加</el-button>
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
      tableData:[{},{}],
      //添加分类的表单
      form:{
        cateName:''
      },
      //对话框的可见性
      dialogFormVisible:false
    };
  },
  methods: {
    //获取分类列表的接口
    getCate(){

    },
    //添加分类的接口
    addCate(){
      
    }

  }
};
</script>

<style lang="">
</style>