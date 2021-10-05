<template>
  <div class="mgt-4 text-caption-1 d-flex pda-3 " :class="{'selected-border': picked === card.card_type}">
    <img class="mgt-n1" :src="require('@/assets/icons/mpesa-icon.svg')" alt=""> 
    <span class="mgl-2">{{ card.card_type }}</span>
    <span class="gray80-text mgl-2"> **** {{ card.last_digits }}</span>   
    <span class="spacer"></span>   
    <div class="">
      <input type="radio" v-if="payment_mode = 'card'" :value="card.card_type" v-model="selected" >
      <input type="radio" v-if="payment_mode = 'mobile'" :value="card.card_type" v-model="selected" >
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentOptionItem',
  props: ['picked', 'payment_mode', 'card'],
  data() {
    return {
      selected: '',
    }
  },
}
</script>