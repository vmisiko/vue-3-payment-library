<template>
  <div class="card-min height-space">
      <div class="text-center">
        <span class="title-body1-bold"> {{title}} </span>
      </div>
      <div class="flex-center">
        <div class="">
          <IconView icon="loading1" class="flex-center mgt-10" />
        </div>
      </div>
      <div class="text-center mgt-5" v-if="count">
        <span class="text-caption text-gray70"> {{ formatedCountdown }}</span>
      </div>
      <div class="text-center mgt-5">
        <span class="normal-text">{{ text }}</span>
      </div>

  </div>
</template>

<script>
  import * as moment from "moment";
  import "moment-duration-format";

  export default {
    name: 'Processing',
    props: ['text', 'count', 'title'],
    data() {
      return {
        countdown: 300,
      }
    },
    computed: {
      formatedCountdown() {
        return moment.duration(this.countdown, "seconds").format("mm:ss");
      },
    },
    watch: {
      count(val) {
        if (val) {
          this.startCount();
        }
      }
    },
    methods: {
      startCount() {
        const stopCountdown = setInterval(() => {
        this.countdown -= 1;
        if (!this.countdown) {
          clearInterval(stopCountdown);
          this.$emit('close');
        } 
      }, 1000);

      }
    },
  }
</script>

<style lang="scss">
  .processing-box {
    width: 240px;
    height: 240px;
    left: 60px;
    top: 32px;
    background: rgb(240, 237, 237);
  }

  .height-space {
    height: 500px;
  }
</style>