import router from './router'
import store from './store'
import iconView from './components/iconView';
import notification from './components/notificationComponent';
import sendyBtn from './components/sendyBtn';
import paymentLibraryMxn from './mixins/paymentLibraryMxn';

export default {
  install (Vue, options) {
    if (!options || !options.store) {
      throw new Error('Please initialise plugin with a Vuex store.')
    }

    if (!options || !options.router) {
      throw new Error('Please Initialise plugin with vue router.')
    }
    
    options.store.registerModule('PaymentLib', store)

    options.router.forEach(route => {
      options.router.addRoute(route);
    });
    
    
    
    Vue.component('IconView', iconView);
    Vue.component('Snackbar', notification);
    Vue.component('sendy-btn', sendyBtn);
    Vue.mixin(paymentLibraryMxn);
  }
}