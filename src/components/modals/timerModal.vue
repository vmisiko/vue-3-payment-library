<template>
  <div id="timer-modal" class="modal" ref="timerModal">
    <div class="modal-content">
      <div class="mgt-4">
        <IconView icon="loading1" width="70" height="70" class="flex-center" />
      </div>

      <div class="text-center mgt-5">
        <span class="text-caption text-gray70"> {{ formatedCountdown }}</span>
      </div>
      <div class="mgt-4 text-center pdb-15">
        <span class="text-body-2">{{ $t("please_wait") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as moment from "moment";
import "moment-duration-format";

export default {
  name: "TimerModal",
  props: ["show"],
  data() {
    return {
      loading: false,
      countdown: 300,
    };
  },
  computed: {
    formatedCountdown() {
      return moment.duration(this.countdown, "seconds").format("mm:ss");
    },
  },
  watch: {
    show(val) {
      val ? this.handleOpen() : this.handleClose();
      if (!val) {
        this.countdown = 0;
      }
    },
  },
  mounted() {
    this.show ? this.handleOpen() : this.handleClose();
  },
  methods: {
    handleOpen() {
      let el = this.$refs.timerModal;
      el.style.display = "block";
      const stopCountdown = setInterval(() => {
        this.countdown -= 1;
        if (!this.countdown) {
          clearInterval(stopCountdown);
          this.$emit("close");
        }
      }, 1000);
    },

    handleClose() {
      let el = this.$refs.timerModal;
      el.style.display = "none";
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
