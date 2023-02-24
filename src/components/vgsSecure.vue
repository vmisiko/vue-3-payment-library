<template>
  <div class="flex">
    <div>
      <img :src="`${imageBaseUrl}/vgs.svg`" alt="">
    </div>
    <div class="mgl-2">
      <img class="mgt-1" :src="`${imageBaseUrl}/padlock.svg`" alt="">
    </div>
    <span class="text-secure mgl-2 mgt-1 ">This is a secure 128-bit SSL encrypted payment</span>
  </div>

</template>

<script setup>

const imageBaseUrl = `https://sendy-payments.s3.eu-west-1.amazonaws.com/payment-icons`;

</script>