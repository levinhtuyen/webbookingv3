<template>
  <section class="date-selection-section">
    <div class="container">
      <div class="date-selection-block">
        <div
          @click="$emit('openModalSelect')"
          class="date-selection-block__check-in"
        >
          <span class="date-selection-block__check-in--title">
            <g2j-image :urlImg="IMAGE_URL+`/icon/filter/calendar.svg`"></g2j-image>
            {{ $t('common.check_in') }}
          </span>
          <p class="date-selection-block__check-in--label">
            {{dayCheckIn?  formatMMM(dayCheckIn) : $t('common.select_date')}}
          </p>
        </div>
        <div
          @click="$emit('openModalSelect')"
          class="date-selection-block__check-out"
        >
          <span class="date-selection-block__check-out--title">
            <g2j-image :urlImg="IMAGE_URL+`/icon/filter/calendar.svg`"></g2j-image>
            {{ $t('common.check_out') }}
          </span>
          <p class="date-selection-block__check-out--label">
            {{dayCheckOut? formatMMM(dayCheckOut): $t('common.select_date')}}
          </p>
        </div>
      </div> <!-- .date-selection-block -->
    </div> <!-- .cotnainer -->
  </section> <!-- .date-selection-section  -->
</template>

<script>
  import { IMAGE_URL } from "~jsDefinePath/general";
  import { mapGetters, mapActions, mapState } from "~jsPath/lib/lib-manager";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";

  export default {
    props: {
      dayCheckIn: {
        default: "",
        type: String,
      }, // dayCheckIn

      dayCheckOut: {
        default: "",
        type: String,
      },
    },

    data() {
      return {
        IMAGE_URL,
      };
    },

    created() {},
    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
    },
    methods: {
      formatMMM(day) {
        let CDate = dayjs(day).format("DD/MM/YYYY");
        return CDate;
      }, // formatMMM()
    },
  };
</script>
