<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" title="Withdrawal Options">
        <template v-slot:subtitle>
          <span class="body-2-regular text-gray70">
            Manage your payment withdrawal options
          </span>
        </template>
      </TopInfo>


      <div class="direction-flex mgt-5">
        <IconView icon="bank"  class="mgy-auto"/>
        <div class="mgl-4">
          <span class="text-caption-1 semi-bold">Absa Bank</span> <br/>
          <span class="text-caption-1  text-gray80">Acc Name : Arabica Coffee</span> <br/>
          <span class="text-caption-1 text-gray80">Acc No : 10002345678910</span> <br/>
        </div>
        
        <span class="spacer"></span>

        <IconView class="mgy-auto" icon="chevron-right" />
      </div>
      <hr
        class="margin-hr mgt-n2"
      />

      <span class="link mgt-5">
        + {{ $translate("add_withdraw_option") }}</span
      >

      <div class="mgy-10"></div>

        <sendy-btn
        color="primary"
        :block="true"
        text="Done"
        />
      
      <div class="mgy-10"></div>

    </div>
  </div>
  
</template>

<script setup>
import { ref } from 'vue';
import TopInfo from '../../components/topInfo.vue';

const icon = ref('back');
const confirm = ref(false);
const accountName = ref('');
const bankName = ref('');
const accountNumber = ref('');

const handleConfirm = () => {
  console.log('handleConfirm');
  confirm.value = true;
  console.log('handleConfirm', confirm.value);

};

</script>