<template>
<div class="flex-center">
  <div class="card-mini-full">
    <div class="row">

      <div class="">

        <AvatarListView 
          icon="success"
          title="Pay by Bank is ready!"
          subtitle= "During checkout, we will show you the account details below to make payments."
        />

        <div class="hr"></div>

      </div>

      <div class="mgt-8">
        <span class="text-subtitle-1"> Account Details</span>

        <AccountsDisplay
          v-model="account"
          :accounts="accounts"
          class="mgt-6"
        />

        <div class="mgt-24"> 
          <button @click="$router.push({name: 'ChoosePayment'})" class="btn-outline primary"> Return to Payment options </button>
        </div>
      </div>
    </div>

  </div>
<div>
</template>

<script>
import AvatarListView from './components/AvatarListView';
import AccountsDisplay from './components/AccountDisplay';

export default {
  name: 'AccountReadyView',
  components: {
    AvatarListView,
    AccountsDisplay
  },
  data() {
    return {
      account: 3343545454545,
      accounts: [
        {
          account: 3343545454545,
          bank: 'SunTrust',
          primary: true,
        },
        {
          account: 33435454345545,
          bank: 'Equity',
          primary: false,
        },
        {
          account: 33435454345535,
          bank: 'Polaris',
          primary: false,
        }
      ]
    }
  },
}
</script>

<style scoped>
.input-label {
  font-family: 'Nunito' 'Sans';
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  letter-spacing: 0.005em;
  color: #606266;
}

.select-input {
  display: block;
  height: 40px;
  width: -webkit-fill-available;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.bank-account {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  height: 100px;
  background: rgba(211, 221, 246, 0.4);
  border-radius: 8px;
}

.title-regular-2 {
  font-family: 'Nunito' 'Sans';
  font-style: normal;
  font-weight: normal;
  font-size: 25px;
  line-height: 28px;
  display: flex;
  align-items: center;
  letter-spacing: -0.01em;
  color: #303133;
}

</style>