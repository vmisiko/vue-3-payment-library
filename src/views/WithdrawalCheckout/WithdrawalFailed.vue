<template>
  <div class="flex-center">
    <div class="card-min">
      <TopInfo
        :icon="icon"
        :title="$translate('withdrawal_failed')"
      />


      <div class="mgt-4 body-2-regular text-gray70">
        <span>{{ $translate('sorry_experiencing_technical_issues')}}
        </span> 

        <div class="mgt-5">
          <span>         
            {{ $translate('please_try_again_later') }}
          </span>
        </div>
      </div>


      <div class="mgt-8 text-right">
        <sendy-btn
          color="primary"
          class="mgt-10"
          @click="routing"
        >
          {{ $translate("close") }}
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

const icon = ref("warning");
const subtitle = ref("");
const loading = ref("");

const { getBupayload , getSavedPayMethods, } = useState()
const { selectedPaymentOption } = useWithdrawals();
const { route, router} = useGlobalProp();
const { commonTrackPayload } = useSegement();

const routing = () => {
  window.analytics.track("Tap close after failed withdrawal", {
    ...commonTrackPayload(),
    duration_of_response: route.params.duration,
  });
  router.push(localStorage.entry_route);
};


</script>
