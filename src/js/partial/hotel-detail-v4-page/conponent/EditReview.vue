<template>
  <div class="edit-review">
    <div class="edit-review__rating">
      <div class="reviews__map--flex">
        <div class="block">
          <span class="cleanliness">{{ $t('hotel_detail.detail_v4.review_c') }}</span>
          <span>{{ $t('hotel_detail.detail_v4.cleanliness') }}</span>
        </div>
        <div class="rating">
          <Star :rattingStart="form.cleanliness" @apply="applyCleanliness" />
        </div>
      </div>

      <div class="reviews__map--flex">
        <div class="block">
          <span class="facilities">{{ $t('hotel_detail.detail_v4.review_f') }}</span>
          <span>{{ $t('hotel_detail.detail_v4.facilities') }}</span>
        </div>
        <div class="rating">
          <Star :rattingStart="form.facilities" @apply="applyFacilities" />
        </div>
      </div>

      <div class="reviews__map--flex">
        <div class="block">
          <span class="services">{{ $t('hotel_detail.detail_v4.review_s') }}</span>
          <span>{{ $t('hotel_detail.detail_v4.services') }}</span>
        </div>
        <div class="rating">
          <Star :rattingStart="form.services" @apply="applyServices" />
        </div>
      </div>
    </div>

    <div class="border-bottom"></div>

    <div class="edit-review__message">
      <h2>{{ basicInfo.roomTypeName }}</h2>
      <textarea 
        class="w-100 text-area" 
        rows="8" 
        cols="50" 
        v-model="form.comment"
        maxlength="1000"
      ></textarea>

      <p class="count-text">{{ charactersCount }}</p>
    </div>

    <div v-if="getErrrors">
      <p v-for="(error, index) in getErrrors" :key="index" class="error-modal">{{ error.message }}</p>
    </div>

    <div class="edit-review__button">
      <button type="submit" :disabled="ui.submitting" @click="submit">{{ $t('hotel_detail.detail_v4.update') }}</button>
    </div>
  </div>
</template>

<script>
import Star from './Star.vue'
import {
  _,
} from "~jsLibPath/lib-manager";
import { apiCaller } from '~jsHelperPath/service/ApiHandler';
import { AJAX_URL } from '~jsDefinePath/ajax-url';
import { getToken } from "~jsDefinePath/general";

export default {
  components: {
    Star
  },

  props: {
    basicInfo: [Array, Object]
  },

  data() {
    return {
      form: {
        comment: this.basicInfo.comment ? this.basicInfo.comment : '',
        cleanliness: this.basicInfo.markClean,
        facilities: this.basicInfo.markFacility,
        services: this.basicInfo.markService,
      },
      ui: {
        submitting: false
      },
      errorList: []
    }
  },

  computed: {
    charactersCount() {
      var char = this.form.comment.length,
          limit = 1000;
      return (limit - char) + "/" + limit;
    },
    getErrrors:function() {
      return this.errorList
    }
  },
  methods: {
    applyCleanliness(value) {
      this.form.cleanliness = value;
    }, // applyCleanliness
    
    applyFacilities(value) {
      this.form.facilities = value;
    }, // applyFacilities

    applyServices(value) {
      this.form.services = value;
    }, // applyServices

    submit() {
      const self = this;
      this.ui.submitting = true;
        apiCaller({
            metaUrl: AJAX_URL.hotel_v4.updateReview,
            data: {
              sn            : this.basicInfo.sn,
              comment       : this.form.comment,
              markFacility  : this.form.facilities,
              markClean     : this.form.cleanliness,
              markService   : this.form.services
            },
            method: 'POST',
            headers: {
                Authorization: getToken(),
            },
            dataType: 'json',
            error(err) {
                self.errorList = err.response?.data.error || []
            },
            success(objResponse) {
            if(
                _.isEmpty(objResponse) ||
                objResponse.error
            ) {
                self.errorList = objResponse.error;
                return;
            }

            self.$emit("reviewList");
            },
            complete() {
                self.ui.submitting = false;
            },
        });
    } // submit
  }
}
</script>