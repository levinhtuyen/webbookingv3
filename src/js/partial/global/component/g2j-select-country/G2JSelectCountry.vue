<template>
  <modal
    ref="g2j-select-country"
    :visible.sync="visible"
    class="g2j-select-country"
  >
    <template slot="header">
      <div class="g2j-select-country__header">
        <!-- this is header -->
        Select a Country
      </div>
    </template>
    <template slot="body">
      <div class="g2j-select-country__body">
        <div class="select-country-input">

          <input
            type="text"
            :placeholder="'Search for your country'"
            v-model="countryInput"
            @input="onChangeSearch()"
          >
          <div>
            <img
              :src="`${IMAGE_URL}/svg/search.svg`"
              alt=""
            >
          </div>
        </div>

        <div
          v-if="selectedCountry"
          class="item-selected-country"
        >
          <div class="flat">
            <img
              :src="`${IMAGE_URL}/static/area/${selectedCountry.img}.png`"
              alt=""
              class="img-flat"
            >
          </div>
          <div class="item"> {{selectedCountry.name}}</div>
          <div class="icon">
            <i
              class="fa fa-check"
              style=""
            ></i>
          </div>
        </div>

        <div class="select-country--container-list">
          <div
            v-for="(value,index) in listData"
            :key="index"
            class=""
          >
            <div>
              <span
                class="text-letter"
                style=""
              > {{index}}</span>
              <div
                v-for="(v, k) in value"
                class="item"
                :key="k"
                @click="code = v.id, check = v.code"
                :class="check ==v.code?'selected':''"
              >
                <div
                  v-if="v.img"
                  class="flat"
                >
                  <img
                    :src="(`${IMAGE_URL}/static/area/${v.img}.png`)"
                    alt="img-flat"
                    class="img-flat"
                  >
                </div>
                <div class="name">
                  {{v.name}}
                </div>
                <div
                  v-if="v.code==check"
                  class="icon"
                >
                  <i class="fa fa-check"></i>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="g2j-select-country__footer">
        <button
          @click="onSubmit()"
          class="g2j-button-book-now"
        >{{$t('common.confirm')}}</button>
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

  export default {
    props: {
      codeCountry: [String, Number],
    },
    components: {
      modal: () =>
        import("~jsPartialPath/global/component/modal/ModalComponent.vue"),
    },
    data() {
      return {
        IMAGE_URL,
        visible: false, //check show modal
        countryInput: null,
        check: null,
        code: 84,
        listCountry: [
          { name: "Afghanistan", code: "AF", id: 93, img: "flag_af" },
          { name: "Land Islands", code: "AX", id: 358, img: "flag_ax" },
          { name: "Albania", code: "AL", id: 355, img: "flag_al" },
          { name: "Algeria", code: "DZ", id: 213, img: "flag_dz" },
          { name: "American Samoa", code: "AS", id: 1, img: "flag_as" },
          { name: "AndorrA", code: "AD", id: 376, img: "flag_ad" },
          { name: "Angola", code: "AO", id: 244, img: "flag_ao" },
          { name: "Anguilla", code: "AI", id: 1, img: "flag_ai" },
          { name: "Antarctica", code: "AQ", id: 672, img: "flag_aq" },
          { name: "Antigua and Barbuda", code: "AG", id: 1, img: "flag_ag" },
          { name: "Argentina", code: "AR", id: 54, img: "flag_ar" },
          { name: "Armenia", code: "AM", id: 374, img: "flag_am" },
          { name: "Aruba", code: "AW", id: 297, img: "flag_aw" },
          { name: "Australia", code: "AU", id: 61, img: "flag_au" },
          { name: "Austria", code: "AT", id: 43, img: "flag_at" },
          { name: "Azerbaijan", code: "AZ", id: 994, img: "flag_az" },
          { name: "Bahamas", code: "BS", id: 1, img: "flag_bs" },
          { name: "Bahrain", code: "BH", id: 973, img: "flag_bh" },
          { name: "Bangladesh", code: "BD", id: 880, img: "flag_bd" },
          { name: "Barbados", code: "BB", id: 1, img: "flag_bb" },
          { name: "Belarus", code: "BY", id: 375, img: "flag_by" },
          { name: "Belgium", code: "BE", id: 32, img: "flag_be" },
          { name: "Belize", code: "BZ", id: 501, img: "flag_bz" },
          { name: "Benin", code: "BJ", id: 229, img: "flag_bj" },
          { name: "Bermuda", code: "BM", id: 1, img: "flag_bm" },
          { name: "Bhutan", code: "BT", id: 975, img: "flag_bt" },
          { name: "Bolivia", code: "BO", id: 591, img: "flag_bo" },
          { name: "Bosnia and Herzegovina", code: "BA", id: 387, img: "flag_ba" },
          { name: "Botswana", code: "BW", id: 267, img: "flag_bw" },
          // { "name": "Bouvet Island", "code": "BV" },
          { name: "Brazil", code: "BR", id: 55, img: "flag_br" },
          {
            name: "British Indian Ocean Territory",
            code: "IO",
            id: 246,
            img: "flag_io",
          },
          { name: "Brunei Darussalam", code: "BN", id: 673, img: "flag_bn" },
          { name: "Bulgaria", code: "BG", id: 359, img: "flag_bg" },
          { name: "Burkina Faso", code: "BF", id: 226, img: "flag_bf" },
          { name: "Burundi", code: "BI", id: 257, img: "flag_bi" },
          { name: "Saint Barthelemy", code: "BL", id: 590, img: "flag_bl" },
          // { "name": "Caribbean Netherlands", "code": "BQ", "id": 599, "img": "flag_bq" },
          { name: "Saint Martin", code: "MF", id: 1, img: "flag_mf" },

          { name: "Cambodia", code: "KH", id: 855, img: "flag_kh" },
          { name: "Cameroon", code: "CM", id: 237, img: "flag_cm" },
          { name: "Canada", code: "CA", id: 1, img: "flag_ca" },
          { name: "Cape Verde", code: "CV", id: 238, img: "flag_cv" },
          { name: "Cayman Islands", code: "KY", id: 1, img: "flag_ky" },
          {
            name: "Central African Republic",
            code: "CF",
            id: 236,
            img: "flag_cf",
          },
          // { "name": "Chad", "code": "TD" },
          // { "name": "Curacao", "code": "CW", "id": 599, "img": "flag_cao" }, can test
          { name: "Chile", code: "CL", id: 56, img: "flag_cl" },
          { name: "China", code: "CN", id: 86, img: "flag_cn" },
          { name: "Christmas Island", code: "CX", id: 61, img: "flag_cx" },
          { name: "Cocos (Keeling) Islands", code: "CC", id: 61, img: "flag_cc" },
          { name: "Colombia", code: "CO", id: 57, img: "flag_co" },
          { name: "Comoros", code: "KM", id: 269, img: "flag_km" },
          // { "name": "Congo", "code": "CG" },
          {
            name: "Congo, The Democratic Republic of the",
            code: "CD",
            id: 243,
            img: "flag_cd",
          },
          { name: "Cook Islands", code: "CK", id: 682, img: "flag_ck" },
          { name: "Costa Rica", code: "CR", id: 506, img: "flag_cr" },
          // { "name": "Cote D\"Ivoire", "code": "CI" },
          { name: "Croatia", code: "HR", id: 385, img: "flag_hr" },
          { name: "Cuba", code: "CU", id: 53, img: "flag_cu" },
          { name: "Cyprus", code: "CY", id: 357, img: "flag_cy" },
          { name: "Czech Republic", code: "CZ", id: 420, img: "flag_cz" },
          { name: "Denmark", code: "DK", id: 45, img: "flag_dk" },
          { name: "Djibouti", code: "DJ", id: 253, img: "flag_dj" },
          { name: "Dominica", code: "DM", id: 1, img: "flag_dm" },
          { name: "Dominican Republic", code: "DO", id: 1, img: "flag_do" },
          { name: "Ecuador", code: "EC", id: 593, img: "flag_ec" },
          { name: "Egypt", code: "EG", id: 20, img: "flag_eg" },
          { name: "El Salvador", code: "SV", id: 503, img: "flag_sv" },
          { name: "Equatorial Guinea", code: "GQ", id: 240, img: "flag_gq" },
          { name: "Eritrea", code: "ER", id: 291, img: "flag_er" },
          { name: "Estonia", code: "EE", id: 372, img: "flag_ee" },
          { name: "Ethiopia", code: "ET", id: 251, img: "flag_et" },
          {
            name: "Falkland Islands (Malvinas)",
            code: "FK",
            id: 500,
            img: "flag_fk",
          },
          { name: "Faroe Islands", code: "FO", id: 298, img: "flag_fo" },
          { name: "Fiji", code: "FJ", id: 679, img: "flag_fj" },
          { name: "Finland", code: "FI", id: "358", img: "flag_fi" },
          { name: "France", code: "FR", id: 33, img: "flag_fr" },
          { name: "French Guiana", code: "GF", id: 594, img: "flag_gf" },
          { name: "French Polynesia", code: "PF", id: 689, img: "flag_pf" },
          // { "name": "French Southern Territories", "code": "TF" },
          { name: "Gabon", code: "GA", id: 241, img: "flag_ga" },
          { name: "Gambia", code: "GM", id: 220, img: "flag_gm" },
          { name: "Georgia", code: "GE", id: 995, img: "flag_ge" },
          { name: "Germany", code: "DE", id: 49, img: "flag_de" },
          { name: "Ghana", code: "GH", id: 233, img: "flag_gh" },
          { name: "Gibraltar", code: "GI", id: 350, img: "flag_gi" },
          { name: "Greece", code: "GR", id: 30, img: "flag_gr" },
          { name: "Greenland", code: "GL", id: 299, img: "flag_gl" },
          { name: "Grenada", code: "GD", id: 1, img: "flag_gd" },
          { name: "Guadeloupe", code: "GP", id: 590, img: "flag_gp" },
          { name: "Guam", code: "GU", id: 1, img: "flag_gu" },
          { name: "Guatemala", code: "GT", id: 502, img: "flag_gt" },
          { name: "Guernsey", code: "GG", id: 44, img: "flag_gg" },
          { name: "Guinea", code: "GN", id: 224, img: "flag_gn" },
          { name: "Guinea-Bissau", code: "GW", id: 245, img: "flag_gw" },
          { name: "Guyana", code: "GY", id: 592, img: "flag_gy" },
          { name: "Haiti", code: "HT", id: 509, img: "flag_ht" },
          // { "name": "Heard Island and Mcdonald Islands", "code": "HM" },
          // { "name": "Vatican", "code": "VA", "id": 39, "img": "flag_va" },
          { name: "Honduras", code: "HN", id: 504, img: "flag_hn" },
          { name: "Hong Kong", code: "HK", id: 852, img: "flag_hk" },
          { name: "Hungary", code: "HU", id: 36, img: "flag_hu" },
          { name: "Ivory Coast", code: "CI", id: 225, img: "flag_ci" },

          { name: "Iceland", code: "IS", id: 354, img: "flag_is" },
          { name: "India", code: "IN", id: 91, img: "flag_in" },
          { name: "Indonesia", code: "ID", id: 62, img: "flag_id" },
          {
            name: "Iran, Islamic Republic Of",
            code: "IR",
            id: 98,
            img: "flag_ir",
          },
          { name: "Iraq", code: "IQ", id: 964, img: "flag_iq" },
          // { "name": "Ireland", "code": "IE" },
          { name: "Isle of Man", code: "IM", id: 44, img: "flag_im" },
          { name: "Israel", code: "IL", id: 972, img: "flag_il" },
          { name: "Italy", code: "IT", id: 39, img: "flag_it" },
          { name: "Jamaica", code: "JM", id: 1, img: "flag_jm" },
          { name: "Japan", code: "JP", id: 81, img: "flag_jp" },
          { name: "Jersey", code: "JE", id: 44, img: "flag_je" },
          { name: "Jordan", code: "JO", id: 962, img: "flag_jo" },
          { name: "Kazakhstan", code: "KZ", id: 7, img: "flag_kz" },
          { name: "Kenya", code: "KE", id: 254, img: "flag_ke" },
          { name: "Kiribati", code: "KI", id: 686, img: "flag_ki" },
          { name: "Laos", code: "LA", id: 856, img: "flag_la" },

          // { "name": "Korea, Democratic People\"S Republic of", "code": "KP" },
          // { "name": "Korea, Republic of", "code": "KR" },
          { name: "Kuwait", code: "KW", id: 965, img: "flag_kw" },
          { name: "Kyrgyzstan", code: "KG", id: 996, img: "flag_kg" },
          // { "name": "Lao People\"S Democratic Republic", "code": "LA" },
          { name: "Latvia", code: "LV", id: 371, img: "flag_lv" },
          { name: "Lebanon", code: "LB", id: 961, img: "flag_lb" },
          { name: "Lesotho", code: "LS", id: 266, img: "flag_ls" },
          { name: "Liberia", code: "LR", id: 231, img: "flag_lr" },
          { name: "Libyan Arab Jamahiriya", code: "LY", id: 218, img: "flag_ly" },
          // { "name": "Liechtenstein", "code": "LI", "id": 423, "code": "flag_li" }, can test
          { name: "Lithuania", code: "LT", id: 370, img: "flag_lt" },
          { name: "Luxembourg", code: "LU", id: 352, img: "flag_lu" },
          // { "name": "Macao", "code": "MO" },
          { name: "Macedonia", code: "MK", id: 389, img: "flag_mk" },
          { name: "Madagascar", code: "MG", id: 261, img: "flag_mg" },
          { name: "Malawi", code: "MW", id: 265, img: "flag_mw" },
          { name: "Malaysia", code: "MY", id: 60, img: "flag_my" },
          { name: "Maldives", code: "MV", id: 960, img: "flag_mv" },
          { name: "Mali", code: "ML", id: 223, img: "flag_ml" },
          { name: "Malta", code: "MT", id: 356, img: "flag_mt" },
          { name: "Marshall Islands", code: "MH", id: 692, img: "flag_mh" },
          { name: "Martinique", code: "MQ", id: 596, img: "flag_mq" },
          { name: "Mauritania", code: "MR", id: 222, img: "flag_mr" },
          { name: "Mauritius", code: "MU", id: 230, img: "flag_mu" },
          { name: "Mayotte", code: "YT", id: 262, img: "flag_yt" },
          { name: "Mexico", code: "MX", id: 52, img: "flag_mx" },
          {
            name: "Micronesia, Federated States of",
            code: "FM",
            id: 691,
            img: "flag_fm",
          },
          { name: "Moldova, Republic of", code: "MD", id: 373, img: "flag_md" },
          { name: "Monaco", code: "MC", id: 377, img: "flag_mc" },
          { name: "Mongolia", code: "MN", id: 976, img: "flag_mn" },
          { name: "Montenegro", code: "ME", id: 382, img: "flag_me" },
          { name: "Macau", code: "MO", id: 853, img: "flag_mo" },

          { name: "Montserrat", code: "MS", id: 1, img: "flag_ms" },
          { name: "Morocco", code: "MA", id: 212, img: "flag_ma" },
          { name: "Mozambique", code: "MZ", id: 258, img: "flag_mz" },
          { name: "Myanmar", code: "MM", id: 95, img: "flag_mm" },
          { name: "Namibia", code: "NA", id: 264, img: "flag_na" },
          { name: "Nauru", code: "NR", id: 674, img: "flag_nr" },
          { name: "Nepal", code: "NP", id: 977, img: "flag_np" },
          { name: "Netherlands", code: "NL", id: 31, img: "flag_nl" },
          { name: "Netherlands Antilles", code: "AN", id: 599, img: "flag_an" },
          { name: "New Caledonia", code: "NC", id: 687, img: "flag_nc" },
          { name: "New Zealand", code: "NZ", id: 64, img: "flag_nz" },
          { name: "Nicaragua", code: "NI", id: 505, img: "flag_ni" },
          { name: "Niger", code: "NE", id: 227, img: "flag_ne" },
          { name: "Nigeria", code: "NG", id: 234, img: "flag_ng" },
          { name: "Niue", code: "NU", id: 683, img: "flag_nu" },
          { name: "Norfolk Island", code: "NF", id: 672, img: "flag_nf" },
          { name: "Northern Mariana Islands", code: "MP", id: 1, img: "flag_mp" },
          { name: "Norway", code: "NO", id: 47, img: "flag_no" },
          { name: "Oman", code: "OM", id: 968, img: "flag_om" },
          { name: "Pakistan", code: "PK", id: 92, img: "flag_pk" },
          { name: "Palau", code: "PW", id: 680, img: "flag_pw" },
          { name: "Palestine", code: "PS", id: 970, img: "flag_ps" },
          { name: "Panama", code: "PA", id: 507, img: "flag_pa" },
          { name: "Papua New Guinea", code: "PG", id: 675, img: "flag_pg" },
          { name: "Paraguay", code: "PY", id: 595, img: "flag_py" },
          { name: "Peru", code: "PE", id: 51, img: "flag_pe" },
          { name: "Philippines", code: "PH", id: 63, img: "flag_ph" },
          { name: "Pitcairn Islands", code: "PN", id: 870, img: "flag_pn" },
          { name: "Poland", code: "PL", id: 48, img: "flag_pl" },
          { name: "Kosovo", code: "XK", id: 381, img: "flag_xk" },

          { name: "Portugal", code: "PT", id: 351, img: "flag_pt" },
          { name: "Puerto Rico", code: "PR", id: 1, img: "flag_pr" },
          { name: "Qatar", code: "QA", id: 974, img: "flag_qa" },
          { name: "Reunion", code: "RE", id: 262, img: "flag_re" },
          { name: "Romania", code: "RO", id: 40, img: "flag_ro" },
          { name: "Russian ", code: "RU", id: 7, img: "flag_ru" },
          { name: "Republic of the Congo", code: "CG", id: 242, img: "flag_cg" },
          { name: "North Korea", code: "KP", id: 850, img: "flag_kp" },
          { name: "South Korea", code: "KR", id: 82, img: "flag_kr" },
          { name: "RWANDA", code: "RW", id: 250, img: "flag_rw" },
          { name: "Saint Helena", code: "SH", id: 290, img: "flag_sh" },
          { name: "Saint Kitts and Nevis", code: "KN", id: 1, img: "flag_kn" },
          { name: "Saint Lucia", code: "LC", id: 1, img: "flag_lc" },
          {
            name: "Saint Pierre and Miquelon",
            code: "PM",
            id: 508,
            img: "flag_pm",
          },
          {
            name: "Saint Vincent and the Grenadines",
            code: "VC",
            id: 1,
            img: "flag_vc",
          },
          { name: "Samoa", code: "WS", id: 685, img: "flag_ws" },
          { name: "Sint Maarten", code: "SX", id: 1, img: "flag_sx" },
          { name: "San Marino", code: "SM", id: 378, img: "flag_sm" },
          { name: "Sao Tome and Principe", code: "ST", id: 239, img: "flag_st" },
          { name: "Saudi Arabia", code: "SA", id: 966, img: "flag_sa" },
          { name: "Senegal", code: "SN", id: 221, img: "flag_sn" },
          { name: "Serbia", code: "RS", id: 381, img: "flag_rs" },
          // { "name": "Seychelles", "code": "SC" },
          { name: "Sierra Leone", code: "SL", id: 232, img: "flag_sl" },
          { name: "Singapore", code: "SG", id: 65, img: "flag_sg" },
          { name: "Slovakia", code: "SK", id: 421, img: "flag_sk" },
          { name: "Slovenia", code: "SI", id: 386, img: "flag_si" },
          { name: "Solomon Islands", code: "SB", id: 248, img: "flag_sc" },
          { name: "Somalia", code: "SO", id: 252, img: "flag_so" },
          { name: "South Africa", code: "ZA", id: 27, img: "flag_za" },
          // { "name": "South Georgia and the South Sandwich Islands", "code": "GS" },
          { name: "Spain", code: "ES", id: 34, img: "flag_es" },
          { name: "Sri Lanka", code: "LK", id: 94, img: "flag_lk" },
          { name: "Sudan", code: "SD", id: 249, img: "flag_sd" },
          { name: "Suriname", code: "SR", id: 597, img: "flag_sr" },
          { name: "Svalbard and Jan Mayen", code: "SJ", id: 47, img: "flag_sj" },
          { name: "Swaziland", code: "SZ", id: 268, img: "flag_sz" },
          { name: "Sweden", code: "SE", id: 46, img: "flag_se" },
          { name: "Switzerland", code: "CH", id: 41, img: "flag_ch" },
          { name: "South Sudan", code: "SS", id: 211, img: "flag_ss" },
          { name: "Syrian Arab Republic", code: "SY", id: 963, img: "flag_sy" },
          { name: "Taiwan", code: "TW", id: 886, img: "flag_tw" },
          { name: "Tajikistan", code: "TJ", id: 992, img: "flag_tj" },
          { name: "Tanzania", code: "TZ", id: 255, img: "flag_tz" },
          { name: "Thailand", code: "TH", id: 66, img: "flag_th" },
          { name: "East Timor", code: "TL", id: 670, img: "flag_tl" },
          { name: "Togo", code: "TG", id: 228, img: "flag_tg" },
          { name: "Tokelau", code: "TK", id: 690, img: "flag_tk" },
          { name: "Tonga", code: "TO", id: 676, img: "flag_to" },
          { name: "Trinidad and Tobago", code: "TT", id: 1, img: "flag_tt" },
          { name: "Tunisia", code: "TN", id: 216, img: "flag_tn" },
          { name: "Turkey", code: "TR", id: 90, img: "flag_tr" },
          { name: "Turkmenistan", code: "TM", id: 993, img: "flag_tm" },
          { name: "Turks and Caicos Islands", code: "TC", id: 1, img: "flag_tc" },
          { name: "Tchad", code: "TD", id: 235, img: "flag_td" },

          { name: "Tuvalu", code: "TV", id: 688, img: "flag_tv" },
          { name: "Uganda", code: "UG", id: 256, img: "flag_ug" },
          { name: "Ukraine", code: "UA", id: 380, img: "flag_ua" },
          { name: "United Arab Emirates", code: "AE", id: 971, img: "flag_ae" },
          { name: "United Kingdom", code: "GB", id: 44, img: "flag_gb" },
          { name: "United States", code: "US", id: 1, img: "flag_us" },
          // { "name": "United States Minor Outlying Islands", "code": "UM" },
          {
            name: "United States Virgin Islands",
            code: "VI",
            id: 1,
            img: "flag_vi",
          },
          { name: "Uruguay", code: "UY", id: 598, img: "flag_uy" },
          { name: "Uzbekistan", code: "UZ", id: 998, img: "flag_uz" },
          { name: "Vanuatu", code: "VU", id: 678, img: "flag_vu" },
          { name: "Venezuela", code: "VE", id: 58, img: "flag_ve" },
          { name: "Viet Nam", code: "VN", id: 84, img: "flag_vn" },
          { name: "British Virgin Islands", code: "VG", id: 1, img: "flag_vg" },
          { name: "Wallis and Futuna", code: "WF", id: 681, img: "flag_wf" },
          { name: "Western Sahara", code: "EH", id: 212, img: "flag_eh" },
          { name: "Yemen", code: "YE", id: 967, img: "flag_ye" },
          { name: "Zambia", code: "ZM", id: 260, img: "flag_zm" },
          { name: "Zimbabwe", code: "ZW", id: 263, img: "flag_zw" },
        ],
        listDefault: [],
        listAlphabet: [],
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
        this.$emit("changeCodeCountry", this.code);
        this.$emit("dataCountry", this.selectedCountry);
        this.closeModal();
      },
      onChangeSearch() {
        let search = this.listDefault;
        // this.check = null
        this.listCountry = search.filter(
          (c) =>
            c.name.toLowerCase().includes(this.countryInput.toLowerCase()) ===
            true
        );
      },
    },
    computed: {
      ...mapState(PAGE_INFO_MODULE_NAME, {
        language: "language",
      }),
      listData() {
        let arr = this.listCountry.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
        let group = arr.reduce((acc, cur) => {
          if (acc.hasOwnProperty(cur.name.charAt(0))) {
            acc[cur.name.charAt(0)].push(cur);
          } else {
            acc[cur.name.charAt(0)] = [cur];
          }
          return acc;
        }, {});
        return group;
      },
      selectedCountry() {
        return this.listCountry.find((el) => el.id == this.code);
      },
    },
    created() {
      this.listDefault = [...this.listCountry];
    },
    mounted() {
      this.check = this.selectedCountry.code;
    },
  };
</script>

