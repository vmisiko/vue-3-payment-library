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

      <div class="mgt-5">

        <div class="textfield mgt-5">
          <label for="" class="normal-text"> Bank Name</label>
          <select
            v-model="bankName"
            class="phone-input"
            required
          >   
            <option selected> Select your bank </option>
            <option value="kcb"> KCB</option>
            <option value="coorp"> CO-ORP</option>
            <option value="equity"> Equity</option>
          </select>
        </div>

        <div class="textfield mgt-5">
          <label for="" class="normal-text"> Account Name</label>
          <input
            type="text"
            v-model="accountName"
            class="phone-input"
            placeholder="Enter your account name"
          /> 
        </div>

        <div class="textfield mgt-5">
          <label for="" class="normal-text"> Account Number</label>
          <input
            type="text"
            v-model="accountNumber"
            class="phone-input"
            placeholder="Enter your account number"
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
        @click="handleConfirm"
        color="primary"
        :block="true"
        text="Continue"
        />
      </div>
    </div>
    <ConfirmDetailsModal :show="confirm"  @close="confirm=false"/>
    <ConfirmDeleteModal :show="isDelete"  @close="isDelete=false"/>
  </div>
  
</template>

<script setup>
import { computed, ref } from 'vue';
import TopInfo from '../../components/topInfo.vue';
import { useGlobalProp } from '../../hooks/globalProperties';
import ConfirmDetailsModal from './components/ConfirmDetails.vue';
import ConfirmDeleteModal from './components/ConfirmDelete.vue';

const icon = ref('back');
const confirm = ref(false);
const isDelete = ref(false);
const accountName = ref('');
const bankName = ref('');
const accountNumber = ref('');
const { router, route } =useGlobalProp();

const handleConfirm = () => {
  console.log('handleConfirm');
  confirm.value = true;
  console.log('handleConfirm', confirm.value);

};

const isEdit = computed(() => {
  console.log(route.params.edit);
  return route.params.edit ? true : false;
});

</script>