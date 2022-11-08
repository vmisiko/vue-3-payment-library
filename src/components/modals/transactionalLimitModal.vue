<template>
  <div id="error-limit" class="modal" ref="transactionLimitModal">
    <div class="modal-content-pl">
      <div>
        <IconView icon="warning" />
      </div>

      <div class="mgt-4">
        <span class="text-list-title text-gray90">
          {{ $translate("amount_exceeds_limit_title") }}
        </span>
        <div>
          <span class="text-caption">
            {{
              $translate("amount_exceeds_limit_text", { mobile: getDefaultpayMethod() })
            }}
          </span>
        </div>
      </div>

      <sendy-btn
        :block="true"
        color="primary"
        class="mgt-8"
        @click="$router.push({ name: 'ChoosePayment' })"
      >
        {{ $translate("change_payment_option") }}
      </sendy-btn>

      <div class="text-center mgt-7">
        <span class="link" @click="handleRouting">
          {{ $translate("cancel_payment") }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TransactionLimitModal",
  props: ["show", "text"],
  data() {
    return {
      defaultpayMethod: null,
    };
  },
  watch: {
    show(val) {
      val ? this.handleOpen() : this.handleClose();
    },
  },
  computed: {
    ...mapGetters("getSavedPayMethods"),
  },
  mounted() {
    this.show ? this.handleOpen() : this.handleClose();
  },
  methods: {
    getDefaultpayMethod() {
      this.defaultpayMethod = this.getSavedPayMethods
        ? this.getSavedPayMethods.filter((method) => method.default === 1)[0]
        : null;
      return this.defaultpayMethod && this.defaultpayMethod.pay_method_id === 1
        ? "M-PESA"
        : `${
            this.defaultpayMethod
              ? this.defaultpayMethod.pay_method_name
              : "Mobile"
          } Money`;
    },
    handleOpen() {
      let el = this.$refs.transactionLimitModal;
      el.style.display = "block";
    },
    handleClose() {
      let el = this.$refs.transactionLimitModal;
      el.style.display = "none";
    },
    handleRouting() {
      const entryRoute = localStorage.entry_route;
      this.$router.push(entryRoute);
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss">
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
</style>
