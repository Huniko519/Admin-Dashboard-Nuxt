<template>
  <div class="en-singleBranch">
    <v-card elevation="10" class="pa-5 mb-5">
      <v-form ref="branchform" v-model="valid">
        <div class="en-singleBranch-main-left-form">
          <v-select
            v-model="branchData.merchant"
            label="Merchant"
            :rules="[(v) => !!v || 'Merchant is required']"
            required
            :items="merchants"
            item-value="_id"
            item-text="name"
          />
          <v-text-field
            v-model="branchData.name"
            :success="!!branchData.name"
            :rules="[(v) => !!v || 'Branch Name is required',]"
            label="Branch Name"
            required
          />
          <v-text-field
            v-model="branchData.phone"
            :success="!!branchData.phone"
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
            v-model="branchData.email"
            :success="!!branchData.email"
            label="Email"
            :rules="[
                  (v) => !!v || 'E-mail is required',
                  (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                ]"
            required
          />

          <v-text-field
            v-model="branchData.password"
            :success="!!branchData.password"
            :rules="[(v) => !!v || 'Password is required']"
            label="Password"
            required
            type="password"
          />

          <v-text-field
            v-model="branchData.address"
            :success="!!branchData.address"
            :rules="[(v) => !!v || 'Address is required']"
            label="Address"
            required
          />
          <div class="en-singleBranch-main-right">
            <!-- <v-text-field
                  v-model="place"
                  :success="placeIsCorrect"
                  :rules="[(v) => !!v || 'Place is required']"
                  label="Search for a place"
                  autocomplete="off"
                  @input="SearchForAplace"
                />
                <div v-if="suggestions != ''" class="maps-suggestions">
                  <div
                    v-for="suggest in suggestions"
                    :key="suggest.id"
                    class="map-suggest"
                  >
                    <div
                      :posTitle="suggest.position"
                      :showTitle="suggest.title"
                      @click="clickForPlace"
                    >
                      {{ suggest.title }}
                      <span style="font-size: 10px;">{{ (suggest.vicinity) }}</span>
                    </div>
                  </div>
            </div>-->
            <map-search-place ::location="branchData.location" @onSelectedNewPlace="handleSelectedNewPlace" />
          </div>

          <v-file-input
            ref="file"
            v-model="Singlefile"
            :success="!!Singlefile"
            :rules="[(v) => !!v || 'Logo is required']"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Logo Upload"
            prepend-icon="mdi-camera"
            label="Logo Upload"
            @change="onSingleChange"
          />
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { required, integer, email } from "vuelidate/lib/validators";
import GoogleMapsNative from "~/components/en/General/GoogleMapsNative.vue";
import buttonWithColors from "~/components/en/General/buttonWithColors.vue";
import notification from "~/components/en/General/notification.vue";
import MapSearchPlace from "@/components/map-search-place.vue";

