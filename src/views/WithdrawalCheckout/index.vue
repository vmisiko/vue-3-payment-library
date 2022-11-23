<template>
  <div class="flex-center">
    <Processing v-if="getLoading" :text="loadingText" />

    <div class="card" v-else>
      <TopInfo :icon="icon" title="Withdraw Cash">
        <template v-slot:subtitle>
          <span class="body-2-regular text-gray70">
            {{ $translate('how_would_you_like_paid') }}
          </span>
        </template>
      </TopInfo>

      <div class="mgt-5" v-for="(paymethod, index) in getSavedPayMethods" :key="index">
        <ChooseWithdrawOption :payment-method="paymethod" v-model="picked"/>
        <hr
          class="margin-hr mgt-n2"
        />
      </div>
      
      <div class="link mgt-5 flex" @click="manageWithdrawOption" >
       <div class="mgy-auto">
          <svg class="svg"  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.9177 4.64056L13.7477 6.73856L14.3497 5.92247C14.561 5.63612 14.6551 5.30999 14.6321 4.9441C14.609 4.5782 14.4341 4.27963 14.1072 4.04838L13.4025 3.54256C13.0775 3.32376 12.7348 3.24135 12.3744 3.29531C12.014 3.34927 11.7282 3.51943 11.517 3.80578L10.9177 4.64056Z" fill="#324BA8"/>
            <path d="M2.78698 18.629C2.97993 18.772 3.20068 18.8249 3.44923 18.7877L4.67955 18.6035C4.7914 18.5868 4.89688 18.5487 4.99598 18.4893C5.09509 18.4299 5.18782 18.3491 5.27419 18.247L13.0981 7.61909L10.2523 5.54256L2.42561 16.1518C2.35167 16.252 2.30088 16.3583 2.27324 16.4707C2.2456 16.5831 2.24017 16.6954 2.25696 16.8075L2.44161 18.0407C2.47891 18.2899 2.59403 18.4859 2.78698 18.629Z" fill="#324BA8"/>
            <path d="M11.75 18.5001C11.0596 18.5001 10.5 17.9405 10.5 17.2501C10.5 16.5598 11.0596 16.0001 11.75 16.0001L21.25 16.0001C21.9404 16.0001 22.5 16.5598 22.5 17.2501C22.5 17.9405 21.9404 18.5001 21.25 18.5001L11.75 18.5001Z" fill="#324BA8"/>
            <path d="M14.5 11.7501C14.5 12.4405 15.0596 13.0001 15.75 13.0001L21.25 13.0001C21.9404 13.0001 22.5 12.4405 22.5 11.7501C22.5 11.0598 21.9404 10.5001 21.25 10.5001L15.75 10.5001C15.0596 10.5001 14.5 11.0598 14.5 11.7501Z" fill="#324BA8"/>
            <path d="M19.75 8.00014C19.0596 8.00014 18.5 7.44049 18.5 6.75014C18.5 6.05978 19.0596 5.50014 19.75 5.50014L21.25 5.50014C21.9404 5.50014 22.5 6.05978 22.5 6.75014C22.5 7.44049 21.9404 8.00014 21.25 8.00014L19.75 8.00014Z" fill="#324BA8"/>
          </svg>
        </div>
        <span class="mgl-2">{{ $translate("manage_withdrawal_options") }}</span>
      </div>
      <div class="mgy-10"></div>
       
      <div class="direction-flex mb-5">
          <div class="">
            <span class="text-caption text-gray70">
              {{ $translate('withdrawal_amount') }}
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
            {{ $translate('continue') }}
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
  window.analytics.track("View Withdraw Cash Options page", {
    ...commonTrackPayload(),
  });

});

const handleContinue = () => {
  window.analytics.track("Tap Continue after selecting a cash withdrawal option", {
    ...commonTrackPayload(),
    withdrawal_option: selectedPaymentOption.value.pay_method_name,
  });

  const entryPoint = localStorage.entry;
  if (entryPoint === 'choose-withdraw-option') {
    router.push(localStorage.entry_route);
    return;
  }
  confirm.value = true;
};

const manageWithdrawOption = () => {
  window.analytics.track("Tap Manage Withdrawal Options during withdrawal", {
    ...commonTrackPayload(),
  });
  router.push({name: "ManageWithdrawal"});
}

</script>
