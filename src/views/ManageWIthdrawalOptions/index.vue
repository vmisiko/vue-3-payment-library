<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" title="Withdrawal Options">
        <template v-slot:subtitle>
          <span class="body-2-regular text-gray70">
            Manage your payment withdrawal options
          </span>
        </template>
      </TopInfo>

      <div class="mgt-5" v-for="(paymethod, index) in getSavedPayMethods" :key="index">
        <WithdrawOption :payment-method="paymethod" />
        <hr
          class="margin-hr mgt-n2"
        />
      </div>
      
      <span class="link mgt-5">
        + {{ $translate("add_withdraw_option") }}</span
      >

      <div class="mgy-10"></div>

        <sendy-btn
        color="primary"
        :block="true"
        text="Done"
        />
      
      <div class="mgy-10"></div>

    </div>
  </div>
  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TopInfo from '../../components/topInfo.vue';
import { useGlobalProp } from '../../hooks/globalProperties';
import { useState } from '../../hooks/useState';
import { usePayment } from '../../hooks/payment';
import WithdrawOption from './components/WithdrawOption.vue';

const icon = ref('back');
const confirm = ref(false);
const accountName = ref('');
const bankName = ref('');
const accountNumber = ref('');
const { router } = useGlobalProp();

const { getSavedPayMethods, getLoading } = useState();
const { retrievePaymentMethods } = usePayment();

onMounted( async () => {
  await retrievePaymentMethods();
});

</script>
