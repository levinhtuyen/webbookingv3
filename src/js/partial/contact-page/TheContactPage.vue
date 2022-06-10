<template>
    <div class="contact-page">\
        <button @click="changeLocale('vi')">Viet Nam</button>
        <button @click="changeLocale('en')">English</button>
        <p class="contact-page__title">The contact page <span class="contact-page__title__span">{{ $t("message.hello") }}</span> : <span class="contact-page__title__span">{{ valueTimeNow }}</span></p>
    </div>
</template>

<script>
export default {

    name: 'TheContactPage',
    components: {
        relativeTime
    },
    data() {
        return {
            valueTime : '',
            now: new Date(),
            languages: [
                { flag: 'us', language: 'en', title: 'English' },
                { flag: 'vn', language: 'vi', title: 'Vietnamese' }
            ],
            flag: localStorage.getItem("lang") ? localStorage.getItem("lang") : 'vi',
        }
    },
    created () {
         this.scheduleUpdateNow();
         EventBus.emit('IS_SHOW_ROUTER_LOADING', false);
    },
    methods: {
        updateNow() {
            this.now = new Date()
            this.valueTime = dayjs(this.now).format('DD/MM/YYYY h:mm:ss A')
            this.scheduleUpdateNow()
        },
        scheduleUpdateNow() {
            setTimeout(this.updateNow, 1000);
        },
        changeLocale(locale) {
            this._i18n.locale = locale;
            localStorage.setItem("lang", locale);
            this.flag = locale;
        },
    },
    computed: {
        valueTimeNow() {
            return this.valueTime
        }
    },
}
</script>
<style src="./contact-page-style.css"></style>
