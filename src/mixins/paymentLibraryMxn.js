import axios from 'axios';
import { mapGetters } from 'vuex';

const mixin = {
  data() {
    return {
      VGS_VAULT_ID: 'tnt4d8qyodm',
      VGS_ENVIRONMENT: 'sandbox',
      BASE_URL: 'https://payment-gateway-dev.sendyit.com/payment-gateway', 
    }
  },
  computed: {
    ...mapGetters(['getPaymentMethods', 'getSavedPayMethods']),
  },
  methods: {
    $handlePaymentMethod(paymentMethod) {
      switch (paymentMethod.id) {
        case 1: 
          this.$router.push('/add-card');
          break;
        case 2: 
          this.$router.push('/add-mpesa');
          break;
        default:
          this.$router.push('/add-card');
          break;
      }
    },
    $paymentNotification(payload) {
      this.$root.$emit('payment-notification', payload);
    },
    async $paymentAxiosPost(payload) {
      return new Promise(async(resolve, reject) => {
        try {
          const { url , params } = payload;
          const { data } = await axios.post(`${this.BASE_URL}${url}`, params);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      })
    },
    async $paymentAxiosGet(payload) {
      return new Promise(async(resolve, reject) => {
        try {
          const { url, params } = payload
          const values = {
           params,
           headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
           }
          };
          const { data } = await axios.get(`${this.BASE_URL}${url}`, values);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      })
    }
    
  }
}

export default mixin;