<template>
  <div class="d-flex normal-text" @click="$handlePaymentMethod(paymentMethod)">

    <IconView :icon="paymentMethod.icon" />

    <span class="ml-2"> {{ paymentMethod.name }} </span>

    <span class="spacer"></span>

    <IconView icon="greator" width="8" height="12"  />
  </div>
</template>

<script>

export default {
  name: 'PaymentOption',
  props: ['paymentMethod'],
  data() {
    return {
    }
  },
  methods: {
    handleSelect() {
      switch (this.paymentMethod.id) {
        case 1: 
          this.$router.push('/add-card')
          break;
        case 2: 
          this.$router.push('/add-mpesa')
          break;
        default:
          this.$router.push('/add-card')
          break;
      }
    }
  }
}
</script>