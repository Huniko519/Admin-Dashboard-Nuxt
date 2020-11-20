<template>
  <div class="w-full">
    <snackbar ref="snackbar"></snackbar>
    <v-stepper v-model="step" vertical>
      <v-stepper-step :complete="step > 1" step="1" editable>Merchant Form</v-stepper-step>

      <v-stepper-content step="1">
        <v-card flat>
          <v-card-text>
            <div class="en-merchantForms-content-firstSection">
              <merchantForm ref="mForm" :validateMerchant="validateMerchant" @merchantValidated="merchantFormValidated" :show-map="showMap" />
            </div>
          </v-card-text>
        </v-card>
        <v-btn color="primary" @click="validateMechantForm">Continue</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="step > 2" step="2" editable>Contact Person Info</v-stepper-step>

      <v-stepper-content step="2">
        <v-card flat>
          <v-card-text>
            <contactPerson ref="pForm" :validateContactPerson="validatePerson" @contactPersonValidated="contactPersonFormValidated" :show-map="showMap" />
          </v-card-text>
        </v-card>
        <v-btn
          v-if="!branches.exist"
          :loading="loading"
          color="#dc1f29"
          dark
          @click="validatePersonForm">Submit The Form without Branches</v-btn>
        <v-btn color="primary" @click="step = 1">Back</v-btn>
      </v-stepper-content>
    </v-stepper>

    <v-divider></v-divider>

    <v-layout column class="pb-12">
      <v-layout justify-center align-start column>
        <v-btn :disabled="loading" @click="toggleBranches" dark color="#dc1f29">
          {{ branches.exist ? 'Hide Branches' : 'Add Branches' }}
        </v-btn>

        <div v-if="branches.exist" class="en-merchantForms-content-FourthSection">
          <merchantBranches :show-map="showMap" />
        </div>

        <div v-if="!loading" class="en-merchantForms-content-ThirdSection">
          <buttonWithColors
            v-if="branches.exist"
            class="en-merchantForms-content-ThirdSection-submitForm"
            btn-color="RedBtn"
            btn-label="Submit"
            @click="submitMerchant" />
        </div>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
import merchantForm from "~/components/en/Forms/merchantForm"
import contactPerson from "~/components/en/Forms/contactPerson"
import merchantBranches from "~/components/en/Forms/merchantBranches"
import buttonWithColors from "~/components/en/General/buttonWithColors.vue"
import snackbar from '~/components/snackbar.vue'

