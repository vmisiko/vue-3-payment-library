<template>
  <div class="flex-center">
    <div class="card">
      <TopInfo :icon="icon" :title="title" />

      <div class="">
        <span class="text-caption-1"> {{ $translate("amount_to_pay") }}</span>

        <div class="float-right">
          <span class="text-caption-1">
            {{ getBupayload.currency }}
            {{ $formatCurrency(getBupayload.amount) }}
          </span>
        </div>

        <hr />

        <IconView icon="mpesa" width="68px" height="48px" />

        <div class="mgt-3">
          <span class="text-list-title"> {{ $translate("payment_instruction") }}</span>
          <div class="mgt-4 pdl-4">
            <ol style="padding-left: 0px">
              <li class="text-body-2">{{ $translate("open_mpesa") }}</li>
              <li class="text-body-2 mgt-2">
                {{ $translate("select_lipa_na_mpesa") }}
              </li>
              <li class="text-body-2 mgt-2">
                {{ $translate("enter_business_no") }}
                <span class="text-bold"> {{ shortCode ?? getBupayload.paybill_no }} </span>
                
                <span>
                  <svg
                    v-if="loadingShortCode"
                    width="10px"
                    height="10px"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    style="
                      margin: auto;
                      background: #ffff;
                      display: block;
                      shape-rendering: auto;
                    "
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      fill="none"
                      stroke="#868686"
                      stroke-width="10"
                      r="35"
                      stroke-dasharray="164.93361431346415 56.97787143782138"
                    >
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        repeatCount="indefinite"
                        dur="1s"
                        values="0 50 50;360 50 50"
                        keyTimes="0;1"
                      ></animateTransform>
                    </circle>
                  </svg>
                  <CopyWidget v-else class="mgl-3" :text="shortCode || getBupayload.paybill_no" /> 
                </span>
              </li>
              <li class="text-body-2 mgt-2 ">
                {{ $translate("enter_account_no") }}
                <span class="text-bold"> {{ getBupayload.txref }} </span>
                <CopyWidget class="mgl-3" :text="getBupayload.txref" />
              </li>
              <li class="text-body-2 mgt-2">
                {{ $translate("enter_amount_no") }}
                <span class="text-bold">
                  {{ getBupayload.currency }}
                  {{ $formatCurrency(getBupayload.amount) }}
                </span>
                <CopyWidget class="mgl-3" :text="getBupayload.amount" />
              </li>
              <li class="text-body-2 mgt-2">
                {{ $translate("enter_mpesa_pin") }}
              </li>
              <li class="text-body-2 mgt-2">
                {{ $translate("confirmation_from_mpesa") }}
              </li>
              <li class="text-body-2 mgt-2">
                {{ $translate("click_complete_payment") }}
              </li>
            </ol>
          </div>
        </div>

        <div class="mgt-8">
          <sendy-btn
            :loading="loading"
            color="primary"
            class="float-right"
            @click="pollC2B"
          >
            {{ $translate("complete_payment") }}
          </sendy-btn>
        </div>
      </div>
      <TimerModal :show="showTimer" />
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { mapGetters, mapMutations } from "vuex";
import TopInfo from "../components/topInfo";
import TimerModal from "../components/modals/timerModal";
import paymentGenMxn from "../mixins/paymentGenMxn";
import { useChoosePayment } from "../hooks/useChoosePayment";
import CopyWidget from "../components/CopyWIdget";
import { useGlobalProp } from '../hooks/globalProperties';

export default {
  name: "MpesaC2B",
  components: {
    TopInfo,
    TimerModal,
    CopyWidget,
  },
  mixins: [paymentGenMxn],
  setup() {
    const shortCode = ref(null);
    const loadingShortCode = ref(false);
    const { getPaybill } = useChoosePayment();
    const { t } = useGlobalProp();
    
    onMounted(async () => {
      loadingShortCode.value= true;
      const res = await getPaybill();
      loadingShortCode.value = false;
      shortCode.value = res.short_code;
    });

    return {
      getPaybill,
      shortCode,
      loadingShortCode,
      t,
    }
  },
  data() {
    return {
      icon: "back",
      title: this.t("pay_with_mpesa"),
      loading: false,
      poll_count: 0,
      poll_limit: 30,
      showTimer: false,
    };
  },
  computed: {
    ...mapGetters(["getBupayload"]),
  },
  methods: {
    ...mapMutations(["setErrorText"]),
    pollC2B() {
      this.poll_count = 0;
      this.showTimer = true;

      window.analytics.track("Complete Payment", {
        ...this.commonTrackPayload(),
        payment_method: "M-PESA",
      });

      for (let poll_count = 0; poll_count < this.poll_limit; poll_count++) {
        const that = this;
        (function (poll_count) {
          setTimeout(() => {
            if (that.poll_count === that.poll_limit) {
              poll_count = that.poll_limit;
              return;
            }

            that.TransactionIdStatus();
            if (poll_count === that.poll_limit - 1) {
              that.loading = false;
              that.showTimer = false;
              that.promptInfo = false;
              that.setErrorText('Your paybill payment has not yet been received, please make the payment and retry. In case the error persists, contact our customer support team for assistance.');
              that.$router.push({
                name: "FailedView",
                params: { mpesa: "mpesa" },
              });
              return;
            }
          }, 10000 * poll_count);
        })(poll_count);
      }
    },

    async TransactionIdStatus() {
      const payload = {
        url: `/api/v1/process/refstatus/${this.getBupayload.txref}`,
      };
      this.$paymentAxiosGet(payload).then((res) => {
        if (res.status) {
          switch (res.transaction_status) {
            case "success":
              this.poll_count = this.poll_limit;
              this.$paymentNotification({
                text: res.message,
              });
              this.loading = false;
              this.showTimer = false;
              (this.promptInfo = false),
                this.$router.push({
                  name: "SuccessView",
                  params: { reciept: res.receipt_no },
                });
              break;
            case "failed":
              this.poll_count = this.poll_limit;
              this.loading = false;
              this.setErrorText('Your paybill payment has not yet been received, please make the payment and retry. In case the error persists, contact our customer support team for assistance.');
              this.showTimer = false;
              (this.promptInfo = false),
                this.$router.push({
                  name: "FailedView",
                  params: { mpesa: "mpesa" },
                });
              break;
            case "pending":
              break;
            default:
              break;
          }
          return res;
        }
        this.poll_count = this.poll_limit;
        this.loading = false;
        this.showTimer = false;
        this.promptInfo = false;
        that.setErrorText('Your paybill payment has not yet been received, please make the payment and retry. In case the error persists, contact our customer support team for assistance.');
        this.$router.push({ name: "FailedView", params: { mpesa: "mpesa" } });
      });
    },
  },
};
</script>

<style lang="scss">
.text-bold {
  font-family: Nunito;
  font-style: normal;
  font-weight: bold;
  font-size: 15px;
  line-height: 24px;
  color: #606266;
}
</style>
