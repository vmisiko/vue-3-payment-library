<template>
  <div class="">
    <NoOptionsModal :show="true"/>
  </div>
</template>

<script>
export default {
  name: 'AddPaymentOption',
  components: {
    NoOptionsModal: () => import('../components/modals/noOptionsModal'),
  },
  data() {
    return {
      icon: 'back',
      title: 'Add Payment option',
    }
  }
}
</script>
