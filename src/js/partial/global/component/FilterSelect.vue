<template>
  <el-select v-model="selected" filterable reserve-keyword :placeholder="placeholder">
    <el-option
      v-for="item in options"
      :key="item.value"
      :value="item.value"
      :label="item.label"
      >
    </el-option>
  </el-select>
</template>

<script>

export default {
    props: {
      placeholder : String,
      options     : Array,
      selected    : String
  },
  data() {
    return {
      // options: 
      // [
      //   {
      //     value: 'Option1',
      //     label: 'zzzz'
      //   }, 
      //   {
      //     value: 'Option2',
      //     label: 'bbbb'
      //   }
      // ],
      // selected: ''
    }
  },

  mounted() {
    this.options = this.options.map(item => {
      return { value: `${item.value}`, label: `${item.label} - ${item.value}` };
    });
  },

  methods: {
    handleSelectedChange(val) {
        this.$emit('handleSelectedChange',val)
    }
  },

  watch: {
      "selected": function() {
          this.handleSelectedChange(this.selected);
      }
  }
}
</script>