<template>
<div class="flex-center">
  <div class="card-min">
    <IconView icon="success" width="64px"  height="64px" />

    <div class="mgt-6">
      <span class="title3-semibold">Pay by Bank is ready!</span>
      <div class="mgt-2">
        <span class="text-body-2 text-gray90">During checkout, we will show you the account details below to make payments.</span>
      </div>
    </div>

    <hr class="mgt-6">

    <div class="mgt-8">
      <span class="text-subtitle-1"> Account Details</span>

      <div class="mgt-4">
        <span class="input-label">Available Banks</span>
        <div class="mgt-1">
          <select
            type="text"
            v-model="account"
            class="select-input"
            placeholder="Select payment methods to use"
          > 
            <template v-for="(obj, index) in accounts" >
              <option :key="index"  :value="obj.account"> {{ obj.bank }} </option>
            </template>
          </select>
        </div>
      </div>

      <div class="bank-account mgt-6" v-if="selectedAccount">
        <span class="text-body-1"> {{ selectedAccount.bank }} </span>
        <div class="mgt-3">
          <span class="title-regular-2">{{ selectedAccount.account }}</span>
        </div>
      </div>

      <div class="mgt-24"> 
        <button @click="$router.push({name: 'ChoosePayment'})" class="btn-outline primary"> Return to Payment options </button>
      </div>
    </div>

  </div>
<div>
</template>

<script>
export default {
  name: 'AccountReadyView',
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
  computed: {
    selectedAccount() {
      const bank = this.accounts.filter(el => el.account === this.account);
      return bank[0];
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