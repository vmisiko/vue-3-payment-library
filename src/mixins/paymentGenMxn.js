import moment from "moment-timezone";
import { mapGetters, mapMutations } from 'vuex';

const mixin = {
  data() {
    return {
      startTime: null,
    }
  },
  computed: {
    ...mapGetters(['getPaymentMethods', 'getBupayload', 'getSavedPayMethods']),
    paymentTimezone() {
      const localtz = moment.tz.guess();
      return localtz;
    },
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
  },
  mounted() {
    this.startTime = new Date()
  },
  methods: {
    ...mapMutations(['setPaymentMethods', 'setSavedPayMethods']),
    commonTrackPayload() {
      const date = new Date();
      const finishTime = date - this.startTime;
      const payload = {
        user_id: this.getBupayload.user_id,
        product: this.getBupayload.entity_id,
        timestamp: Date.now(),
        platform_name: this.isMobile ? this.getMobileOs() : 'web',
        duration_on_page: finishTime,
      }
      return payload;
    },
    async retrievePaymentMethods() {
      const payload = {
        country_code : this.getBupayload.country_code,
        entity_id : this.getBupayload.entity_id,
        user_id : this.getBupayload.user_id,
      };

      const paymentOptions = this.getBupayload.payment_options;
      const fullPayload = {
        url: '/payment_methods',
        params: payload,
      }
      
      const response = await this.$paymentAxiosPost(fullPayload);
      if (response.status) {
        const paymentMethods = response.payment_methods.filter(item => paymentOptions.includes(item.payment_method_id));
        const savedMethods = response.saved_payment_methods.filter(item => paymentOptions.includes(item.pay_method_id));
        this.setPaymentMethods(paymentMethods);
        this.setSavedPayMethods(savedMethods);
      }
    },
    checkAvailableOptions(defaultPaymentMethod) {
      if (this.getSavedPayMethods && this.getSavedPayMethods.length > 0 && !defaultPaymentMethod) {
        this.$router.push({ name: 'ChoosePayment', params: { entry: 'entry'}});
        return;
      };
      if (!defaultPaymentMethod) {
        this.$router.push({name: "AddPayment", params: { entry: 'entry'}});
        return;
      }
    },
    getMobileOs() {
      let name = 'web'
      if (navigator.userAgent.indexOf("Android") != -1)  {
        name = "Android";
      }
      if (navigator.userAgent.indexOf("like Mac") != -1) {
        name = "iOS";
      }
      return name;
    }
    
  }

}

export default mixin;