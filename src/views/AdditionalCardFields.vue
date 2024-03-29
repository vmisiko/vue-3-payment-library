<template>
  <div class="card-min">
    <div v-if="!isCVV">
      <form @submit.prevent="submit">
        <div v-for="(item, index) in fields" :key="index">
          <div class="textfield mgt-5" v-if="item.type === 'text'">
            <label for="" class="normal-text">
              {{ capitalize(item.field) }}</label
            >
            <input
              type="text"
              class="phone-input"
              :placeholder="`${item.field}`"
              required
              v-model="form[item.field_id]"
            />
          </div>
          <div class="textfield mgt-5" v-if="item.type === 'phone'">
            <label for="" class="normal-text">
              {{ capitalize(item.field) }}</label
            >
            <vue-tel-input
              autoFormat
              :defaultCountry="getBupayload.country_code"
              :dropdownOptions="dropdownOptions"
              mode="national"
              :invalidMsg="$translate('phone_number_invalid')"
              @validate="validatePhone"
            >
            </vue-tel-input>
          </div>
          <div class="textfield mgt-5" v-if="item.type === 'date'">
            <birth-datepicker
              :placeholder="$translate('phone_number_invalid')"
              v-model="form[item.field_id]"
              :valueIsString="true"
              delimiter="-"
              :yearFirst="true"
              class="phone-input"
            />
          </div>
        </div>
        <sendy-btn
          :block="true"
          :loading="loading"
          color="primary"
          class="mgt-5"
          type="submit"
        >
          {{ $translate("submit") }}
        </sendy-btn>
      </form>
    </div>

    <div v-else>
      <form ref="cvv" @submit.prevent="submitCvv">
        <div class="form-group">
          <span id="cc-cvc" class="form-field" />
          <span class="text-caption-2 text-error" v-if="cvv"> {{ cvv }} </span>
        </div>

        <sendy-btn
          :block="true"
          :loading="loading"
          color="primary"
          class="mgt-5"
          type="submit"
        >
          {{ $translate("submit") }}
        </sendy-btn>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { VueTelInput } from "vue-tel-input";
import birthDatepicker from "vue-birth-datepicker/src/birth-datepicker";

export default {
  name: "AdditionalCardFields",
  components: {
    VueTelInput,
    birthDatepicker,
  },
  props: ["additionalData", "transaction_id", "is3DS", "defaultPaymentMethod"],
  data() {
    return {
      loading: false,
      address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
      phone: "",
      dropdownOptions: {
        showFlags: true,
        showDialCodeInSelection: true,
      },
      formattedPhone: null,
      form: {},
      fields: [],
      isCVV: false,
      updateFields: false,
      vgs_valid_payment: false,
      cvv: "",
    };
  },
  computed: {
    ...mapGetters(["getBupayload", "getSavedPayMethods"]),
  },
  watch: {
    additionalData(val) {
      const cvv = val.filter((element) => element.field_id === "cvv");
      if (cvv.length) {
        this.initCVV();
        return;
      }
      this.fields = val;
    },
    updateFields(val) {
      if (val) {
        const cvv = this.additionalData.filter(
          (element) => element.field_id === "cvv"
        );
        if (cvv.length) {
          this.initCVV();
          return;
        }
      }
    },
  },
  mounted() {
    this.fields = this.additionalData ? this.additionalData : [];
    const cvv = this.additionalData.filter(
      (element) => element.field_id === "cvv"
    );
    if (cvv.length) {
      this.initCVV();
    }
  },
  methods: {
    initCVV() {
      this.isCVV = true;
      setTimeout(() => {
        this.setForm();
      }, 500);
    },
    setForm() {
      // eslint-disable-next-line no-undef
      this.form = VGSCollect.create(
        this.config.VGS_VAULT_ID,
        this.config.VGS_ENVIRONMENT,
        () => {}
      );

      this.form.field("#cc-cvc", {
        type: "card-security-code",
        name: "cvv",
        fontSize: "13px",
        placeholder: "CVV",
        validations: ["required", "validCardSecurityCode"],
      });
    },
    validatePhone(val) {
      this.formattedPhone = val.valid ? val.number : null;
      this.form["phone"] = this.formattedPhone;
      return;
    },
    async submit() {
      this.loading = true;
      const payload = {
        transaction_id: this.transaction_id,
        ...this.form,
      };

      const fullPayload = {
        params: payload,
        url: "/api/v3/submit_info",
      };

      const response = await this.$paymentAxiosPost(fullPayload);
      this.loading = false;
      if (response.status) {
        if (response.additional_data) {
          this.fields = response.additional_data;
          return;
        }
        
        this.$emit("continue", true);
        return;
      }
      this.$paymentNotification({ text: response.message, type: "error" })
      this.$emit("continue", false);
    },
    submitCvv() {
      this.loading = true;
      this.form.submit(
        "/customers/collect_card_details",
        {
          headers: {
            Authorization: this.getBupayload.authToken,
          },
        },
        (status, res) => {
          if (res.status) {
            const values = res.data;
            delete values.language;

            const payload = {
              transaction_id: this.transaction_id,
              ...values,
            };

            const fullPayload = {
              params: payload,
              url: "/api/v3/submit_info",
            };

            this.$paymentAxiosPost(fullPayload)
              .then((response) => {
                if (response.status) {
                  if (response.additional_data) {
                    this.updateFields = true;
                    if (response.tds) {
                      const responsePayload = {
                        status: true,
                        additionalData: response.additional_data,
                      };

                      this.$emit("continue3DS", responsePayload);
                      return;
                    }

                    this.fields = response.additional_data;
                  }

                  this.$emit("continue", true);
                  return;
                }

                this.loading = false;
                this.$emit("continue", false);
              })
              .catch((error) => {
                this.loading = false;
                this.$emit("continue", false);
              });
          }
        }
      );
    },
    capitalize(str) {
      const result = str.charAt(0).toUpperCase() + str.slice(1);
      return result;
    },
  },
};
</script>

<style scoped lang="scss">
.phone-input {
  padding: 8px;
  height: 40px;
  background: #ffffff;
  border: 0.5px solid #c0c4cc;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
}

.vue-tel-input {
  border-radius: 3px;
  display: flex;
  border: 0.5px solid #c0c4cc !important;
  text-align: left;
  height: 40px;
}
</style>
