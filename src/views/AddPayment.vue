<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" :title="title"/>

     <div class="mt-6" v-for="(method, index) in paymentMethods" :key="index">
       <PaymentOption :paymentMethod="method" />
       <hr v-if="index !== paymentMethods.length-1" class="mt-4" />
      </div> 
    
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddPayment',
  components: {
    TopInfo: () => import('@/components/topInfo'),
    PaymentOption: () => import('@/components/paymentOption'),
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
