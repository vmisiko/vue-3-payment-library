<template>
  <div id="cvv-modal" class="modal" ref="confirmModal">
    <div class="modal-content">
      <div class="mgt-5">
        <span>Are you sure you want to remove this withdrawal option?</span>
      </div>

      <sendy-btn
        :block="true"
        color="primary"
        class="mgt-5"
        type="submit"
        @click="router.push({name: 'ConfirmOtp'})"
      >
        Delete
      </sendy-btn>

      <div class="mgy-5 text-center">
        <span @click="$emit('close')" class="text-midnightBlue20 cursor pointer"> Cancel </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useGlobalProp } from "../../../hooks/globalProperties";
const confirmModal = ref(null);

const props = defineProps(["show"]);
const emit = defineEmits(['close']);
const { router }  = useGlobalProp();


watch(() => props.show, (val) => {
  val ? handleOpen() : handleClose();
});

onMounted(() => {
  console.log(props.show);
  props.show ? handleOpen() : handleClose();
})

const handleOpen = () => {
  confirmModal.value.style.display = "block";
};

const handleClose = () => {
  confirmModal.value.style.display  = "none";
};
</script>

<style lang="scss">
.modal {
  display: none;
  position: fixed;
  z-index: 1;
  padding-top: 150px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.5);
}

/* Modal Content */
.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 32px;
  border: 1px solid #888;
  border-radius: 4px;
  width: 300px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s;
}

/* Add Animation */
@-webkit-keyframes animatetop {
  from {
    top: -300px;
    opacity: 0;
  }
  to {
    top: 0;
    opacity: 1;
  }
}

@keyframes animatetop {
  from {
    top: -300px;
    opacity: 0;
  }
  to {
    top: 0;
    opacity: 1;
  }
}

/* The Close Button */
.close {
  color: black;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>
