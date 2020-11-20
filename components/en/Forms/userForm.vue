<template>
  <div class="en-userForm">
    <div v-if="success != ''" class="en-userForm-errors-error">
      <notification notfi-color="greenNotfi">
        {{ success }}
      </notification>
    </div>

    <div class="en-userForm-errors">
      <div
        v-for="error in errors"
        :key="error.msg"
        class="en-userForm-errors-error"
      >
        <notification notfi-color="redNotfi">
          {{ error.msg }}
        </notification>
      </div>
    </div>

    <div v-if="loading" class="sk-folding-cube">
      <div class="sk-cube1 sk-cube" />
      <div class="sk-cube2 sk-cube" />
      <div class="sk-cube4 sk-cube" />
      <div class="sk-cube3 sk-cube" />
    </div>
    <v-card elevation="10" class="pa-5 mb-6">
      <form
        v-if="!loading"
        class="en-userForm-content"
        @submit.prevent="addUser"
      >
        <div class="en-userForm-content-row">
          <v-text-field
            v-model="firstName"
            :counter="12"
            :rules="[
              (v) => !!v || 'Name is required',
              (v) =>
                (v && v.length <= 12) || 'Name must be less than 12 characters',
            ]"
            label="First Name"
            required
            @input="setFirstName"
          />
        </div>

        <div class="en-userForm-content-row">
          <v-text-field
            v-model="lastName"
            :counter="12"
            :rules="[
              (v) => !!v || 'Name is required',
              (v) =>
                (v && v.length <= 12) || 'Name must be less than 12 characters',
            ]"
            label="Last Name"
            required
            @input="setLastName"
          />
        </div>
        <div class="en-userForm-content-row">
          <v-text-field
            v-model="password"
            :rules="[(v) => !!v || 'Password is required']"
            label="Password"
            required
            type="password"
            @input="setPassword"
          />
        </div>

        <div class="en-userForm-content-row">
          <v-text-field
            v-model="Phone"
            :rules="[
              (v) => !!v || 'Phone Number is required',
              (v) =>
                (v && /^[0-9]+$/.test(v)) || 'Phone Number must be digits only',
            ]"
            label="Phone Number"
            required
            @input="setPhone"
          />
        </div>

        <div class="en-userForm-content-row">
          <v-text-field
            v-model="Email"
            label="Email"
            :rules="[
              (v) => !!v || 'E-mail is required',
              (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ]"
            required
            @input="setEmail"
          />
        </div>

        <div class="en-userForm-content-radio">
          <div>
            <p>Gender:</p>
          </div>
          <div>
            <input id="male" v-model="gender" type="radio" value="male">
            <label for="male" style="margin-right: 15px;">Male</label>
            <input id="female" v-model="gender" type="radio" value="female">
            <label for="female">Female</label>
          </div>
        </div>

        <div class="en-userForm-content-row">
          <v-text-field
            v-model="birthDate"
            :rules="[
              (v) => !!v || 'Birth Date is required',
              (v) =>
                (v &&
                  /^(?:19|20)\d\d(-)(((0)[0-9])|((1)[0-2]))(-)([0-2^([0-2][0-9]|(3)[0-1])$/.test(
                    v
                  )) ||
                'Wrong Format YYYY-MM-DD',
            ]"
            label="Birth Date"
            placeholder="YYYY-MM-DD"
            required
            @input="setBirthDate"
          />
        </div>

        <buttonWithColors btn-color="RedBtn" btn-label="Add User" />
      </form>
    </v-card>
  </div>
</template>

<script>
// import Cookie from "js-cookie"
import { required, integer, email } from "vuelidate/lib/validators"
// import inputWithIcon2 from "~/components/en/General/inputWithIcon2.vue"
// import arinputWithIcon2 from "~/components/ar/General/arinputWithIcon2.vue"
// import selectInput from "~/components/en/General/selectInput.vue"
import buttonWithColors from "~/components/en/General/buttonWithColors.vue"
import notification from "~/components/en/General/notification.vue"

export default {
  name: "UserForm",
  components: {
    // inputWithIcon2,
    // arinputWithIcon2,
    buttonWithColors,
    notification,
    // selectInput,
  },
  data () {
    return {
      firstName: "",
      lastName: "",
      Phone: "",
      Email: "",
      birthDate: "",
      gender: "",
      password: "",
      errors: [],
      file: "",
      success: "",
      loading: false,
    }
  },

  validations: {
    firstName: {
      required,
    },
    lastName: {
      required,
    },
    Phone: {
      required,
      integer,
    },
    Email: {
      required,
      email,
    },
    birthDate: {
      required,
    },
    gender: {
      required,
    },

    password: {
      required,
    },
  },
  methods: {
    setFirstName (value) {
      this.firstName = value
      this.$v.firstName.$touch()
    },
    setLastName (value) {
      this.lastName = value
      this.$v.lastName.$touch()
    },
    setPhone (value) {
      this.Phone = value
      this.$v.Phone.$touch()
    },
    setEmail (value) {
      this.Email = value
      this.$v.Email.$touch()
    },
    setBirthDate (value) {
      this.birthDate = value
      this.$v.birthDate.$touch()
    },
    setPassword (value) {
      this.password = value
      this.$v.password.$touch()
    },
    addUser () {
      this.loading = true
      const userData = {
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.Phone,
        email: this.Email,
        birthDate: this.birthDate,
        password: this.Password,
        gender: this.gender,
      }

      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR"
        this.loading = false
      } else {
        // eslint-disable-next-line no-unused-vars
        const config = {
          headers: {
            authorization: this.$store.state.token,
          },
        }
        this.errors = []
        const submitUser = async () => {
          // await uploadImage()
          console.log("start submit")
          const config = {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
          await this.$axios
            .post("/user/signup", userData, config)
            .then((result) => {
              this.success = "Added to Users"
              this.$emit("updated")
              this.loading = false
            })
            .catch((error) => {
              this.errors.push(error.response.data)
              this.loading = false
            })
        }
        submitUser()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.en-userForm {
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
.en-userForm-content {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
  height: auto;
  &-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    &-element {
      width: 100%;
      &-img {
        width: 30%;
        margin: auto;
        display: block;
        margin-bottom: 10px;
      }
    }
  }
  &-radio {
    width: 100%;
    display: inline-block;
    justify-content: space-between;
    margin-bottom: 20px;
  }
}

@media (max-width: 992px) {
  .en-userForm-content {
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
        width: auto;
      }
    }
  }
}

// loading :

.sk-folding-cube {
  margin: 200px 100px;
  width: 40px;
  height: 40px;
  position: relative;
  -webkit-transform: rotateZ(45deg);
  transform: rotateZ(45deg);
}

.sk-folding-cube .sk-cube {
  float: left;
  width: 50%;
  height: 50%;
  position: relative;
  -webkit-transform: scale(1.1);
  -ms-transform: scale(1.1);
  transform: scale(1.1);
}
.sk-folding-cube .sk-cube:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #333;
  -webkit-animation: sk-foldCubeAngle 2.4s infinite linear both;
  animation: sk-foldCubeAngle 2.4s infinite linear both;
  -webkit-transform-origin: 100% 100%;
  -ms-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
}
.sk-folding-cube .sk-cube2 {
  -webkit-transform: scale(1.1) rotateZ(90deg);
  transform: scale(1.1) rotateZ(90deg);
}
.sk-folding-cube .sk-cube3 {
  -webkit-transform: scale(1.1) rotateZ(180deg);
  transform: scale(1.1) rotateZ(180deg);
}
.sk-folding-cube .sk-cube4 {
  -webkit-transform: scale(1.1) rotateZ(270deg);
  transform: scale(1.1) rotateZ(270deg);
}
.sk-folding-cube .sk-cube2:before {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}
.sk-folding-cube .sk-cube3:before {
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}
.sk-folding-cube .sk-cube4:before {
  -webkit-animation-delay: 0.9s;
  animation-delay: 0.9s;
}
@-webkit-keyframes sk-foldCubeAngle {
  0%,
  10% {
    -webkit-transform: perspective(140px) rotateX(-180deg);
    transform: perspective(140px) rotateX(-180deg);
    opacity: 0;
  }
  25%,
  75% {
    -webkit-transform: perspective(140px) rotateX(0deg);
    transform: perspective(140px) rotateX(0deg);
    opacity: 1;
  }
  90%,
  100% {
    -webkit-transform: perspective(140px) rotateY(180deg);
    transform: perspective(140px) rotateY(180deg);
    opacity: 0;
  }
}

@keyframes sk-foldCubeAngle {
  0%,
  10% {
    -webkit-transform: perspective(140px) rotateX(-180deg);
    transform: perspective(140px) rotateX(-180deg);
    opacity: 0;
  }
  25%,
  75% {
    -webkit-transform: perspective(140px) rotateX(0deg);
    transform: perspective(140px) rotateX(0deg);
    opacity: 1;
  }
  90%,
  100% {
    -webkit-transform: perspective(140px) rotateY(180deg);
    transform: perspective(140px) rotateY(180deg);
    opacity: 0;
  }
}
</style>
