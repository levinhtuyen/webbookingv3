import { Vue} from '~jsLibPath/lib-manager';
import GoogleLogin from 'vue-google-login';

Vue.component("back-button", () => import('~jsPartialPath/global/component/back-button/BackButtonComponent.vue'));

Vue.component("g2j-image", () => import('~jsPartialPath/global/component/g2j-img/Go2JoyImages.vue'));
Vue.component("GoogleLogin", GoogleLogin);
Vue.component("g2j-toast",() => import("~jsPartialPath/global/component/g2j-toast/Go2JoyToast.vue"));
