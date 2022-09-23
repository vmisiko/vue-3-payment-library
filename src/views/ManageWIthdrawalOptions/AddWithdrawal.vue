<template>
  <div class="flex-center">
    <Processing v-if="getLoading" text="Please wait ..." />

    <div class="card" v-else>
      <TopInfo :icon="icon" :title="title">
        <template v-slot:subtitle>
          <span class="body-2-regular text-gray70">
            Select a withdrawal option to continue
          </span>
        </template>
      </TopInfo>

      <div class="mgt-10">
        <div class="" v-for="(method, index) in getPaymentMethods" :key="index">
          <PaymentOption :paymentMethod="method" />
          <hr
            class="margin-hr mgt-n2"
          />
        </div>
      </div>

      <div class="mgy-10"></div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import TopInfo from '../../components/topInfo.vue';
import PaymentOption from './components/PaymentOption.vue';
import Processing from "../../components/processing";
import { useState } from '../../hooks/useState';
const title = ref('Add a withdrawal option');
const icon = ref("back");

const { getPaymentMethods, retrievePaymentMethods, getLoading } = useState();

onMounted(() => {
  retrievePaymentMethods();
})
</script>

<style>
.margin-hr {
  margin-top: 16px !important;
  margin-bottom: 19px !important;
}
</style>