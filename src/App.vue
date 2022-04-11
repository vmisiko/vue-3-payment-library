<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { useAxios } from './hooks/AxiosHook';

export default {
  name: "App",
  data() {
    return {};
  },
  setup(props, context) {

    const { config } = useAxios(context);
  },
  mounted() {
    console.log(this.config);
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Nunito&display=swap");
@import "@/assets/styles/global.scss";
</style>
