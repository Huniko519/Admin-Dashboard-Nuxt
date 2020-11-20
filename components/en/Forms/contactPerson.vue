<template>
  <div class="en-contactPerson">
    <div class="en-contactPerson-title">
      <v-card elevation="0" class="pa-5 mb-5 border">
        <v-form ref="contactform" v-model="valid">
          <div class="en-contactPerson-main">
            <div class="en-contactPerson-main-left">
              <div class="en-contactPerson-main-left-form">
                <v-text-field
                  v-model="contactPerson.name"
                  :counter="20"
                  :success="!!contactPerson.name"
                  :rules="[
                    (v) => !!v || 'Person Name is required',
                    (v) =>
                      (v && v.length <= 20) ||
                      'Name must be less than 20 characters',
                  ]"
                  label="Person Name"
                  required
                />

                <v-text-field
                  v-model="contactPerson.phone"
                  :success="!!contactPerson.phone"
                  :rules="[
                    (v) => !!v || 'Phone Number is required',
                    (v) =>
                      (v && /^[0-9]+$/.test(v)) ||
                      'Phone Number must be digits only',
                  ]"
                  label="Phone Number"
                  required
                />

                <v-text-field
                  v-model="contactPerson.email"
                  :success="!!contactPerson.email"
                  label="Email"
                  :rules="[
                    (v) => !!v || 'E-mail is required',
                    (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                  ]"
                  required
                />

                <v-text-field
                  v-model="contactPerson.jobTitle"
                  :success="!!contactPerson.jobTitle"
                  label="Job Title"
                  :rules="[(v) => !!v || 'Job Title is required']"
                  required
                />
                <v-select
                  v-model="contactPerson.payOutBy"
                  :success="!!contactPerson.payOutBy"
                  label="Payout By"
                  :rules="[(v) => !!v || 'Payout by is required']"
                  required
                  :items="payOut"
                  item-value="val"
                  item-text="name"
                />

              </div>
            </div>

          </div>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<script>
import { required, integer, email } from "vuelidate/lib/validators"
import notification from "~/components/en/General/notification.vue"

