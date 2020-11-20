<template>
  <v-app class="mainContainer">
    <v-container class="mt-lg-12 py-0">
      <v-card elevation="5" class="loginCard mt-lg-5">
        <v-row>
          <!-- left side -->
          <!-- image -->
          <v-col class="p-3" cols="12" md="7">
            <img height="100%" width="100%" src="~/assets/images/dashboardIntro.png">
          </v-col>

          <!-- right side -->
          <!-- form -->
          <v-col class="mx-auto p-5" cols="12" md="5">
            <h5>Login</h5>
            <p class="mt-5">Welcome back, please login to your account.</p>
            <hr>
            <loginForm />
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
  import loginForm from "~/components/en/Forms/loginForm"
  export default {
    middleware: ["check-auth", "prevent-login"],
    components: {
      loginForm,
    },
    head () {
      return {
        title: 'Yalla Dealz Inc, Dashboard Portal',
        titleTemplate: '%s - Login',
      }
    }
  }
</script>

<style scoped>
.mainContainer {
  /* background: url('~assets/images/dashboardIntro.png') no-repeat top left; */
  background-size: cover;
}

.loginCard {
  width: 80%;
  margin: auto;
  background: #fff;
}
</style>
