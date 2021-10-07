<template>
  <div class="card-min">
      <div class="flex-center">
        <div class="">
          <IconView icon="loading1" class="flex-center mgt-10" />
        </div>
      </div>
      <div class="text-center mgt-15">
        <span class="normal-text">{{ text }}</span>
      </div>

  </div>
</template>

<script>
  export default {
    name: 'Processing',
    props: ['text']
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
</style>