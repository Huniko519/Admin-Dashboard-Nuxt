<template>
  <v-container class="mt-10 mt-md-1">
    <dealForm />
  </v-container>
</template>

<script>
  import dealForm from "~/components/en/Forms/dealForm.vue"
  export default {
    layout: "adminlayout",
    head() {
      return {
        titleTemplate: '%s - Deals',
      }
    },
    components: {
      dealForm,
    },
  }
</script>

<style lang="scss" scoped>
  .en-deals {
    display: flex;
    justify-content: center;
    &-content {
      margin-top: 10%;
      width: 90%;
    }
  }
</style>
