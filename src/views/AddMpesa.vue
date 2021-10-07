<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" :title="title"/>

      <IconView icon="mpesa" width="68" height="48" />
    <div class="mgt-8">
      <span class="text-list-title">
        How it works
      </span>

      <div>
        <p class="text-caption-1 text-gray80">
          Whenever you choose to pay with M-Pesa, you will be requested to provide a phone number during payment.
        </p>
      </div>

      <div class="mgt-15 float-right">
        <sendy-btn 
          :loading="loading"
          color='primary'
          class="mgt-10"
          @click="submit"
        >
          Add M-PESA
        </sendy-btn>
      </div>
    </div>

    </div>  
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TopInfo from '../components/topInfo';

export default {
  name: 'AddMpesa',
  components: {
    TopInfo,
  },
  data() {
    return {
      icon: 'back',
      title: 'Add a Mpesa',
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['getPaymentMethods', 'getBupayload']),
  },
  mounted() {
  },
  methods: {
    async submit() {
      this.loading = true;
      const payMethod = this.getPaymentMethods.find(element => element.name === 'M-Pesa');
      
      const payload = {
        user_id : this.getBupayload.user_id,
        pay_method_id : payMethod ? payMethod.payment_method_id : 1,
      };

      const fullPayload = {
        url: '/save_payment_method',
        params: payload,
      };

      const response = await this.$paymentAxiosPost(fullPayload);
      this.loading = false;      
      response.status
        ? this.$paymentNotification( {text: 'M-PESA option added and selected for payment.'})
        : this.$paymentNotification( {text: 'M-PESA option already exists', type: "error"});
      this.$router.push({ name: 'ChoosePayment' });
    }
  }
}
</script>

