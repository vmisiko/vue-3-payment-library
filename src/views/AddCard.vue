<template>
  <div class="flex-center">
    <Processing text="Processing your card details" v-if="collectLoad" />
    <div class="card" v-if="!collectLoad">
      <TopInfo :icon="icon" :title="title"/>    

      <form id="cc-form" @submit.prevent="onsubmit">
        <div class="form-group">
          <label for="cc-name" class="text-caption-2">Cardholder name</label>
          <span id="cc-name" class="form-field">
          </span>
          <span class="text-caption-2 text-error" v-if="card_name"> {{ card_name }} </span>
        </div>

        <div class="form-group mgt-4">
          <label for="cc-number" class="mgt-2 text-caption-2">Card number</label>
            <span id="cc-number" class="form-field">
            </span>
            <span class="text-caption-2 text-error" v-if="cardno"> {{ cardno }} </span>
          </div>

          <div class="d-flex mgt-4">
            <div class="form-group">
              <label for="cc-expiration-date" class="text-caption-2">Expiry</label>
              <span id="cc-expiration-date" class="form-field">
              </span>
              <span class="text-caption-2 text-error" v-if="expiry_date"> {{ expiry_date }} </span>
            </div>

            <div class="form-group mgl-8">
              <label for="cc-cvc" class="text-caption-2">CVC</label>

              <span id="cc-cvc" class="form-field">
              </span>
              <IconView icon="cvv"  class="float-right mgr-2 mgt-n10" @cvv="showModal=true" />
              <span class="text-caption-2 text-error" v-if="cvv"> {{ cvv }} </span>

            </div>

          </div>
       
        <sendy-btn 
          :block="true" 
          :loading="loading"
          color='primary'
          class="mgt-10"
          type="submit"
        >
          Add Card
        </sendy-btn>

      </form>

    </div>
    <CvvModal :show="showModal" @close="showModal=!showModal"/>
    <ErrorModal :show="showErrorModal" :text="errorText" @close="showErrorModal=!showErrorModal" />
  </div>
</template>

<script>
// import { loadVGSCollect } from "@vgs/collect-js";z
import TopInfo from '../components/topInfo';
import CvvModal from '../components/modals/cvvModal';
import ErrorModal from '../components/modals/ErrorModal';
import Processing from '../components/processing';

