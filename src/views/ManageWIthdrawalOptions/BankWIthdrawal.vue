<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" :title="$translate('bank')">
        <template v-slot:subtitle>
          <span class="body-2-regular text-gray70">
            Enter your bank account details
          </span>
        </template>
      </TopInfo>
      <form @submit.prevent="handleConfirm">
        <div class="mgt-5">

          <div class="textfield mgt-5">
            <label for="" class="normal-text"> Bank Name</label>
            <select
              v-model="selectedBank"
              class="phone-input"
              required
            >   
              <option :value="null" selected> Select your bank </option>
              <option v-for="(bank, index) in banks" :key="index" :value="bank"> {{ bank.name }}</option>
            </select>
          </div>

          <div class="textfield mgt-5">
            <label for="" class="normal-text"> Account Name</label>
            <input
              type="text"
              v-model="accountName"
              class="phone-input"
              placeholder="Enter your account name"
              required
            /> 
          </div>

          <div class="textfield mgt-5">
            <label for="" class="normal-text"> Account Number</label>
            <input
              type="text"
              v-model="accountNumber"
              class="phone-input"
              placeholder="Enter your account number"
              required
            /> 
          </div>
        </div>

        <div v-if="isEdit" @click="isDelete=true" class="mgt-8 text-btn direction-flex pointer" >
          <IconView icon="delete" />
          <span class="text-btn"> Remove bank </span>
        </div>

        <div class="mgy-10"></div>

        <div>
          <sendy-btn
          v-if="!isEdit"
          type="submit"
          color="primary"
          :block="true"
          text="Continue"
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

onMounted( async () => {
  await getBanks();
  if (isEdit.value) {
    selectedBank.value = banks.value.filter(bank => bank?.operator_id === selectedPaymentOption.value?.bankDetails?.operator_id)[0];
    accountName.value = `${getBupayload.value.firstname} ${getBupayload.value.lastname}`
    accountNumber.value = selectedPaymentOption.value?.pay_method_details;
  }
});

const handleConfirm = () => {
  confirm.value = true;
};

</script>