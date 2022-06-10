<template>
    <div>
        <div class="comment-review">
            <div class="comment-review-name-user">{{ review.userNickName }}</div>
            <div class="comment-review-room">
                <div class="comment-review-room__name-room">
                    {{ review.roomTypeName }}
                </div>
                <div class="comment-review-room__name-review">
                    <div class="comment-review-room__name-review__name-review1">
                        <div class="align-item-comment">
                            <div class="comment-review-room__name-review__name-review1--orange">
                            <span class="orange-text">S</span>
                        </div>
                        </div>
                        <div class="comment-review-room__name-review__name-review1--text">
                            <span class="text-review-number">{{ formatComment(review.markClean) }}</span>
                        </div>
                    </div>
                    <div class="comment-review-room__name-review__name-review1">
                        <div class="align-item-comment">
                            <div class="comment-review-room__name-review__name-review1--blue">
                                <span class="blue-text">T</span>
                            </div>
                        </div>
                        <div class="comment-review-room__name-review__name-review1--text">
                            <span class="text-review-number">{{ formatComment(review.markFacility) }}</span>
                        </div>
                        
                    </div>
                    <div class="comment-review-room__name-review__name-review1">
                        <div class="align-item-comment">
                            <div class="comment-review-room__name-review__name-review1--primary">
                                <span class="primary-text">D</span>
                            </div>
                        </div>
                        <div class="comment-review-room__name-review__name-review1--text">
                            <span class="text-review-number">{{ formatComment(review.markService) }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="comment-review-review-user">
                <div class="comment-review-review-user__text">
                    {{ review.comment}}
                </div>
            </div>
            <div class="comment-review-like-date">
                <div class="comment-review-like-date__like-icon">
                    <i class="far fa-thumbs-up"></i> <span>{{ review.numOfLike }}</span>
                </div>
                <div class="comment-review-like-date__date">
                        <p>{{ review.createTime }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        review: [Object,Array],
    },
    data () {
        return {}
    },
    methods: {
        formatComment(value){
            switch(value) {
                case 1:
                return `${this.$t("comment.very_bad")}`
                case 2:
                return `${this.$t("comment.bad")}`
                case 3:
                return `${this.$t("comment.normal")}`
                case 4:
                return `${this.$t("comment.good")}`
                case 5:
                return `${this.$t("comment.excellent")}`
                default: return "";
            }
        }
    },
}
</script>

<style lang="scss" scoped>

</style>