export default {
  name: 'AddCard',
  components: {
    TopInfo,
    CvvModal,
    ErrorModal,
    Processing,
  },
  data() {
    return {
      loading: false,
      showSnackbar: true,
      showModal: false,
      showErrorModal: false,
      errorText: 'Your card issuer has declined this transaction. Contact your bank or card issuer for more information.',
      icon: 'back',
      title: 'Add a Card',
      form: {},
      cardno: '',
      card_name: '',
      expiry_date: '',
      cvv: '',
      transaction_id: '',
      poll_count: 0,
      poll_limit: 6,
      paymentBaseUrl: 'https://payment-gateway-dev.sendyit.com/payment-gateway/api/v1',
      collectLoad: false,
    }
  },
  watch: {
    form: {
      handler(val) {
        const state = val.state;
        for (const [key, value] of Object.entries(state)) {
          this[`${key}`] = !value.isValid && !value.isEmpty? value.errorMessages[0] : '';
        }
      },
      deep: true
    },
  },
  async mounted() {
    this.loadVGS();
    setTimeout(() => {
      this.setForm();
    }, 500);
  },
  methods: {  
    loadVGS() {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://js.verygoodvault.com/vgs-collect/2.0/vgs-collect.js';
      document.head.appendChild(script);
    },
    initForm() {
      setTimeout(() => {
        this.setForm();
      }, 500);
    }, 
    setForm() {

      const classes = {
        empty: 'field--empty',
        valid: 'field--valid',
        invalid: 'field--invalid',
        focused: 'field--focused',
        dirty: 'field--dirty',
        touched: 'field--touched',
      };

      this.form = VGSCollect.create(
        'tnt4d8qyodm',
        'sandbox',
        () => {},
      );
      
       this.form.field('#cc-name', {
        type: "text",
        name: "card_name",
        placeholder: 'Enter full name',
        validations: ['required'],
      });

      this.form.field('#cc-number', {
        type: 'card-number',
        name: 'cardno',
        successColor: '#4F8A10',
        errorColor: '#D8000C',
        showCardIcon: true,
        fontSize: '13px',
        placeholder: '0000 0000 0000 0000',
        validations: ['required', 'validCardNumber'],
        classes: classes,
      });

      this.form.field('#cc-cvc', {
        type: 'card-security-code',
        name: 'cvv',
        fontSize: '13px',
        placeholder: '***',
        validations: ['required', 'validCardSecurityCode'],
        showCardIcon: false,
        classes: classes,
      });

      this.form.field('#cc-expiration-date', {
        type: 'card-expiration-date',
        name: 'expiry_date',
        fontSize: '13px',
        errorColor: '#D8000C',
        successColor: '#4F8A10',
        placeholder: 'MM/YY',
        serializers: [{ name: 'replace', options: { old: ' ', new: '' } }],
        validations: ['required', 'validCardExpirationDate'],
        classes: classes,
      });
    },
    onsubmit() {
      const newCardPayload = {
        "country": "KE",
        "currency": "KES",
        "email": "jamesdoes@gmail.com",
        "firstname": "james",
        "lastname": "does",
        "phonenumber": "0798675432",
        "userid":"123456"
      };
      this.loading = true;
      this.form.submit(
          '/customers/collect_card_details',
          {
            data: newCardPayload,
          },
          (status, response) => {
            this.loading = false;
            if (response.status) {
              this.collectLoad = true;

              const payload = {
                url: '/api/v1/save',
                params: response.data,
              }

              this.$paymentAxiosPost(payload).then((res)=> {
                this.transaction_id = res.transaction_id;
                if (res.status) {
                  this.pollCard();
                } else {
                  this.collectLoad = false,
                  this.initForm();
                  this.loading = false;
                  this.errorText = res.reason;
                  this.showErrorModal= true;
                }

              }).catch(err => {
                this.errorText = 'Failed to collect card details. Please try again';
                this.showErrorModal= true;
              });
            } else {
              this.errorText = 'Failed to collect card details. Please try again';
              this.showErrorModal= true;
            }
          },
      );
    },

    pollCard() {
      this.poll_count = 0;
      const poll_limit = 6;
      for (let poll_count = 0; poll_count < poll_limit; poll_count++) {
        const that = this;
        (function (poll_count) {
          setTimeout(() => {
            if (that.poll_count === poll_limit) {
              poll_count = poll_limit;
              return;
            }
            
            that.TransactionIdStatus(); 
            if (poll_count === 5) {
              that.loading = false;
              this.collectLoad = false,
              this.initForm();
              this.errorText = 'Failed to confirm card. Please try again.';
              this.showErrorModal= true;
              return;
            }
          }, 10000 * poll_count);
        }(poll_count));
      }
    },

    async TransactionIdStatus() {

      const payload = {
        url: `/api/v1/process/status/${this.transaction_id}`,
      }
      this.$paymentAxiosGet(payload).then((res) => {
        if (res.status) { 
          switch (res.transaction_status) {
            case 'success':
              this.poll_count = this.poll_limit;
              this.collectLoad = false;
              this.$paymentNotification({
                text: 'Card details added and selected for payment.'
              });
              this.$router.push('/choose-payment');
              this.loading = false;
              break;
            case 'failed':
              this.poll_count = this.poll_limit;
              this.loading = false;
              this.collectLoad = false;
              this.initForm();
              this.errorText = res.message;
              this.showErrorModal= true;
              break;
            case 'pending':
              break;
            default:
              break;
          }
          return res;
        }

        this.poll_count = this.poll_limit;
        this.collectLoad = false;
        this.initForm();
        this.errorText = res.message;
        this.showErrorModal= true;
      })
    }
  }
}
</script>


<style lang="scss">

.form-field {
  display: block;
  height: 40px;
  width: -webkit-fill-available;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-field iframe {
  border: 0 none transparent;
  height: 100%;
  vertical-align: middle;
  width: 100%;
}

.form-field.field--valid iframe {
  border-color: #249e4c;
}

.text-caption-2 {
  font-family: Nunito;
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: #606266;
}
     
.modal {
  display: none;
  position: fixed;
  z-index: 1;
  padding-top: 150px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%; 
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.5);

}

/* Modal Content */
.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 32px;
  border: 1px solid #888;
  border-radius: 4px;
  width: 300px;
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
