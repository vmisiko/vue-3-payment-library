// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)
const store = {
  state: {
    paymentMethods: null,
    savedPayMethods: null, 
    bupayload: localStorage.buPayload ? JSON.parse(localStorage.buPayload) : null,
    errorText: null,
    twoFACompleted: false,
    virtualAccounts: [],
    selectedAccount: null,
  },
  mutations: {
    setPaymentMethods(state, val) {
      state.paymentMethods = val;
    },
    setSavedPayMethods(state, val) {
      state.savedPayMethods = val;
    },
    setBupayload(state, val) {
      state.bupayload = val;
    },
    setErrorText(state, val) {
      state.errorText = val;
    },
    setTwoFACompleted(state, val) {
      state.twoFACompleted = val;
    },
    setVirtualAccounts(state, val) {
      state.virtualAccounts = val
    } ,
    setSelectedVirtualAccount(state, val) {
      state.selectedAccount = val
    }
    
  },
  getters: {
    getPaymentMethods: ( state) => state.paymentMethods,
    getSavedPayMethods: ( state) => state.savedPayMethods,
    getBupayload: (state) => state.bupayload,
    getErrorText: (state) => state.errorText,
    getTwoFACompleted: (state) => state.twoFACompleted,
    getVirtualAccounts: (state) => state.virtualAccounts,
    getSelectedVirtualAccount: (state) => state.selectedAccount,
  },
  actions: {
  },
  modules: {
  }
}

export default store 
