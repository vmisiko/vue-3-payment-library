<template>
  <div id="app">
    <div class="container">
      <img class="mt-8" :src="require('@/assets/logo.svg')" />
        <router-view/>
    </div>
    <NotificationComponent :show="showNotification" :text="notificationText" />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    NotificationComponent: () => import('./components/notificationComponent'),
  },
  data() {
    return {
      showNotification: false,
      notificationText: 'M-PESA option added and selected for payment.',
    }
  },
  mounted() {
    this.$root.$on('payment-notification', this.notificationInit);
  },
  methods: {
    notificationInit(payload) {
      this.notificationText = payload.text;
      this.showNotification = !this.showNotification;
    }
  }
 }
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');
@import '@/assets/styles/global.scss';
</style>

