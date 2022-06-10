<template>
    <el-button type="primary" @click="handleSearch" icon="el-icon-search" >Search</el-button>
</template>

<script>

export default {
  data() {
    return {}
  },

  methods: {
    handleSearch() {
        this.$emit('handleSearch')
    }
  }
}
</script>
