<template>
  <div
    class="pagination-component"
    :style="`justify-content:${positionPagination}`"
  >
    <!-- TODO: case pageSizes <=5 -->
    <template v-if="pageSizes <= 5">
      <button
        class="pagination-component__btn-prev"
        :disabled="active == 1"
        @click="prePage()"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <ul>
        <li
          v-for="(v, k) in pageSizes"
          :key="k"
          class="pagination-component--item"
          :class="active == v ? 'active' : ''"
          @click="changePage(v)"
        >
          {{ v }}
        </li>
      </ul>

      <button
        class="pagination-component__btn-next"
        :disabled="active == pageSizes"
        @click="nextPage()"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </template>
    <!-- end -->

    <template v-else>
      <button
        class="pagination-component__btn-prev"
        :disabled="active == 1"
        @click="prePage()"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <ul>
        <!-- b1, TODO: 1234...pageSizes -->
        <template v-if="active < 4">
          <li
            v-for="(v, k) in defaultRange"
            :key="k"
            class="pagination-component--item"
            :class="active == v ? 'active' : ''"
            @click="changePage(v)"
          >
            {{ v }}
          </li>
          <li class="pagination-component--three-dots">
            ...
          </li>
          <li
            :class="active == pageSizes ? 'active' : ''"
            class="pagination-component--item"
            @click="changePage(pageSizes, 'last')"
          >
            {{ pageSizes }}
          </li>
        </template>
        <!-- end b1 -->

        <!-- b1.1, TODO: 1... -->
        <template v-if="active >= defaultRange - 1">
          <li
            :class="active == 1 ? 'active' : ''"
            class="pagination-component--item"
            @click="changePage(1)"
          >
            1
          </li>
          <li class="pagination-component--three-dots">
            ...
          </li>
        </template>
        <!-- end b1.1 -->

        <!-- b2, TODO: n, n+1(active), n+2, ..., pageSizes -->
        <template v-if="active >= defaultRange - 1 && active < pageSizes - 2">
          <li
            v-for="(v, k) in range(active - 1, defaultRange + 1)"
            :class="active == v ? 'active' : ''"
            class="pagination-component--item"
            @click="changePage(v, 'mid')"
            :key="k"
          >
            {{ v }}
          </li>

          <li
            v-if="active < pageSizes - 2"
            class="pagination-component--three-dots"
          >
            ...
          </li>

          <li
            :class="active == pageSizes ? 'active' : ''"
            class="pagination-component--item"
            @click="changePage(pageSizes, 'last')"
          >
            {{ pageSizes }}
          </li>
        </template>
        <!-- end b2 -->

        <!-- b3, TODO: pageSizes -2  ,pageSizes - 1, pageSizes -->
        <template
          v-if="active > pageSizes - 3"
          template
        >
          <li
            v-for="(v, k) in range(defaultRange - 2, pageSizes)"
            :class="active == v ? 'active' : ''"
            class="pagination-component--item"
            @click="changePage(v, 'last')"
            :key="k"
          >
            {{ v }}
          </li>
        </template>
        <!-- end b3 -->
      </ul>
      <button
        class="pagination-component__btn-next"
        :disabled="active == pageSizes"
        @click="nextPage()"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </template>
  </div>
</template>

<script>
  export default {
    name: "Pagination",
    props: {
      pageSizes: {
        type: Number
      },
      currentPage: {
        type: Number
      },
      position: {
        type: String,
        default: 'start'
      }
    },
    data () {
      return {
        active: 1,
        defaultRange: 5
      };
    },

    watch: {
      currentPage: {
        handler () {
          this.active = this.currentPage;
        },
        deep: true,
        immediate: true
      },
    },
    methods: {

      changePage (page, magic) {
        this.active = page;

        if (magic == "mid" && page < this.pageSizes - 2 && page > 5) {
          this.defaultRange = page + 1;
        }
        if (magic == "last" && page < this.pageSizes - 3) {
          this.defaultRange = page + 1;
        }
        if (this.active <= 5) {
          this.defaultRange = 5;
        }

        if (page == this.pageSizes) {
          this.defaultRange = this.pageSizes - 2;
        }

        this.$emit("changeCurrentPage", page);
      },
      nextPage () {
        let count = this.active + 1;
        if (count >= 4) {
          this.changePage(count, "mid");
          return;
        }
        this.changePage(count);
      },
      prePage () {
        let count = this.active - 1;
        if (count < this.pageSizes - 2 && count > 5) {
          this.changePage(count, "mid");
          return;
        }

        if (count < this.pageSizes - 3) {
          this.changePage(count, "last");
          return;
        }
        this.changePage(count);
      },
      range (start, end) {
        return Array(end - start + 1)
          .fill()
          .map((_, idx) => start + idx);
      },
    },
    computed: {
      positionPagination () {
        let result = this.position == 'start' ? 'flex-start' : this.position == 'center' ? 'center' : 'flex-end'
        return result
      }
    },
  };
</script>
