<template>
  <div class="book-now-button">
    <button
      class="g2j-button-book-now "
      :disabled="isDisable"
      :class="{ 'disable-button': isDisable }"
      @click="handleClick()"
    >
      <p v-html="titleText"></p>
    </button>
  </div>
</template>

<script>
  export default {
    name: "BookNow",
    props: {
      title: String,
      isDisable: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {};
    },
    computed: {
      titleText() {
        return this.title;
      },
    },
    methods: {
      handleClick() {
        this.$emit("bookNow");
      },
    },
  };
</script>


