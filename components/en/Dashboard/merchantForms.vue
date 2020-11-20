<template>
  <div class="w-full">
    <snackbar ref="snackbar"></snackbar>
    <v-stepper v-model="step" vertical>
      <v-stepper-step :complete="step > 1" step="1" editable>Merchant Form</v-stepper-step>

      <v-stepper-content step="1">
        <v-card flat>
          <v-card-text>
            <div class="en-merchantForms-content-firstSection">
              <merchantForm
                ref="mForm"
                :validateMerchant="validateMerchant"
                @merchantValidated="merchantFormValidated"
                :show-map="showMap"
              />
            </div>
          </v-card-text>
        </v-card>
        <v-btn color="primary" @click="validateMechantForm">Continue</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="step > 2" step="2" editable>Contact Person Info</v-stepper-step>

      <v-stepper-content step="2">
        <v-card flat>
          <v-card-text>
            <contactPerson
              ref="pForm"
              :validateContactPerson="validatePerson"
              @contactPersonValidated="contactPersonFormValidated"
              :show-map="showMap"
            />
          </v-card-text>
        </v-card>
        <v-btn
          v-if="!branches.exist"
          :loading="loading"
          color="#dc1f29"
          dark
          @click="validatePersonForm"
        >Submit The Form without Branches</v-btn>
        <v-btn color="primary" @click="step = 1">Back</v-btn>
      </v-stepper-content>
    </v-stepper>

    <v-divider></v-divider>

    <v-layout column class="pb-12">
      <v-layout justify-center align-start column>
        <v-btn
          :disabled="loading"
          @click="toggleBranches"
          dark
          color="#dc1f29"
        >{{ branches.exist ? 'Hide Branches' : 'Add Branches' }}</v-btn>

        <div v-if="branches.exist" class="en-merchantForms-content-FourthSection">
          <merchantBranches :show-map="showMap" />
        </div>

        <div v-if="!loading" class="en-merchantForms-content-ThirdSection">
          <buttonWithColors
            v-if="branches.exist"
            class="en-merchantForms-content-ThirdSection-submitForm"
            btn-color="RedBtn"
            btn-label="Submit"
            @click="submitMerchant"
          />
        </div>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
