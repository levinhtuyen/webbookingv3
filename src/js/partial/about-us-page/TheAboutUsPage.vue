<template>
  <div class="about-us-page">
    <div class="container">
      <div class="about-us-page-content">
        <div class="about-us-page-content__title">
          <p>{{ $t("about-us.about_us") }}</p>
        </div>
        <div class="about-us-page-content__company">
          <p class="about-us-page-content__company--title">
            {{ $t("about-us.go2joy_jsc") }}
          </p>
          <p class="about-us-page-content__company--text">
            <span class="title-content"
              >{{ $t("about-us.customer_support") }}: </span
            ><b>
              <a @click="onMail('cskh@go2joy.vn') ">cskh<!-- >@. -->@<!-- >@. -->go2joy<!-- >@. -->.<!-- >@. -->vn  </a>
              </b>
          </p>
          <p class="about-us-page-content__company--text">
            <span class="title-content"
              >{{ $t("about-us.contact_for_co") }}: </span
            ><b>
              <a  @click="onMail('support@go2joy.vn')">support<!-- >@. -->@<!-- >@. -->go2joy<!-- >@. -->.<!-- >@. -->vn
                </a>
              </b>
          </p>
          <!-- <p class="about-us-page-content__company--text">
            Contact cooperation
          </p> -->
        </div>
        <div class="about-us-page-content__provice">
          <p class="about-us-page-content__provice--name">
            {{ $t("about-us.hcm") }}
          </p>

          <div class="about-us-page-content__provice--text">
            <p>
              <span class="title-content"
                >{{ $t("about-us.head_office") }}:</span
              >
              <b>5A / 2 Tran Phu, District 5, Ho Chi Minh</b>
            </p>
          </div>
          <div class="about-us-page-content__provice--text">
            <p>
              <span class="title-content">{{ $t("about-us.hotline") }}:</span>
              <b><a href="tel:+0931 836 836">0931 836 836</a></b>
            </p>
          </div>
        </div>
        <div class="about-us-page-content__provice">
          <p class="about-us-page-content__provice--name">
            {{ $t("about-us.hn") }}
          </p>

          <div class="about-us-page-content__provice--text">
            <p>
              <span class="title-content"
                >{{ $t("about-us.head_office") }}:</span
              >
              <b>12th floor, Mipec building, Tay Son, Dong Da, Hanoi</b>
            </p>
          </div>
          <div class="about-us-page-content__provice--text">
            <p>
              <span class="title-content">{{ $t("about-us.hotline") }}:</span>
              <b><a href="tel:+077 789 2399">077 789 2399</a></b>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
  },
  methods: {
    onMail(email){
      window.location.href = `mailto:${email}`;
    },
  },
};
</script>

<style src="./about-us-page-style.css"></style>
