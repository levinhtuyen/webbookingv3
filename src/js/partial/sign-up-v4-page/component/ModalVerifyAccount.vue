<template>
  <modal
    ref="modal-verify-account"
    :visible.sync="visible"
    class="modal-verify-account"
    :disableClickBackground="true"
  >
    <template slot="header">
      <div class="modal-verify-account__header">
      </div>
    </template>
    <template slot="body">
      <div class="modal-verify-account__body">
        <div class="verify-account-container">
          <p class="verify-account-container__title">
            {{ $t('sign_up.verify') }}
            <span class="verify-account-container__title--account"> {{ $t('sign_up.account') }}
            </span>
          </p>
          <p
            v-if="isLinkedAccount"
            class="verify-account-container__sub-title"
          >
            {{ $t('sign_up.not_linked_account')}}
          </p>
          <div class="verify-account-container__content">{{ $t('sign_up.description_verify_account') }} {{dataAccount.name}} {{ $t('sign_up.linked_to_g2j') }}
          </div>
          <div class="verify-account-container__info">
            <p v-for="(v,k) in dataLinkedAccount">{{v.relatedInformation}}</p>
          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="modal-verify-account__footer">
        <button
          class="verify-account-button"
          @click="onClickButton(v)"
          v-for="(v,k) in linkedAccount"
          :key="k"
        >

          <img
            :src="v.viaApp ==2?`${IMAGE_URL}/icon/account/fb_sign_in.svg`:v.viaApp ==3?`${IMAGE_URL}/icon/account/gg_sign_in.svg`:v.viaApp ==4? `${IMAGE_URL}/icon/account/apple_sign_in.svg` :''"
            width="30px"
            height="30px"
          />
          <p class="verify-account-button__title"> {{ $t('sign_up.continue_with') }} {{v.viaApp ==2? 'Facebook':v.viaApp ==3?'Google' :'Apple' }}</p>
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
  import {
    IMAGE_URL,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
  } from "~jsDefinePath/general";

  import { mapGetters, mapActions, mapState } from "~jsPath/lib/lib-manager";
  import { MODULE_NAME as PAGE_INFO_MODULE_NAME } from "~jsBasePath/vuex/modules/page-info-module";
  import { getLoginPath } from "~jsHelperPath/util/HandleUrl";
  import { ROUTER_NAME } from "~jsBasePath/vue-router/router-define";

  export default {
    props: {
      linkedAccount: [Array, Object],
      isLinkedAccount: Boolean,
    },
    components: {
      modal: () =>
        import("~jsPartialPath/global/component/modal/ModalComponent.vue"),
    },
    data() {
      return {
        IMAGE_URL,
        visible: false, //check show modal
      };
    },

    methods: {
      openModal() {
        this.visible = true; //key => hiện modal
      },
      closeModal() {
        this.visible = false; //key => ẩn modal
      },
      onSubmit() {
        // sync data roi tat
      },
      onChangeSearch() {},
      onClickButton(data) {
        if (data.viaApp == 2) {
          this.$emit("onFacebook");
        }
        if (data.viaApp == 3) {
          this.$emit("onGoogle");
        }
        // this.$router.replace({ name: ROUTER_NAME["login-page"] });
      },
    },
    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
      dataLinkedAccount() {
        return this.linkedAccount;
      },
      dataAccount() {
        let name = "";
        let viaApp = "";
        if (this.dataLinkedAccount && this.dataLinkedAccount.length == 1) {
          viaApp = this.dataLinkedAccount[0].viaApp;
          switch (viaApp) {
            case 2:
              return { name: "Facebook", viaApp };
              break;
            case 3:
              return { name: "Google", viaApp };
              break;
            case 4:
              return { name: "Apple", viaApp };
              break;
            default:
              return { name: "", viaApp };
              break;
          }
        }

        return { name, viaApp };
      },
    },
    created() {},
  };
</script>

