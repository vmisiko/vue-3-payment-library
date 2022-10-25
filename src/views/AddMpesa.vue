<template>
  <div class="flex-center">
    <div class="card">
      <TopInfo :icon="icon" :title="title" />

      <IconView icon="mpesa" width="68" height="48" />
      <div class="mgt-8">
        <span class="text-list-title">
          {{ $translate("how_it_works") }}
        </span>

        <div>
          <p class="text-caption-1 text-gray80">
            {{ $translate("whenever_choose_mpesa") }}
          </p>
        </div>

        <div class="mgt-15 float-right">
          <sendy-btn
            :loading="loading"
            color="primary"
            class="mgt-10"
            @click="submit"
          >
            {{ $translate("add_mpesa") }}
          </sendy-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopInfo from "../components/topInfo";

export default {
  name: "AddMpesa",
  components: {
    TopInfo,
  },
  data() {
    return {
      icon: "back",
      title: this.$translate("add_a_mpesa"),
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["getPaymentMethods", "getBupayload"]),
  },
  mounted() {},
  methods: {
    async submit() {
      this.loading = true;
      const payMethod = this.getPaymentMethods.find(
        (element) => element.name === "M-PESA"
      );

      const payload = {
        user_id: this.getBupayload.user_id,
        pay_method_id: payMethod ? payMethod.payment_method_id : 1,
      };

      const fullPayload = {
        url: "/save_payment_method",
        params: payload,
      };

      const response = await this.$paymentAxiosPost(fullPayload);
      this.loading = false;
      response.status
        ? this.$paymentNotification({ text: this.$translate("mpesa_added") })
        : this.$paymentNotification({
            text: this.$translate("mpesa_already_added"),
            type: "error",
          });
      this.$router.push({ name: "ChoosePayment" });
    },
  },
};
</script>
