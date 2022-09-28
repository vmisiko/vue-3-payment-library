<template>
  <div class="flex-center">
    <Processing v-if="getLoading" text="Loading..." />

    <div class="card" v-else>
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
      
      <span class="link mgt-5" @click="router.push({ name: 'AddWithdrawal'})" >
        + {{ $translate("add_withdraw_option") }}</span
      >

      <div class="mgy-10"></div>
       
        <div class="text-right">
          <sendy-btn
          color="primary"
          text="Done"
          />
        </div>
      
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
import Processing from '../../components/processing.vue';
import { useStore } from 'vuex';

const icon = ref('back');
const confirm = ref(false);
const accountName = ref('');
const bankName = ref('');
const accountNumber = ref('');
const { router } = useGlobalProp();

const store = useStore();
const { getSavedPayMethods, getLoading } = useState();
const { retrievePaymentMethods } = usePayment();

onMounted( async () => {
  store.commit("setLoading", true);
  await retrievePaymentMethods();
  store.commit("setLoading", false);
});

</script>
