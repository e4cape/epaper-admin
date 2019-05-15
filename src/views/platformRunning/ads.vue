<template>
  <div id="ads">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="PC端" name="first">
        <el-table :data="PCtableData" border style="width: 100%">
          <el-table-column prop="bannerLocation" label="横幅位置" align="center">
            <template slot-scope="scope">
              <el-link :underline="false" v-if="scope.row.bannerLocation==1">首页banner</el-link>
              <el-link :underline="false" v-else-if="scope.row.bannerLocation==2">资讯banner</el-link>
              <el-link :underline="false" v-else>促销banner</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="bannerUrl" label="链接目标" align="center"></el-table-column>
          <el-table-column prop="bannerImage" label="图片" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.bannerImage" style="width:300px;height:180px">
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" align="center">
            <template slot-scope="scope">
              <!-- 文件上传 -->
              <el-upload
                :action="uploadAction"
                :limit="1"
                :on-success="afterSuccess"
                :on-error="afterError"
              >
              <el-button size="small" type="primary" @click="changePic(scope.row)">换图</el-button>
              </el-upload>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>


      <el-tab-pane label="小程序" name="second">
        <el-table :data="MPtableData" border style="width: 100%">
          <el-table-column prop="bannerLocation" label="横幅位置" align="center">
            <template slot-scope="scope">
              <el-link :underline="false" v-if="scope.row.bannerLocation==1">首页banner</el-link>
              <el-link :underline="false" v-else-if="scope.row.bannerLocation==2">资讯banner</el-link>
              <el-link :underline="false" v-else>促销banner</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="bannerUrl" label="链接目标" align="center"></el-table-column>
          <el-table-column prop="bannerImage" label="图片" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.bannerImage" style="width:300px;height:180px">
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" align="center">
            <template slot-scope="scope">
              <!-- 文件上传 -->
              <el-upload
                :action="uploadAction"
                :limit="1"
                :on-success="afterSuccess"
                :on-error="afterError"
              >
              <el-button size="small" type="primary" @click="changePic(scope.row)">换图</el-button>
              </el-upload>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
export default {
  name: "ads",
  data() {
    return {
      activeName: "first",
      //pc列表数据
      PCtableData: [],
      //小程序列表数据
      MPtableData:[],
      //图片上传的地址
      uploadAction: "https://szyizhitong.com:443/basics/goods/good/uploadimg",
      //编辑的那一行广告图
      editAd:{
        bannerId:0,
        bannerImage:''
      }
    };
  },
  methods: {
    //获取广告图列表
    async getAdList() {
      //每次获取前都要清空数组
      this.PCtableData=[];
      this.MPtableData=[];

      let res = await this.$axios.get(`basics/banner/queryBanner`);
      console.log(res);
      if (res.data.code === 200) {
        
        res.data.data.forEach(v=>{
          //获取到pc的banner图
          if(v.bannerSource==1){
            this.PCtableData.push(v)
          }else {
             this.MPtableData.push(v)
          }
        })
      } else {
        this.$message.error(res.data.message);
      }
    },
    //tab栏切换
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //换图
    changePic(row) {
      //拿到bannerId
      this.editAd.bannerId=row.bannerId;
    },
    //图片上传成功的回调函数
    async afterSuccess(response){
        // console.log(response);
        if(response.code==200){
          //换图后的新路径
          this.editAd.bannerImage=response.data;
          
          //更新广告图
          let res = await this.$axios.post(`basics/banner/updateBanner`, this.editAd);
          if (res.data.code == 200) {
             this.$message.success('更换成功!')
             this.getAdList();
          } 
        }else {
           this.$message.error('更换失败!')
        }
    },
    //图片上传失败的回调函数
    afterError(){
        this.$message.error('图片上传失败!');
    }
  },
  created() {
    this.getAdList();
  }
};
</script>

<style lang="less">
</style>