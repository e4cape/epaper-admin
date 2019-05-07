<template>
  <div>
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
  </div>
</template>

<script>
export default {
  name: "myPage"
};
</script>

<style lang="less">
.my-page {
  position: absolute;
  left: 50%;
  margin-left: -180px;
  bottom: 60px;
}
</style>