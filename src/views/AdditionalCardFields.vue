<template>
  <div class="card-min">
    <span v-if="!is3DS">
    <div class="textfield mgt-5" v-if="additionalData.includes('address')">
      <label for="" class="normal-text"> Address</label>
      <input
        type="text"
        class="phone-input"
        placeholder="Marsabit Plaza-3rd Floor"
        required
        v-model="address"
      >
    </div>

    <div class="mgt-5" :class="{ 'direction-flex': additionalData.includes('city') && additionalData.includes('state')}">
      <div v-if="additionalData.includes('city')">
        <label for="" class="normal-text"> City</label>
        <input
          type="text"
          class="phone-input"
          placeholder="Nairobi"
          required
          v-model="city"
        >
      </div> 
      
      <div v-if="additionalData.includes('state')">
        <label for="" class="normal-text"> State</label>
        <input
          type="text"
          class="phone-input"
          placeholder="Kayole"
          required
          v-model="state"
        >
      </div> 
    </div>

    <div class="mgt-5">
      <div v-if="additionalData.includes('zip_code')">
        <label for="" class="normal-text"> Zip Code</label>
        <input
          type="text"
          class="phone-input"
          placeholder="00100"
          required
          v-model="zip_code"
        >
      </div> 
    </div>

    <div class="textfield mgt-5" v-if="additionalData.includes('phone')">>
      <label for="" class="normal-text"> Phone Number</label>
      <!-- <input
        type="text"
        class="phone-input"
        placeholder="Enter Phone Number"
        required
        v-model="address"
      > -->
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

    <sendy-btn 
      :block="true" 
      :loading="loading"
      color='primary'
      class="mgt-5"
      type="submit"
    >
      Submit
    </sendy-btn>
    </span>
    <span v-else>
      Add 3ds logic here
    </span>

  </div> 
</template>

<script>
import { mapGetters } from 'vuex';
import { VueTelInput } from 'vue-tel-input';

export default {
  name: 'AdditionalCardFields',
  components: {
    VueTelInput,
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
    }
  },
  computed: {
    ...mapGetters(['getBupayload']),
  },
  mounted () {
    if (this.is3DS) {
      const url = !this.additionalData ? this.additionalData : this.additionalData[0];
      const urlWindow = window.open(JSON.parse(url), '');

      const timer = setInterval(() => {
			  if (urlWindow.closed) {
          clearInterval(timer);
        }
	  	}, 500)

    }

  },
  methods: {
    validatePhone(val) {
      this.formattedPhone = val.valid ? val.number.split('+')[1] : null;
      return;
    },
  }
}
</script>

<style scoped>
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