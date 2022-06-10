<template>
  <modal
    ref="filter-modal"
    class="status-modal"
    :disable-click-background="true"
    :visible.sync="visible"
    width="400px"
    @beforeClose="beforeClose"
  >
    <template slot="header">
      <div class="status-modal__title">
        <span v-if="isSuccess"> <i class="fas fa-check-circle success" /> {{ $t('payment-detail.booking_success') }}</span>
        <span v-else> <i class="fas fa-times-circle fail" /> {{ $t('payment-detail.booking_fail') }}</span>
      </div>
    </template>
    <template slot="body">
      <div
        v-if="isSuccess"
        class="status-modal__body"
      >
        <p>
          {{ $t('payment-detail.note_popup_success') }}
          <span class="status-modal__body--title-hotel">{{dataBooking.hotelName}} </span>
          {{ $t('payment-detail.is_success') }}
        </p>
        <p>{{ $t('payment-detail.thanks_success') }}</p>
      </div>
      <div
        v-else
        class="status-modal__body"
      >
        <p>
          {{ $t('payment-detail.note_popup_fail') }}
          <span class="status-modal__body--title-hotel">{{dataBooking.hotelName}} </span>
          {{ $t('payment-detail.note_popup_fail2') }}
        </p>
        <p>
          <!-- {{ $t('payment-detail.reason_fail') }} -->
          <!-- {{messageError}} -->
        <p v-if="!messageError || messageError.length ==0">{{ $t('payment-detail.reason_fail') }}</p>
        <template v-else>
          <p v-for="(v,k) in messageError">{{v.message}}</p>

        </template>
        </p>
      </div>
    </template>
    <template slot="footer">
      <div class="status-modal__footer">
          <button
          v-if="isSuccess"
          class="status-modal__footer--button"
          @click="$router.push('/')"
        >
          {{ $t('payment-detail.back_to_home') }}
        </button>
        <button
          v-if="isSuccess"
          class="status-modal__footer--button btn-detail"
          @click="goDetail()"
        >
          {{ $t('payment-detail.see_detail') }}
        </button>
        <button
          v-else
          class="status-modal__footer--button btn-detail"
          @click="bookOtherRoom()"
        >
          {{ $t('payment-detail.book_other') }}
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
  export default {
    components: {
      "modal": () =>
        import("~jsPartialPath/global/component/modal/ModalComponent.vue"),
    },
    props: {
      isSuccess: {
        type: Boolean,
      },
      messageError: {
        type: String,
      },
      dataBooking: {
        type: [Array, Object],
      },
    },
    data() {
      return {
        visible: false,
      };
    },
    created() {},
    methods: {
      goDetail() {
        this.$emit("goDetail");
      },
      bookOtherRoom() {
        // this.$emit("bookOtherRoom");
        this.$router.push({
          name: "payment",
          query: {
            hotelSn: this.dataBooking.hotelSn,
            roomSn: this.dataBooking.roomTypeSn,
            mode: this.dataBooking.mode,
          },
        });
      },
      show() {
        this.visible = true;
      },
      beforeClose(done) {
        this.$router.push({
          name: "payment",
          query: {
            hotelSn: this.dataBooking.hotelSn,
            roomSn: this.dataBooking.roomTypeSn,
            mode: this.dataBooking.mode,
          },
        });
        done();
      },
      close() {
        this.visible = false;
      },
    },
  };
</script>
