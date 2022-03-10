<template>
  <div class="flex-center">
    <Processing @close="showProcessing=false" :count="count" title="Pay by Bank Setup" text="Assinging your unique account details..." v-if="showProcessing" />
    <div class="card" v-else>
      <div class="">
        <div class="">
          <span class="title text-gray90">Terms of Service</span>
        </div>
      </div>
      <div class="mgt-4 iframe-div">
        <iframe frameBorder="0" width="100%" height="450" src="https://docs.google.com/document/d/e/2PACX-1vRPx-4L-5lSb1QZ0L3Amph5mtRGR3wxiVgfmahbZIOZZIhty2b6tdEqWJqHNoFSfg/pub?embedded=true"></iframe>
      </div>

       <div class="direction-flex mgt-13">
        <div class="mgy-auto">
          <span @click="$router.go(-1)" class="link"> cancel</span>
        </div>

        <div class="spacer"></div>
        <sendy-btn
          :loading="loading"
          color='primary'
          text = 'Agree and Continue'
          @click="openAccount"
        />
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Processing from '../../components/processing'

export default {
  name: 'TermsOfService',
  components: {
    Processing,
  },
  data() {
    return {
      showProcessing: false,
      count: true,
    }
  },
  computed: {
    ...mapGetters(['getBupayload']),
  },
  methods: {
    ...mapMutations('setErrorText'),
    async openAccount() {
      this.loading = true;
      this.showProcessing = true;
      this.count = true;

      const payload = {
        user_id: this.getBupayload.user_id,
        first_name: this.getBupayload.first_name,
        surname: this.getBupayload.last_name,
        email: this.getBupayload.email,
        mobile_number: this.getBupayload.phonenumber,
        entity: this.getBupayload.entity_id,
        country_code: this.getBupayload.currency,
      }

      const fullPayload = {
        url: '/api/v3/onepipe/open_account',
        params: payload ,
      }

      const response = await this.$paymentAxiosPost(fullPayload);
      console.log(response);
      this.loading = false;
      this.showProcessing = false;
      if (response.status) {
        this.$router.push({ name: 'AccountReadyView'});
        return;
      }
      this.$router.push({ name: 'FailedAccountSetup'});
      this.setErrorText(response.message);
    },
  }
}
</script>

<style scoped>
.title {
  font-family: 'Nunito' 'Sans';
  font-style: normal;
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
  text-align: center;
  letter-spacing: -0.003em;
  color: #303133;
}

.iframe-div {
  display: block;
  overflow: hidden;
  background: #F7F9FC;
  height: 450px;
  border-radius: 10px;
  transform: translateZ(0px);
  /* border: 3px solid #eee; */
}

iframe .c27 {
  background-color: #F7F9FC !important;
}
</style>