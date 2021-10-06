<template>
  <div id="payment">
    <div class="container">
      <div @click="$router.push({ name: 'Entry' })" v-if="false">
       <IconView icon="sendy-logo" />
      </div> 
      <router-view/>
    </div>
    <NotificationComponent :show="showNotification" :text="notificationText"  :type="type" />
    <AxiosErrorModal :show="showAxiosError" :text="errorText" @close="showAxiosError=!showAxiosError" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import NotificationComponent from '../components/notificationComponent';
import AxiosErrorModal from '../components/modals/AxiosErrorModal';

export default {
  name: 'PaymentEntry',
  components: {
    NotificationComponent,
    AxiosErrorModal,
  },
  data() {
    return {
      showNotification: false,
      showAxiosError: false,
      notificationText: 'M-PESA option added and selected for payment.',
      type: null,
      errorText: 'Failed. Network Error!',
    }
  },
  computed: {
    ...mapGetters(['getBupayload']),
  },
  mounted() {
    this.$root.$on('payment-notification', this.notificationInit);
    this.$root.$on('axios-notification', this.axiosNotif);
    this.retrievePaymentMethods();
  },
  methods: {
    ...mapMutations(['setPaymentMethods', 'setSavedPayMethods']),
    notificationInit(payload) {
      this.notificationText = payload.text;
      this.type = payload.type;
      this.showNotification = !this.showNotification;
    },
    axiosNotif(payload) {
      this.showAxiosError = true;
      this.errorText = payload.text;
    },
    async retrievePaymentMethods() {
      const payload = {
        country_code : this.getBupayload.country_code,
        entity_id : this.getBupayload.entity_id,
        user_id : this.getBupayload.user_id,
      };

      const fullPayload = {
        url: '/payment_methods',
        params: payload,
      }

      const response = await this.$paymentAxiosPost(fullPayload);
      if (response.status) {
        this.setPaymentMethods(response.payment_methods);
        this.setSavedPayMethods(response.saved_payment_methods);
      }
    },
  }
 }
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');
@import '@/assets/styles/global.scss';
</style>