export default {
  name: "SingleBranch",
  components: {
    GoogleMapsNative,
    buttonWithColors,
    notification,
    MapSearchPlace,
  },
  props: {
    showMap: {
      type: Boolean,
      default: false,
    },
    branchesNumber: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      lat: 30.04,
      long: 31.23,
      branchData: {
        name: "",
        merchant: "",
        phone: "",
        email: "",
        address: "",
        password: "",
        location: {},
      },
      success: "",
      error: "",
      suggestions: "",
      place: "",
      SingleImage: "",
      Singlefile: [],
      merchants: [],
      SingleCover: "",
      Coverfile: [],
      valid: false,
      placeIsCorrect: false,
    };
  },
  created() {
    console.log(this.branchesNumber);
    let config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    this.$axios
      .get("/merchants", config)
      .then((data) => {
        this.merchants = data.data.merchants;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  watch: {
    valid() {
      if (this.$refs.branchform.validate() && !this.error) {
        this.confirmSingleBranch();
      }
    },
  },
  methods: {
    SearchForAplace() {
      this.suggestions = "";
      const getStatment =
        "https://places.ls.hereapi.com/places/v1/autosuggest?apiKey=lfJxURZOAcIIg5nEj-0Ioi72nWpw5iIF9NT3n_NPAKE&at=40.7539,-73.9837&q=" +
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
        const position = {
          lat: myarray[0],
          long: myarray[1],
        };
        this.lat = parseInt(position.lat);
        this.long = parseInt(position.long);
        this.branchData.location = position;
        let merchantForm = {
          index: this.branchesNumber,
          data: {
            key: "location",
            value: {
              lat: position.lat,
              long: position.long,
            },
          },
        };
        this.$store.commit("updateMerchantForms", merchantForm);
        const map = this.$refs.map;
        map.dropMarker(position);
        this.placeIsCorrect = true;
      } catch {}
    },
    createSingleImage(file) {
      // eslint-disable-next-line no-unused-vars
      const image = new Image();
      const reader = new FileReader();
      const vm = this;
      reader.onload = (e) => {
        vm.SingleImage = this.Singlefile;
      };
      reader.readAsDataURL(file);
    },
    removeSingle(e) {
      this.SingleImage = "";
    },
    onSingleChange(e) {
      if (this.Singlefile) {
        const formDataa = new FormData();
        formDataa.append("image", this.Singlefile);
        let config = {
          headers: {
            authorization: localStorage.getItem("token"),
            "Content-Type": `application/json'; boundary=${formDataa._boundary}`,
          },
        };
        this.$axios
          .post("/upload/image", formDataa, config)
          .then((response) => {
            this.createSingleImage(this.Singlefile);
            const branchData = {
              index: this.branchesNumber,
              data: response.data.dataimages[0].imageUrl,
            };
            this.$store.commit("updateBranches", branchData);
          });
      }
    },
    createSingleCover(file) {
      // eslint-disable-next-line no-unused-vars
      const image = new Image();
      const reader = new FileReader();
      const vm = this;
      reader.onload = (e) => {
        vm.SingleCover = this.Coverfile;
      };
      reader.readAsDataURL(file);
    },
    removeSingleCover(e) {
      this.SingleCover = "";
    },
    onSingleCoverChange(e) {
      if (this.Coverfile) {
        const formDataa = new FormData();
        formDataa.append("image", this.Coverfile);
        let config = {
          headers: {
            authorization: localStorage.getItem("token"),
            "Content-Type": `application/json'; boundary=${formDataa._boundary}`,
          },
        };
        this.$axios
          .post("/upload/image", formDataa, config)
          .then((response) => {
            this.createSingleImage(this.Singlefile);
            const branchData = {
              index: this.branchesNumber,
              data: response.data.dataimages[0].imageUrl,
              index_type: "cover",
            };
            this.$store.commit("updateBranches", branchData);
          });
      }
    },
    confirmSingleBranch() {
      this.error = "";
      this.success = "";
      // this.$v.$touch()
      if (this.$refs.branchform.validate()) {
        this.$store.commit("validateBranch");

        let merchantForm = {
          index: this.branchesNumber,
          data: {
            key: "name",
            value: this.branchData.name,
          },
        };
        console.log(merchantForm);
        this.$store.commit("updateMerchantForms", merchantForm);
        merchantForm = {
          index: this.branchesNumber,
          data: {
            key: "merchant",
            value: this.branchData.merchant,
          },
        };
        this.$store.commit("updateMerchantForms", merchantForm);
        merchantForm = {
          index: this.branchesNumber,
          data: {
            key: "phone",
            value: this.branchData.phone,
          },
        };
        this.$store.commit("updateMerchantForms", merchantForm);
        merchantForm = {
          index: this.branchesNumber,
          data: {
            key: "email",
            value: this.branchData.email,
          },
        };
        this.$store.commit("updateMerchantForms", merchantForm);
        merchantForm = {
          index: this.branchesNumber,
          data: {
            key: "password",
            value: this.branchData.password,
          },
        };
        this.$store.commit("updateMerchantForms", merchantForm);
        merchantForm = {
          index: this.branchesNumber,
          data: {
            key: "address",
            value: this.branchData.address,
          },
        };
        this.$store.commit("updateMerchantForms", merchantForm);
        
        console.log(this.$store.state.merchantData.branches);
        this.success = "Confirmed";
      } else if (
        !(
          Object.keys(this.branchData.location).length === 0 &&
          (this.branchData.location.constructor === Object) != ""
        )
      ) {
        if (this.SingleCover === "" || this.SingleImage === "") {
          this.error = "Please Upload the required Images";
        } else {
          const formBranch = {
            index: this.branchesNumber,
            data: {
              key: "status",
              value: false,
            },
          };
          this.$store.commit("updateMerchantForms", formBranch);
        }
      } else {
        this.error = "You have to choose a location";
      }
    },
    handleSelectedNewPlace(data) {
      console.log("Received new location", data);
      this.branchData.location = data.location;

      let merchantForm = {
          index: this.branchesNumber,
          data: {
            key: "location",
            value: this.branchData.location,
          },
        };
        this.$store.commit("updateMerchantForms", merchantForm);

      this.place = data.address;
    },
  },
};
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
.en-singleBranch {
  width: 50%;
  &-title {
    font-size: 24px;
  }
  &-main {
    margin-bottom: 30px;
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
  }
}
input[type="file"] {
  display: none;
}
.custom-file-upload {
  display: inline-block;
  padding: 4px 12px;
  width: 100%;
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
.cover-img {
  width: 200px;
  width: 200px;
  margin: auto;
  display: block;
  margin-bottom: 10px;
}
.en-singleBranch-main-right {
  width: 100%;
}
.en-singleBranch-main-left {
  width: 100% !important;
}
</style>
