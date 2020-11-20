<template>
  <v-container class="mt-10 mt-md-1">
    <orders/>
  </v-container>
</template>

<script>
import orders from '~/components/en/Dashboard/orders'
export default {
  head() {
    return {
      titleTemplate: "%s - Users"
    };
  },
  layout: "adminlayout",
  components : {
    orders
  },
};
</script>

<style scoped></style>
