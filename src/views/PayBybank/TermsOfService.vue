<template>
  <div class="flex-center">
    <Processing @close="showProcessing=false" :count="count" title="Pay by Bank Setup" text="Assinging your unique account details..." v-if="showProcessing" />
    <div class="card" v-else>
      <div class="">
        <span class="link" @click="$router.go(-1)"> Cancel </span>

        <div class="mgt-n6 text-center">
          <span class="title text-gray90">Terms of Service</span>
        </div>
      </div>
      <div class="mgt-8">
        <iframe width="100%" height="450" src="https://docs.google.com/document/d/e/2PACX-1vRPx-4L-5lSb1QZ0L3Amph5mtRGR3wxiVgfmahbZIOZZIhty2b6tdEqWJqHNoFSfg/pub?embedded=true"></iframe>
      </div>

      <sendy-btn
        :block="true" 
        :loading="loading"
        color='primary'
        class="mgt-13"
        text='Agree and Continue'
      />

    </div>
  </div>
</template>

<script>
import Processing from '../../components/processing'

export default {
  name: 'TermsOfService',
  components: {
    Processing,
  },
  data() {
    return {
      showProcessing: true,
      count: true,
    }
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
</style>