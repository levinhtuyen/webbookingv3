<template>
    <div>
        <div class="comment-start">
            <div class="comment-start-standard">
                <div class="comment-start-standard__cicle" :class="color == 'orange' ? 'orange' : color == 'blue' ? 'blue' : color == 'primary' ? 'primary' : ''">
                    <span class="comment-start-standard__cicle--text">{{ color == 'orange' ? 'S' : color == 'blue' ? 'T' : color == 'primary' ? 'D' : ''}}</span>
                </div>
                <div class="comment-start-standard__title">
                    <span class="comment-start-standard__title--text">{{ color == 'orange' ? `${this.$t("comment.cleanliness")}` : color == 'blue' ? `${this.$t("comment.facilities")}` : color == 'primary' ? `${this.$t("comment.services")}` : ''}}</span>
                </div>
            </div>
            <div class="comment-start-detail">
                <div class="comment-start-detail__start1">
                    <div class="comment-start-detail__start1--start">
                        <i class="fas fa-star"></i>
                        <span class="number">{{ dataStart1.star1 }}</span>
                    </div>
                </div>
                <div class="comment-start-detail__start1">
                    <div class="comment-start-detail__start1--start">
                        <i class="fas fa-star"></i>
                        <span class="number">{{ dataStart1.star2 }}</span>
                    </div>
                </div>
                <div class="comment-start-detail__start1">
                    <div class="comment-start-detail__start1--start">
                        <i class="fas fa-star"></i>
                        <span class="number">{{ dataStart1.star3 }}</span>
                    </div>
                </div>
                <div class="comment-start-detail__start1">
                    <div class="comment-start-detail__start1--start">
                        <i class="fas fa-star"></i>
                        <span class="number">{{ dataStart1.star4 }}</span>
                    </div>
                </div>
                <div class="comment-start-detail__start1">
                    <div class="comment-start-detail__start1--start">
                        <i class="fas fa-star"></i>
                        <span class="number">{{ dataStart1.star5 }}</span>
                    </div>
                </div>
            </div>
            <div class="comment-start-number-total">
                <div class="comment-start-number-total__number" :class="color == 'orange' ? 'orange' : color == 'blue' ? 'blue' : color == 'primary' ? 'primary' : ''">
                    <span>{{ start}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        dataReview: [Object,Array],
        color: String,
        start:[String, Number]
    },
    name: "Commentstart",
    data () {
        return {
            getDataReview: null
        }
    },
    computed: {
        dataStart1() {
            return this.dataReview 
        },
    },
}
</script>