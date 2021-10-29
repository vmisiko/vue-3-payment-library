import moment from "moment-timezone";
import { mapGetters } from 'vuex';

const mixin = {
  data() {
    return {
      startTime: null,
    }
  },
  computed: {
    ...mapGetters(['getPaymentMethods', 'getBupayload']),
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
    commonTrackPayload() {
      const date = new Date();
      const finishTime = date - this.startTime;
      const payload = {
        user_id: this.getBupayload.user_id,
        product: '',
        time: Date.now(),
        device: this.isMobile ? 'mobile' : 'desktop',
        duration_on_page: finishTime,
      }
      return payload;
    },
    
  }

}

export default mixin;