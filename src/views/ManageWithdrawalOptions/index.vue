<template>
  <div class="flex-center">
    <Processing v-if="getLoading" :text="$translate('loading')" />

    <div class="card" v-else>
      <TopInfo :icon="icon" :title="$translate('withdrawal_options')">
        <template v-slot:subtitle>
          <span class="body-2-regular text-gray70">
            {{ $translate('manage_your_payment') }}
          </span>
        </template>
      </TopInfo>

      <div class="mgt-5" v-for="(paymethod, index) in getSavedPayMethods" :key="index">
        <WithdrawOption :payment-method="paymethod" />
        <hr
          class="margin-hr mgt-n2"
        />
      </div>
      
      <span class="link mgt-5" @click="addWithdraw" >
        + {{ $translate("add_withdraw_option") }}</span
      >

      <div class="mgy-10"></div>
       
        <div class="text-right">
          <sendy-btn
          color="primary"
          :text="$translate('done')"
          @click="submit"
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
import { useSegement } from '../../hooks/useSegment';

const icon = ref('back');
const confirm = ref(false);
const accountName = ref('');
const bankName = ref('');
const accountNumber = ref('');
const { router } = useGlobalProp();

const store = useStore();
const { getSavedPayMethods, getLoading } = useState();
const { retrievePaymentMethods } = usePayment();
const { commonTrackPayload } = useSegement();

onMounted( async () => {
  store.commit("setLoading", true);
  await retrievePaymentMethods();
  store.commit("setLoading", false);
  if (!getSavedPayMethods.value.length) {
    router.push({name: 'AddWithdrawal'});
  }
  window.analytics.track("View Manage Withdrawal Options Page", {
    ...commonTrackPayload(),
    duration_of_response: null,
  });
});


const addWithdraw = () => {
  window.analytics.track("Tap Add a withdrawal option", {
    ...commonTrackPayload(),
  })
  router.push({ name: 'AddWithdrawal'});
};

const submit = () => {
  window.analytics.track("Tap done on added withdrawal option", {
    ...commonTrackPayload(),
    withdrawal_option: selectedPaymentOption.value?.pay_method_name ?? selectedPaymentOption.value?.name,
  });
  router.push(localStorage.entry_route);
}
</script>
