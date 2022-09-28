import {ref, computed } from "vue";
import { useStore } from "vuex";
import { useGlobalProp } from "./globalProperties";
import { useState } from "./useState";

const accountName = ref('');
const selectedBank = ref(null);
const accountNumber = ref('');
const selectedPaymentOption = ref("");

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
    console.log(response);

    if (response.status) {
      router.push({ name: "ManageWithdrawal"});
      store.dispatch("paymentNotification", {
        text: `${selectedBank.value.name}. | Acc No: ${accountNumber.value} has been added`,
      })
      return;
    }
    store.dispatch("paymentNotification", {
        text: `Failed to add Add withdral option`,
        type: "error"
    });
    loading.value = false;
  };

  const addMpesa = async (phone) => {

    const payload = {
      "operator_id": 1,
      "operator_name": "MPESA",
      "user_account_no": phone,
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
      return;
    }
    store.dispatch("paymentNotification", {
        text: response.message,
        type: "error"
    });
    loading.value = false;
  };

  const deleteBank = async () => {
    const payload = {
      account_id: selectedPaymentOption.value.pay_detail_id
    }
    
    const fullPayload = {
      params: payload,
      url: "/api/v3/payout/account"
    }
    
    loading.value = true;
    const response = await store.dispatch('paymentAxiosDelete', fullPayload);
    loading.value = false;

    if (response.status) {
      router.push({ name: 'ManageWithdrawal'});
      store.dispatch("paymentNotification", {
        text: `${selectedPaymentOption.value.bankDetails.operator_name}. | Acc No: ${selectedPaymentOption.value.pay_method_detail} has been deleted`,
      })
      return;
    }

    store.dispatch("paymentNotification", {
      text: `Failed to delete`,
      type: "error"
    });
  }; 

  const deleteMpesa = async () => {
    const payload = {
      pay_detail_id: selectedPaymentOption.value.pay_detail_id,
      user_id: selectedPaymentOption.value.getBupayload.user_id,
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
    getBanks,
    addBank,
    addMpesa,
    deleteBank,
    deleteMpesa,
  }
}