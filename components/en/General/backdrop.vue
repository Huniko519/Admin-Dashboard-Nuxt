<template>
  <div class="en-backdrop" @click="$emit('clickingOnBackDrop')">
    <slot />
  </div>
</template>

<script>
export default {
  name: "Backdrop",
  methods: {
    test () {
      console.log("on overlay")
    },
  },
}
</script>

<style lang="scss" scoped>
.en-backdrop {
  background-color: rgba(99, 108, 141, 0.438);
  width: 100%;
  height: 100vh;
  z-index: 10000;
  position: fixed;
}
</style>
