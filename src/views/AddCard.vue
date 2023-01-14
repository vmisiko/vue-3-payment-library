<template>
  <div class="flex-center">
    <Processing
      :count="count"
      text="Processing your card details"
      v-if="getLoading"
    />
    <div v-else>
      <AdditionalCardFields
        :additionalData="additionalData"
        :transaction_id="transaction_id"
        v-if="showAdditionalCardFields"
        @continue="handleContinue"
      />
      <div class="card" v-if="!showAdditionalCardFields">
        <TopInfo :icon="icon" :title="title" />

        <form id="cc-form" @submit.prevent="onsubmit">
          <div class="form-group">
            <label class="text-caption-2">{{ $translate("cardholder_name") }}</label>
            <input
              type="text"
              v-model="card_name"
              class="form-field payment-input"
              :placeholder="$translate('enter_full_name')"
              required
            />
          </div>

          <div class="form-group mgt-4" v-if="getBupayload.isPayOnDelivery()">
            <label class="text-caption-2">{{ $translate("email") }}</label>
            <input
              type="text"
              v-model="email"
              class="form-field payment-input"
              :placeholder="$translate('enter_email')"
              required
            />
          </div>

          <div class="form-group mgt-4">
            <label for="cc-number" class="mgt-2 text-caption-2">{{
              $translate("card_number")
            }}</label>
            <span id="cc-number" class="form-field"> </span>
            <span class="text-caption-2 text-error" v-if="cardno">
              {{ cardno }}
            </span>
          </div>

          <div class="direction-flex mgt-4">
            <div class="form-group">
              <label for="cc-expiration-date" class="text-caption-2">{{
                $translate("expiry")
              }}</label>
              <span id="cc-expiration-date" class="form-field"> </span>
              <span class="text-caption-2 text-error" v-if="expirydate">
                {{ expirydate }}
              </span>
            </div>

            <div class="form-group mgl-8">
              <label for="cc-cvc" class="text-caption-2">{{ $translate("cvv") }}</label>

              <span id="cc-cvc" class="form-field"> </span>
              <IconView
                icon="cvv"
                class="float-right mgr-2 mgt-n10"
                @cvv="showModal = true"
              />
              <span class="text-caption-2 text-error" v-if="cvv">
                {{ cvv }}
              </span>
            </div>
          </div>

          <div class="mgt-11">
            <VgsSecure  />
          </div>
          <hr class="mgt-2">

          <div class="mgt-4 direction-flex pda-3" v-if="getBupayload.isPayOnDelivery()">
            <div class="">
              <span class="text-caption text-gray70">{{
                $translate("amount_to_pay")
              }}</span>
              <div class="payment-text-secondary">
                {{ getBupayload.currency }}
                {{ $formatCurrency(getBupayload.amount) }}
              </div>
            </div>
            <span class="spacer"></span>
            <sendy-btn
              color="primary"
              class="mgt-2"
              type="submit"
              :loading="loading"
            >
              {{ $translate("confirm_and_pay") }}
            </sendy-btn>
          </div>

          <div v-else >
            <div class="text-center">
              <span class="charge-text"> {{ $translate("in_order_to_verify") }} {{ getBupayload.currency }} {{ addCardAmount }} {{ $translate("and_refund_your_card") }} </span>
            </div>
            <sendy-btn
              :block="true"
              :loading="loading"
              color="primary"
              class="mgt-3"
              type="submit"
            >
              {{ $translate("add_card") }}
            </sendy-btn>
          </div>
        </form>
      </div>
    </div>
    <CvvModal :show="showModal" @close="showModal = !showModal" />
    <ErrorModal
      :show="showErrorModal"
      :text="errorText"
      :title="errorTitle"
      @close="handleErrorClose"
    />
  </div>
</template>
<script>
import { onMounted, toRefs, reactive, computed, ref} from "vue";
import TopInfo from "../components/topInfo";
import CvvModal from "../components/modals/cvvModal";
import ErrorModal from "../components/modals/ErrorModal";
import Processing from "../components/processing";
import AdditionalCardFields from "./AdditionalCardFields";
import { useGlobalProp } from '../hooks/globalProperties';
import { useState } from '../hooks/useState';
import { usePayment } from '../hooks/payment';
import { useStore } from 'vuex';
import { datadogRum } from "@datadog/browser-rum";
import { useSegement } from '../hooks/useSegment';
import VgsSecure from "../components/vgsSecure.vue";

