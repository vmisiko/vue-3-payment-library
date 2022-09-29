<template>
    <button
      :type="type || 'text'"
      class="primary-btn"
      :disabled="disabled"
      :class="{
        'opacity-25': disabled || loading,
        'primary-btn-block': block && color === 'primary',
        'midnightblue-btn-block': color === 'info',
        'error-btn-block': color === 'error',
        'btn-outline primary': outline,
        'large': large,
      }"
    >
      <IconView icon="loading" v-if="loading" />
      <slot v-if="!loading"> {{ text ? text : $translate("submit") }} </slot>
    </button>
</template>

<script>
export default {
  name: "sendy-btn",
  props: [
    "block",
    "color",
    "loading",
    "type",
    "disabled",
    "text",
    "outline",
    "large",
    "medium",
    "small",
  ],
};
</script>

<style lang="scss"></style>
