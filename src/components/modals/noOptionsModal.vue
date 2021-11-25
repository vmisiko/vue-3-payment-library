<template>
  <div id="no-option" class="modal">
      <div class="modal-content-option ">
        <div class="flex-center">
        <div class="text-center mgt-11">
          <IconView icon="add-payment" />
        </div>
      </div>
      <div class="text-center mgt-10">
        <div><span class="text-subtitle-1">Payment option missing</span></div>
        <span class="text-body-2 mgt-3">
          Add a new payment method to proceed with the transaction
        </span>
      </div>

      <div class="text-center mgt-8">
        <sendy-btn 
          color='primary'
          class=""
         @click="addPaymentOption"
        >
          Add payment option
        </sendy-btn>
      </div>

      <div class="text-center mgt-8">
        <span class="link" @click="handleBack">Back</span>
      </div>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import paymentGenMxn from '../../mixins/paymentGenMxn';

export default {
  name: 'cvvModule',
  mixins: [paymentGenMxn],
  props: ['show'],
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['getBupayload']),
  },
  watch: {
    show(val) {
      val ? this.handleOpen(): this.handleClose();
    }
  },
  mounted() {
    this.handleOpen();
  },
  methods: {
    handleOpen() {
      document.getElementById('no-option').style.display = 'block';
    },
    handleClose() {
      document.getElementById('no-option').style.display = 'none';
    },
    addPaymentOption() {
      window.analytics.track('Add Payment Option', {
        ...this.commonTrackPayload(),
        timestamp_zone: this.paymentTimezone,
        country_code: this.getBupayload.country_code,
      })
      this.$router.push('/add-payment');
    },
    handleBack() {
      const entryRoute = localStorage.entry_route;
      this.$router.push({name: entryRoute});
    }
  }
}
</script>


<style lang="scss">     
.modal {
  display: none;
  position: fixed;
  z-index: 1;
  padding-top: 15px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%; 
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.5);
}

/* Modal Content */
.modal-content-option {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 32px;
  border: 1px solid #888;
  border-radius: 4px;
  width: 348px;
  height: 496px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s
}

/* Add Animation */
@-webkit-keyframes animatetop {
  from {top:-300px; opacity:0} 
  to {top:0; opacity:1}
}

@keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}

/* The Close Button */
.close {
  color: black;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}


</style>
