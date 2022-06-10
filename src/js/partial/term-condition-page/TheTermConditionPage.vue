<template>
  <div class="term-condition-page">
    <div class="container">
      <div class="term-condition-page__title">
        <p>Terms / Privacy Policy</p>
      </div>
      <div class="term-condition-page__content">
        <div class="term-condition-page__content--tab">
          <div
            class="title-tab"
            @click="chooseTab(1)"
            :class="displayChoose == 1 ? 'active' : ''"
          >
            <p>Service Agreement</p>
          </div>
          <div
            class="title-tab"
            @click="chooseTab(2)"
            :class="displayChoose == 2 ? 'active' : ''"
          >
            <p>Privacy Policy</p>
          </div>
          <div
            class="title-tab"
            @click="chooseTab(3)"
            :class="displayChoose == 3 ? 'active' : ''"
          >
            <p>Payment Policy</p>
          </div>
        </div>
        <div
          class="term-condition-page__content--text"
          v-if="displayChoose == 1"
        >
          <div v-html="htmlDecode(dataTermCondition.serviceAgreement)">
          </div>
        </div>
        <div
          class="term-condition-page__content--text"
          v-if="displayChoose == 2"
        >
          <div v-html="htmlDecode(dataTermCondition.privatePolicy)">
          </div>
        </div>
        <div
          class="term-condition-page__content--text"
          v-if="displayChoose == 3"
        >
          <div v-html="htmlDecode(dataTermCondition.paymentPolicy)">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { he } from "~jsLibPath/lib-manager";
  import { AJAX_URL } from "~jsDefinePath/ajax-url";
  import { HEADER_CONFIG } from "~jsDefinePath/general";
  import { apiCaller } from "~jsHelperPath/service/ApiHandler";

  export default {
    data() {
      return {
        displayChoose: 1,
        dataTermCondition: {},
      };
    },
    async created() {
      await this.getDataTermCondition();
      EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
    },
    methods: {
      htmlDecode(content) {
        if (!content) {
          return "";
        }

        // NOTE - hot fix for those contents copied from html resource or from a website have explict space character
        const tmpContent = content.replace(/&nbsp;/g, " ");

        return he.decode(tmpContent);
      }, // htmlDecode()

      chooseTab(a) {
        this.displayChoose = a;
      },
      async getDataTermCondition() {
        try {
          let res = await apiCaller({
            url: AJAX_URL.terCondition.terCondition,
            dataType: "json",
            method: "GET",
            headers: {
              "Device-Encode": "device_for_web",
              Authorization: HEADER_CONFIG["Token"],
            },
            contentType: "application/json; charset=utf-8",
          });
          this.dataTermCondition = res.data[0];
        } catch (error) {
          console.log("error :>> ", error);
        }
        // let self = this;
        // await apiCaller({
        //   url: AJAX_URL.terCondition.terCondition,
        //   dataType: "json",
        //   method: "GET",
        //   headers: {
        //     "Device-Encode": "device_for_web",
        //     Authorization: HEADER_CONFIG["Token"],
        //   },
        //   contentType: "application/json; charset=utf-8",
        //   success: function (result) {
        //     let data = result.data;
        //     self.dataTermCondition = data[0];
        //     // EventBus.emit("IS_SHOW_ROUTER_LOADING", false);
        //   },
        //   error: function (error) {
        //     console.log("error :>> ", error);
        //   },
        // });
      }, // getDataTermCondition()
    },
  };
</script>

<style src="./term-condition-page-style.css"></style>
