const store = {
  state: {
    paymentMethods: null,
    savedPayMethods: null,
    bupayload: localStorage.buPayload
      ? JSON.parse(localStorage.buPayload)
      : null,
    errorText: null,
    twoFACompleted: false,
    virtualAccounts: [],
    selectedAccount: null,
    loading: false,
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
      state.virtualAccounts = val;
    },
    setSelectedVirtualAccount(state, val) {
      state.selectedAccount = val;
    },
    setLoading(state, val) {
      state.loading = val;
    },
  },
  getters: {
    getPaymentMethods: (state) => state.paymentMethods,
    getSavedPayMethods: (state) => state.savedPayMethods,
    getBupayload: (state) => state.bupayload,
    getErrorText: (state) => state.errorText,
    getTwoFACompleted: (state) => state.twoFACompleted,
    getVirtualAccounts: (state) => state.virtualAccounts,
    getSelectedVirtualAccount: (state) => state.selectedAccount,
    getLoading: (state) => state.loading,
  },
  actions: {},
  modules: {},
};

export default store;
