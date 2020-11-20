<template>
  <v-app class="app">
    <!-- Navbar -->
    <dashnav />
    <!-- Pages -->
    <v-main class="my-md-3 p-0">
      <v-container class="container">
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import dashnav from "~/components/en/Navigation/dashnav.vue"

  export default {
    components: { dashnav },

    head() {
      return {
        title: 'Yalla Dealz Inc, Dashboard Portal',
      }
    }
  }
</script>

<style scoped>
.app {
  background: #eee;
}

.container {
  max-width: 100%;
}
</style>
