import router from './router'
import store from './store'
import iconView from './components/iconView';
import notification from './components/notificationComponent';
import sendyBtn from './components/sendyBtn';
import paymentLibraryMxn from './mixins/paymentLibraryMxn';
import 'vue-tel-input/dist/vue-tel-input.css';
import i18n from './plugins/i18n'


export default {
  install (Vue, options) {
    if (!options || !options.store) {
      throw new Error('Please initialise plugin with a Vuex store.')
    }

    if ( !options.hasOwnProperty('router')) {
      throw new Error('Please Initialise plugin with vue router.')
    }
    
    options.store.registerModule('PaymentLib', store)

    options.router.addRoute(router[0]);
    
    Vue.prototype.$sendyOptions = options;
    Vue.prototype.$t = (key) => i18n.t(key)

    Vue.component('IconView', iconView);

    Vue.component('Snackbar', notification);

    Vue.component('sendy-btn', sendyBtn);

    Vue.mixin(paymentLibraryMxn);
  }
}