export default {
  components: {
    merchantForm,
    contactPerson,
    merchantBranches,
    buttonWithColors,
    snackbar
  },
  head() {
    return {
      link: [
        {
          rel: "stylesheet",
          href: "https://js.hereapi.cn/v3/3.0/mapsjs-ui.css",
        },
      ],
      script: [
        {
          hid: "maps1",
          src: "https://js.api.here.com/v3/3.0/mapsjs-core.js",
          defer: true,
          callback: () => {
            this.isMapLoaded1 = true
          },
        },
        {
          hid: "maps2",
          src: "https://js.api.here.com/v3/3.0/mapsjs-service.js",
          defer: true,
          callback: () => {
            this.isMapLoaded2 = true
          },
        },
        {
          hid: "maps3",
          src: "https://js.api.here.com/v3/3.0/mapsjs-ui.js",
          defer: true,
          callback: () => {
            this.isMapLoaded3 = true
          },
        },
        {
          hid: "maps4",
          src: "https://js.api.here.com/v3/3.0/mapsjs-mapevents.js",
          defer: true,
          callback: () => {
            this.isMapLoaded4 = true
          },
        },
      ],
    }
  },
  data () {
    return {
      step: 1,
      isMapLoaded1: false,
      isMapLoaded2: false,
      isMapLoaded3: false,
      isMapLoaded4: false,
      branches: {
        exist: false,
        number: 0,
      },
      loading: false,
      validateMerchant: false,
      validatePerson: false
    }
  },
  computed: {
    showMap() {
      if (
        this.isMapLoaded1 &&
        this.isMapLoaded2 &&
        this.isMapLoaded3 &&
        this.isMapLoaded4
      ) {
        return true
      } else {
        return false
      }
    },
  },
  methods: {
    toggleBranches() {
      this.branches.exist = !this.branches.exist
    },
    validateMechantForm(status) {
      this.validateMerchant = !this.validateMerchant
    },
    merchantFormValidated(status) {
      const data = this.$refs.mForm._data;

      const mData = {
        name: data.Name,
        phone: data.Phone,
        email: data.Email,
        address: data.Address,
        location: data.location,
        category: data.Category,
        username: data.username,
        password: data.password,
        accountType: data.AccountType,
        Website: data.Website,
        facebook: data.socialMediaLinks.facebook,
        youtube: data.socialMediaLinks.youtube,
        instagram: data.socialMediaLinks.instagram,
      }
      if (status) {
        this.$store.commit("merchnatForm", mData)
        this.$store.commit("updateFirstOne", true)
        this.step = 2
      } else {
        this.$refs.snackbar.open("Please check for required fields", 4500, 'error');
      }
    },
    validatePersonForm(status) {
      this.validatePerson = !this.validatePerson
    },
    contactPersonFormValidated(status) {
      const data = this.$refs.pForm._data;
      const cData = {
        name: data.contactPerson.name,
        phone: data.contactPerson.phone,
        email: data.contactPerson.email,
        location: data.contactPerson.location,
        jobTitle: data.contactPerson.jobTitle,
        payOutBy: data.contactPerson.payOutBy,
      }
      this.$store.commit("contactPerson", cData)
      // this.$store.commit("updateSecondOne", true)
      console.log('updated contact person: ',cData)

      this.sendDataWithoutBranches()
    },
    submitMerchant() {
      this.loading = true
      // const branchesStatus = this.checkValidtiyOfBranches()
        let merchantData = this.$store.state.merchantData
        let config = {
          headers: {
            authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
        const asyncSubmitting = async () => {
          await this.uploadImage({
            forWhat: "main",
            fileToUpload: merchantData.cover,
          })
          merchantData.branches.map(async (branch) => {
            await this.uploadImage({
              forWhat: "branch",
              branch: branch.branchId - 1,
              fileToUpload: branch.cover,
              propName: "cover",
            })
            await this.uploadImage({
              forWhat: "branch",
              branch: branch.branchId - 1,
              fileToUpload: branch.image,
              propName: "image",
            })
            await this.$axios
              .post("/merchants", merchantData, config)
              .then((result) => {
                console.log(result)
                this.success = "Added Successfully!"
                this.loading = false
                this.$refs.snackbar.open("Added Successfully!", 4500, 'info');
                this.$router.push('/en/dashboard/merchants');
              })
              .catch((error) => {
                this.error = "Sorry, something happened!"
                console.log(error)
                this.loading = false
                this.$refs.snackbar.open("Sorry, something happened!", 4500, 'error');
              })
          })
        }
        asyncSubmitting()
      // } else {
      //   this.error = "Some Data, is missing, please re-confirm all the forms"
      //   this.loading = false
      // }
    },
    sendDataWithoutBranches() {
      this.loading = true

      if (
        this.$store.state.merchantForms.firstOne &&
        this.$store.state.merchantForms.secondOne &&
        !this.branches.exist
      ) {
        let merchantData = this.$store.state.merchantData
        let config = {
          headers: {
            authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
        const asyncSubmitting = async () => {
          await this.uploadImage({
            forWhat: "main",
            fileToUpload: merchantData.cover,
          })
          await this.$axios
            .post("/merchants", merchantData, config)
            .then((result) => {
              console.log(result)
              this.success = "Added Successfully!"
              this.loading = false
              this.$refs.snackbar.open("Added Successfully!", 4500, 'info');
              this.$router.push('/en/dashboard/merchants');
            })
            .catch((error) => {
              console.log(error)
              this.error = "Sorry, something happened!"
              this.loading = false
              this.$refs.snackbar.open("Sorry, something happened!", 4500, 'error');
            })
        }
        asyncSubmitting()
      } else {
        this.loading = false
        console.log("errorrr")
        this.error = "Some Data is missing, please re-confirm the forms"
        this.$refs.snackbar.open("Some Data is missing, please re-confirm the forms", 4500, 'error');
      }
    },
  }
}
</script>

<style scoped>
  .w-full {
    width: 100%;
  }
</style>
