<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" title="M-PESA">
        <template v-slot:subtitle>
          <span class="body-2-regular text-gray70">
            Enter your M-PESA details
          </span>
        </template>
      </TopInfo>

      <div class="mgt-5">

        <div class="textfield mgt-5">
          <label for="" class="normal-text"> Mobile Number</label>
          <vue-tel-input
            v-model="phone"
            autoFormat
            :defaultCountry="getBupayload.country_code"
            :dropdownOptions="dropdownOptions"
            mode="national"
            :invalidMsg="$translate('phone_number_invalid')"
            @validate="validatePhone"
          >
          </vue-tel-input>
        </div>
      </div>

      <div v-if="isEdit" @click="isDelete=true" class="mgt-8 text-btn direction-flex pointer" >
        <IconView icon="delete" />
        <span class="text-btn"> Remove Option </span>
      </div>

      <div class="mgy-10"></div>

      <div>
        <sendy-btn
        v-if="!isEdit"
        @click="handleConfirm"
        color="primary"
        :block="true"
        text="Continue"
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
import { computed, ref } from 'vue';
import { VueTelInput } from "vue3-tel-input";
import TopInfo from '../../components/topInfo.vue';
import { useGlobalProp } from '../../hooks/globalProperties';
import ConfirmDetailsModal from './components/ConfirmDetails.vue';
import ConfirmDeleteModal from './components/ConfirmDelete.vue';
import { useState } from '../../hooks/useState';

const icon = ref('back');
const formattedPhone = ref("");
const disable = ref(false);
const phone = ref("");
const confirm = ref(false);
const isDelete = ref(false);
const dropdownOptions = ref({
  disabled: true,
  showFlags: true,
  showDialCodeInSelection: true,
});

const { getBupayload } = useState();

const { router, route } = useGlobalProp();

const handleConfirm = () => {
  console.log('handleConfirm');
  confirm.value = true;
  console.log('handleConfirm', confirm.value);

};

const validatePhone = (val) => {
  phone.value = val.valid ? val.number.split("+")[1] : null;
  formattedPhone.value = `+${val.countryCallingCode} ${val.nationalNumber}`;
  disable.value = val.valid;
  if (val.valid) {
    error.value = '';
  }
};

const isEdit = computed(() => {
  return route.params.edit ? true : false;
});

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