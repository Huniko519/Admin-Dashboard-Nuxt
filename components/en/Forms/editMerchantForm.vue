<template>
  <v-container class="p-0">
    <v-row>
      <v-col class="ml-sm-2 mr-sm-6 mt-10 p-0">
        <v-card class="rounded-xl p-3 text-center">
          <v-card-text>
            <v-form ref="mform" v-model="valid">
              <h4 class="d-inline">Merchant Data</h4>
              <v-row justify="center" class="mt-10" dense>
                <v-col cols="10" md="5">
                  <v-text-field v-model="merchantData.name" :success="!!merchantData.name" label="Merchant Name" :rules="[(v) => !!v || 'Merchant Name is required']" required outlined dense rounded />
                </v-col>
                <v-col cols="10" md="5">
                  <v-text-field v-model="merchantData.phone" :success="!!merchantData.phone" label="Phone Number" :rules="[(v) => !!v || 'Phone Number is required',(v) =>(v && /^[0-9]+$/.test(v)) || 'Phone Number must be digits only']" required outlined dense rounded />
                </v-col>
                <v-col cols="10" md="5">
                  <v-text-field v-model="merchantData.email" :success="!!merchantData.email" label="Email" :rules="[(v) => !!v || 'E-mail is required', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid']" required outlined dense rounded />
                </v-col>
                <v-col cols="10" md="5">
                  <v-text-field v-model="merchantData.address" :success="!!merchantData.address" label="Address" :rules="[(v) => !!v || 'Address is required']" required outlined dense rounded />
                </v-col>
                <v-col cols="10" md="6">
                  <v-select v-model="merchantData.category" :success="!!merchantData.category" label="Category" :rules="[(v) => !!v || 'Category is required']" :items="flatCategories" item-value="_id" item-text="name" required outlined dense rounded block />
                </v-col>
                <v-col cols="10" class="d-flex justify-content-center p-0">
                  <h5 class="mt-5">Account Type : </h5>
                  <v-radio-group v-model="merchantData.accountType" :success="!!merchantData.accountType" row class="ml-5">
                    <v-radio v-for="accType in merchantData.accTypes" :key="accType.val" :label="accType.name" :value="accType.val" color="red"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>

              <hr class="my-10">

              <h4 class="d-inline">Social</h4>
              <v-row justify="center" class="mt-10" dense>
                <v-col cols="10" md="5">
                  <v-text-field v-model="merchantData.website" :success="!!merchantData.website" label="Website" outlined dense rounded />
                </v-col>
                <v-col cols="10" md="5">
                  <v-text-field v-model="merchantData.socialMediaLinks.facebook" :success="!!merchantData.socialMediaLinks.facebook" label="Facebook" outlined dense rounded />
                </v-col>
                <v-col cols="10" md="5">
                  <v-text-field v-model="merchantData.socialMediaLinks.youtube" :success="!!merchantData.socialMediaLinks.youtube" label="Youtube" outlined dense rounded />
                </v-col>
                <v-col cols="10" md="5">
                  <v-text-field v-model="merchantData.socialMediaLinks.instagram" :success="!!merchantData.socialMediaLinks.instagram" label="Instagram" outlined dense rounded />
                </v-col>
              </v-row>

              <hr class="my-10">

              <h4>Locaction</h4>
              <v-row justify="center" class="mt-10" dense>
                <v-col cols="10" md="8">
                  <map-search-place :location="merchantData.location" @onSelectedNewPlace="handleSelectedNewPlace" outlined />
                </v-col>
              </v-row>

              <hr class="my-10">

              <v-row justify="center" class="mt-10" dense>
                <v-col cols="10" md="8">
                  <v-text-field v-model="merchantData.username" :rules="[(v) => !!v || 'Username is required']" label="Username" required outlined dense rounded />
                </v-col>
                <v-col cols="10" md="8">
                  <v-text-field v-model="merchantData.password" label="Password" outlined dense rounded />
                </v-col>
                <v-col cols="12"></v-col>
                <v-col cols="10" md="3" v-if="merchantData.image">
                  <img :key="merchantData.image" :src="merchantData.image" class="cover-img" width="200" alt />
                  <!-- <buttonWithColors class="btn-font upload-img my-3" prevent-no-event btn-color="RedBtn" btn-label="Remove Cover" @click="removeImage" /> -->
                  <v-btn class="mt-3" color="red" btn-label="Remove Cover" @click="removeImage" dark dense rounded>Remove Image</v-btn>
                </v-col>
                <v-col cols="10" md="8" v-else>
                  <v-btn color="red" class="rounded-xl" dark block>
                    <label for="image-upload" class="my-auto pointer">
                      <v-icon>mdi-upload</v-icon>
                      <span>Upload Image</span>
                    </label>
                  </v-btn>
                  <input v-show="false" id="image-upload" ref="imageUpload" multiple="multiple" type="file" @change="onFileChange" />
                  <!-- <div v-if="!merchantData.image">
                    <span>Image is a must</span>
                  </div> -->
                </v-col>
              </v-row>

              <hr class="my-10">

              <h4>Payment</h4>
              <v-row justify="center" class="mt-5" dense>
                <v-row v-for="(payment,index) in merchantData.payments" :key="'p'+index" justify="center" class="mt-10" dense>
                  <v-col cols="10" md="5">
                    <v-text-field v-model="payment.amount" label="Amount" outlined dense rounded />
                  </v-col>
                  <v-col cols="10" md="5">
                    <v-text-field v-model="payment.dateGet" label="Date" type="datetime-local" outlined dense rounded />
                  </v-col>
                  <v-col cols="10" md="5">
                    <v-text-field v-model="payment.description" label="Description" outlined dense rounded />
                  </v-col>
                  <v-col cols="10" md="5">
                    <v-text-field v-model="payment.creatorWhom" label="By who" outlined dense rounded />
                  </v-col>
                  <v-col cols="10" md="5" class="d-flex justify-content-center">
                    <v-btn width="150" class="mr-2" color="red" @click="$delete(merchantData.payments, index)" dark dense rounded>remove</v-btn>
                    <v-btn width="150" color="primary" @click="addPayment()" dense rounded>Add Payment</v-btn>
                  </v-col>
                </v-row>
              </v-row>
            </v-form>
          </v-card-text>


          <!-- <v-card-text>
            <v-btn width="150" color="primary" @click="merchantFormValidated" dense rounded>Continue</v-btn>
          </v-card-text> -->

          <hr />

          <v-card-text>
            <h4>Contact Info</h4>
            <v-form ref="pForm" v-model="valid">
              <v-row justify="center" class="mt-10" dense>
                <v-col cols="10" md="5">
                  <v-text-field v-model="merchantData.contactPerson.name" :counter="20" :success="!!merchantData.contactPerson.name" :rules="[(v) => !!v || 'Person Name is required', (v) => (v && v.length <= 20) || 'Name must be less than 20 characters']" label="Person Name" required outlined dense rounded />
                </v-col>
                <v-col cols="10" md="5">
                  <v-text-field v-model="merchantData.contactPerson.phone" :success="!!merchantData.contactPerson.phone" :rules="[(v) => !!v || 'Phone Number is required', (v) => (v && /^[0-9]+$/.test(v)) || 'Phone Number must be digits only']" label="Phone Number" required outlined dense rounded />
                </v-col>
                <v-col cols="10" md="5">
                  <v-text-field v-model="merchantData.contactPerson.email" :success="!!merchantData.contactPerson.email" label="Email" :rules="[(v) => !!v || 'E-mail is required', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid']" required outlined dense rounded />
                </v-col>
                <v-col cols="10" md="5">
                  <v-text-field v-model="merchantData.contactPerson.jobTitle" :success="!!merchantData.contactPerson.jobTitle" label="Job Title" :rules="[(v) => !!v || 'Job Title is required']" required outlined dense rounded />
                </v-col>
                <v-col cols="10">
                  <v-select v-model="merchantData.contactPerson.payOutBy" :success="!!merchantData.contactPerson.payOutBy" label="Payout By" :rules="[(v) => !!v || 'Payout by is required']" required :items="payOut" item-value="val" item-text="name" outlined dense rounded />
                </v-col>
                <v-col cols="5">
                  <v-btn block v-if="!branches.exist" :loading="loading" color="red" dark @click="contactPersonFormValidated" dense rounded>Update</v-btn>
                </v-col>
                <v-col v-if="updateStatus" cols="10" class="mt-5">
                  <p>{{ updateStatus }}</p>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import merchantForm from "~/components/en/Forms/merchantForm";
