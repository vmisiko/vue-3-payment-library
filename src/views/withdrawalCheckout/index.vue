<template>
  <div class="flex-center">
    <Processing v-if="getLoading" :text="loadingText" />

    <div class="card" v-else>
      <TopInfo :icon="icon" title="Withdraw Cash">
        <template v-slot:subtitle>
          <span class="body-2-regular text-gray70">
            How would you like to be paid?
          </span>
        </template>
      </TopInfo>

      <div class="mgt-5" v-for="(paymethod, index) in getSavedPayMethods" :key="index">
        <ChooseWithdrawOption :payment-method="paymethod" v-model="picked"/>
        <hr
          class="margin-hr mgt-n2"
        />
      </div>
      
      <span class="link mgt-5" @click="router.push({ name: 'AddWithdrawal'})" >
        + {{ $translate("add_withdraw_option") }}</span
      >

      <div class="mgy-10"></div>
       
      <div class="direction-flex mb-5">
          <div class="">
            <span class="text-caption text-gray70">
              Withdrawal amount
            </span>
            <div class="payment-text-secondary">
              {{ getBupayload.currency }}
              {{ formatCurrency(getBupayload.amount) }}
            </div>
          </div>
          <span class="spacer"></span>
          <sendy-btn
            color="primary"
            class="mgt-2"
            :disabled="!picked"
            @click="handleContinue"
          >
            continue
          </sendy-btn>
        </div>
      
    </div>
    <ConfirmWithrawalModal :show="confirm" @close="confirm=false" />
  </div>
  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TopInfo from '../../components/topInfo.vue';
import ChooseWithdrawOption from './components/ChooseWithdrawOption.vue';
import ConfirmWithrawalModal from './components/confirmWithrawalModal.vue';
import { useGlobalProp } from '../../hooks/globalProperties';
import { useState } from '../../hooks/useState';
import { usePayment } from '../../hooks/payment';
import Processing from '../../components/processing.vue';
import { useStore } from 'vuex';
import { useWithdrawals } from '../../hooks/useWithdrawals';
import { useSegement } from '../../hooks/useSegment';

const icon = ref('back');
const confirm = ref(false);
const accountName = ref('');
const bankName = ref('');
const accountNumber = ref('');
const picked = ref(false);
const { router } = useGlobalProp();

const store = useStore();
const { getSavedPayMethods, getLoading, getBupayload } = useState();
const { selectedPaymentOption, loadingText, formatCurrency, withdraw } = useWithdrawals();
const { retrievePaymentMethods } = usePayment();
const { commonTrackPayload }= useSegement();

onMounted( async () => {
  store.commit("setLoading", true);
  await retrievePaymentMethods();
  store.commit("setLoading", false);

  if (!getSavedPayMethods.value.length) {
    router.push({name: 'AddWithdrawal'});
  }
  window.analytics.track("Loaded withdrawal checkout page", {
    ...commonTrackPayload(),
    duration_of_response: null,
  });

});

const handleContinue = () => {
  confirm.value = true
  window.analytics.track("Contiue with withdrawal checkout", {
    ...commonTrackPayload(),
    duration_of_response: null,
  });
};

</script>
