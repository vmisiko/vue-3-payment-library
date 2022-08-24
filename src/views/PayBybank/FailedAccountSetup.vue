<template>
  <div class="flex-center">
    <Processing
      @close="showProcessing = false"
      :count="count"
      :title="$translate('pay_by_bank_setup')"
      :text="$translate('assign_account_details')"
      v-if="showProcessing"
    />
    <div class="card" v-else>
      <AvatarListView icon="warning" :title="$translate('unable_to_setup')">
        <template v-slot:list-subtitle>
          <span class="text-error"> {{ getErrorText }}</span>
        </template>
      </AvatarListView>

      <div class="mgt-8 flex-center">
        <sendy-btn
          :outline="true"
          :text="$translate('retry')"
          class="retry-btn"
          :loading="loading"
          @click="openAccount"
        />
      </div>

      <div class="text-center mgt-5">
        <span @click="$router.push({ name: 'ChoosePayment' })" class="link">{{
          $translate("return_to_payment_options")
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import AvatarListView from "./components/AvatarListView";
import Processing from "../../components/processing";
import { usePayBybankSetup } from '../../hooks/payBybankSetup';

export default {
  name: "FailedAccountSetup",
  components: {
    AvatarListView,
    Processing,
  },
  data() {
    return {
      loading: false,
      showProcessing: false,
      count: true,
    };
  },
  setup() {
    const { openAccount } = usePayBybankSetup();
    return {
      openAccount
    }
  },
  computed: {
    ...mapGetters(["getErrorText"]),
  },
  methods: {
    ...mapMutations("setErrorText"),
  },
};
</script>

<style scoped>
.retry-btn {
  width: 240px !important;
}
</style>
