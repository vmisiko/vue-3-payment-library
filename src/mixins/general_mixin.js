const mixin = {
  methods: {
    handlePaymentMethod(paymentMethod) {
      switch (paymentMethod.id) {
        case 1: 
          this.$router.push('/add-card')
          break;
        case 2: 
          this.$router.push('/add-mpesa')
          break;
        default:
          this.$router.push('/add-card')
          break;
      }
    }
  }
}

export default mixin;