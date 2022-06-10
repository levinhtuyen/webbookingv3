<template>
  <div class="label-remaining-day-container">
    <div
      class="label-remaining-day"
      :class="'label-remaining-day-'+type"
    >
      <div
        class="label-remaining-day__title"
        :class="'label-remaining-day__title--'+type"
      >
        <div class="label-remaining-day__title--icon">
          <slot name="icon" />
        </div>

        <slot name="title" />
      </div>
      <div class="label-remaining-day__content">
        <div class="label-remaining-day__content--container">
          <slot name="content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'flash-sale',
        require: true
      },
    },
    created () {
    },
  }
</script>
