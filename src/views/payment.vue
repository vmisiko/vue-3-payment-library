<template>
  <div class="flex-center">

    <div class="card" :class="{'card-min': paymentStatus }">

      <TopInfo :icon="icon" :title="title" :subtitle="subtitle"/>

      <PaymentDetail :currency="currency" :amount="amount" :payment_mode="payment_mode"  :paymentStatus="paymentStatus" />

      <div class="mt-8 text-right" v-if="!paymentStatus">
        <button class="primary-btn">Confirm and Pay </button>
      </div>

      <div class="mt-8 text-right" v-if="paymentStatus === 'success'" >
        <button class="primary-btn-block">Done </button>
      </div>

      <div class="mt-8 text-right" v-if="paymentStatus === 'failed'">
        <button class="primary-btn-block">Try Again </button>
      </div>

      <div class="mt-8 text-right" v-if="paymentStatus === 'retry'">
        <button class="primary-btn-block">Retry in 3min 57seconds... </button>
      </div>

      <div class="text-center mt-8" >
        <span class="link">Contact Support</span>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'Payment',
  components: {
    TopInfo: () => import('@/components/topInfo'),
    PaymentDetail: () => import('@/components/paymentDetail'),
  },
  data() {
    return {
      icon: 'back',
      title: 'Payment',
      subtitle: '',
      paymentStatus: 'failed',
      currency: 'KES',
      amount: '415,000.00',
      payment_mode: 'card',
    }
  },
  mounted() {
    this.retryView();
  },
  methods: {
    sucessView() {
      this.icon = 'success';
      this.title = 'Payment Successful';
      this.subtitle = '';
      this.paymentStatus= 'success';
    },

    failView() {
      this.icon = 'warning';
      this.title = 'Payment failed';
      this.subtitle = 'We are unable to process your transaction. Your card has insufficient funds.';
      this.paymentStatus= 'failed';
    },

    retryView() {
      this.icon = 'warning';
      this.title = 'Unable to confirm payment';
      this.subtitle = 'We are unable to confirm your M-PESA payment. Please retry again after a couple of minutes or contact our Support team.';
      this.paymentStatus= 'retry';
    },
  }
}

</script>