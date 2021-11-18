<template>
  <div class="card-min">
    <span v-if="!is3DS">

    <div v-for="(item, index) in fields" :key="index">
       <div class="textfield mgt-5" v-if="item.type === 'text'" >
          <label for="" class="normal-text"> {{ capitalize(item.field) }}</label>
          <input
            type="text"
            class="phone-input"
            :placeholder="`Enter ${item.field}`"
            required
            v-model="form[item.field]"
          >
        </div>
        <div class="textfield mgt-5" v-if="item.type === 'phone'" >
          <label for="" class="normal-text"> {{ capitalize(item.field) }}</label>
          <vue-tel-input 
            autoFormat 
            :defaultCountry="getBupayload.country_code"
            :dropdownOptions="dropdownOptions"
            mode="national"
            invalidMsg="Phone number is Invalid"
            @validate="validatePhone"
          >
          </vue-tel-input>
        </div>
        <div class="textfield mgt-5" v-if="item.type === 'date'" >
          <birth-datepicker
            placeholder="Enter Date of birth"
            v-model="form[item.field]"
            :valueIsString="true"
            delimiter="-"
            :yearFirst="true"
            class="phone-input"
          />
        </div>
       
    </div> 

    <sendy-btn 
      :block="true" 
      :loading="loading"
      color='primary'
      class="mgt-5"
      type="submit"
      @click="submit"
    >
      Submit
    </sendy-btn>
    </span>
    <span v-else>
      <Processing text="Processing your card details" />
    </span>

  </div> 
</template>

<script>
import { mapGetters, mapMutations, Mutation } from 'vuex';
import { VueTelInput } from 'vue-tel-input';
import Processing from '../components/processing';
// import birthDatepicker from 'vue-birth-datepicker';
import birthDatepicker from 'vue-birth-datepicker/src/birth-datepicker';


export default {
  name: 'AdditionalCardFields',
  components: {
    VueTelInput,
    Processing,
    birthDatepicker,
  },
  props: ['additionalData', 'transaction_id', 'is3DS'],
  data() {
    return {
      loading: false,
      address: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      phone: '',
      dropdownOptions: {
        showFlags: true,
        showDialCodeInSelection: true
      },
      formattedPhone: null,
      form: {},
      fields: this.additionalData,
    }
  },
  computed: {
    ...mapGetters(['getBupayload']),
  },
  watch: {
    additionalData(val) {
      this.fields = val;
    }
  },
  mounted () {
    if (this.is3DS) {
      const url = !this.additionalData ? this.additionalData : this.additionalData[0];
      const urlWindow = window.open(JSON.parse(url.field), '');

      const timer = setInterval(() => {
        
			  if (urlWindow.closed) {
          this.setTwoFACompleted(true);
          clearInterval(timer);
        }
	  	}, 500)

    }

  },
  methods: {
    ...mapMutations(['setTwoFACompleted']),

    validatePhone(val) {
      this.formattedPhone = val.valid ? val.number.split('+')[1] : null;
      this.form['phone'] = this.formattedPhone;
      return;
    },
    async submit() {
      this.loading = true;
      const payload = {
        transaction_id: this.transaction_id,
        ...this.form,
      }

      const fullPayload = {
        params: payload,
        url: '/api/v2/submit_info'
      }

      const response = await this.$paymentAxiosPost(fullPayload);
      this.loading = false;
      if (response.status) {

        if (response.additional_data) {
          this.fields = response.additional_data;
          //  this.$emit('continue', true);
          return;
        } else {
          this.setTwoFACompleted(true);
        }

        return;
      }

      this.$emit('continue', false);
    },
    capitalize(str) {
      const result = str.charAt(0).toUpperCase() + str.slice(1);
      return result;
    }
  }
}
</script>

<style scoped lang="scss">
.phone-input {
  padding: 8px;
  height: 40px;
  background: #FFFFFF;
  border: 0.5px solid #C0C4CC;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
}

.vue-tel-input {
  border-radius: 3px;
  display: flex;
  border: 0.5px solid #C0C4CC !important;
  text-align: left;
  height: 40px;
}
</style>
