<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" :title="$translate('bank')">
        <template v-slot:subtitle>
          <span class="body-2-regular text-gray70">
            {{ $translate('enter_your_bank_details') }}
          </span>
        </template>
      </TopInfo>
      <form @submit.prevent="handleConfirm">
        <div class="mgt-5">

          <div class="textfield mgt-5">
            <label for="" class="normal-text"> {{ $translate('bank_name') }}</label>
            <select
              v-model="selectedBank"
              class="phone-input"
              required
              @input="handleSelect"
              :disabled="isEdit"
            >   
              <option :value="null" selected> {{ $translate('select_your_bank') }} </option>
              <option v-for="(bank) in banks" :key="bank.operator_id" :value="bank"> {{ bank.name }}</option>
            </select>
          </div>

          <div class="textfield mgt-5">
            <label for="" class="normal-text"> {{ $translate('account_name') }}</label>
            <input
              type="text"
              v-model="accountName"
              class="phone-input"
              :class="{'disabled': isEdit}"
              :placeholder="$translate('enter_account_name')"
              required
              :disabled="isEdit"
            /> 
          </div>

          <div class="textfield mgt-5">
            <label for="" class="normal-text"> {{ $translate('account_number') }}</label>
            <input
              type="text"
              v-model="accountNumber"
              class="phone-input"
              :class="{'disabled': isEdit}"
              :placeholder="$translate('enter_account_number')"
              required
              :disabled="isEdit"
            /> 
          </div>
        </div>

        <div v-if="isEdit" @click="deleteBank" class="mgt-8 text-btn direction-flex pointer" >
          <IconView icon="delete" />
          <span class="text-btn"> {{ $translate('remove_bank')}} </span>
        </div>

        <div class="mgy-10"></div>

        <div>
          <sendy-btn
          v-if="!isEdit"
          type="submit"
          color="primary"
          :block="true"
          :text="$translate('continue')"
          />
        </div>
      </form>
    </div>
    <ConfirmDetailsModal :show="confirm"  @close="confirm=false"/>
    <ConfirmDeleteModal :show="isDelete"  @close="isDelete=false"/>
  </div>
  
</template>

<script setup>
import { onMounted, ref } from 'vue';
import TopInfo from '../../components/topInfo.vue';
import { useGlobalProp } from '../../hooks/globalProperties';
import ConfirmDetailsModal from './components/ConfirmDetails.vue';
import ConfirmDeleteModal from './components/ConfirmDelete.vue';
import { useWithdrawals } from '../../hooks/useWithdrawals';
import { useState } from '../../hooks/useState';
import { useSegement } from '../../hooks/useSegment';

const icon = ref('back');
const confirm = ref(false);
const isDelete = ref(false);

const { router, route } = useGlobalProp();
const { getBupayload } = useState();
const {  
  accountName,
  selectedBank,
  accountNumber,
  banks,
  isEdit,
  selectedPaymentOption,
  getBanks,
} = useWithdrawals();

const { commonTrackPayload } = useSegement();
onMounted( async () => {
  await getBanks();
  if (isEdit.value) {
    selectedBank.value = banks.value.filter(bank => bank?.operator_id === selectedPaymentOption.value?.bankDetails?.operator_id)[0];
    accountName.value = `${getBupayload.value.firstname} ${getBupayload.value.lastname}`
    accountNumber.value = selectedPaymentOption.value?.pay_method_details;
  }
  else {
    selectedBank.value = "";
    accountName.value ="";
    accountNumber.value = "";
  }
  window.analytics.track(isEdit.value ? "View Manage a Withdrawal Option Page" : "View Add a Withdrawal Option Page", {
    ...commonTrackPayload(),
    withdrawal_option: 'bank',
  });
});

const handleConfirm = () => {
  window.analytics.track("Tap submit a withdrawal option details", {
    ...commonTrackPayload(),
    withdrawal_option: 'bank'
  })
  confirm.value = true;
};

const handleSelect = (e) => {
  const bank = e.target.value;
  window.analytics.track("Select bank to transfer", {
    ...commonTrackPayload(),
    withdrawal_option: 'bank',
    bank_selected: bank.name
  });
}

const deleteBank = () => {
  window.analytics.track("Tap delete a withdrawal option details", {
    ...commonTrackPayload(),
    withdrawal_option: 'bank'
  })
  isDelete.value = true;
}

</script>