export default {
  name: "ContactPerson",
  components: {
    notification,
  },
  props: {
    showMap: Boolean,
    validateContactPerson: Boolean
  },
  data () {
    return {
      lat: 30.04,
      long: 31.23,
      contactPerson: {
        name: "",
        phone: "",
        email: "",
        jobTitle: "",
        payOutBy: "",
        location: {},
        address: "",
      },
      success: "",
      error: "",
      suggestions: "",
      place: "",
      payOut: [
        { name: "Cheque", val: "cheque", },
        { name: "Cash", val: "cash", }
      ],
      valid: false,
      placeIsCorrect: null,
    }
  },
  watch: {
    validateContactPerson () {
      if (this.$refs.contactform.validate()) {
        this.$emit("contactPersonValidated", true)
      } else {
        this.$emit("contactPersonValidated", false)
      }
    },
  },
  validations: {
    contactPerson: {
      name: {
        required,
      },
      phone: {
        required,
        integer,
      },
      email: {
        required,
        email,
      },
      jobTitle: {
        required,
      },
      payOutBy: {
        required,
      },
      place: {
        required,
      },
      location: {},
    },
  },
  methods: {
    getAddressData (addressData, placeResultData, id) {
      this.lat = addressData.latitude
      this.long = addressData.longitude
      this.contactPerson.address = placeResultData.formatted_address
      this.contactPerson.location = {
        lat: this.lat.toString(),
        long: this.long.toString(),
      }
      this.placeIsCorrect = true
    },
    SearchForAplace () {
      this.suggestions = ""
      const getStatment =
        "https://places.ls.hereapi.com/places/v1/autosuggest?apiKey=d9JJdfnwO3m7HTjkm2tkS7WYy0Rkvu2hQQ2Ku643QZw&at=40.7539,-73.9837&q=" +
        this.place +
        "&pretty"
      this.$axios
        .get(getStatment)
        .then((result) => {
          this.suggestions = result.data.results
          try {
            this.suggestions.map((suggest) => {
              suggest.vicinity = suggest.vicinity.replace(/<\/?[^>]+(>|$)/g, "")
              suggest.id = Math.random() * 1000
            })
          } catch {}
        })
        .catch((error) => {
          console.log(error)
        })
    },
    clickForPlace (e) {
      try {
        this.suggestions = ""
        const myarray = e.target.getAttribute("posTitle").split(",")
        this.place = e.target.getAttribute("showTitle")
        const position = {
          lat: myarray[0],
          long: myarray[1],
        }
        this.lat = parseInt(position.lat)
        this.long = parseInt(position.long)
        this.contactPerson.location = {
          lat: position.lat.toString(),
          long: position.long.toString(),
        }
      } catch {}
    },
    setName (value) {
      this.contactPerson.name = value
      this.$v.contactPerson.name.$touch()
    },
    setPhone (value) {
      this.contactPerson.phone = value
      this.$v.contactPerson.phone.$touch()
    },
    setEmail (value) {
      this.contactPerson.email = value
      this.$v.contactPerson.email.$touch()
    },
    setJobTitle (value) {
      this.contactPerson.jobTitle = value
      this.$v.contactPerson.jobTitle.$touch()
    },
    setPayOutBy (value) {
      this.contactPerson.payOutBy = value
      this.$v.contactPerson.payOutBy.$touch()
    },
    submitContactWithPrevious () {
      this.error = ""
      this.success = ""
      this.$v.$touch()
      if (!this.$refs.contactform.validate()) {
        // this.$store.state.merchantForms.secondOne = false
        const cData = {
          name: this.contactPerson.name,
          phone: this.contactPerson.phone,
          email: this.contactPerson.email,
          location: this.contactPerson.location,
          jobTitle: this.contactPerson.jobTitle,
          payOutBy: this.contactPerson.payOutBy,
        }
        this.$store.commit("updateSecondOne", false)
        this.error = "Please fill all the fields!"
        alert("Please fill all the fields!")
      } else if (
        !(
          !Object.keys(this.contactPerson.location).length === 0 &&
            (!this.contactPerson.location.constructor === Object) !== ""
        )
      ) {
        const cData = {
          name: this.contactPerson.name,
          phone: this.contactPerson.phone,
          email: this.contactPerson.email,
          location: this.contactPerson.location,
          jobTitle: this.contactPerson.jobTitle,
          payOutBy: this.contactPerson.payOutBy,
        }
        this.$store.commit("contactPerson", cData)
        this.$store.commit("updateSecondOne", true)
        this.success = "Confirmed"
        alert("Confirmed")
      } else {
        // this.error = "You have to choose a location"
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.maps-suggestions {
  width: 85%;
  background-color: rgba(204, 204, 204, 0);
  padding: 5px;
  color: rgb(45, 105, 233);
  border-radius: 5px;
  position: float;
  height: 200px;
  overflow-y: scroll;
}
.map-suggest {
  text-align: center;
  font-size: 20px;
  cursor: pointer;
}
.en-contactPerson {
  &-msg {
    margin-bottom: 30px;
  }
  &-title {
    font-size: 24px;
  }
  &-main {
    width: 100%;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    &-left {
      // background-color: red;
      width: 45%;
      &-form {
        display: flex;
        flex-flow: column;
        justify-content: space-around;
        &-row {
          margin-bottom: 10px;
        }
      }
    }
    &-right {
      width: 45%;
    }
  }
  .field-error {
    font-size: 15px;
    color: red;
  }
}
input[type="file"] {
  display: none;
}
.custom-file-upload {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  width: 100%;
  text-align: center;
  border: 1px solid rgb(45, 105, 233);
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
}
.optional-title {
  color: #ccc;
  font-size: 15px;
}
.cover-img {
  width: 200px;
  width: 200px;
  margin: auto;
  display: block;
  margin-bottom: 10px;
}
.btn-font {
  font-size: 18px;
}
</style>
