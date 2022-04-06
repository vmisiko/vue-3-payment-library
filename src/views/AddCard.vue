<template>
  <div class="flex-center">
    <Processing
      :count="count"
      text="Processing your card details"
      v-if="showProcessing && !showAdditionalCardFields"
    />
    <AdditionalCardFields
      :additionalData="additionalData"
      :transaction_id="transaction_id"
      v-if="!showProcessing && showAdditionalCardFields"
      @continue="handleContinue"
    />
    <div class="card-min" v-if="!showProcessing && !showAdditionalCardFields">
      <TopInfo :icon="icon" :title="title" />

      <form id="cc-form" @submit.prevent="onsubmit">
        <div class="form-group">
          <label class="text-caption-2">{{ $t("cardholder_name") }}</label>
          <input
            type="text"
            v-model="card_name"
            class="form-field"
            placeholder="Enter full name"
            required
          />
        </div>

        <div class="form-group mgt-4">
          <label for="cc-number" class="mgt-2 text-caption-2">{{
            $t("card_number")
          }}</label>
          <span id="cc-number" class="form-field"> </span>
          <span class="text-caption-2 text-error" v-if="cardno">
            {{ cardno }}
          </span>
        </div>

        <div class="direction-flex mgt-4">
          <div class="form-group">
            <label for="cc-expiration-date" class="text-caption-2">{{
              $t("expiry")
            }}</label>
            <span id="cc-expiration-date" class="form-field"> </span>
            <span class="text-caption-2 text-error" v-if="expirydate">
              {{ expirydate }}
            </span>
          </div>

          <div class="form-group mgl-8">
            <label for="cc-cvc" class="text-caption-2">{{ $t("cvv") }}</label>

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

        <div class="mgt-10 text-center">
          <span class="charge-text"> {{ $t("in_order_to_verify") }}</span>
        </div>
        <sendy-btn
          :block="true"
          :loading="loading"
          color="primary"
          class="mgt-3"
          type="submit"
        >
          {{ $t("add_card") }}
        </sendy-btn>
      </form>
    </div>
    <CvvModal :show="showModal" @close="showModal = !showModal" />
    <ErrorModal
      :show="showErrorModal"
      :text="errorText"
      @close="handleErrorClose"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import TopInfo from "../components/topInfo";
import CvvModal from "../components/modals/cvvModal";
import ErrorModal from "../components/modals/ErrorModal";
import Processing from "../components/processing";
import AdditionalCardFields from "./AdditionalCardFields";