export default {
  name: "AddCard",
  components: {
    TopInfo,
    CvvModal,
    ErrorModal,
    Processing,
    AdditionalCardFields,
    VgsSecure,
  },
  data() {
    return {
      icon: "back",
      title: this.getBupayload.isPayOnDelivery() ? this.$translate("enter_card_details") : this.$translate("add_a_card"), 
      showModal: false,
    };
  },
  setup() {
    const { sendyOptions, router, t } = useGlobalProp();
    const { getBupayload, getLoading, state } = useState();
    const {      
      pollCard,
      init3DS,
    } = usePayment();

    const store = useStore();

    const { commonTrackPayload } = useSegement();
    const cardState = reactive({
      cardno: "",
      card_name: "",
      email: "",
      expirydate: "",
      cvv: "",
    })
    
    onMounted(() => {
      setForm();
    });

    const addCardAmount = computed(() => {
      let computedAMount = 5;
      switch (getBupayload.value.country_code) {
        case 'UG':
          computedAMount = computedAMount * 100;
          break;
        case 'NG':
          computedAMount = computedAMount * 10;
          break;
        case 'CI':
          computedAMount = computedAMount * 10;
          break;
        default:
          computedAMount = computedAMount;
          break;
      }
      return computedAMount;
    });

    const vgsForm = window.VGSCollect.create(
      sendyOptions.config.VGS_VAULT_ID,
      sendyOptions.config.VGS_ENVIRONMENT,
      () => {}
    );

    async function loadVGS() {
      const script = document.createElement("script");
      script.src = 'https://js.verygoodvault.com/vgs-collect/2.12.0/vgs-collect.js';
      script.async = true;
      script.onload = () => {};
      document.body.appendChild(script);
      return;
    }

    function setForm() {

      const classes = {
        empty: "field--empty",
        valid: "field--valid",
        invalid: "field--invalid",
        focused: "field--focused",
        dirty: "field--dirty",
        touched: "field--touched",
      };

      vgsForm.field("#cc-number", {
        type: "card-number",
        name: "cardno",
        successColor: "#4F8A10",
        errorColor: "#D8000C",
        showCardIcon: true,
        placeholder: "0000 0000 0000 0000",
        validations: ["required"],
        classes: classes,
      });

      vgsForm.field("#cc-cvc", {
        type: "card-security-code",
        name: "cvv",
        placeholder: "***",
        validations: ["required", "validCardSecurityCode"],
        showCardIcon: false,
        classes: classes,
      });

      vgsForm.field("#cc-expiration-date", {
        type: "card-expiration-date",
        name: "expirydate",
        successColor: '#4F8A10',
        errorColor: '#D8000C',
        placeholder: "MM/YY",
        serializers: [{ name: "replace", options: { old: " ", new: "" } }],
        validations: ["required", "validCardExpirationDate"],
        classes: classes,
      });

    }

    function setErrors() {
      const state = vgsForm.state;
      const errors = [];
      for (const [key, value] of Object.entries(state)) {
        cardState[key] = !value.isValid ? value.errorMessages[0] : "";
        if (!value.isValid) {
          errors.push(key);
        }
      }

      return errors.length ? false : true;
    }

    function onsubmit() {
      window.analytics.track("Submit Add Card", {
        ...commonTrackPayload(),
        payment_method: "card",
      });

      const isValid = setErrors();
      if (!isValid) {
        return;
      }

      const cardname = cardState.card_name?.split(" ");
      const firstname = cardname[0] ?? getBupayload.value.firstname;
      const lastname = cardname[1] ?? getBupayload.value.lastname;
      const newCardPayload = {
        country: getBupayload.value.country_code,
        currency: getBupayload.value.currency,
        email: getBupayload.value.isPayOnDelivery() ? cardState.email : getBupayload.value.email,
        firstname: firstname,
        lastname: lastname,
        phonenumber: getBupayload.value.phonenumber,
        userid: getBupayload.value.user_id,
        company_code: getBupayload.value.company_code,
      };

      state.loading = true;
      vgsForm.submit(
        "/customers/collect_card_details",
        {
          data: newCardPayload,
          headers: {
            Authorization: getBupayload.value.authToken,
          },
        },
        (status, response) => {
          if (status === 200) {
            const reponseData = response.data;
            delete reponseData['language'];
            processNewCard(reponseData);
            // saveNewCard(reponseData)
            state.loading = false;
          }
        },
        (error) => {
          state.loading = false;
          state.showErrorModal = true;
          datadogRum.addError(error);
        }
      );
    }

    const processNewCard = async (reponseData) => {
      store.commit('setLoading', true);
      window.analytics.track("Processing your card", {
        ...commonTrackPayload(),
        payment_method: "card",
      });
      const additionalPayload = {
        amount: getBupayload.value.isPayOnDelivery() ? getBupayload.value.amount : addCardAmount.value,
        bulk: false,
        entity: getBupayload.value.isPayOnDelivery() ? getBupayload.value.entity_id : 1,
        pay_direction: getBupayload.value.pay_direction,
        paymethod: 2,
        save: true,
        txref: getBupayload.value.isPayOnDelivery() ? getBupayload.value.txref : `AC_${new Date().getTime()}`,
        platform: 'web',
        test: getBupayload.value.test ?? false,
      };

      reponseData = {...reponseData, ...additionalPayload};
      
      const payload = {
        url: getBupayload.value.isPayOnDelivery()  ? "/api/v3/pod/process" :"/api/v3/process",
        params: reponseData,
      };

      const res = await store.dispatch('paymentAxiosPost', payload);
      state.transaction_id = res.transaction_id;

      if (res.status) {
        state.transactionStatus = res.transaction_status.toLowerCase();

        if (res.additional_data) {
          state.additionalData = res.additional_data;
          state.is3DS = res.redirect;
          if (res.redirect) {
            init3DS();
            return;
          }
          state.showAdditionalCardFields = true;
          store.commit('setLoading', false);
          return;
        }

        switch (res.transaction_status.toLowerCase()) {
          case "pending":
            pollCard();
            break;
          case "success":
            store.commit('setLoading', false);
            store.dispatch('paymentNotification', {
              text: t("card_details_added"),
            });
            window.analytics.track("Payment option saved successfully", {
              ...commonTrackPayload(),
              message: res.message,
              payment_method: "card",
            });
            
            getBupayload.value.isPayOnDelivery() ? 
            router.push({
              name: "SuccessView",
              duration: duration,
            }) 
            : router.push("/choose-payment");
            state.loading = false;
            break;
          default:
            break;
        }
        return;
      }

      state.showProcessing = false;
      store.commit('setLoading', false);
      window.analytics.track("Payment option not saved successfully", {
        ...commonTrackPayload(),
        reason: res.message,
        sendy_error_code: "",
        message: res.message,
        payment_method: "card",
      });
      state.errorText = res?.message ?? t('unabled_to_confirm_payment_text');
      state.errorTitle = t('unable_to_confirm_payment');
      state.showErrorModal = true;
      datadogRum.addError(new Error(res.message));
      return;
    }

    function initForm() {
      setTimeout(() => {
        setForm();
      }, 500);
    }

    function handleContinue(val) {
      if (val) {
        store.commit('setLoading', false);
        state.showProcessing = true;
        pollCard();
        return;
      }
      state.showProcessing = false;
      store.commit('setLoading', false);
      initForm();
      state.errorText = t("failed_to_collect_card_details");
      window.analytics.track("Payment option not saved successfully", {
        ...commonTrackPayload(),
        mesage: t("failed_to_collect_card_details"),
        reason: t("failed_to_collect_card_details"),
        sendy_error_code: '',
        payment_method: "card",
      });
      state.showErrorModal = true;
      datadogRum.addError('Failed to continue with Additional data flow');

    }

    function handleErrorClose() {
      state.showErrorModal = false;
      state.showAdditionalCardFields = false;
     
      getBupayload.value.isPayOnDelivery() ? setForm() : router.push({ name: "ChoosePayment" })
    }

   
    return {
      ...toRefs(cardState),
      ...toRefs(state),
      getLoading,
      getBupayload,
      addCardAmount,
      onsubmit,
      handleErrorClose,
      handleContinue,
      
    }
  },
};
</script>

