<template>
  <div class="flex-center">
    <div class="card-min">
      <TopInfo
        :icon="icon"
        :title="title"
        :mpesaCode="$route.params.reciept"
      />

    <div>
      <div class="mgt-8">
        <span class="normal-text">
          {{
            $translate("amount_paid")
          }}</span
        >

        <div class="float-right">
          <span class="amount-text" >
            {{ getBupayload.currency }} {{ formatCurrency(getBupayload.amount) }}
          </span>
        </div>
      </div>

      <hr class="margin-hr" />

      <div class="mgt-8">
        <span class="normal-text">
          {{
            `Payment Method`
          }}</span
        >

        <div class="direction-flex float-right">
          <img
            v-if="selectedPaymentOption.pay_method_id === 1"
            :src="require(`../../assets/withdrawals/${selectedPaymentOption.pay_method_name.toLowerCase()}`)"
            alt=""
          />
          <IconView
            class="mgt-n2"
            v-if="selectedPaymentOption.pay_method_id === 10"
            icon="bank"
            width="34"
            height="24"
          />
          <span
            class="mgl-2 text-caption-1"
            v-if="selectedPaymentOption.pay_method_id === 1"
          >
            {{ selectedPaymentOption.pay_method_name }}</span
          >

          <span
            class="mgl-2 text-caption-1"
            v-if="selectedPaymentOption.pay_method_id === 10"
          >
            {{ selectedPaymentOption.bankDetails.operator_name }}
          </span>
        </div>
      </div>
    </div>

    <hr class="margin-hr" />

      <div class="mgt-8">
        <div>
          <span class="body-2-semibold text-gray80">Withdrawal Details</span>
        </div>
        <div class="direction-flex" v-if="selectedPaymentOption?.pay_method_id === 10">
          
          <img class="mgy-auto" :src="require('../../assets/withdrawals/bank-withdrawal.svg')" alt="">

          <div class="mgl-4">
            <span class="text-caption-1 semi-bold text-gray90">Bank Name</span>: <span class="text-caption-1">{{ selectedPaymentOption?.bankDetails?.operator_name   || "N/A" }}</span> <br/>
            <span class="text-caption-1 semi-bold text-gray90">Acc Name</span>: <span class="text-caption-1">{{ `${getBupayload.firstname} ${getBupayload.lastname}` }}</span> <br/>
            <span class="text-caption-1 semi-bold text-gray90">Acc No</span>: <span class="text-caption-1">{{ selectedPaymentOption.pay_method_details }}</span> <br/>
          </div>
        </div>

        <div class="direction-flex mgt-5" v-if="selectedPaymentOption?.pay_method_id === 1">
          <img class="mgy-auto"  :src="require('../../assets/withdrawals/m-pesa-withdrawal.svg')" alt="">
          <div class="mgl-4">
            <span class="text-caption-1 semi-bold text-gray90">M-PESA</span> <br/>
            <span class="text-caption-1 semi-bold text-gray90">Mobile Number</span>: <span class="text-caption-1">{{ selectedPaymentOption.pay_method_details || "N/A" }}</span> <br/>
          </div>
        </div>
      </div>

      <div class="mgt-8 text-right">
        <sendy-btn
          :block="true"
          :loading="loading"
          color="primary"
          @click="routing"
        >
          {{ this.$translate("done") }}
        </sendy-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { mapGetters, mapMutations } from "vuex";
import TopInfo from "../../components/topInfo";
import PaymentDetail from "../../components/paymentDetail";
import { useState } from '../../hooks/useState';
import { useWithdrawals } from '../../hooks/useWithdrawals';
import { useGlobalProp } from '../../hooks/globalProperties';
import { useSegement } from '../../hooks/useSegment';

const icon = ref("success");
const title = ref("Withdrawal Successful");
const subtitle = ref("");
const loading = ref("");
const mpesaCode = ref("");

const { getBupayload , getSavedPayMethods, } = useState()
const { selectedPaymentOption , formatCurrency } = useWithdrawals();
const { route, router} = useGlobalProp();
const { commonTrackPayload } = useSegement();

const routing = () => {
  window.analytics.track("Done after Successful Payment", {
    ...commonTrackPayload(),
    duration_of_response: null,
  });
  router.push(localStorage.entry_route);
};


</script>
