const _ = window._;
const he = window.he;
const Vue = window.Vue;
const Vuex = window.Vuex;
const mapState = window?.Vuex?.mapState ?? {};
const mapGetters = window?.Vuex?.mapGetters ?? {};
const mapActions = window?.Vuex?.mapActions ?? {};
const VueRouter = window.VueRouter;
const required = window.validators?.required ?? {};
const requiredIf  = window.validators?.requiredIf  ?? {};
const email = window.validators?.email ?? {};
const sameAs = window.validators?.sameAs ?? {};
const minLength = window.validators?.minLength ?? {};
const maxLength = window.validators?.maxLength ?? {};
const minValue = window.validators?.minValue ?? {};
const maxValue = window.validators?.maxValue ?? {};

const numeric = window.validators?.numeric ?? {};

const VueI18n = window?.VueI18n ?? {};
const uuidv1 = window?.uuidv1 ?? {};

export {
  _,

  he,

  Vue,

  Vuex,
  mapState,
  mapGetters,
  mapActions,

  VueRouter,

  required,
  requiredIf,
  email,
  sameAs,
  minLength,
  maxLength,
  minValue,
  maxValue,
  numeric,

  VueI18n,

  uuidv1,
};
