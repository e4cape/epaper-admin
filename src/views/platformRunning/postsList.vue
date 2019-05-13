<template>
  <div id="postsList">
    <!-- 头部搜索区域 -->
    <div class="search">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="文章名" class="inputForm">
          <el-input v-model="formInline.postsName" placeholder="请输入文章名"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" class="inputForm">
          <el-select v-model="formInline.postsCate" placeholder="请选择文章分类">
            <el-option
              :label="item.acName"
              :value="item.acName"
              v-for="(item,index) in cateList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="首页推荐" class="inputForm">
          <el-select v-model="formInline.state" placeholder="是否首页推荐" class="my-input">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册日期">
          <el-date-picker
            v-model="formInline.dataValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="my-date-picker"
            value-format="timestamp"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="mySearch">
          <!-- 清除按钮 -->
          <el-link
            type="primary"
            :underline="false"
            style="marginRight:30px"
            @click="clearCondition"
          >清除条件</el-link>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 主体区域 -->
    <div class="main">
      <el-button type="primary" @click="newPost" style="marginBottom:25px">发布文章</el-button>
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%"
        border
      >
        <el-table-column prop="articleTitle" label="文章名" align="center" width="550"></el-table-column>
        <el-table-column prop="acName" label="文章分类" align="center"></el-table-column>
        <el-table-column prop="aticleClick" label="浏览量" align="center" sortable></el-table-column>
        <el-table-column prop="aticleLove" label="点赞数" align="center" sortable></el-table-column>
        <el-table-column prop="articleState" label="首页推荐" align="center">
           <template slot-scope="scope">
          <el-link type="danger" :underline="false" v-if="scope.row.articleState==1">是</el-link>
          <el-link type="primary" :underline="false" v-else>否</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="articleTime" label="发布日期" align="center">
          <template slot-scope="scope">{{ scope.row.articleTime | formatTime('YYYY-MM-DD')}}</template>
        </el-table-column>
        <el-table-column porp="articleState" label="操作" width="260" align="center">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="showAmendPost(scope.row)">编辑</el-link>
            <el-link
              type="primary"
              :underline="false"
              @click="deletePost(scope.row)"
              style="margin:0 25px"
            >删除</el-link>
            <el-link
              type="primary"
              :underline="false"
              @click="recommendAndNo(scope.row)"
              v-if="scope.row.articleState==1"
            >取消推荐</el-link>
            <el-link type="primary" :underline="false" @click="recommendAndNo(scope.row)" v-else>推荐</el-link>
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

    <!-- 发布文章对话框 -->
    <el-dialog title="发布文章" :visible.sync="dialogFormVisible" width="550px">
      <el-form :model="form">
        <el-form-item label="文章名" :label-width="formLabelWidth">
          <el-input v-model="form.postName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章内容" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="15" placeholder="请输入内容" v-model="form.textarea"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" :label-width="formLabelWidth">
          <el-select v-model="form.postCate" placeholder="请选择分类">
            <el-option
              :label="item.acName"
              :value="item.acId"
              v-for="(item,index) in cateList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="publishPost">确认发布</el-button>
      </div>
    </el-dialog>

    <!-- 编辑文章对话框 -->
    <el-dialog title="编辑文章" :visible.sync="editVisible" width="550px">
      <el-form :model="editForm">
        <el-form-item label="文章名" :label-width="formLabelWidth">
          <el-input v-model="editForm.postName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章内容" :label-width="formLabelWidth">
          <el-input v-model="editForm.textarea" type="textarea" :rows="15" placeholder="请输入内容" ></el-input>
        </el-form-item>
        <el-form-item label="文章分类" :label-width="formLabelWidth">
          <el-select v-model="editForm.postCate" placeholder="请选择分类">
            <el-option
              :label="item.acName"
              :value="item.acId"
              v-for="(item,index) in cateList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="amendPost">确认发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "postsList",
  data() {
    return {
      //搜索表单
      formInline: {
        postsName: "",
        postsCate: "",
        state: "",
        dataValue: []
      },
      //表格数据
      tableData: [],
      //页码
      currentPage: 1,
      totalPages: 0,

      //对话框的表单
      form: {
        postName: "",
        postCate: "",
        textarea: ""
      },
      //修改文章对话框的表单
      editForm: {
        postName: "",
        postCate: "",
        textarea: "",
        articleId:0
      },
      //分类列表
      cateList: [],
      //对话框
      dialogFormVisible: false,
      editVisible: false,
      formLabelWidth: "80px"
    };
  },
  methods: {
    //获取文章列表
    async getPostList() {
      let res = await this.$axios.get(
        `informationController/sysArticleList?currentPage=${
          this.currentPage
        }&pageSize=10&articleTitle=${this.formInline.postsName}&articleState=${
          this.formInline.state
        }&acName=${this.formInline.postsCate}&startTime=${this.formInline
          .dataValue[0] || ""}&endTime=${this.formInline.dataValue[1] || ""}`
      );
      console.log(res);
      if (res.data.code === 200) {
        this.tableData = res.data.data.list;
        this.totalPages = res.data.data.list.length;
      } else {
        this.$message.error(res.data.message);
      }
    },
    //获取文章分类
    async getCate() {
      let res = await this.$axios.get(
        `informationController/queryArticleCatelog?currentPage=${
          this.currentPage
        }&pageSize=10`
      );
      console.log(res);
      if (res.data.code === 200) {
        res.data.data.list.forEach(v => {
          //拿到文章分类和分类id
          this.cateList.push({ acId: v.acId, acName: v.acName });
        });
        console.log(this.cateList);
      } else {
        this.$message.error(res.data.message);
      }
    },
    //点击发布文章按钮
    newPost(){
      this.form.postName = "",
      this.form.postCate = "",
      this.form.textarea = "",
      this.dialogFormVisible=true;
    },
    //发布文章
    async publishPost() {
      let res = await this.$axios.post(`informationController/sysArticleAdd`, {
        articleCateId: this.form.postCate,
        articleContent: this.form.textarea,
        articleTitle: this.form.postName
      });
      console.log(res);

      if (res.data.code === 200) {
        this.$message.success("发布成功!");
        this.getPostList();
      } else {
        this.$message.error(res.data.message);
      }

      this.dialogFormVisible = false;
    },
    //展示修改文章的对话框
    showAmendPost(row) {
      this.editForm.postName = row.articleTitle;
      this.editForm.postCate = row.articleCateId;
      this.editForm.textarea = row.articleContent;

      //拿到文章Id
      this.editForm.articleId = row.articleId;

      this.editVisible = true;
    },
    //修改文章
    async amendPost() {
      let res = await this.$axios.post(`informationController/sysArticleUpdate`, {
        articleId:this.editForm.articleId,
        articleCateId: this.editForm.postCate,
        articleContent: this.editForm.textarea,
        articleTitle: this.editForm.postName
      });
      console.log(res);

      if (res.data.code === 200) {
        this.$message.success("修改成功!");
        this.getPostList();
      } else {
        this.$message.error(res.data.message);
      }

      this.editVisible = false;
    },
    //删除文章
    deletePost(row) {
      this.$confirm("确认删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //调删除接口
          let res = await this.$axios.post(`informationController/sysArticleDel`,{articleId:row.articleId});
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
           this.getPostList();
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
    //推荐和取消推荐
    async recommendAndNo(row){
        //声明一个变量存放推荐的状态
        let state=1;
        if(row.articleState==1){
          state=0;
        }
        let res = await this.$axios.post(`informationController/sysArticleUpdate`, {
        articleId:row.articleId,
        articleState:state
      });
      console.log(res);

      if (res.data.code === 200) {
        this.$message.success("更新成功!");
        this.getPostList();
      } else {
        this.$message.error(res.data.message);
      }
    },
    //清除筛选条件
    clearCondition() {
      (this.formInline.postsName = ""),
        (this.formInline.postsCate = ""),
        (this.formInline.state = ""),
        (this.formInline.dataValue = []);
         this.getPostList();
    },
    //搜索
    search() {
      this.getPostList();
    },
    //页码改变事件
    handleCurrentChange() {
      this.getPostList();
    }
  },
  created() {
    this.getPostList();
    this.getCate();
  }
};
</script>

<style lang="less">
#postsList {
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