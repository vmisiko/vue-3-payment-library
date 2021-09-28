<template>
  <div id="payment">
    <div class="container">
      <img class="mt-8" :src="require('@/assets/logo.svg')" />
        <router-view/>
    </div>
    <NotificationComponent :show="showNotification" :text="notificationText" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'PaymentEntry',
  components: {
    NotificationComponent: () => import('../components/notificationComponent'),
  },
  data() {
    return {
      showNotification: false,
      notificationText: 'M-PESA option added and selected for payment.',
    }
  },
  mounted() {
    this.$root.$on('payment-notification', this.notificationInit);
    const buPayload = {
      "user_id": 3435,
      "entity_id": 1,
      "country_code": "KES",
      "country": "KE",
      "amount": 415000.00,
      "success_callback_url": "",
      "fail_callback_url": "",
    }

    localStorage.setItem('buPayload', buPayload);
    this.paymentMethods();
  },
  methods: {
    ...mapMutations(['setPaymentMethods', 'setSavedPayMethods']),
    notificationInit(payload) {
      this.notificationText = payload.text;
      this.showNotification = !this.showNotification;
    },
    async paymentMethods() {
      const buPayload = localStorage.buPayload;
      const payload = {
        country_code : 'KE',
        entity_id : 1,
        user_id : 3435
      };

      const fullPayload = {
        url: '/payment_methods',
        params: payload,
      }
      const payment_methods = [
        {
            "payment_method_id": 1,
            "name": "M-Pesa",
            "available": true
        },
        {
            "payment_method_id": 2,
            "name": "Card",
            "available": true
        }
      ];

      const user_pay_method = [
        {
              "id": 2,
              "user_id": "3435",
              "pay_method_id": 1,
              "pay_method_details": "0725034298",
              "pay_detail_id": 56,
              "pay_method_name": "Card",
              "status": 1,
              "default": 0,
              "psp": "MASTERCARD",
              "category": "Credit or Debit Card",
        },
        {
              "id": 3,
              "user_id": "3435",
              "pay_method_id": 1,
              "pay_method_details": "0725034298",
              "pay_detail_id": 56,
              "pay_method_name": "Card",
              "status": 1,
              "default": 0,
              "psp": "MASTERCARD",
              "category": "Credit or Debit Card",
        },
        {
            "id": 2,
            "user_id": "3435",
            "pay_method_id": 1,
            "pay_method_details": "0725034298",
            "pay_detail_id": 56,
            "pay_method_name": "M-Pesa",
            "default": 0,
            "psp": "",
            "category": "Mobile Money",
        },
        {
            "id": 4,
            "user_id": "3435",
            "pay_method_id": 2,
            "pay_method_details": "5960XXXXX6076",
            "pay_detail_id": 67,
            "pay_method_name": "Card",
            "default": 0,
            "psp": "MASTERCARD",
            "category": "Credit or Debit Card",
        }
      ];

      this.setPaymentMethods(payment_methods);
      this.setSavedPayMethods(user_pay_method);
      // const response = await this.$paymentAxiosPost(fullPayload);
      // console.log(response);
    },
  }
 }
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');
@import '@/assets/styles/global.scss';
</style>

