<template>
  <div id="payment">
    <div class="container">
      <img class="mt-8" :src="require('@/assets/logo.svg')" />
        <router-view/>
    </div>
    <NotificationComponent :show="showNotification" :text="notificationText"  :type="type" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'PaymentEntry',
  components: {
    NotificationComponent: () => import('../components/notificationComponent'),
  },
  data() {
    return {
      showNotification: false,
      notificationText: 'M-PESA option added and selected for payment.',
      type: null,
    }
  },
  computed: {
    ...mapGetters(['getBupayload']),
  },
  mounted() {
    this.$root.$on('payment-notification', this.notificationInit);
    localStorage.removeItem('buPayload');
    const buPayload = {
      user_id: 3435,
      entity_id: 1,
      currency: "KES",
      country_code: "KE",
      amount: 415000.00,
      success_callback_url: "",
      fail_callback_url: "",
      txref: "RRRIIIAAAAKK",
      bulk: false,
      mpesa_business_no: '',
    }
    
    localStorage.setItem('buPayload', JSON.stringify(buPayload));
    this.retrievePaymentMethods();
  },
  methods: {
    ...mapMutations(['setPaymentMethods', 'setSavedPayMethods']),
    notificationInit(payload) {
      this.notificationText = payload.text;
      this.type = payload.type;
      this.showNotification = !this.showNotification;
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

