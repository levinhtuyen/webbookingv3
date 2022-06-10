<template>
  <div>
    <el-table
      :data="tableData"
    >
      <el-table-column
        type="index"
        width="50">
      </el-table-column>

      <el-table-column
        v-for="(column, index) in columns"
        :key="index"
        property="name"
        :label="column.lable"
        width="120">
          <template slot-scope="scope">
            <span>{{ column.formatter(scope.row[column.prop]) }}</span>
          </template>
      </el-table-column>

      <el-table-column
        label="Operations">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>

export default {
  props: {
    columns   : Array,
    tableData : Array
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
    handleEdit(index, row) {
      this.$emit('handleEdit', row);
    },
    handleDelete(index, row) {
      this.$emit('handleDelete', row);
    }
  }
}
</script>
