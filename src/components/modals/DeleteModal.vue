<template>
  <div id="delete-modal" class="modal" ref="deleteModal">
    <div class="modal-content-pl">
      <div class="mgt-4">
        <span class="text-body-1">
          {{ $translate("sure_delete") }}
        </span>
      </div>

      <sendy-btn
        :block="true"
        color="error"
        class="mgt-8"
        type="submit"
        @click="handleDelete"
        :loading="loading"
      >
        {{ $translate("delete") }}
      </sendy-btn>

      <sendy-btn
        :block="true"
        color="info"
        class="mgt-4"
        type="submit"
        @click="cancelRemove"
      >
        {{ $translate("cancel") }}
      </sendy-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import paymentGenMxn from "../../mixins/paymentGenMxn";

export default {
  name: "DeletModal",
  mixins: [paymentGenMxn],
  props: ["show"],
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["getBupayload", "getSelectedPayOption"]),
    payMethodName() {
      let result = '';
      switch (this.getSelectedPayOption.category) {
        case 'bank':
          result = 'Pay by bank';
          break;
        case 'Mobile Money':
          result = 'Mobile Money';
          break;
        default:
          result = this.getSelectedPayOption.pay_method_name;
          break;
      }
      return result;
    }
  },
  watch: {
    show(val) {
      val ? this.handleOpen() : this.handleClose();
    },
  },
  methods: {
    handleOpen() {
      let el = this.$refs.deleteModal;
      el.style.display = "block";
    },
    handleClose() {
      let el = this.$refs.deleteModal;
      el.style.display = "none";
    },
    handleDelete() {
      this.getSelectedPayOption.category === 'Credit or Debit Card' ? this.deleteCard() : this.deleteMethod();
    },
    async deleteCard() {
      this.loading = true;
      const startTime = new Date();
      window.analytics.track("Delete card", {
        ...this.commonTrackPayload(),
        payment_method: this.getSelectedPayOption.pay_method_name,
        card_network: this.getSelectedPayOption.psp,
      });

      const payload = {
        cardno: this.getSelectedPayOption.pay_method_details,
        userid: this.getBupayload.user_id,
      };

      const fullPayload = {
        url: "/api/v1/card/delete",
        params: payload,
      };

      const response = await this.$paymentAxiosPost(fullPayload);
      this.loading = false;
      const finishTime = Date.now() - startTime;
      window.analytics.track(
        response.status ? "Card Deleted Successfully" : "Card Not Deleted",
        {
          ...this.commonTrackPayload(),
          duration_taken: finishTime,
          payment_method: this.getSelectedPayOption.pay_method_name,
          card_network: this.$route.params.cardTitle,
          ...(!response.status && { failure_reason: response.message }),
        }
      );

      if (response.status) {
        this.loading = false;
        this.$paymentNotification({
          text: this.$translate("card_details_removed"),
          type: "info",
        });
        this.$router.push({ name: "PaymentOptionsPage" });
        return;
      }

      this.$paymentNotification({ text: response.message, type: "error" });
    },
    async deleteMethod() {
      this.loading = true;
      const startTime = new Date();
      window.analytics.track(`Delete ${this.payMethodName}`, {
        ...this.commonTrackPayload(),
      });

      const payload = {
        pay_detail_id: this.getSelectedPayOption.pay_detail_id,
        user_id: this.getBupayload.user_id,
      };

      const fullPayload = {
        url: "/delete_payment_method",
        params: payload,
      };

      const response = await this.$paymentAxiosPost(fullPayload);

      const finishTime = Date.now() - startTime;
      window.analytics.track(
        response.status
          ? `${this.payMethodName} Deleted Successfully`
          : `${this.payMethodName} Not Deleted`,
        {
          ...this.commonTrackPayload(),
          duration_taken: finishTime,
          payment_method: this.getSelectedPayOption.pay_method_name,
        }
      );

      this.loading = false;
      if (response.status) {
        this.$paymentNotification({
          text: this.$translate('payment_option_removed', {payment_method: this.payMethodName}),
          type: "info",
        });
        this.$router.push({ name: "PaymentOptionsPage" });
      }
      this.$paymentNotification({ text: response.message, type: "error" });
    },
    cancelRemove() {
      window.analytics.track(`Cancel Remove ${this.payMethodName}`, {
        ...this.commonTrackPayload(),
        payment_method: this.getSelectedPayOption.pay_method_name,
      });
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
