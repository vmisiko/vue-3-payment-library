<template>
  <div class="">
      <IconView :icon="icon" />
      <div class="mgt-4">
        <span class="title-payment" v-if="title"> {{ title }} </span>
      </div>

      <div class="mgt-4">
        <span class="subtitle-warning"> {{ subtitle }} </span>
      </div>
      <div class="mgt-1 text-caption-1 text-gray80" v-if="mpesaCode">
        <span>M-PESA code : {{ mpesaCode }} </span>
      </div>
  </div>
</template>

<script>
export default {
  name: 'TopInfo',
  props: ['icon', 'title', 'subtitle', 'mpesaCode' ],
  data() {
    return {
      text: '', 
    }
  },
}
</script>

<style lang="scss">
.subtitle-warning {
  font-family: Nunito;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.4px;
  color: #9B101C;
}
</style>
