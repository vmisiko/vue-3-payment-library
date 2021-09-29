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
    ...mapGetters(['getPaymentMethods']),
  },
  methods: {
    $handlePaymentMethod(paymentMethod) {
      switch (paymentMethod.payment_method_id) {
        case 1: 
          this.$router.push('/add-mpesa');
          break;
        case 2: 
          this.$router.push('/add-card');
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
    },
    async $paymentAxiosPut(payload) {
      return new Promise(async(resolve, reject) => {
        try {
          const { url, params } = payload
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }
          };
          const { data } = await axios.put(`${this.BASE_URL}${url}`, params, config);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      })
    },
    $formatCurrency(amount) {
      const result = parseFloat(amount);
      return result.toLocaleString()
      ;
    },
    $formatLastFour(cardno) {
      const result = cardno.substr(-4)
      return `**** ${result}`;
    },
    $cardIconValidator(icon) {
      const icons = [
        'mastercard',
        'visa',
        'union-pay',
      ];

      return icons.includes(icon);
    },
    $formatCardno(card)  {
      const first = card.substr(0,4);
      const last = card.substr(-4)
      return `${first} **** ${last}`;
    },
    $paymentInit(payload, entry) {
      localStorage.setItem('buPayload', JSON.stringify(payload));
      switch (entry) {
        case 'checkout':
          this.$router.push({ name: 'Entry'});
          break;
        case 'payment-option':
          this.$router.push({ name: 'PaymentOptionsPage'});
          break;
        default:
          break;
      }
    }
     
  }
}

export default mixin;