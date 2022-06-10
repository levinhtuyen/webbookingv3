<template>
  <div class="container">
    <template v-for="(v,k) in dataCollections">
      <!-- <p>{{v.title}}</p> -->
      <VueContentLoading
        :key="index"
        :width="50"
        :height="2"
      >
        <rect
          x="0"
          y="0"
          rx="0"
          ry="0"
          width="10"
          height="30"
        />

      </VueContentLoading>
      <!-- G2jLightSquareCard loading -->
      <div
        v-if="v.displayType == 5"
        class="g2j-container-loading"
      >
        <div
          v-for="(v,k) in 2"
          class="g2j-container-loading__item"
        >
          <VueContentLoading
            :key="index"
            :width="350"
            :height="250"
          >
            <rect
              x="0"
              y="10"
              rx="4"
              ry="4"
              width="100%"
              height="100"
            />

            <rect
              x="10"
              y="130"
              rx="4"
              ry="4"
              width="80%"
              height="20"
            />
            <rect
              x="10"
              y="170"
              rx="4"
              ry="4"
              width="50%"
              height="10"
            />
            <rect
              x="10"
              y="190"
              rx="4"
              ry="4"
              width="30%"
              height="10"
            />
          </VueContentLoading>
        </div>
      </div>
      <!--end G2jLightSquareCard loading -->

      <!-- G2jDarkSquareCard loading -->
      <div
        v-if="v.displayType == 6"
        class="g2j-container-loading"
      >
        <div
          v-for="(v,k) in 2"
          class="g2j-container-loading__item"
        >
          <VueContentLoading
            :key="index"
            :width="350"
            :height="280"
          >
            <rect
              x="0"
              y="10"
              rx="8"
              ry="8"
              width="100%"
              height="100%"
            />
          </VueContentLoading>
        </div>
      </div>
      <!--end G2jDarkSquareCard loading -->

      <!-- G2jVerticalCard loading -->
      <div
        v-if="v.displayType == 7"
        class="g2j-container-loading loading-4"
      >
        <div
          v-for="(v,k) in 4"
          class="g2j-container-loading__item "
        >
          <VueContentLoading
            :key="index"
            :height="450"
          >
            <rect
              x="0"
              y="10"
              rx="8"
              ry="8"
              width="100%"
              height="450"
            />
          </VueContentLoading>
        </div>
      </div>
      <!--end G2jVerticalCard loading -->

      <!-- G2jHorizontalCard loading -->
      <div
        v-if="v.displayType == 8"
        class="g2j-container-loading "
      >
        <div
          v-for="(v,k) in 2"
          class="g2j-container-loading__item "
        >
          <VueContentLoading
            :key="index"
            :height="170"
          >
            <rect
              x="0"
              y="10"
              rx="8"
              ry="8"
              width="40%"
              height="165"
            />

            <rect
              x="43%"
              y="20"
              rx="0"
              ry="0"
              width="20%"
              height="20"
            />

            <rect
              x="43%"
              y="55"
              rx="0"
              ry="0"
              width="30%"
              height="20"
            />
            <rect
              x="43%"
              y="110"
              rx="0"
              ry="0"
              width="27%"
              height="25"
            />
          </VueContentLoading>
        </div>
      </div>
      <!--end G2jHorizontalCard loading -->

      <!-- G2jArticleCard loading -->
      <div
        v-if="v.displayType == 9"
        class="g2j-container-loading"
      >
        <div
          v-for="(v,k) in 2"
          class="g2j-container-loading__item"
        >
          <VueContentLoading
            :key="index"
            :width="350"
            :height="250"
          >
            <rect
              x="0"
              y="10"
              rx="4"
              ry="4"
              width="100%"
              height="100"
            />

            <rect
              x="10"
              y="130"
              rx="4"
              ry="4"
              width="80%"
              height="20"
            />
            <rect
              x="10"
              y="170"
              rx="4"
              ry="4"
              width="50%"
              height="10"
            />
            <rect
              x="10"
              y="190"
              rx="4"
              ry="4"
              width="30%"
              height="10"
            />
          </VueContentLoading>
        </div>
      </div>
      <!--end G2jArticleCard loading -->
    </template>
  </div>

</template>

<script>
  export default {
    props: {
      collections: [Array],
    },
    components: {
      VueContentLoading: window.VueContentLoading.VueContentLoading,
    },
    created() {},
    computed: {
      dataCollections() {
        return this.collections;
      },
    },
    mounted() {},
  };
</script>

<style>
</style>
