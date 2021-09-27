<template>
  <div id="app">
    <!-- <div class="container">
      <img class="mt-8" :src="require('@/assets/logo.svg')" /> -->
        <router-view/>
    <!-- </div>
    <NotificationComponent :show="showNotification" :text="notificationText" /> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
    }
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');
@import '@/assets/styles/global.scss';
</style>

