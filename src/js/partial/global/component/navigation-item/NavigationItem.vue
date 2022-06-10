<template>
  <router-link
    :to="to"
    custom
    v-slot="{ isExactActive, href, navigate }"
  >
    <a
      class="navigation-item"
      :href="href"
      @click="navigate"
      :class="
        {
          'is-active': isExactActive
        }
      "
    >
      <slot name="navigation-name">
        navigation
      </slot>
    </a> <!-- .navigation-item -->
  </router-link>
</template>

<script>
export default {
  name: 'NavigationItem',

  props: {
    to: {
      type: String,
      default: '',
    },
  },
}
</script>
