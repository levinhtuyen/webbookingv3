<template>
    <div>
        <div class="category-detail__section">
            <div class="category-detail__section__list">
                <el-progress :percentage="50"></el-progress>
                <el-progress :percentage="100" :format="format"></el-progress>
                <el-progress :percentage="100" status="success"></el-progress>
                <el-progress :percentage="100" status="warning"></el-progress>
                <el-progress :percentage="50" status="exception"></el-progress>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'CategoryDetail',
    data() {
        return {
        }
    },
    methods: {
        format(percentage) {
        return percentage === 100 ? 'Full' : `${percentage}%`;
        }
    }
}
</script>