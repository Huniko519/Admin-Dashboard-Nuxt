<template>
  <div class="" style=" margin-top: 5%;">
    <div :class="mainSide" class="">
      <merchantBranches />
    </div>
  </div>
</template>
<script>
  import merchantBranches from "~/components/en/Forms/merchantBranches.vue"

  export default {
    components: {
      merchantBranches,
    },
    head() {
      return {
        titleTemplate: '%s - Merchants',
      }
    },
    props: {
      mainSide: {
        type: String,
        default: null,
      },
    },
    layout: "adminlayout",
  }
</script>

<style lang="scss" scoped>
  .en-merchants {
    width: 100%;
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: center;
    &-content {
      margin-top: 5%;
      width: 100%;
      display: flex;
      flex-flow: row;
      justify-content: center;
    }
  }
</style>
