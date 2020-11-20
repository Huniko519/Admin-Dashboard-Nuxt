<template>
  <div class="en-loginForm">
    <div class="en-loginForm-errors">
      <div
        v-for="error in errors"
        :key="error.message"
        class="en-loginForm-errors-error"
      >
        <notification notfi-color="redNotfi">
          {{ error.message }}
        </notification>
      </div>
    </div>
    <form class="en-loginForm-content" @submit.prevent="loginCheck">
      <div class="en-loginForm-content-row">
        <v-text-field
          v-model="username"
          color="success"
          prepend-inner-icon="mdi-shield-account"
          label="Your name"
          :counter="12"
          :rules="[
            (v) => !!v || 'Name is required',
            (v) =>
              (v && v.length <= 12) || 'Name must be less than 12 characters',
          ]"
          required
          @input="setUsername"
        />
      </div>

      <div class="en-loginForm-content-row">
        <v-text-field
          v-model="password"
          color="success"
          prepend-inner-icon="mdi-lock"
          label="Your Password"
          :type="show1 ? 'text' : 'password'"
          :rules="[(v) => !!v || 'Password is required']"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          required
          @input="setPassword"
          @click:append="show1 = !show1"
        />
      </div>

      <buttonWithColors
        class="py-6"
        style="font-size: 18px;"
        btn-color="RedBtn"
        btn-label="Login"
      />
    </form>
  </div>
</template>

<script>
import Cookie from "js-cookie"
import { required } from "vuelidate/lib/validators"
import Vue from "vue"
import VueCookie from "vue-cookie"
// import inputWithIcon from "~/components/en/General/inputWithIcon.vue"
import buttonWithColors from "~/components/en/General/buttonWithColors.vue"
import notification from "~/components/en/General/notification.vue"

Vue.use(VueCookie)

export default {
  name: "LoginForm",
  components: {
    // inputWithIcon,
    buttonWithColors,
    notification,
  },
  data () {
    return {
      username: "",
      loginField: "",
      password: "",
      show1: false,
      errors: [],
    }
  },

  validations: {
    username: {
      required,
    },
    password: {
      required,
    },
  },
  methods: {
    setUsername (value) {
      this.username = value
      this.$v.username.$touch()
    },
    setPassword (value) {
      this.password = value
      this.$v.password.$touch()
    },
    loginCheck () {
      //       let config = {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }
      // }

      const userData = {
        loginField: this.username,
        password: this.password,
      }
      this.$cookie.set("navName", this.username, 1)
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR"
      } else {
        this.errors = []
        this.$axios
          .post("/systemUsers/login", userData)
          .then((result) => {
            console.log(result)

            this.$store.commit("setToken", result.data.token)
            this.$router.push("/en/dashboard")
            localStorage.setItem("token", result.data.token)
            localStorage.setItem(
              "tokenExpiration",
              new Date().getTime() + 3600 * 1000
            )
            Cookie.set("jwt", result.data.token)
            Cookie.set("expirationDate", new Date().getTime() + 3600 * 1000)
          })
          .catch((error) => {
            this.errors.push(error.response.data)
          })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.en-loginForm {
  &-errors {
    width: 80%;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    &-error {
      width: auto;
      text-align: center;
    }
  }
}
.en-loginForm-content {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
  height: 190px;
  &-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    &-element {
      width: 400px;
    }
  }
  &-button {
    width: 300px;
    &-TheButton {
      width: 100px;
      float: right;
    }
  }
}
@media (max-width: 992px) {
  .en-loginForm-content {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    align-items: center;
    height: 190px;
    &-row {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      &-element {
        width: 400px;
      }
    }
    &-button {
      width: 80%;
      display: flex;
      justify-content: flex-end;
      &-TheButton {
        width: 100px;
      }
    }
  }
}
</style>
