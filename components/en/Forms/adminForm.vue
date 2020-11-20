<template>
  <div class="en-AdminForm">
    <div v-if="success != ''" class="en-AdminForm-errors-error">
      <notification notfi-color="greenNotfi">
        {{ success }}
      </notification>
    </div>

    <div class="en-AdminForm-errors">
      <div
        v-for="error in errors"
        :key="error.msg"
        class="en-AdminForm-errors-error"
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
        class="en-AdminForm-content"
        @submit.prevent="addAdmin"
      >
        <div class="en-AdminForm-content-row">
          <v-text-field
            v-model="AdminName"
            :counter="12"
            :rules="[
              (v) => !!v || 'Name is required',
              (v) =>
                (v && v.length <= 12) || 'Name must be less than 12 characters',
            ]"
            label="Admin Name"
            required
            @input="setAdminName"
          />
        </div>

        <div class="en-AdminForm-content-row">
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

        <div class="en-AdminForm-content-row">
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

        <div class="en-AdminForm-content-row">
          <v-select
            v-model="Role"
            label="Role"
            :rules="[(v) => !!v || 'Role is required']"
            required
            :items="roles"
            value="val"
            item-text="name"
            @changedSelect="setRole"
          />
        </div>

        <div class="en-AdminForm-content-row">
          <v-text-field
            v-model="password"
            :rules="[(v) => !!v || 'Password is required']"
            label="Password"
            required
            type="password"
            @input="setPassword"
          />
        </div>

        <buttonWithColors btn-color="RedBtn" btn-label="Add Admin" />
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
  name: "AdminForm",
  components: {
    // inputWithIcon2,
    // arinputWithIcon2,
    buttonWithColors,
    notification,
    // selectInput,
  },
  data () {
    return {
      AdminName: "",
      Phone: "",
      Email: "",
      Role: "",
      password: "",
      roles: [
        { name: "Data Entry", val: "data_entry", },
        { name: "Admin", val: "admin", },
        { name: "Super Admin", val: "super_admin", }
      ],
      errors: [],
      file: "",
      success: "",
      loading: false,
    }
  },

  validations: {
    AdminName: {
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
    Role: {
      required,
    },
    password: {
      required,
    },
  },
  methods: {
    setAdminName (value) {
      this.AdminName = value
      this.$v.AdminName.$touch()
    },
    setPhone (value) {
      this.Phone = value
      this.$v.Phone.$touch()
    },
    setEmail (value) {
      this.Email = value
      this.$v.Email.$touch()
    },
    setRole (value) {
      this.Role = value
      this.$v.Role.$touch()
    },
    setPassword (value) {
      this.password = value
      this.$v.password.$touch()
    },
    addAdmin () {
      this.loading = true
      const adminData = {
        name: this.AdminName,
        phone: this.Phone,
        email: this.Email,
        role: this.Role,
        password: this.Password,
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
        const submitAdmin = async () => {
          // await uploadImage()
          console.log("start submit")
          const config = {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
          await this.$axios
            .post("/systemUsers", adminData, config)
            .then((result) => {
              this.success = "Added to Admins"
              this.$emit("updated")
              this.loading = false
            })
            .catch((error) => {
              this.errors.push(error.response.data)
              this.loading = false
            })
        }
        submitAdmin()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.en-AdminForm {
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
.en-AdminForm-content {
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
  &-button {
    width: 100%;
    &-TheButton {
      width: 350px;
    }
  }
}

@media (max-width: 992px) {
  .en-AdminForm-content {
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
