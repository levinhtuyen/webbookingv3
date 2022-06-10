<template>
    <div class="blog-list-page">
        <ArticleSection v-if="!query"></ArticleSection>
        <ListLandingSection v-if="query == 'landing'"></ListLandingSection>
    </div>
</template>

<script>
import ArticleSection from './component/ArticleSection.vue'
import ListLandingSection from './component/ListLandingSection.vue'
export default {
    name: "TheBlogListPage",
    components: {
        ArticleSection,
        ListLandingSection,
    },
    data () {
        return {
            query: this.$route.params.query
        }
    },
    created () {
        EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
    },
}
</script>

<style src="./blog-list-page-style.css"></style>
