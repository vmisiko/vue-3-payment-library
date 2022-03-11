<template>
<div class="flex-center">
  <div class="card-mini-full">
    <div class="grid-container">

      <div class="first-row pdr-4 pdt-22">

        <AvatarListView 
          icon="success"
          title="Pay by Bank is ready!"
          subtitle= "During checkout, we will show you the account details below to make payments."
          class=""
        />


      </div>

      <div class="mgt-8 pdl-6">
        <span class="text-subtitle-1">Your account details</span>

        <AccountsDisplay
          v-model="account"
          :accounts="getVirtualAccounts"
          class="mgy-6"
        />

      </div>
    </div>

    <div class="direction-flex">
      <span class="spacer"></span>
      <div class="mgt-14"> 
        <sendy-btn
        color="primary"
        text="Finish Setup"
        @click="finish"
        ></sendy-btn>
      </div>
    </div>
  </div>
<div>
</template>

<script>
import AvatarListView from './components/AvatarListView';
import AccountsDisplay from './components/AccountDisplay';
import { mapGetters } from 'vuex';
import paymentGenMxn from '../../mixins/paymentGenMxn';

export default {
  name: 'AccountReadyView',
  mixins: [paymentGenMxn],
  components: {
    AvatarListView,
    AccountsDisplay
  },
  data() {
    return {
      account: 3343545454545,
    }
  },
  computed: {
    ...mapGetters(['getBupayload'])
  },
  watch: {
    getSelectedVirtualAccount(val) {
      this.account = val;
    }
  },
  mounted() {
    this.getAccounts();
  },
  methods: {
    finish() {
      this.$paymentNotification({text: 'Pay by bank added and selected for payment.'});
      this.$router.push({ name: 'ChoosePayment' })
    },
  }
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 50% 50%;
}

.first-row {
  border-right: 1px solid #E2E7ED;
}


</style>