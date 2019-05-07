<template></template>

<script>
export default {
  name: "redirect",
  created() {
    const path = this.$router.currentRoute.params;
    this.$router.push(path);
  }
};
</script>

<style lang="less">
</style>