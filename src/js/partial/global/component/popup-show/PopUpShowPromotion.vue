<template>
<div id="modal-template">
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">

                    <div class="modal-header">
                        <slot name="header">
                            {{ $t("message.title_popup_promotion") }}
                        </slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body">
                            {{ $t("message.content_popup_promotion") }}
                        </slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                           {{ $t("message.footer_popup_promotion") }}
                           <div class="modal-footer__image">
                               <div class="modal-footer__image--image">
                                   <img src="http://go2joy.vn/images/GooglePlay-white.png" alt="">
                               </div>
                               <div class="modal-footer__image--image">
                                   <img src="http://go2joy.vn/images/appstore-white.png" alt="">
                               </div>
                               <div class="modal-footer__image--close">
                                    <button class="modal-default-button" @click="$emit('close')">
                                        {{ $t("message.close") }}
                                    </button>
                               </div>
                           </div>
                            
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</div>
</template>

<script>
export default {
    data() {
        return {
            showPopup: false
        }
    },
}
</script>

<style lang="scss" scoped>

</style>
