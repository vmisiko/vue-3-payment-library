<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" :title="title"/>

      <span class="mt-2 text-overline">CREDIT OR DEBIT CARD</span>
      <div class="">
        <div class="mt-4 text-caption-1 d-flex pa-3" :class="{'selected-border': (picked === 'visa')}" >
            <img class="mt-n1" :src="require('@/assets/icons/visa-icon.svg')" alt=""> 
            <span class="ml-2">VISA</span>
            <span class="gray80-text ml-2"> **** 7659</span>   
            <span class="spacer"></span>   
            <div class="">
              <!-- <img class="mt-n10" :src="require('@/assets/icons/circle-check.svg')" alt=""> -->
              <input name="paymentoption" type="radio" value="visa"  v-model="picked" >
             </div>
        </div>

        <div class="mt-4 text-caption-1 d-flex pa-3" :class="{'selected-border': picked === 'master'}">
            <img class="mt-n1" :src="require('@/assets/icons/master-card.svg')" alt=""> 
            <span class="ml-2">VISA</span>
            <span class="gray80-text ml-2"> **** 7659</span>   
            <span class="spacer"></span>   
            <div class="">
              <!-- <img class="mt-n10" :src="require('@/assets/icons/circle-check.svg')" alt=""> -->
              <input type="radio" value="master"  v-model="picked" >
             </div>
        </div>
      </div>

      <span class="mt-8 text-overline">mobile money</span>

      <div class="mt-4 text-caption-1 d-flex pa-3 " :class="{'selected-border': picked === 'mpesa'}">
            <img class="mt-n1" :src="require('@/assets/icons/mpesa-icon.svg')" alt=""> 
            <span class="ml-2">M-PESA</span>
            <span class="gray80-text ml-2"> **** 7659</span>   
            <span class="spacer"></span>   
            <div class="">
              <input type="radio" value="mpesa" v-model="picked" >
            </div>
      </div>

      <hr class="mt-5" />

      <span class="link mt-5" @click="$router.push('/add-payment')"> + Add payment option</span>

      <div class="mt-8">
        <button class="primary-btn float-right" > continue </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentOptionsPage',
  components: {
    TopInfo: () => import('@/components/topInfo'),
  },
  data() {
    return {
      icon: 'back',
      title: 'Payment options',
      picked: '',
    }
  }
}
</script>
