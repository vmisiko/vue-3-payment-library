<template>
  <div class="flex-center">
    <div class="card">
      <AvatarListView
        icon="warning"
        title="Unable to setup Pay by Bank"
      >
        <template v-slot:list-subtitle>
          <span class="text-error"> Error message from OnePipe</span>
        </template>
      </AvatarListView>

      <div class="mgt-8 flex-center">
        <sendy-btn
          :outline="true"
          text="Retry"
          class="retry-btn"
          :loading="loading"
        />
      </div>

      <div class="text-center mgt-5">
        <span @click="$router.push({name: 'ChoosePayment'})" class="link">Return to Payment Options</span>
      </div>
    </div>
  </div>
</template>

<script>
import AvatarListView from './components/AvatarListView';
 
export default {
  name: 'FailedAccountSetup',
  components: {
    AvatarListView,
  },
  data() {
    return {
      loading: false,
    }
  }
}
</script>

<style scoped>
.retry-btn {
  width: 240px !important;
}
</style>