export default {
  name: "AddCard",
  components: {
    TopInfo,
    CvvModal,
    ErrorModal,
    Processing,
    AdditionalCardFields,
  },
  data() {
    return {
      loading: false,
      showSnackbar: true,
      showModal: false,
      showErrorModal: false,
      errorText: this.$t("card_declined"),
      icon: "back",
      title: this.$t("add_a_card"),
      form: {},
      cardno: "",
      card_name: "",
      expirydate: "",
      cvv: "",
      transaction_id: "",
      poll_count: 0,
      poll_limit: 30,
      showProcessing: false,
      vgs_valid_payment: false,
      cardType: null,
      showAdditionalCardFields: false,
      additionalData: null,
      is3DS: false,
      twoFACompleted: false,
      transactionStatus: null,
      count: false,
    };
  },
  computed: {
    ...mapGetters(["getBupayload", "getTwoFACompleted"]),
  },
  watch: {
    getTwoFACompleted(status) {
      this.twoFACompleted = status;

      if (status) {
        switch (this.transactionStatus) {
          case "pending":
            this.pollCard();
            break;
          case "success":
            this.showProcessing = false;
            this.$paymentNotification({
              text: this.$t("card_details_added"),
            });
            this.$router.push("/choose-payment");
            this.loading = false;
            break;
          default:
            break;
        }
      }
    },
    form: {
      handler(val) {
        const state = val.state;
        if (
          Object.prototype.hasOwnProperty.call(state, "cardno") &&
          state.cardno.isValid &&
          state.cvv.isValid &&
          state.expirydate.isValid
        ) {
          this.vgs_valid_payment = true;
          this.cardType = state.cardno;
        } else {
          this.vgs_valid_payment = false;
        }
      },
      deep: true,
    },
  },
  async mounted() {
    this.loadVGS();
    setTimeout(() => {
      this.setForm();
    }, 500);
  },
  methods: {
    ...mapMutations(["setTwoFACompleted"]),
    loadVGS() {
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://js.verygoodvault.com/vgs-collect/2.0/vgs-collect.js";
      document.head.appendChild(script);
    },
    initForm() {
      setTimeout(() => {
        this.setForm();
      }, 500);
    },
    setForm() {
      const classes = {
        empty: "field--empty",
        valid: "field--valid",
        invalid: "field--invalid",
        focused: "field--focused",
        dirty: "field--dirty",
        touched: "field--touched",
      };

      /* eslint-disable */
      this.form = VGSCollect.create(
        this.config.VGS_VAULT_ID,
        this.config.VGS_ENVIRONMENT,
        () => {}
      );

      //  this.form.field('#cc-name', {
      //   type: "text",
      //   name: "card_name",
      //   placeholder: 'Enter full name',
      //   validations: ['required'],
      // });

      this.form.field("#cc-number", {
        type: "card-number",
        name: "cardno",
        successColor: "#4F8A10",
        errorColor: "#D8000C",
        showCardIcon: true,
        fontSize: "13px",
        placeholder: "0000 0000 0000 0000",
        validations: ["required"],
        classes: classes,
      });

      this.form.field("#cc-cvc", {
        type: "card-security-code",
        name: "cvv",
        fontSize: "13px",
        placeholder: "***",
        validations: ["required", "validCardSecurityCode"],
        showCardIcon: false,
        classes: classes,
      });

      this.form.field("#cc-expiration-date", {
        type: "card-expiration-date",
        name: "expirydate",
        fontSize: "13px",
        errorColor: "#D8000C",
        successColor: "#4F8A10",
        placeholder: "MM/YY",
        serializers: [{ name: "replace", options: { old: " ", new: "" } }],
        validations: ["required", "validCardExpirationDate"],
        classes: classes,
      });
    },
    setErrors() {
      const state = this.form.state;
      for (const [key, value] of Object.entries(state)) {
        this[`${key}`] = !value.isValid ? value.errorMessages[0] : "";
      }
    },
    onsubmit() {
      if (!this.vgs_valid_payment) {
        this.setErrors();
        return;
      }
      const newCardPayload = {
        country: this.getBupayload.country_code,
        currency: this.getBupayload.currency,
        email: this.getBupayload.email,
        firstname: this.getBupayload.firstname,
        lastname: this.getBupayload.lastname,
        phonenumber: this.getBupayload.phonenumber,
        userid: this.getBupayload.user_id,
        company_code: this.getBupayload.company_code,
      };
      this.loading = true;
      this.form.submit(
        "/customers/collect_card_details",
        {
          data: newCardPayload,
          headers: {
            Authorization: this.getBupayload.authToken,
          },
        },
        (status, response) => {
          this.loading = false;
          if (response.status) {
            this.showProcessing = true;

            const payload = {
              url: "/api/v2/save",
              params: response.data,
            };

            this.$paymentAxiosPost(payload)
              .then((res) => {
                this.transaction_id = res.transaction_id;

                if (res.status) {
                  this.transactionStatus = res.transaction_status.toLowerCase();

                  if (res.additional_data) {
                    this.additionalData = res.additional_data;
                    this.is3DS = res.tds;
                    if (res.tds) {
                      this.init3DS();
                      return;
                    }
                    this.showAdditionalCardFields = true;
                    this.showProcessing = false;
                    return;
                  }

                  switch (res.transaction_status.toLowerCase()) {
                    case "pending":
                      this.pollCard();
                      break;
                    case "success":
                      this.showProcessing = false;
                      this.$paymentNotification({
                        text: this.$t("card_details_added"),
                      });
                      this.$router.push("/choose-payment");
                      this.loading = false;
                      break;
                    default:
                      break;
                  }
                } else {
                  this.loading = false;
                  (this.showProcessing = false), this.initForm();

                  this.errorText = res.message;
                  this.showErrorModal = true;
                }
              })
              .catch((err) => {
                console.log(err);
                (this.showProcessing = false), this.initForm();
                this.errorText = this.$t("failed_to_collect_card_details");
                this.showErrorModal = true;
              });
          } else {
            (this.showProcessing = false), this.initForm();
            this.errorText = this.$t("failed_to_collect_card_details");
            this.showErrorModal = true;
          }
        }
      );
    },
    handleContinue(val) {
      if (val) {
        this.showProcessing = true;
        this.pollCard();
        return;
      }
      (this.showProcessing = false), this.initForm();
      this.errorText = this.$t("failed_to_collect_card_details");
      this.showErrorModal = true;
    },

    pollCard() {
      this.poll_count = 0;
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
              (that.showProcessing = false), that.initForm();
              that.errorText = this.$t("failed_to_collect_card_details");
              that.showErrorModal = true;
              return;
            }
          }, 10000 * poll_count);
        })(poll_count);
        this.setTwoFACompleted(false);
      }
      this.setTwoFACompleted(false);
    },

    async TransactionIdStatus() {
      const payload = {
        url: `/api/v2/process/status/${this.transaction_id}`,
      };
      this.$paymentAxiosGet(payload).then((res) => {
        if (res.status) {
          switch (res.transaction_status.toLowerCase()) {
            case "success":
              this.poll_count = this.poll_limit;
              this.showProcessing = false;
              this.$paymentNotification({
                text: this.$t("card_details_added"),
              });
              this.$router.push("/choose-payment");
              this.loading = false;
              break;
            case "failed":
              this.poll_count = this.poll_limit;
              this.loading = false;
              this.showProcessing = false;
              this.initForm();
              this.errorText = res.message;
              this.showErrorModal = true;
              break;
            case "pending":
              break;
            default:
              break;
          }
          return res;
        }

        this.poll_count = this.poll_limit;
        this.showProcessing = false;
        this.initForm();
        this.errorText = res.message;
        this.showErrorModal = true;
      });
    },
    init3DS() {
      const res = !this.additionalData
        ? this.additionalData
        : this.additionalData[0];
      const url = res.field;
      const urlWindow = window.open(url, "");

      const timer = setInterval(() => {
        if (urlWindow.closed) {
          this.init3dsPoll();
          clearInterval(timer);
        }
      }, 500);
    },
    handleErrorClose() {
      this.showErrorModal = !this.showErrorModal;
      this.$router.push({ name: "ChoosePayment" });
    },
    async init3dsPoll() {
      this.loading = true;
      const payload = {
        transaction_id: this.transaction_id,
        tds: true,
      };

      const fullPayload = {
        params: payload,
        url: "/api/v2/submit_info",
      };

      const response = await this.$paymentAxiosPost(fullPayload);
      this.loading = false;
      if (response.status) {
        switch (response.transaction_status.toLowerCase()) {
          case "pending":
            this.pollCard();
            this.count = true;
            break;
          case "success":
            this.showProcessing = false;
            this.$paymentNotification({
              text: this.$t("card_details_added"),
            });
            this.$router.push("/choose-payment");
            this.loading = false;
            break;
          default:
            break;
        }
        return;
      }
      (this.showProcessing = false), this.initForm();
      this.errorText = this.$t("failed_to_collect_card_details");
      this.showErrorModal = true;
    },
  },
};
</script>

<style lang="scss">
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
.modal-content {
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
