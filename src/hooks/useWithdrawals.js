import {ref, computed } from "vue";
import { useStore } from "vuex";
import { useGlobalProp } from "./globalProperties";
import { useState } from "./useState";

const accountName = ref('');
const selectedBank = ref(null);
const accountNumber = ref('');
const selectedPaymentOption = ref("");
const phone = ref("");

export function useWithdrawals() {

  const banks = ref([]);
  const store = useStore();
  const loading = ref(false);
  const { route , router} = useGlobalProp();

  const { getBupayload } = useState();

  const isEdit = computed(() => {
    return route.params.edit ? true : false;
  });

  const getBanks = async () => {

    const payload = {
      country_code: getBupayload.value.country_code,
    }
    
    const fullPayload = {
      params: payload,
      url: `/api/v1/dashboard/bank`,
    }

    const response = await store.dispatch('paymentAxiosGet', fullPayload);
    banks.value = response;
  }

  const addBank = async () => {

    const payload = {
      "operator_id": selectedBank.value.operator_id,
      "operator_name": selectedBank.value.name,
      "user_account_no": accountName.value,
      "user_id": getBupayload.value.user_id,
      "country_code": getBupayload.value.country_code,
      "entity_id": getBupayload.value.entity_id,
      "test": false,
    };
    const fullPayload = {
      params: payload,
      url: "/api/v3/payout/account"
    }
    loading.value = true;
    const response = await store.dispatch("paymentAxiosPost", fullPayload);

    if (response.status) {
      router.push({ name: "ManageWithdrawal"});
      store.dispatch("paymentNotification", {
        text: `${selectedBank.value.name}. | Acc No: ${accountNumber.value} has been added`,
      })
      selectedPaymentOption.value = "";
      selectedBank.value = "";
      accountName.value = ""
      selectedBank.value = ""
      accountNumber.value = ""
      return;
    }
    store.dispatch("paymentNotification", {
        text: `Failed to add Add withdral option`,
        type: "error"
    });
    loading.value = false;
  };

  const addMpesa = async () => {

    const payload = {
      "operator_id": 1,
      "operator_name": "MPESA",
      "user_account_no": phone.value,
      "user_id": getBupayload.value.user_id,
      "country_code": getBupayload.value.country_code,
      "entity_id": getBupayload.value.entity_id,
      "test": false,
    };

    const fullPayload = {
      params: payload,
      url: "/api/v3/payout/account"
    }
    loading.value = true;
    const response = await store.dispatch("paymentAxiosPost", fullPayload);

    if (response.status) {
      router.push({ name: "ManageWithdrawal"});
      store.dispatch("paymentNotification", {
        text: `M-PESA | Mobile No: ${phone.value} has been added`,
      })
      selectedPaymentOption.value = "";
      selectedBank.value = "";
      accountName.value = ""
      selectedBank.value = ""
      accountNumber.value = ""
      return;
    }
    store.dispatch("paymentNotification", {
        text: response.message,
        type: "error"
    });
    loading.value = false;
  };

  const deleteBank = async () => {
  
    const fullPayload = {
      url: `/api/v3/payout/account/${selectedPaymentOption.value.pay_detail_id}`
    }
    
    loading.value = true;
    const response = await store.dispatch('paymentAxiosDelete', fullPayload);
    loading.value = false;

    if (response.status) {
      router.push({ name: 'ManageWithdrawal'});
      store.dispatch("paymentNotification", {
        text: `${selectedPaymentOption.value.bankDetails.operator_name}. | Acc No: ${selectedPaymentOption.value.pay_method_details} has been deleted`,
      })
      selectedPaymentOption.value = "";
      selectedBank.value = "";
      accountName.value = ""
      selectedBank.value = ""
      accountNumber.value = ""
      return;
    }

    store.dispatch("paymentNotification", {
      text: `Failed to delete`,
      type: "error"

    });
  }; 

  const deleteMpesa = async () => {
    console.log('delete mpesa')
    const payload = {
      pay_detail_id: selectedPaymentOption.value.pay_detail_id,
      user_id: getBupayload.value.user_id,
    };

    const fullPayload = {
      url: "/delete_payment_method",
      params: payload,
    };

    loading.value = true;
    const response = await store.dispatch('paymentAxiosPost', fullPayload);
    loading.value = false;

    if (response.status) {
      router.push({ name: 'ManageWithdrawal'});
      store.dispatch("paymentNotification", {
        text: `M-PESA | Mobile No: ${selectedPaymentOption.value.pay_method_details} has been removed`,
      })
      return;
    }
    store.dispatch("paymentNotification", {
      text: response.message,
      type: "error" 
    })
  }

  return {
    isEdit,
    accountName,
    selectedBank,
    accountNumber,
    banks,
    selectedPaymentOption,
    loading,
    phone,
    getBanks,
    addBank,
    addMpesa,
    deleteBank,
    deleteMpesa,
  }
}