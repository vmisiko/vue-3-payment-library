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
      amount: 41000.00,
      success_callback_url: "",
      fail_callback_url: "",
      txref: "RRRIIIAAAAKK",
      bulk: false,
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
      console.log(this.getBupayload);
      const payload = {
        country_code : this.getBupayload.country_code,
        entity_id : this.getBupayload.entity_id,
        user_id : this.getBupayload.user_id,
      };

      const fullPayload = {
        url: '/payment_methods',
        params: payload,
      }

      // const payment_methods = [
      //   {
      //       "payment_method_id": 1,
      //       "name": "M-Pesa",
      //       "available": true
      //   },
      //   {
      //       "payment_method_id": 2,
      //       "name": "Card",
      //       "available": true
      //   }
      // ];

      // const user_pay_method = [
      //   {
      //       "id": 1,
      //       "user_id": "3435",
      //       "pay_method_id": 2,
      //       "pay_method_details": "6565XXXXX7895",
      //       "pay_detail_id": 34,
      //       "pay_method_name": "Card",
      //       "default": 0,
      //       "psp": "visa",
      //       "category": "Credit or Debit Card"
      //   },
      //   {
      //       "id": 2,
      //       "user_id": "3435",
      //       "pay_method_id": 1,
      //       "pay_method_details": "0725034298",
      //       "pay_detail_id": 56,
      //       "pay_method_name": "M-Pesa",
      //       "default": 1,
      //       "psp": "",
      //       "category": "Mobile Money"
      //   },
      //   {
      //       "id": 4,
      //       "user_id": "3435",
      //       "pay_method_id": 2,
      //       "pay_method_details": "5960XXXXX6076",
      //       "pay_detail_id": 67,
      //       "pay_method_name": "Card",
      //       "default": 0,
      //       "psp": "MASTERCARD",
      //       "category": "Credit or Debit Card"
      //   }
      // ];
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

