import full from "core-js/full";
import {ref, computed } from "vue";
import { useStore } from "vuex";
import { useGlobalProp } from "./globalProperties";
import { useState } from "./useState";

const accountName = ref('');
const selectedBank = ref(null);
const accountNumber = ref('');

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

  const deleteBank = async () => {
    const payload = {
      account_id: "",
    }
    
    const fullPayload = {
      params: payload,
      url: "/api/v3/payout/account"
    }

    const response = await store.dispatch('paymentAxiosDelete', fullPayload);
    
    if (response.status) {
      router.push({ name: 'ManageWithdrawal'});
    }
  }; 

  return {
    isEdit,
    accountName,
    selectedBank,
    accountNumber,
    banks,
    getBanks,
    addBank,
    deleteBank,
  }
}