import Vue from "vue";
import merchantForm from "~/components/en/Forms/merchantForm";
import contactPerson from "~/components/en/Forms/contactPerson";
import merchantBranches from "~/components/en/Forms/merchantBranches";
import buttonWithColors from "~/components/en/General/buttonWithColors.vue";
import snackbar from "~/components/snackbar.vue";
import MapSearchPlace from "@/components/map-search-place.vue"
import InputMapSearchPlace from "@/components/input-map-search-place.vue"
export default {
  components: {
    merchantForm,
    contactPerson,
    merchantBranches,
    buttonWithColors,
    snackbar,
    MapSearchPlace,
    InputMapSearchPlace
  },

  data() {
    return {
      step: 1,
      branches: {
        exist: false,
        number: 0,
      },
      loading: false,
      validateMerchant: false,
      validatePerson: false,

      mapData: {
        place: null,
        placeLocation: "",
      },
      mapElement: null,
      markers: [],
    };
  },
  computed: {
    showMap() {
      return true;
    },
  },
  methods: {
    toggleBranches() {
      this.branches.exist = !this.branches.exist;
    },
    validateMechantForm(status) {
      this.validateMerchant = !this.validateMerchant;
    },
    merchantFormValidated(status) {
      status = true;
      const data = this.$refs.mForm;
      console.log(data.location);
      if (!data.location.lat || !data.location.long) {
        this.$refs.snackbar.open(
          "Sorry, Please fill the location field",
          4500,
          "error"
        );
        return;
      }
      const formDataa = new FormData();
      formDataa.append("image", data.image);
      let config = {
        headers: {
          authorization: localStorage.getItem("token"),
          "Content-Type": `application/json'; boundary=${formDataa._boundary}`,
        },
      };
      this.$axios.post("/upload/image", formDataa, config).then((response) => {
        const mData = {
          name: data.Name,
          phone: data.Phone,
          email: data.Email,
          address: data.Address,
          location: data.location,
          category: data.Category,
          username: data.username,
          password: data.password,
          website: data.website,
          facebook: data.socialMediaLinks.facebook,
          youtube: data.socialMediaLinks.youtube,
          instagram: data.socialMediaLinks.instagram,
          accountType: data.AccountType,
          image: response.data.dataimages[0].imageUrl,
        };
        const paymentData = {
          payments: data.payments,
        };
        if (status) {
          this.$store.commit("merchnatForm", mData);
          this.$store.commit("paymentMerchantForm", paymentData);
          this.$store.commit("updateFirstOne", true);
          this.step = 2;
        } else {
          this.$refs.snackbar.open(
            "Please check for required fields",
            4500,
            "error"
          );
        }
      });
    },
    validatePersonForm(status) {
      this.validatePerson = !this.validatePerson;
    },
    contactPersonFormValidated(status) {
      console.log("test", status);
      if (status == true) {
        const data = this.$refs.pForm._data;
        const cData = {
          name: data.contactPerson.name,
          phone: data.contactPerson.phone,
          email: data.contactPerson.email,
          location: data.contactPerson.location,
          jobTitle: data.contactPerson.jobTitle,
          payOutBy: data.contactPerson.payOutBy,
        };
        this.$store.commit("contactPerson", cData);
        this.$store.commit("updateSecondOne", true);
        this.sendDataWithoutBranches();
      }
    },
    contactPFormValidated(status) {
      console.log("test", status);
      if (status == true) {
        const data = this.$refs.pForm._data;
        const cData = {
          name: data.contactPerson.name,
          phone: data.contactPerson.phone,
          email: data.contactPerson.email,
          location: data.contactPerson.location,
          jobTitle: data.contactPerson.jobTitle,
          payOutBy: data.contactPerson.payOutBy,
        };
        this.$store.commit("contactPerson", cData);
        this.$store.commit("updateSecondOne", true);
      }
    },
    submitMerchant() {
      this.loading = true;
      let merchantData = this.$store.state.merchantData;
      let config = {
        headers: {
          authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      const asyncSubmitting = async () => {
        await this.contactPFormValidated(true);
        await this.$axios
          .post("/merchants", merchantData, config)
          .then((result) => {
            this.success = "Added Successfully!";
            this.loading = false;
            this.$refs.snackbar.open("Added Successfully!", 4500, "info");
            this.$router.push("/en/dashboard/merchants");
          })
          .catch((error) => {
            this.error = "Sorry, something happened!";
            this.loading = false;
            this.$refs.snackbar.open(
              "Sorry, something happened!",
              4500,
              "error"
            );
          });
      };
      asyncSubmitting();
    },
    sendDataWithoutBranches() {
      this.loading = true;
      if (
        this.$store.state.merchantForms.firstOne &&
        this.$store.state.merchantForms.secondOne &&
        !this.branches.exist
      ) {
        let merchantData = this.$store.state.merchantData;
        delete merchantData.branches;
        let config = {
          headers: {
            authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        };
        const asyncSubmitting = async () => {
          await this.$axios
            .post("/merchants", merchantData, config)
            .then((result) => {
              this.$axios
                .post(
                  "/payments",
                  {
                    merchant: result.data.data._id,
                    payment: this.$store.state.paymentMerchData,
                  },
                  config
                )
                .then((res) => {
                  console.log(res);
                  this.success = "Added Successfully!";
                  this.loading = false;
                  this.$refs.snackbar.open("Added Successfully!", 4500, "info");
                  this.$router.push("/en/dashboard/merchants");
                });
            })
            .catch((error) => {
              this.error = "Sorry, something happened!";
              this.loading = false;
              this.$refs.snackbar.open(
                "Sorry, something happened!",
                4500,
                "error"
              );
            });
        };
        asyncSubmitting();
      } else {
        this.loading = false;
        this.error = "Some Data is missing, please re-confirm the forms";
        this.$refs.snackbar.open(
          "Some Data is missing, please re-confirm the forms",
          4500,
          "error"
        );
      }
    },
    handleSelectedNewPlace(data) {
      console.log("Received new location", data)
    }
  },
};
</script>

<style scoped>
.w-full {
  width: 100%;
}
</style>