import contactPerson from "~/components/en/Forms/contactPerson";
import merchantBranches from "~/components/en/Forms/merchantBranches";
import buttonWithColors from "~/components/en/General/buttonWithColors.vue";
import snackbar from "~/components/snackbar.vue";
import FormData from "form-data";
import MapSearchPlace from "@/components/map-search-place.vue";

export default {
  components: {
    merchantForm,
    contactPerson,
    merchantBranches,
    buttonWithColors,
    snackbar,
    MapSearchPlace,
  },

  props: {
    merchant: {
      type: Array,
      default: [],
    },
  },

  data() {
    return {
      // step: 1,
      updateStatus: '',
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
      validatePerson: false,
      //contact
      lat: 30.04,
      long: 31.23,
      placesAPI: false,

      success: "",
      error: "",
      suggestions: "",
      place: "",
      payOut: [
        { name: "Cheque", val: "cheque" },
        { name: "Cash", val: "cash" },
      ],
      valid: false,
      placeIsCorrect: null,
      //merchant
      categories: "",
      location_status: "not selected",
      selected_place: "",
      flatCategories: [],
      file: "",
      merchantData: {
        name: "",
        password: "",
        phone: "",
        website: "",
        email: "",
        address: "",
        category: "some category",
        username: "",
        image: "",
        accountType: "",
        accTypes: [
          { name: "Premium", val: "Premium" },
          { name: "Free", val: "Free" },
        ],
        fileAdded: false,
        payments: [
          {
            dateGet: "",
            amount: "",
            description: "",
            creatorWhom: "",
          },
        ],
        contactPerson: {
          name: "",
          phone: "",
          email: "",
          jobTitle: "",
          payOutBy: "",
          location: {},
          address: "",
        },
        location: {},
        socialMediaLinks: {
          facebook: "",
          youtube: "",
          instagram: "",
        },
      },
    };
  },

  computed: {
    showMap() {
      if (
        this.isMapLoaded1 &&
        this.isMapLoaded2 &&
        this.isMapLoaded3 &&
        this.isMapLoaded4
      ) {
        return true;
      } else {
        return false;
      }
    },
  },

  watch: {
    merchant() {
      this.merchantData.name = this.merchant[0].name;
      this.merchantData.password = this.merchantData.password;
      this.merchantData.accountType = this.merchant[0].accountType;
      this.merchantData.address = this.merchant[0].address;
      this.merchantData.category = this.merchant[0].category;
      this.merchantData.contactPerson = this.merchant[0].contactPerson;
      this.merchantData.coupons = this.merchant[0].coupons;
      this.merchantData.email = this.merchant[0].email;
      this.merchantData.location = this.merchant[0].location;
      this.merchantData.phone = this.merchant[0].phone;
      this.merchantData.image = this.merchant[0].image;
      this.merchantData.socialMediaLinks = this.merchant[0].socialMediaLinks;
      this.merchantData.username = this.merchant[0].username;
      this.merchantData.website = this.merchant[0].website;
      if (
        this.merchant.length >= 1 &&
        this.merchant[1] &&
        this.merchant[1].payment.length
      ) {
        let payments = this.merchant[1].payment;
        for (let x = 0; x < payments.length; x++) {
          let dateGet = "";
          if (payments[x].dateGet) {
            dateGet =
              payments[x].dateGet.split(":")[0] +
              ":" +
              payments[x].dateGet.split(":")[1];
          }
          if (x == 0) {
            this.merchantData.payments[0].dateGet = dateGet;
            this.merchantData.payments[0].amount = payments[x].amount;
            this.merchantData.payments[0].description = payments[x].description;
            this.merchantData.payments[0].creatorWhom = payments[x].creatorWhom;
          } else {
            this.merchantData.payments.push({
              dateGet: dateGet,
              amount: payments[x].amount,
              description: payments[x].description,
              creatorWhom: payments[x].creatorWhom,
            });
          }
        }
      }
    },
  },

  mounted() {
    this.fetchCategories();
  },

  methods: {
    // get categories
    fetchCategories() {
      this.$axios
        .get("/categories", {
          headers: { authorization: localStorage.getItem("token") },
        })
        .then((data) => {
          this.categories = data.data.data;
          if (this.categories.length) {
            this.flattenCategoriesRecursively(this.categories);
          } else {
            console.log("category data empty");
          }
        });
    },
    //contact
    submitContactWithPrevious() {
      this.error = "";
      this.success = "";
      this.$v.$touch();
      if (!this.$refs.contactform.validate()) {
        // this.$store.state.merchantForms.secondOne = false
        const cData = {
          name: this.contactPerson.name,
          phone: this.contactPerson.phone,
          email: this.contactPerson.email,
          location: this.contactPerson.location,
          jobTitle: this.contactPerson.jobTitle,
          payOutBy: this.contactPerson.payOutBy,
        };
        this.$store.commit("updateSecondOne", false);
        this.error = "Please fill all the fields!";
        alert("Please fill all the fields!");
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
        };
        this.$store.commit("contactPerson", cData);
        this.$store.commit("updateSecondOne", true);
        this.success = "Confirmed";
        alert("Confirmed");
      } else {
        // this.error = "You have to choose a location"
      }
    },

    //merch
    addPayment() {
      this.merchantData.payments.push({
        dateGet: "",
        amount: "",
        description: "",
        creatorWhom: "",
      });
    },
    validateForm() {
      if (this.$refs.form.validate() && this.fileAdded) {
        this.$emit("merchantValidated", true);
      } else {
        this.$emit("merchantValidated", false);
      }
    },
    getAddressData(addressData, placeResultData, id) {
      this.lat = addressData.latitude;
      this.long = addressData.longitude;
      this.location = {
        lat: this.lat.toString(),
        long: this.long.toString(),
      };
      this.placeIsCorrect = true;
      // this.confirmBranch()
    },
    SearchForAplace() {
      this.suggestions = "";
      const getStatment =
        "https://places.ls.hereapi.com/places/v1/autosuggest?apiKey=d9JJdfnwO3m7HTjkm2tkS7WYy0Rkvu2hQQ2Ku643QZw&at=40.7539,-73.9837&q=" +
        this.place +
        "&pretty";
      this.$axios
        .get(getStatment)
        .then((result) => {
          this.suggestions = result.data.results;
          try {
            this.suggestions.map((suggest) => {
              suggest.vicinity = suggest.vicinity.replace(
                /<\/?[^>]+(>|$)/g,
                ""
              );
              suggest.id = Math.random() * 1000;
            });
          } catch {}
        })
        .catch((error) => {
          console.log(error);
        });
    },
    clickForPlace(e) {
      try {
        this.suggestions = "";
        const myarray = e.target.getAttribute("posTitle").split(",");
        this.place = e.target.getAttribute("showTitle");
        this.selected_place = e.target.getAttribute("showtitle");
        const position = {
          lat: myarray[0],
          long: myarray[1],
        };
        this.lat = parseInt(position.lat);
        this.long = parseInt(position.long);
        this.location = {
          lat: position.lat.toString(),
          long: position.long.toString(),
        };
        if (this.location) {
          this.location_status = "selected";
        }
      } catch {}
    },

    removeImage(e) {
      this.merchantData.image = "";
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      else {
        this.createImage(files[0]);
        this.file = this.$refs.imageUpload.files[0];
      }
    },
    createImage(file) {
      var image = new Image();
      var reader = new FileReader();
      var vm = this;
      reader.onload = (e) => {
        vm.merchantData.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    flattenCategoriesRecursively(items) {
      items.forEach((cat) => {
        this.flatCategories.push(cat);
        if (cat.root.length) {
          this.flattenCategoriesRecursively(cat.root);
        } else {
        }
      });
    },
    toggleBranches() {
      this.branches.exist = !this.branches.exist;
    },
    validateMechantForm(status) {
      this.validateMerchant = !this.validateMerchant;
    },

    // Form Validate
    merchantFormValidated() {
      let status = this.$refs.mform.validate();
      if (status) {
        // this.step = 2;
        return true;
      } else {
        // this.$refs.snackbar.open( "Please check for required fields", 4500, "error" );
        return false;
      }
    },

    contactPersonFormValidated() {
      let status = this.$refs.pForm.validate();
      if (status) {
        this.updateMerchant();
      } else {
        this.$refs.snackbar.open(
          "Please check for required fields",
          4500,
          "error"
        );
      }
    },

    updateMerchant() {
      if(this.merchantFormValidated()) {
        this.loading = true;
        let merchantData = {...this.merchantData};
        let config = {
          headers: {
            authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        };
        // console.log("merchantData: ", merchantData)
        let listUnusedKey = ["accTypes", "fileAdded", "payments", "coupons"]
        delete merchantData.accTypes
        delete merchantData.fileAdded
        delete merchantData.payments
        delete merchantData.coupons

        const asyncSubmitting = async () => {
          if (this.merchantData.image) {
            // only call api upload image when it's not empty and not an url
            if (!this.merchantData.image.includes("http")) {
              const formDataa = new FormData();
              formDataa.append("image", this.merchantData.image);
              await this.$axios
                .post("/upload/image", formDataa, config)
                .then((data) => { this.merchantData.image = data.data.dataimages[0].imageUrl });
            }
          }
          await this.$axios
            .put("/merchants/" + this.merchant[0]._id, merchantData, config)
            .then((result) => {
              console.log(result);
              this.success = "Added Successfully!";
              this.loading = false;
              this.$refs.snackbar.open("Added Successfully!", 4500, "info");
              this.$router.push("/en/dashboard/merchants");
            })
            .catch((error) => {
              console.log(error);
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
        this.updateStatus = "The Merchant Have Been Updated";
      } else {
        this.updateStatus = "Please check for required fields";
      }
    },
    handleSelectedNewPlace(data) {
      console.log("Received new location", data);
      this.location_status = "selected";
      this.merchantData.location = data.location;
      this.place = data.address;
    },
  },
};
</script>

<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}

.w-full {
  width: 100%;
}

.close {
  position: absolute;
  color: wheat;
  font-size: 35px;
  margin-left: 10px;
}

.close:hover {
  cursor: pointer;
}

.merchant-form {
  &-msg {
    margin-bottom: 10px;
  }

  &-title {
    font-size: 24px;
  }

  &-main {
    width: 100%;
    display: flex;
    flex-flow: row;
    justify-content: center;

    &-left {
      // background-color: red;
      width: 60%;

      &-form {
        display: flex;
        flex-flow: column;
        justify-content: space-around;

        &-row {
          margin-bottom: 10px;
        }
      }
    }
  }

  .field-error {
    font-size: 15px;
    color: red;
  }

  .btn-font {
    font-size: 18px;
  }

  input[type="file"] {
    display: none;
  }

  .custom-file-upload {
    display: inline-block;
    padding: 6px 12px;
    width: 50%;
    text-align: center;
    background-color: #dc1f29;
    color: white;
    border-radius: 2px;
    cursor: pointer;
  }

  .custom-file-upload:hover {
    background-color: #e03d45;
    transition: 0.7s;
  }

  .optional-title {
    color: #ccc;
    font-size: 15px;
  }
  .upload-img {
    margin-bottom: 15px;
  }
}

// Spinner
.spinner {
  width: 40px;
  height: 40px;
  background-color: #333;
  margin: 100px auto;
  -webkit-animation: sk-rotateplane 1.2s infinite ease-in-out;
  animation: sk-rotateplane 1.2s infinite ease-in-out;
}

@-webkit-keyframes sk-rotateplane {
  0% {
    -webkit-transform: perspective(120px);
  }

  50% {
    -webkit-transform: perspective(120px) rotateY(180deg);
  }

  100% {
    -webkit-transform: perspective(120px) rotateY(180deg) rotateX(180deg);
  }
}

@keyframes sk-rotateplane {
  0% {
    transform: perspective(120px) rotateX(0deg) rotateY(0deg);
    -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg);
  }

  50% {
    transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
    -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
  }

  100% {
    transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
    -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
  }
}
</style>
