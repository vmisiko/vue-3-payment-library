<template>
  <div id="snackbar" class="">
    <div class="mgt-3 direction-flex">
      <IconView v-if="!type" icon="check-circle-sucess" />
      <IconView v-if="type === 'info'" icon="info" />
      <IconView
        v-if="type === 'error'"
        icon="warning"
        width="20px"
        height="20px"
      />
      <span class="text-caption mgl-5"> {{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "notification",
  props: ["show", "text", "type"],
  data() {
    return {};
  },
  watch: {
    show(old, val) {
      if (old !== val) {
        this.showSnackbar();
      }
    },
  },
  methods: {
    showSnackbar() {
      var x = document.getElementById("snackbar");
      x.className = "show";
      setTimeout(function () {
        x.className = x.className.replace("show", "");
      }, 3000);
    },
  },
};
</script>

<style lang="scss">
#snackbar {
  visibility: hidden;
  max-width: 312px;
  margin-right: 20px;
  background-color: #f7f9fc;
  color: #303133;
  border-radius: 8px;
  padding: 16px;
  position: absolute;
  z-index: 1;
  right: 0px;
  top: 43px;
}

#snackbar.show {
  visibility: visible; /* Show the snackbar */
  /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
  However, delay the fade out process for 2.5 seconds */
  -webkit-animation: fadein 0.1s, fadeout 0.5s 2.5s;
  animation: fadein 0.1s, fadeout 0.5s 2.5s;
}

/* Animations to fade the snackbar in and out */
@-webkit-keyframes fadein {
  from {
    right: 0;
    opacity: 0;
  }
  to {
    right: 30px;
    opacity: 1;
  }
}

@keyframes fadein {
  from {
    right: 0;
    opacity: 0;
  }
  to {
    right: 30px;
    opacity: 1;
  }
}

@-webkit-keyframes fadeout {
  from {
    right: 30px;
    opacity: 1;
  }
  to {
    right: 0;
    opacity: 0;
  }
}

@keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}
</style>