<style lang="scss">
form {
  padding: 0px !important;
}

.form-name {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 8px;
  position: absolute;
  height: 40px;
  left: 0px;
  right: 0px;
  top: 0px;
  background: #ffffff;
  border: 0.5px solid #c0c4cc;
  box-sizing: border-box;
  border-radius: 4px;
}

.form-field {
  display: block;
  height: 40px;
  width: -webkit-fill-available;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-field iframe {
  border: 0 none transparent;
  height: 100%;
  vertical-align: middle;
  width: 100%;
}

.form-field.field--valid iframe {
  border-color: #249e4c;
}

.text-caption-2 {
  font-family: Nunito;
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: #606266;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  padding-top: 150px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.5);
}

/* Modal Content */
.modal-content-pl {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 32px;
  border: 1px solid #888;
  border-radius: 4px;
  width: 300px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s;
}

/* Add Animation */
@-webkit-keyframes animatetop {
  from {
    top: -300px;
    opacity: 0;
  }
  to {
    top: 0;
    opacity: 1;
  }
}

@keyframes animatetop {
  from {
    top: -300px;
    opacity: 0;
  }
  to {
    top: 0;
    opacity: 1;
  }
}

/* The Close Button */
.close {
  color: black;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.charge-text {
  font-family: Nunito;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 0.2px;
  color: #909399;
}
</style>
