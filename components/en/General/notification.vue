<template>
  <div v-if="show" class="en-notification" @click="hideNotfication">
    <div :class="notfiColor" class="en-notification-content">
      <span><slot /></span>
    </div>
  </div>
</template>
<script>
export default {
  name: "Notification",
  props: {
    notfiColor: {
      type: String,
      default: null,
    },
  },
  data () {
    return {
      show: true,
    }
  },
  methods: {
    hideNotfication () {
      this.show = false
    },
  },
}
</script>
<style lang="scss" scoped>
.en-notification {
  &-content {
    border-radius: 10px;
    color: white;
    height: 50px;
    font-size: 18px;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
  }
}
.redNotfi {
  background-color: rgb(216, 21, 21);
  &:hover {
    background-color: rgb(235, 46, 46);
  }
}
.greenNotfi {
  background-color: rgb(27, 216, 21);
  &:hover {
    background-color: rgb(40, 231, 34);
  }
}
</style>
