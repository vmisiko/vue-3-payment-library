<template>
  <div class="">
    <IconView :icon="icon" />
    <div class="mgt-4">
      <span class="title-payment" v-if="title">
        {{
          $route.name === "SuccessView" && $route.params.title
            ? $route.params.title
            : title
        }}
      </span>
    </div>

    <slot name="subtitle">
      <div class="mgt-4">
        <span
          class="subtitle-warning"
          :class="{
            'subtitle-normal': ($route.params.name = 'ResolvePayment'),
          }"
        >
          {{ subtitle }}
        </span>
      </div>
    </slot>
    <div class="mgt-1 text-caption-1 text-gray80" v-if="mpesaCode">
      <span>{{ $t("mpesa_code") }}: {{ mpesaCode }} </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopInfo",
  props: ["icon", "title", "subtitle", "mpesaCode"],
  data() {
    return {
      text: "",
    };
  },
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
