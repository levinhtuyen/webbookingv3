<template>
    <div class="list-landing-page">
      <div class="container list-landing-page__back-btn-container">
        <!-- <BackButtonComponent></BackButtonComponent> -->
      </div>
      <section class="list-landing-section">
        <div class="container">
          <div class="list-landing-block">
            <div class="list-landing-page-content-background"></div>
            <div class="list-landing-page-content">
                <div class="list-landing-page-content__item">
                    <div class="list-landing-page-content__item--text">
                        <div class="block-text">
                            <p class="block-text__content">
                                <span class="block-text__content--title">
                                    GO2JOY'S BLOG
                                </span><br>
                                <span class="block-text__content--content">
                                    Welcome to Go2Joy's Blog, We will bring to you an online journal,
                                    many attractive destinations and many experiences.
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class="list-landing-page-content__item--block-1">
                        <div class="block-item-landing">
                            <a :href="BASE_URL + '/bat-mi-diem-hen-ho-ly-tuong'">
                            <div class="block-item-landing__image">
                                <img src="https://staging-home.go2joy.vn/static/img/hotel2.58ba2dd.png" alt="">
                                <div class="block-item-landing__image--text">
                                    <p class="title-landing-page">
                                        BẬT MÍ ĐIỂM HẸN HÒ LÝ TƯỞNG CỦA GIỚI TRẺ NGÀY NAY
                                    </p>
                                </div>
                            </div>
                            </a>
                        </div>
                    </div>
                    <div class="list-landing-page-content__item--block-2">
                        <div class="block-item-landing">
                            <a :href="BASE_URL + '/4-buoc-ve-dem-cua-gioi-tre'">
                                <div class="block-item-landing__image">
                                    <img src="https://staging-home.go2joy.vn/static/img/hotel1.ce2474e.png" alt="">
                                    <div class="block-item-landing__image--text">
                                        <p class="title-landing-page">
                                            CÔNG THỨC 4 BƯỚC VỀ ĐÊM CỦA GIỚI TRẺ SÀI THÀNH
                                        </p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
          </div> <!-- .list-landing-block -->
        </div>
      </section> <!-- .list-landing-section -->

        <TheFooterSection/>
    </div>
</template>

<script>
// import BackButtonComponent from '~jsPartialPath/global/component/back-button/BackButtonComponent.vue';
import {
  BASE_URL,
} from '~jsDefinePath/general';
import TheFooterSection from '~jsPath/partial/global/TheFooterSection.vue';

export default {
    name: "TheListLandingPage",
    components: {
        // BackButtonComponent,
        TheFooterSection,
    },
    data() {
        return {
            BASE_URL,
            value: false
        }
    },
    created () {
        EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
    },
}
</script>
