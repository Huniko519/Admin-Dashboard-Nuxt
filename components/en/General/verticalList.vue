<template>
  <div class="en-verticalList">
    <div class="en-verticalList-item">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: "VerticalList",
  props: {
    center: {
      type: String,
      default: null,
    },
  },
}
</script>

<style lang="scss" scoped>
.en-verticalList {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-evenly;
  align-items: left;
  padding: 20px;
}
</style>
