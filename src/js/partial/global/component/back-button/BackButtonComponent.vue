<template>
  <div class="back-button-component">
    <button @click="click()">
      <i class="fas fa-chevron-left"></i>
    </button>
  </div>
</template>

<script>
  export default {
    props: {
      to: {
        type: String,
      },
    },
    methods: {
      click () {
        if (this.to) {

          this.$router.push(this.to)
          return
        }
        this.$router.go(-1)
      }
    },
  }
</script>
