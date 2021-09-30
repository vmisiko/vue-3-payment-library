// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)
const store = {
  state: {
    paymentMethods: null,
    savedPayMethods: null, 
    bupayload: localStorage.buPayload ? JSON.parse(localStorage.buPayload): null,
    errorText: null,
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
    }
  },
  getters: {
    getPaymentMethods: ( state) => state.paymentMethods,
    getSavedPayMethods: ( state) => state.savedPayMethods,
    getBupayload: (state) => state.bupayload,
    getErrorText: (state) => state.errorText,
  },
  actions: {
  },
  modules: {
  }
}

export default store 