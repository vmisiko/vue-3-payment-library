<template>
  <div class="">
    <img
      width="34"
      :src="`${iconUrl}/${paymentOption.pay_method_name?.toLowerCase()}.png`"
      alt=""
    />
  </div>
</template>

<script setup>
const props = defineProps([ 'paymentOption']);
const iconUrl = 'https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons';
</script>
