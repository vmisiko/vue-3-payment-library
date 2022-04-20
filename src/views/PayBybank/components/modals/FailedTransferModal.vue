<template>
  <div id="failed-transfer" class="modal" ref="FailedTransfer">
    <div class="modal-content">
      <div>
        <IconView icon="warning" width="72px" height="72px" />
      </div>

      <div class="mgt-4">
        <span class="subtitle-2-bold text-gray90">
          {{ $t("transfer_wasnt_detected") }}
        </span>
      </div>

      <div class="mgt-4">
        <span class="caption-1-regular text-gray90">
          {{ $t("check_again") }}
          <strong class=""> {{ $t("confirm_transfer") }}</strong>
        </span>
      </div>

      <sendy-btn :outline="true" class="mgt-10" @click="$emit('close')">
        {{ $t("close") }}
      </sendy-btn>

      <div class="mgt-8">
        <span class="caption-2-bold">{{
          $t("still_have_issues_with_bank_transfer")
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MpesaErrorModal",
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
      let el = this.$refs.FailedTransfer;
      el.style.display = "block";
    },
    handleClose() {
      let el = this.$refs.FailedTransfer;
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
