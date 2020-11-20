<template>
  <v-container class="mt-10 mt-md-1">
    <users :key="usersKey" />
  </v-container>
</template>

<script>
import users from "~/components/en/Dashboard/users.vue"
export default {
  head() {
    return {
      titleTemplate: '%s - Users',
    }
  },
  components: {
    users,
  },
  data () {
    return {
      usersKey: 0,
    }
  },
  layout: "adminlayout",
  methods: {
    forceRerender () {
      this.usersKey += 1
    },
  },
}
</script>

<style scoped></style>
