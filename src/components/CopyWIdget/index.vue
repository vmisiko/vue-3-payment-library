<template>
  <span class="link mgl-3" @click="handleCopy">
    <svg
      width="10"
      height="12"
      viewBox="0 0 10 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 0.5H1C0.45 0.5 0 0.95 0 1.5V8C0 8.275 0.225 8.5 0.5 8.5C0.775 8.5 1 8.275 1 8V2C1 1.725 1.225 1.5 1.5 1.5H6.5C6.775 1.5 7 1.275 7 1C7 0.725 6.775 0.5 6.5 0.5ZM6.795 2.795L9.21 5.21C9.395 5.395 9.5 5.65 9.5 5.915V10.5C9.5 11.05 9.05 11.5 8.5 11.5H2.995C2.445 11.5 2 11.05 2 10.5L2.005 3.5C2.005 2.95 2.45 2.5 3 2.5H6.085C6.35 2.5 6.605 2.605 6.795 2.795ZM6.5 6H8.75L6 3.25V5.5C6 5.775 6.225 6 6.5 6Z"
        fill="#324BA8"
      />
    </svg>

    <span class="mgl-1">{{ $translate("copy") }}</span>
  </span>
</template>

<script setup>
import { useStore } from 'vuex';
import { useGlobalProp } from '../../hooks/globalProperties';

const store = useStore();
const { t } = useGlobalProp();

const props = defineProps(['text'])
const handleCopy = () => {
  const cb = navigator.clipboard;
  cb.writeText(props.text).then(() => {
    store.dispatch('paymentNotification', { text: "Copied!" });
  });
}

</script>

