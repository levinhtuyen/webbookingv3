<template>
  <div class="block" >
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageSizeCurrent"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>

export default {
    props: {
        pageSizeCurrent     : Number,
        pageSizes           : Array,
        pageSize            : Number,
        total               : Number
    },

    data() {
        return {
            form: {
                limit: 10,
                page : 1
            }
        }
    },

    methods: {
        handleSizeChange(size) {
            this.$emit('handleSizeChange',size)
        },
        handleCurrentChange(currentPage) {
            this.$emit('handleCurrentChange',currentPage)
        }
    }
}
</script>
