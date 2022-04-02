<template>
  <div class="direction-flex mgt-6">
    <div class="list-icon">
      <slot name="icon">
        <IconView :icon="icon || 'warning'" width="72" height="72" />
      </slot>
    </div>

    <div class="mgl-6">
      <slot name="list-title">
        <span class="subtitle-2-semibold text-gray90"> {{ title }} </span>
      </slot>
      <div class="mt-2">
        <slot name="list-subtitle">
          <span class="body-2-regular"> {{ subtitle }} </span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AvatarListView",
  props: ["title", "subtitle", "icon"],
};
</script>
