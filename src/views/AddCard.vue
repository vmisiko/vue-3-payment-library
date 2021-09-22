<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" :title="title"/>    

      <form id="cc-form" @submit.prevent="showErrorModal=!showErrorModal">
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
       

        <button type="submit" class="primary-btn-block mt-10" itemref="">
          Add Card
        </button>
      </form>

    </div>
    <CvvModal :show="showModal" @close="showModal=!showModal"/>
    <ErrorModal :show="showErrorModal" @close="showErrorModal=!showErrorModal" />
  </div>
</template>

<script>
// import { loadVGSCollect } from "@vgs/collect-js";z

export default {
  name: 'AddCard',
  components: {
    TopInfo: () => import('@/components/topInfo'),
    CvvModal: () => import('@/components/modals/cvvModal'),
    ErrorModal: () => import('@/components/modals/ErrorModal'),
  },
  data() {
    return {
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
