import axios from 'axios';
import { mapGetters, mapMutations } from 'vuex';

const mixin = {
  data() {
    return {
      VGS_VAULT_ID: 'tnt4d8qyodm',
      VGS_ENVIRONMENT: 'sandbox',
      BASE_URL: 'https://payment-gateway-dev.sendyit.com/payment-gateway', 
    }
  },
  computed: {
    ...mapGetters(['getPaymentMethods', 'getBupayload']),
    config() {
      return this.$sendyOptions.config;
    },
    
  },
  methods: {
    ...mapMutations(['setBupayload']),
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
    $initAxiosErrorNotif(payload) {
      this.$root.$emit('axios-notification', payload);
    },
    paymentCustomHeaders() {
      const authToken = this.getBupayload.authToken;
      const param = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: authToken,
        },
      }; 
      return param;
    },
    async $paymentAxiosPost(payload) {
      return new Promise(async(resolve, reject) => {
        const headers = this.paymentCustomHeaders();
        try {
          const { url , params } = payload;
          const { data } = await axios.post(`${this.config.BASE_URL}${url}`, params, headers);
          resolve(data);
        } catch (err) {
          this.handlePaymentAxiosErrors(err.response.status);
          reject(err);
        }
      })
    },
    async $paymentAxiosGet(payload) {
      return new Promise(async(resolve, reject) => {
        try {
          const { url, params } = payload
          const headers = this.paymentCustomHeaders();

          const values = {
           params,
           headers: headers.headers,
          };

          const { data } = await axios.get(`${this.config.BASE_URL}${url}`, values);
          resolve(data);
        } catch (err) {
            this.handlePaymentAxiosErrors(err.response.status);
          reject(err);
        }
      })
    },
    async $paymentAxiosPut(payload) {
      return new Promise(async(resolve, reject) => {
        try {
          const { url, params } = payload
          const headers = this.paymentCustomHeaders();
          const { data } = await axios.put(`${this.config.BASE_URL}${url}`, params, headers);
          resolve(data);
        } catch (err) {
            this.handlePaymentAxiosErrors(err.response.status);
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
      this.setBupayload(payload);
      localStorage.setItem('entry', entry);
      localStorage.setItem('entry_route', this.$route.name);
      switch (entry) {
        case 'checkout':
          this.$router.push({ name: 'Entry'});
          break;
        case 'payment-option':
          this.$router.push({ name: 'PaymentOptionsPage'});
          break;
        case 'choose-payment':
          this.$router.push({ name: 'ChoosePayment'});
          break;
        default:
          break;
      }
    },
    async handlePaymentAxiosErrors(error) {
      switch (error) {
        case 403:
          this.$initAxiosErrorNotif({text: 'Please Login Again.'})
          break;
        case 204:
          this.$initAxiosErrorNotif({text: 'Your session has expired. Please login again'})
          console.clear();
          break;
        case 500:
          this.$initAxiosErrorNotif({text: 'Oops an error has Occurred. Please try again'})
          break;
        default:
      }
    },
     
  }
}

export default mixin;