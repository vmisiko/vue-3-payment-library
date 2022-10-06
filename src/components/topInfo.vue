<template>
  <div class="">
    <IconView :icon="icon" />
    <div class="mgt-4">
      <span class="title-payment" v-if="title">
        {{
         topTitle
        }}
      </span>
    </div>

    <slot name="subtitle">
      <div class="mgt-4">
        <span
          class="subtitle-warning"
          :class="{
            'subtitle-normal': isResolvepayment,
          }"
        >
          {{ subtitle }}
        </span>
      </div>
    </slot>
    <div class="mgt-1 text-caption-1 text-gray80" v-if="mpesaCode">
      <span
        >{{ isMpesa ? $translate("mpesa_code") : $translate("transaction_id") }}:
        {{ mpesaCode }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopInfo",
  props: ["icon", "title", "subtitle", "mpesaCode", "isMpesa"],
  data() {
    return {
      text: "",
    };
  },
  computed: {
    topTitle() {
      return this.$route.name === "SuccessView" && this.$route.params.title
              ? this.title
              : this.title
    },
    isResolvepayment() {
      return this.$route.params.name === 'ResolvePayment'
    }
  }

};
</script>

<style lang="scss">
.subtitle-warning {
  font-family: Nunito;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.4px;
  color: #9b101c;
}

.subtitle-normal {
  font-family: Nunito;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.4px;
}
</style>
