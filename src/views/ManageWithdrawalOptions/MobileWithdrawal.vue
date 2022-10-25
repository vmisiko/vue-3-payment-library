<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" title="M-PESA">
        <template v-slot:subtitle>
          <span class="body-2-regular text-gray70">
           {{ $translate('enter_mpesa_details') }}
          </span>
        </template>
      </TopInfo>

      <div class="mgt-5">

        <div class="textfield mgt-5">
          <label for="" class="normal-text"> {{ $translate('mobile_number') }}</label>
          <vue-tel-input
            v-model="phone"
            :value="phone"
            autoFormat
            :defaultCountry="getBupayload.country_code"
            :dropdownOptions="dropdownOptions"
            mode="national"
            :invalidMsg="$translate('phone_number_invalid')"
            @validate="validatePhone"
            :disabled="isEdit"
          >
          </vue-tel-input>
        </div>
      </div>

      <div v-if="isEdit" @click="deletePhone" class="mgt-8 text-btn direction-flex pointer" >
        <IconView icon="delete" />
        <span class="text-btn"> {{ $translate('remove_option') }} </span>
      </div>

      <div class="mgy-10"></div>

      <div class="text-right">
        <sendy-btn
        v-if="!isEdit"
        @click="handleConfirm"
        color="primary"
        :text="$translate('continue')"
        :disable="disable"
        />
      </div>
      <div class="mgy-10"></div>

    </div>
    <ConfirmDetailsModal :show="confirm"  @close="confirm=false"/>
    <ConfirmDeleteModal :show="isDelete"  @close="isDelete=false"/>
  </div>
  
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { VueTelInput } from "vue3-tel-input";
import TopInfo from '../../components/topInfo.vue';
import { useGlobalProp } from '../../hooks/globalProperties';
import ConfirmDetailsModal from './components/ConfirmDetails.vue';
import ConfirmDeleteModal from './components/ConfirmDelete.vue';
import { useState } from '../../hooks/useState';
import { useWithdrawals } from '../../hooks/useWithdrawals';
import { useSegement } from '../../hooks/useSegment';

const icon = ref('back');
const formattedPhone = ref("");
const disable = ref(false);
const confirm = ref(false);
const isDelete = ref(false);
const error = ref("");
const dropdownOptions = ref({
  disabled: true,
  showFlags: true,
  showDialCodeInSelection: true,
});

const { getBupayload } = useState();
const { commonTrackPayload } = useSegement(); 
const { router, route } = useGlobalProp();
const { phone, isEdit, selectedPaymentOption } = useWithdrawals();

onMounted(()=> {
  if (isEdit.value) {
    phone.value = selectedPaymentOption.value?.pay_method_details ? selectedPaymentOption.value?.pay_method_details?.toString(): "";
  };
  window.analytics.track(isEdit.value ? "View Manage a Withdrawal Option Page" : "View Add a Withdrawal Option Page", {
    ...commonTrackPayload(),
    withdrawal_option: 'M-PESA',
  });
});

const handleConfirm = () => {
  window.analytics.track("Tap submit a withdrawal option details", {
    ...commonTrackPayload(),
  });
  confirm.value = true;
};

const validatePhone = (val) => {
  phone.value = val.valid ? val.number.split("+")[1] : "";
  formattedPhone.value = `+${val.countryCallingCode} ${val.nationalNumber}`;
  disable.value = val.valid;
  if (val.valid) {
    error.value = '';
  }
};

const deletePhone = () => {
  window.analytics.track("Tap delete a withdrawal option details", {
    ...commonTrackPayload(),
  })
  isDelete.value = true;
}

</script>
<style>
 .vti__input {
    border: none;
    border-radius: 0 2px 2px 0;
    width: 100%;
    outline: none;
    padding: 16px 8px;
}
</style>