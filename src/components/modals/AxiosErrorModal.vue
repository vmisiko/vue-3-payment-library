<template>
  <div id="axios-modal" class="modal" ref="axiosErrorModal">
    <div class="modal-content-pl">
      <div>
        <IconView icon="warning" />
      </div>

      <div class="mgt-4">
        <span> {{ $translate("error_alert") }} </span>
        <div>
          <span class="text-caption text-sendy-red-30">
            {{ text }}
          </span>
        </div>
      </div>

      <sendy-btn id="close" :block="true" color="info" class="mgt-8" @click="close">
        {{ $translate("close") }}
      </sendy-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "AxiosErrorModal",
  props: ["show", "text"],
  data() {
    return {};
  },
  watch: {
    show(val) {
      val ? this.handleOpen() : this.handleClose();
    },
  },
  mounted() {
    this.show ? this.handleOpen() : this.handleClose();
  },
  methods: {
    handleOpen() {
      let elementAxiosModal = this.$refs.axiosErrorModal;
      elementAxiosModal.style.display = "block";
    },
    handleClose() {
      let elementAxiosModal = this.$refs.axiosErrorModal;
      elementAxiosModal.style.display = "none";
    },
    close() {
      const entryRoute = localStorage.entry_route;
      this.$router.push(entryRoute);
      this.$emit("close");
    },
  },
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

.modal-content-pl {
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
