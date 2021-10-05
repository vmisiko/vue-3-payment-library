<template>
   <div class="direction-flex normal-text pointer" @click="$handlePaymentMethod(paymentMethod)">

    <IconView class="text-center mgt-0" :icon="paymentMethod.name.toLowerCase()" />

    <span class="mgl-5"> {{ paymentMethod.name }} </span>

    <span class="spacer"></span>

    <IconView icon="greator-gray" width="8" height="12"  />
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
  },
}
</script>
