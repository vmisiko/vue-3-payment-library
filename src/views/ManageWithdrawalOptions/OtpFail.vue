<template>
  <div class="flex-center">
   <div class="relative card-min height-space ">
      <div class="mgy-20 text-center">
        <svg width="144" height="150" viewBox="0 0 144 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle opacity="0.5" cx="72" cy="78" r="72" fill="#FBDECF"/>
          <path d="M17.9946 68.2643L36.2094 136.243C36.5992 137.698 38.0947 138.561 39.5496 138.171L134.386 112.76C135.841 112.37 136.704 110.875 136.314 109.42L131.373 90.9793L91.8582 101.567C84.5837 103.517 77.1063 99.1996 75.1571 91.925C73.2079 84.6505 77.525 77.1732 84.7995 75.224L124.315 64.6359L119.411 46.3351C119.028 44.9064 117.576 44.0433 116.138 44.3895L110.604 45.7219L25.4119 68.549C22.8701 69.23 20.3014 69.0796 17.9946 68.2643ZM10.3838 60.7454C10.257 60.398 10.1445 60.042 10.0469 59.678L9.76458 58.6243C7.81537 51.3497 12.1324 43.8724 19.4069 41.9232L35.213 37.688C36.6679 37.2981 38.1634 38.1615 38.5532 39.6164C38.9431 41.0714 38.0797 42.5668 36.6248 42.9567L20.8187 47.1919C16.454 48.3614 13.8637 52.8478 15.0333 57.2125L15.3156 58.2663C16.3292 62.049 20.2174 64.2939 24.0002 63.2803L106.719 41.116L102.483 25.3099L89.3116 28.8393C87.8567 29.2291 86.3613 28.3657 85.9714 26.9108C85.5816 25.4559 86.445 23.9604 87.8999 23.5706L103.706 19.3353C105.161 18.9455 106.656 19.8089 107.046 21.2638L112.006 39.7739L114.862 39.0864C119.176 38.0479 123.531 40.6373 124.68 44.9234L141.583 108.008C142.753 112.373 140.162 116.859 135.798 118.029L40.9613 143.44C36.5966 144.609 32.1102 142.019 30.9407 137.655L10.4705 61.2586C10.4246 61.0875 10.3961 60.9158 10.3838 60.7454ZM129.962 85.7107L125.726 69.9046L86.2112 80.4927C81.8465 81.6622 79.2563 86.1486 80.4258 90.5133C81.5953 94.878 86.0817 97.4682 90.4465 96.2987L129.962 85.7107ZM95.0093 92.2526C92.0995 93.0323 89.1085 91.3055 88.3288 88.3957C87.5492 85.4859 89.276 82.4949 92.1858 81.7153C95.0956 80.9356 98.0865 82.6624 98.8662 85.5722C99.6459 88.482 97.9191 91.4729 95.0093 92.2526Z" fill="#9B101C"/>
          <g clip-path="url(#clip0_425_14775)">
          <path d="M58.0333 15.028C50.4878 17.0498 46.0049 24.8145 48.0267 32.3599C50.0485 39.9054 57.8132 44.3883 65.3586 42.3665C72.904 40.3447 77.387 32.58 75.3652 25.0346C73.3434 17.4892 65.5787 13.0062 58.0333 15.028ZM62.0622 30.0642C61.3104 30.2656 60.5304 29.8153 60.329 29.0635L58.8639 23.5958C58.6625 22.844 59.1128 22.0641 59.8646 21.8627C60.6164 21.6612 61.3963 22.1115 61.5978 22.8633L63.0628 28.331C63.2643 29.0828 62.814 29.8628 62.0622 30.0642ZM64.8942 35.1656L62.1603 35.8982L61.4278 33.1643L64.1616 32.4318L64.8942 35.1656Z" fill="#9B101C"/>
          </g>
          <defs>
          <clipPath id="clip0_425_14775">
          <rect width="33.9635" height="33.9635" fill="white" transform="translate(40.8976 16.6894) rotate(-15)"/>
          </clipPath>
          </defs>
        </svg>

        <div class="text-center mt-5">
          <span class="text-gray90 text-body-1 semi-bold">{{ $translate("oops") }}</span>

          <div class="text-center ">
            <span class="text-body-2 text-gray70"> {{ $translate("entered_incorrect_code") }} </span>
          </div>
        </div>
      </div>

      
      <sendy-btn
        @click="submit"
        color="primary"
        :block="true"
        :text="$translate('resend')"
        :loading="loading"
        />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useGlobalProp } from "../../hooks/globalProperties";
import { useOtp } from "../../hooks/useOtp";
import { useSegement } from "../../hooks/useSegment";
import { useWithdrawals } from "../../hooks/useWithdrawals";

const store = useStore();
const { router } = useGlobalProp();
const { getOtp, loading } = useOtp();
const { commonTrackPayload } = useSegement();
const { selectedPaymentOption } = useWithdrawals();

onMounted(() => {
  window.analytics.track("View failed add withdrawal option page", {
    ...commonTrackPayload(),
  })
})
const submit = async () => {
  window.analytics.track("Tap resend OTP", {
    ...commonTrackPayload(),
    withdrawal_option: selectedPaymentOption.value?.pay_method_name ?? selectedPaymentOption.value?.name,
  })
  const response = await getOtp();
  if (response.status) {
    router.push({ name: 'ConfirmOtp' });
    return;
  }
  store.dispatch('paymentNotification' , {
    text: response.message,
    type: "error"
  });
}


</script>

