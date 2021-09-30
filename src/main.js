import router from './router'
import store from './store'
import iconView from './components/iconView';
import notification from './components/notificationComponent';
import sendyBtn from './components/sendyBtn';
import paymentLibraryMxn from './mixins/paymentLibraryMxn';

export default {
  install (Vue, options) {
    console.log(options, options.router);
    if (!options || !options.store) {
      throw new Error('Please initialise plugin with a Vuex store.')
    }

    if ( !options.hasOwnProperty('router')) {
      throw new Error('Please Initialise plugin with vue router.')
    } else {
      console.log('has router');
    }
    
    options.store.registerModule('PaymentLib', store)

    options.router.addRoute(router[0]);
    
    Vue.prototype.$router = options.router;
    Vue.component('IconView', iconView);
    Vue.component('Snackbar', notification);
    Vue.component('sendy-btn', sendyBtn);
    Vue.mixin(paymentLibraryMxn);
  }
}