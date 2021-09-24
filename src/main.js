import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iconView from './components/iconView';
import notification from './components/notificationComponent';
import sendyBtn from './components/sendyBtn';

Vue.config.productionTip = false

Vue.component('IconView', iconView);
Vue.component('Snackbar', notification);
Vue.component('sendy-btn', sendyBtn);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
