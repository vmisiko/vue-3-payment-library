import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    paymentMethods: null,
    savedPayMethods: null, 
    bupayload: JSON.parse(localStorage.buPayload),
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
    }
  },
  getters: {
    getPaymentMethods: ( state) => state.paymentMethods,
    getSavedPayMethods: ( state) => state.savedPayMethods,
    getBupayload: (state) => state.bupayload,
  },
  actions: {
  },
  modules: {
  }
})
