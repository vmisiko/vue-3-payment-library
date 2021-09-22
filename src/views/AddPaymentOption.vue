<template>
  <div class="">
    <NoOptionsModal :show="true"/>
  </div>
</template>

<script>
export default {
  name: 'AddPaymentOption',
  components: {
    NoOptionsModal: () => import('@/components/modals/noOptionsModal'),
  },
  data() {
    return {
      icon: 'back',
      title: 'Add Payment option',
      paymentMethods:[
        {
          id: 1,
          icon: 'credit',
          name: 'Credit or Debit card',
        },
        {
          id: 2,
          icon: 'mobile',
          name: 'M-Pesa',
        },
      ]
    }
  }
}
</script>
