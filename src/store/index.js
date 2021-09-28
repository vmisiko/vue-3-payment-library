import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    paymentMethods: null,
    savedPayMethods: null, 
  },
  mutations: {
    setPaymentMethods(state, val) {
      state.paymentMethods = val;
    },
    setSavedPayMethods(state, val) {
      state.savedPayMethods = val;
    },
  },
  getters: {
    getPaymentMethods: ( state) => state.paymentMethods,
    getSavedPayMethods: ( state) => state.savedPayMethods,
  },
  actions: {
  },
  modules: {
  }
})
