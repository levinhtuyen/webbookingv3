<template>
  <div>
    <div class="section-flags">
      <div class="blog-flags">
        <div class="blog-flags-select">
          <el-select
            placeholder=""
            filterable
            v-model="value"
            remote
            reserve-keyword
            :remote-method="remoteMethod"
            @visible-change="visibleChange"
            @change="getCodeCountryChoose(value)"
          >
            <template slot="prefix">
              <div class="blog-flags-select__image-choose">
                <img
                  class="prefix"
                  :src="(`${IMAGE_URL}/static/area/${value.urlImg}.png`)"
                >
                <span>&nbsp;(+{{ value.keyCode }})</span>
              </div>
            </template>
            <template slot="empty">
              <div class="empty-container">
                No data
              </div>
            </template>
            <el-option
              v-for="item in options"
              :key="item.name"
              :value="item"
              size="small"
              class="blog-flags-select__flags-option"
            >
              <span class="blog-flags-select__flags-option--image">
                <img :src="(`${IMAGE_URL}/static/area/${item.urlImg}.png`)">
              </span>
              <span class="blog-flags-select__flags-option--number">&nbsp;{{ item.name }}&nbsp;(+{{ item.keyCode }})</span>
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    IMAGE_URL,
    IS_MOBILE,
    CACHE_VERSION,
    ASSETS_SERVICE_URL,
  } from "~jsDefinePath/general";
  export default {
    props: {
      codeCountry: [String, Number],
    },
    data() {
      return {
        IMAGE_URL,
        dataArea: [
          "Andorra,376,AD,flag_ad",
          "United Arab Emirates,971,AE,flag_ae",
          "Afghanistan,93,AF,flag_af",
          "Antigua and Barbuda,1,AG,flag_ag",
          "Anguilla,1,AI,flag_ai",
          "Albania,355,AL,flag_al",
          "Armenia,374,AM,flag_am",
          "Netherlands Antilles,599,AN,flag_an",
          "Angola,244,AO,flag_ao",
          "Antarctica,672,AQ,flag_aq",
          "Argentina,54,AR,flag_ar",
          "American Samoa,1,AS,flag_as",
          "Austria,43,AT,flag_at",
          "Australia,61,AU,flag_au",
          "Aruba,297,AW,flag_aw",
          "Åland Islands,358,AX,flag_ax",
          "Azerbaijan,994,AZ,flag_az",
          "Bosnia and Herzegovina,387,BA,flag_ba",
          "Barbados,1,BB,flag_bb",
          "Bangladesh,880,BD,flag_bd",
          "Belgium,32,BE,flag_be",
          "Burkina Faso,226,BF,flag_bf",
          "Bulgaria,359,BG,flag_bg",
          "Bahrain,973,BH,flag_bh",
          "Burundi,257,BI,flag_bi",
          "Benin,229,BJ,flag_bj",
          "Saint Barthelemy,590,BL,flag_bl",
          "Bermuda,1,BM,flag_bm",
          "Brunei,673,BN,flag_bn",
          "Bolivia,591,BO,flag_bo",
          // "Caribbean Netherlands,599,BQ,flag_bq",
          "Brazil,55,BR,flag_br",
          "Bahamas,1,BS,flag_bs",
          "Bhutan,975,BT,flag_bt",
          "Botswana,267,BW,flag_bw",
          "Belarus,375,BY,flag_by",
          "Belize,501,BZ,flag_bz",
          "Canada,1,CA,flag_ca",
          "Cocos (Keeling) Islands,61,CC,flag_cc",
          "Democratic Republic of Congo,243,CD,flag_cd",
          "Central African Republic,236,CF,flag_cf",
          "Republic of the Congo,242,CG,flag_cg",
          "Switzerland,41,CH,flag_ch",
          "Ivory Coast,225,CI,flag_ci",
          "Cook Islands,682,CK,flag_ck",
          "Chile,56,CL,flag_cl",
          "Cameroon,237,CM,flag_cm",
          "China,86,CN,flag_cn",
          "Colombia,57,CO,flag_co",
          "Costa Rica,506,CR,flag_cr",
          "Cuba,53,CU,flag_cu",
          "Cape Verde,238,CV,flag_cv",
          "Christmas Island,61,CX,flag_cx",
          // "Curacao,599,CW,flag_cao",
          "Cyprus,357,CY,flag_cy",
          "Czech Republic,420,CZ,flag_cz",
          "Germany,49,DE,flag_de",
          "Djibouti,253,DJ,flag_dj",
          "Denmark,45,DK,flag_dk",
          "Dominica,1,DM,flag_dm",
          "Dominican Republic,1,DO,flag_do",
          "Algeria,213,DZ,flag_dz",
          "Ecuador,593,EC,flag_ec",
          "Estonia,372,EE,flag_ee",
          "Egypt,20,EG,flag_eg",
          "Western Sahara,212,EH,flag_eh",
          "Eritrea,291,ER,flag_er",
          "Spain,34,ES,flag_es",
          "Ethiopia,251,ET,flag_et",
          "Finland,358,FI,flag_fi",
          "Fiji,679,FJ,flag_fj",
          "Falkland Islands,500,FK,flag_fk",
          "Micronesia,691,FM,flag_fm",
          "Faroe Islands,298,FO,flag_fo",
          "France,33,FR,flag_fr",
          "Gabon,241,GA,flag_ga",
          "United Kingdom,44,GB,flag_gb",
          "Grenada,1,GD,flag_gd",
          "Georgia,995,GE,flag_ge",
          "French Guiana,594,GF,flag_gf",
          "Guernsey,44,GG,flag_gg",
          "Ghana,233,GH,flag_gh",
          "Gibraltar,350,GI,flag_gi",
          "Greenland,299,GL,flag_gl",
          "Gambia,220,GM,flag_gm",
          "Guinea,224,GN,flag_gn",
          "Guadeloupe,590,GP,flag_gp",
          "Equatorial Guinea,240,GQ,flag_gq",
          "Greece,30,GR,flag_gr",
          "Guatemala,502,GT,flag_gt",
          "Guam,1,GU,flag_gu",
          "Guinea-Bissau,245,GW,flag_gw",
          "Guyana,592,GY,flag_gy",
          "Hong Kong,852,HK,flag_hk",
          "Honduras,504,HN,flag_hn",
          "Croatia,385,HR,flag_hr",
          "Haiti,509,HT,flag_ht",
          "Hungary,36,HU,flag_hu",
          "Indonesia,62,ID,flag_id",
          "Ireland,353,IE,flag_ie",
          "British Indian Ocean Territory,246,IO,flag_io",
          "Israel,972,IL,flag_il",
          "Isle of Man,44,IM,flag_im",
          "India,91,IN,flag_in",
          "Iraq,964,IQ,flag_iq",
          "Iran,98,IR,flag_ir",
          "Iceland,354,IS,flag_is",
          "Italy,39,IT,flag_it",
          "Jersey,44,JE,flag_je",
          "Jamaica,1,JM,flag_jm",
          "Jordan,962,JO,flag_jo",
          "Japan,81,JP,flag_jp",
          "Kenya,254,KE,flag_ke",
          "Kyrgyzstan,996,KG,flag_kg",
          "Cambodia,855,KH,flag_kh",
          "Kiribati,686,KI,flag_ki",
          "Comoros,269,KM,flag_km",
          "Saint Kitts and Nevis,1,KN,flag_kn",
          "North Korea,850,KP,flag_kp",
          "South Korea,82,KR,flag_kr",
          "Kuwait,965,KW,flag_kw",
          "Cayman Islands,1,KY,flag_ky",
          "Kazakhstan,7,KZ,flag_kz",
          "Laos,856,LA,flag_la",
          "Lebanon,961,LB,flag_lb",
          "Saint Lucia,1,LC,flag_lc",
          "Liechtenstein,423,LI,flag_li",
          "Sri Lanka,94,LK,flag_lk",
          "Liberia,231,LR,flag_lr",
          "Lesotho,266,LS,flag_ls",
          "Lithuania,370,LT,flag_lt",
          "Luxembourg,352,LU,flag_lu",
          "Latvia,371,LV,flag_lv",
          "Libya,218,LY,flag_ly",
          "Morocco,212,MA,flag_ma",
          "Monaco,377,MC,flag_mc",
          "Moldova,373,MD,flag_md",
          "Montenegro,382,ME,flag_me",
          "Saint Martin,1,MF,flag_mf",
          "Madagascar,261,MG,flag_mg",
          "Marshall Islands,692,MH,flag_mh",
          "Macedonia,389,MK,flag_mk",
          "Mali,223,ML,flag_ml",
          "Myanmar,95,MM,flag_mm",
          "Mongolia,976,MN,flag_mn",
          "Macau,853,MO,flag_mo",
          "Martinique,596,MQ,flag_mq",
          "Northern Mariana Islands,1,MP,flag_mp",
          "Mauritania,222,MR,flag_mr",
          "Montserrat,1,MS,flag_ms",
          "Malta,356,MT,flag_mt",
          "Mauritius,230,MU,flag_mu",
          "Maldives,960,MV,flag_mv",
          "Malawi,265,MW,flag_mw",
          "Mexico,52,MX,flag_mx",
          "Malaysia,60,MY,flag_my",
          "Mozambique,258,MZ,flag_mz",
          "Namibia,264,NA,flag_na",
          "New Caledonia,687,NC,flag_nc",
          "Niger,227,NE,flag_ne",
          "Norfolk Island,672,NF,flag_nf",
          "Nigeria,234,NG,flag_ng",
          "Nicaragua,505,NI,flag_ni",
          "Netherlands,31,NL,flag_nl",
          "Norway,47,NO,flag_no",
          "Nepal,977,NP,flag_np",
          "Nauru,674,NR,flag_nr",
          "Niue,683,NU,flag_nu",
          "New Zealand,64,NZ,flag_nz",
          "Oman,968,OM,flag_om",
          "Panama,507,PA,flag_pa",
          "Peru,51,PE,flag_pe",
          "French Polynesia,689,PF,flag_pf",
          "Papua New Guinea,675,PG,flag_pg",
          "Philippines,63,PH,flag_ph",
          "Pakistan,92,PK,flag_pk",
          "Poland,48,PL,flag_pl",
          "Saint Pierre and Miquelon,508,PM,flag_pm",
          "Pitcairn Islands,870,PN,flag_pn",
          "Puerto Rico,1,PR,flag_pr",
          "Portugal,351,PT,flag_pt",
          "Palestine,970,PS,flag_ps",
          "Palau,680,PW,flag_pw",
          "Paraguay,595,PY,flag_py",
          "Qatar,974,QA,flag_qa",
          "Reunion,262,RE,flag_re",
          "Romania,40,RO,flag_ro",
          "Serbia,381,RS,flag_rs",
          "Russia,7,RU,flag_ru",
          "Rwanda,250,RW,flag_rw",
          "Saudi Arabia,966,SA,flag_sa",
          "Solomon Islands,677,SB,flag_sb",
          "Seychelles,248,SC,flag_sc",
          "Sudan,249,SD,flag_sd",
          "Sweden,46,SE,flag_se",
          "Singapore,65,SG,flag_sg",
          "Saint Helena,290,SH,flag_sh",
          "Slovenia,386,SI,flag_si",
          "Svalbard and Jan Mayen,47,SJ,flag_sj",
          "Slovakia,421,SK,flag_sk",
          "Sierra Leone,232,SL,flag_sl",
          "San Marino,378,SM,flag_sm",
          "Senegal,221,SN,flag_sn",
          "Somalia,252,SO,flag_so",
          "Suriname,597,SR,flag_sr",
          "South Sudan,211,SS,flag_ss",
          "Sao Tome and Principe,239,ST,flag_st",
          "Sint Maarten,1,SX,flag_sx",
          "El Salvador,503,SV,flag_sv",
          "Syria,963,SY,flag_sy",
          "Swaziland,268,SZ,flag_sz",
          "Turks and Caicos Islands,1,TC,flag_tc",
          "Tchad,235,TD,flag_td",
          "Togo,228,TG,flag_tg",
          "Thailand,66,TH,flag_th",
          "Tajikistan,992,TJ,flag_tj",
          "Tokelau,690,TK,flag_tk",
          "East Timor,670,TL,flag_tl",
          "Turkmenistan,993,TM,flag_tm",
          "Tunisia,216,TN,flag_tn",
          "Tonga,676,TO,flag_to",
          "Turkey,90,TR,flag_tr",
          "Trinidad and Tobago,1,TT,flag_tt",
          "Tuvalu,688,TV,flag_tv",
          "Taiwan,886,TW,flag_tw",
          "Tanzania,255,TZ,flag_tz",
          "Ukraine,380,UA,flag_ua",
          "Uganda,256,UG,flag_ug",
          "United States,1,US,flag_us",
          "Uruguay,598,UY,flag_uy",
          "Uzbekistan,998,UZ,flag_uz",
          "Vatican,39,VA,flag_va",
          "Saint Vincent and the Grenadines,1,VC,flag_vc",
          "Venezuela,58,VE,flag_ve",
          "British Virgin Islands,1,VG,flag_vg",
          "United States Virgin Islands,1,VI,flag_vi",
          "Vanuatu,678,VU,flag_vu",
          "Wallis and Futuna,681,WF,flag_wf",
          "Samoa,685,WS,flag_ws",
          "Kosovo,381,XK,flag_xk",
          "Yemen,967,YE,flag_ye",
          "Vietnam,84,VN,flag_vn",
          "Mayotte,262,YT,flag_yt",
          "South Africa,27,ZA,flag_za",
          "Zambia,260,ZM,flag_zm",
          "Zimbabwe,263,ZW,flag_zw",
        ],
        arrFormat: [],
        options: [],
        value: {
          keyCode: "84",
          urlImg: "flag_vn",
        },
      };
    },
    computed: {
      keyCodeCountry() {
        return this.codeCountry || 84;
      },
    },
    created() {
      this.formatData();
      this.getFlagsForCodeCountry();
    },
    methods: {
      visibleChange() {
        this.options = this.arrFormat;
      },
      remoteMethod(query) {
        if (query !== "") {
          // this.loading = true;
          setTimeout(() => {
            // this.loading = false;

            this.options = this.arrFormat.filter((item) => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = this.arrFormat;
        }
      },

      formatData() {
        this.dataArea = this.dataArea.sort();
        this.dataArea.forEach((item) => {
          let obj = {};
          let arr = item.split(",");
          obj.name = arr[0];
          obj.keyCode = arr[1];
          obj.shortName = arr[2];
          obj.urlImg = arr[3];
          this.arrFormat.push(obj);
        });
        this.options = this.arrFormat;
      },
      getFlagsForCodeCountry() {
        let getObj = [];
        getObj = this.arrFormat.filter(
          (item) => item.keyCode == String(this.keyCodeCountry)
        );
        this.value = getObj[0];
      },
      getCodeCountryChoose(value) {
        this.$emit("changeCodeCountry", value.keyCode, value.shortName);
        this.$emit("update:codeCountry", value.keyCode);
      },
    },
  };
</script>
