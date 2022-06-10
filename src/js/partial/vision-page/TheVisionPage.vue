<template>
      <div class="vision-page">
        <section class="back-btn-section">
          <div class="container">
            <div class="back-btn-block">
              <!-- <TheGo2JoyBack></TheGo2JoyBack> -->
            </div> <!-- .back-btn-block -->
          </div>
        </section> <!-- .back-btn-section -->

        <section class="vision-section">
          <div class="container">
              <div class="vision-block">
                <div class="vision-page__banner">
                  <div class="vision-page__banner--image">
                      <img src="../image/backvision.png" alt="">
                  </div>
              </div>
              <div class="vision-page__content">
                  <div class="vision-page__content--title">
                      <p class="title"> Vision</p>
                  </div>
              </div>
              <div class="vision-page__tab">
                  <div class="vision-page__tab--tab">
                      <div class="tab-vision-mision"
                          :class="chooseTab == 1 ? 'active' : ''"
                          @click="onChangeTab(1)"><i class="fas fa-map-signs"></i> Vision
                      </div>
                      <div class="tab-vision-mision"
                          :class="chooseTab == 2 ? 'active' : ''"
                          @click="onChangeTab(2)"> <i class="fas fa-flag"></i>
                          Mission
                      </div>
                  </div>
                  <div class="vision-page__tab--content">
                      <div class="content-tab" v-show="chooseTab == 1">
                          <p>Go2joy định hướng phát triển sản phẩm dịch vụ, trở thành ứng dụng đặt phòng theo giờ hàng đầu với tiên ích tối ưu về thời gian và vị trí cho người dùng.</p>
                      </div>
                      <div class="content-tab" v-show="chooseTab == 2">
                          <p>Mang đến những trải nghiệm thú vị, đáp ứng nhu cầu đặt phòng mới của người tiêu dùng. Cung cấp thông tin hữu ích và là cầu nối giúp người tiêu dùng có thể chủ động và thoải mái lựa chọn những địa điểm nghỉ ngơi trong thời gian ngắn. Khuyến khích, thúc đẩy, tạo ra xu hướng du lịch và nghỉ dưỡng ngay trong thành phố.</p>
                      </div>
                  </div>
              </div>
            </div> <!-- .vision-block -->
          </div>
        </section> <!-- .vision-section -->

        <TheFooterSection/>
      </div> <!-- .vision-page -->
</template>

<script>
// import TheGo2JoyBack from '../global/component/go2joy-back/TheGo2JoyBack.vue';
import TheFooterSection from '~jsPartialPath/global/TheFooterSection.vue';

export default {
    name: "TheVisionPage",

    components: {
        // TheGo2JoyBack,
        TheFooterSection,
    },

    data() {
        return {
            chooseTab: 1
        }
    },

    created () {
        EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
    },

    methods: {
        onChangeTab(change) {
            this.chooseTab = change
        }
    },
}
</script>
<style src="./vision-page-style.css"></style>
