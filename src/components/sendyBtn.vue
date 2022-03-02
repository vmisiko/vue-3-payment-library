<template>
  <div>
    <button 
    :type="type || 'text'" 
    class="primary-btn"
    @click="$emit('click')"
    :disabled="disabled"
    :class="{'opacity-25': disabled || loading, 
      'primary-btn-block': block && color === 'primary',
      'midnightblue-btn-block': color === 'info',
      'error-btn-block': color === 'error',
      'btn-outline-primary': outline,
      }"
    >
      <IconView icon="loading" v-if="loading" />
      <slot v-if="!loading"> {{ text ? text : $t('submit') }} </slot>
    </button>
  </div>
</template>

<script>
export default {
  name: 'sendy-btn',
  props: ['block', 'color', 'loading', 'type', 'disabled', 'text', 'outline'],
}
</script>

<style lang="scss">

</style>