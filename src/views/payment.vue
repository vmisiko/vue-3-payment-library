<template>
  <div class="flex-center">

    <div class="card" :class="{'card-min': paymentStatus }">

      <TopInfo :icon="icon" :title="title" :subtitle="subtitle"/>

      <PaymentDetail :currency="currency" :amount="amount" :payment_mode="payment_mode"  :paymentStatus="paymentStatus" />

      <div class="mt-8 text-right" v-if="!paymentStatus">
        <!-- <button class="primary-btn">Confirm and Pay </button> -->
         <sendy-btn 
          :loading="loading"
          color='primary'
          class="mt-10"
          @click="$router.push('/processing')"
          >
            Confirm and Pay
          </sendy-btn>
      </div>

      <div class="mt-8 text-right" v-if="paymentStatus === 'success'" >
        <!-- <button class="primary-btn-block">Done </button> -->
        <sendy-btn 
          :block="true"
          :loading="loading"
          color='primary'
          class="mt-10"
        >
          Done
        </sendy-btn>
      </div>

      <div class="mt-8 text-right" v-if="paymentStatus === 'failed'">
        <!-- <button class="primary-btn-block">Try Again </button> -->
        <sendy-btn 
          :block="true"
          :loading="loading"
          color='primary'
          class="mt-10"
        >
          Try Again
        </sendy-btn>
      </div>

      <div class="mt-8 text-right" v-if="paymentStatus === 'retry'">
        <!-- <button class="primary-btn-block">Retry in 3min 57seconds... </button> -->
        <sendy-btn 
          :block="true"
          :loading="loading"
          color='primary'
          class=""
        >
          Retry in 3min 57seconds...
        </sendy-btn>
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
      paymentStatus: null,
      currency: 'KES',
      amount: '415,000.00',
      payment_mode: 'card',
      loading: false,
    }
  },
  mounted() {
    switch (this.$route.name){
      case 'SuccessView':
        this.sucessView();
        break;
      case 'FailedView':
        this.failView();
        break;
      case 'RetryView':
        this.retryView();
        break;
      default:
        break;
    }
    this.paymentMethods = this.getSavedPayMethods;
    console.log(this.getSavedPayMethods)
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