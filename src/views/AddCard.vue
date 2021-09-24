<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" :title="title"/>    

      <form id="cc-form" @submit.prevent="onsubmit">
        <div class="form-group">
          <label for="cc-name" class="text-caption-2">Cardholder name</label>
          <span id="cc-name" class="form-field">
          </span>
          <span class="text-caption-2 text-error" v-if="card_name"> {{ card_name }} </span>
        </div>

        <div class="form-group mt-4">
          <label for="cc-number" class="mt-2 text-caption-2">Card number</label>
            <span id="cc-number" class="form-field">
            </span>
            <span class="text-caption-2 text-error" v-if="cardno"> {{ cardno }} </span>
          </div>

          <div class="d-flex mt-4">
            <div class="form-group">
              <label for="cc-expiration-date" class="text-caption-2">Expiry</label>
              <span id="cc-expiration-date" class="form-field">
              </span>
              <span class="text-caption-2 text-error" v-if="expiry_date"> {{ expiry_date }} </span>
            </div>

            <div class="form-group ml-8">
              <label for="cc-cvc" class="text-caption-2">CVC</label>

              <span id="cc-cvc" class="form-field">
              </span>
              <IconView icon="cvv"  class="float-right mr-2 mt-n10" @cvv="showModal=true" />
              <span class="text-caption-2 text-error" v-if="cvv"> {{ cvv }} </span>

            </div>

          </div>
       

        <sendy-btn 
          :block="true" 
          :loading="loading"
          color='primary'
          class="mt-10"
          type="submit"
        >
          Add Card
        </sendy-btn>
      </form>

    </div>
    <CvvModal :show="showModal" @close="showModal=!showModal"/>
    <ErrorModal :show="showErrorModal" @close="showErrorModal=!showErrorModal" />
  </div>
</template>

<script>
// import { loadVGSCollect } from "@vgs/collect-js";z
import axios from 'axios';

export default {
  name: 'AddCard',
  components: {
    TopInfo: () => import('@/components/topInfo'),
    CvvModal: () => import('@/components/modals/cvvModal'),
    ErrorModal: () => import('@/components/modals/ErrorModal'),
  },
  data() {
    return {
      loading: false,
      showSnackbar: true,
      showModal: false,
      showErrorModal: false,
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
  mounted() {
    this.loadVeryGoodSecurityScript();
    console.log(document.title);
    setTimeout(() => {
      this.setForm();
    }, 500);
    localStorage.setItem('jwtToken', 'eyJhbGciOiJIUzI1NiIsInR5cGUiOiJKV1QifQ.eyJwYXlsb2FkIjp7InBlZXIiOnsicGF5X29wdGlvbiI6MSwidXNlcl9lbWFpbCI6Im1pc2lrb0BzZW5keWl0LmNvbSIsImRlZmF1bHRfY3VycmVuY3kiOiJLRVMiLCJ1c2VyX3Byb21vIjoiRlpXU0RPQSIsInVzZXJfaWQiOjE5MTMzLCJ1c2VyX3Bob25lIjoiKzI1NDcyMTY0OTQxNiIsInByZWZlcnJlZF9sYW5ndWFnZSI6ImVuIiwidXNlcl9uYW1lIjoiTWlzaWtvIiwiZnJlaWdodF9zdGF0dXMiOjEsInRheF9hdXRob3JpdHlfcGluIjoiQTAwMDAwOTAzOVMiLCJwYXlfbWV0aG9kIjoxLCJzdGF0dXMiOnRydWUsImNvdW50cnlfY29kZSI6IktFIiwiaWRfbm8iOiIzMjM0NTY0In0sImJpeiI6e30sInRlc3RfYWNjb3VudCI6ZmFsc2UsImN1c3RvbWVyX2NhcmVfbnVtYmVyIjoiKzI1NCA3MDkgNzc5IDc3OSIsImRlZmF1bHQiOiJwZWVyIiwiZmlyc3RfdGltZSI6ZmFsc2V9LCJzdGF0dXMiOnRydWV9.450iLVOq0xIUc6crATVHkwvkXfgboYBY23dmD7sYlJc')
  },
  methods: {
    loadVeryGoodSecurityScript() {
      console.log('loadVeryGoodSecurityScript');
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://js.verygoodvault.com/vgs-collect/2.0/vgs-collect.js';
      document.head.appendChild(script);
      console.log(script);
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
        showCardIcon: true,
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
      this.showErrorModal=!this.showErrorModal;
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
            console.log(response);
            if (response.status) {
              const headers = {
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  Authorization: localStorage.jwtToken,
                },
              }
              axios.post('https://payment-gateway-dev.sendyit.com/api/v1/save', response.data, headers).then((res)=> {
                this.transaction_id = res.transaction_id;
                if (res.status) {
                  this.pollCard();
                } else {
                  this.loading = false;
                  console.log(res.message);
                }

              }).catch(err => {
                console.log(err);
              });
            } else {
              console.log('Faled to collect card to vgs');
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
              that.transactionText = 'card payment Failed';
              that.loading = false;
              console.log('Failed to charge card');
              return;
            }
          }, 10000 * poll_count);
        }(poll_count));
      }
    },
    async TransactionIdStatus() {
      axios
      .get(`${paymentBaseUrl}/api/v1/process/status/${this.transaction_id}`)
      .then((res) => {
        if (res.status) { 
          this.transactionText = res.message;
          switch (res.transaction_status) {
            case 'success':
              this.poll_count = this.poll_limit;
              this.loading = false;
              console.log('Transaction was successfull')
              break;
            case 'failed':
              this.poll_count = this.poll_limit;
              this.loading = false;
              console.log('Transaction was successfull')
              break;
            case 'pending':
              break;
            default:
              break;
            }
          return res;
        }
        console.log(res.message);
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
