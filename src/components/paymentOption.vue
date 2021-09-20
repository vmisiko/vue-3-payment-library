<template>
  <div class="d-flex normal-text" @click="$router.push('/add-card')">

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
  }
}
</script>