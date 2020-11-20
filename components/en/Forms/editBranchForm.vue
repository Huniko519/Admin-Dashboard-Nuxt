<template>
  <div class="en-CategoryForm">
    <div v-if="success != ''" class="en-CategoryForm-errors-error">
      <notification notfi-color="greenNotfi">
        {{ success }}
      </notification>
    </div>

    <div class="en-CategoryForm-errors">
      <div
        v-for="error in errors"
        :key="error.msg"
        class="en-CategoryForm-errors-error"
      >
        <notification notfi-color="redNotfi">
          {{ error.msg }}
        </notification>
      </div>
    </div>

    <div v-if="loading" class="sk-folding-cube">
      <div class="sk-cube1 sk-cube"/>
      <div class="sk-cube2 sk-cube"/>
      <div class="sk-cube4 sk-cube"/>
      <div class="sk-cube3 sk-cube"/>
    </div>
    <v-card elevation="10" class="pa-5">
      <form v-if="!loading" class="en-CategoryForm-content" @submit.prevent="addCategeroy">
        <div class="en-singleBranch-main-left-form">

          <v-select
            v-model="branch.parentId"
            label="Merchant"
            :rules="[(v) => !!v || 'Merchant is required']"
            required
            :items="merchants"
            item-value="_id"
            item-text="name"
          />
          <v-text-field v-model="branch.name" :success="!!branch.name"
                        :rules="[(v) => !!v || 'Branch Name is required',]" label="Branch Name" required/>
          <v-text-field
            v-model="branch.phone"
            :success="!!branch.phone"
            :rules="[(v) => !!v || 'Phone Number is required',
                  (v) => (v && /^[0-9]+$/.test(v)) || 'Phone Number must be digits only']"
            label="Phone Number"
            required
          />
          <v-text-field
            v-model="branch.email"
            :success="!!branch.email"
            label="Email"
            :rules="[(v) => !!v || 'E-mail is required',
                  (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',]"
            required
          />

          <v-text-field
            v-model="branch.password"
            :success="!!branch.password"
            :rules="[(v) => !!v || 'Password is required']"
            label="Password"
            required
            type="password"
          />

          <v-text-field
            v-model="branch.address"
            :success="!!branch.address"
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
                v-for="suggest in suggestions" :key="suggest.id" class="map-suggest">
                <div :posTitle="suggest.position" :showTitle="suggest.title" @click="clickForPlace">
                  {{ suggest.title }}
                  <span style="font-size: 10px;">{{ (suggest.vicinity) }}</span>
                </div>
              </div>
            </div> -->
              <map-search-place :location="{long, lat}" @onSelectedNewPlace="handleSelectedNewPlace"/>
          </div>

          <div class="en-CategoryForm-content-row">
            <div v-if="!branch.image" class="en-CategoryForm-content-row-element">
              <img :src="branch.image" class="en-CategoryForm-content-row-element-img">
              <label for="edit-category-upload" class="custom-file-upload">
                <v-icon style="color: white;">mdi-upload</v-icon>
                Upload
              </label>
              <input id="edit-category-upload" ref="BranchImage" name="image" type="file" @change="changeImage">
            </div>
            <div v-else class="en-CategoryForm-content-row-element">
              <img :src="branch.image" class="en-CategoryForm-content-row-element-img" alt>
              <v-btn color="error" @click="removeImage()">Remove</v-btn>
            </div>
          </div>
          <div class="en-categoryForm-content-button">
            <div class="en-CategoryForm-content-button-TheButton">
              <v-btn color="error" @click="update()">Update Branch</v-btn>
            </div>
          </div>
        </div>
      </form>
    </v-card>
  </div>
</template>

<script>
  import Cookie from "js-cookie"
  import inputWithIcon2 from "~/components/en/General/inputWithIcon2.vue"
  import arinputWithIcon2 from "~/components/ar/General/arinputWithIcon2.vue"
  import selectInput from "~/components/en/General/selectInput.vue"
  import buttonWithColors from "~/components/en/General/buttonWithColors.vue"
  import notification from "~/components/en/General/notification.vue"
  import {required} from "vuelidate/lib/validators"
  import MapSearchPlace from "@/components/map-search-place.vue"

  export default {
    name: "EditBranchForm",
    components: {
      inputWithIcon2,
      arinputWithIcon2,
      buttonWithColors,
      notification,
      selectInput,
      MapSearchPlace,
    },
    props: {
      branch: {},
      selectItems: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        lat: undefined,
        long: undefined,
        branchData: {
          name: "",
          merchant: "",
          phone: "",
          email: "",
          address: "",
          password: "",
          location: {},
        },
        error: "",
        suggestions: "",
        place: "",
        SingleImage: "",
        merchants: [],
        SingleCover: "",
        valid: false,
        placeIsCorrect: false,
        CategoryName: "",
        ArCategoryName: "",
        ParentCategory: "",
        CategoryDesc: "",
        ArCategoryDesc: "",
        Tags: "",
        image: "",
        categories: "",
        errors: [],
        file: "",
        success: "",
        loading: false,
        selectPlaceholders: [
          {header: "Parent:"},
          {divider: " "},
          {header: "Child (Choose parent):"},
        ],
      }
    },
    updated() {
      console.log(this.branch)
      const {location, address} = this.branch
      this.long = location.long;
      this.lat = location.lat
    },
    created() {
      let config = {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
      this.$axios
        .get("/merchants", config)
        .then((data) => {
          this.merchants = data.data.merchants
        })
        .catch((error) => {
          console.log(error)
        })
    },
    computed: {
      items() {
        const nodes = this.selectItems.map((el) => {
          return {text: el.name, value: el._id}
        })
        return [...this.selectPlaceholders, ...nodes]
      },
      rootId() {
        return this.selectItems[0]._id
      },
    },
    watch: {
      image(val) {
        console.log(val)
        this.branch.image = val
      },
    },
    methods: {
      SearchForAplace() {
        this.suggestions = ""
        const getStatment =
          "https://places.ls.hereapi.com/places/v1/autosuggest?apiKey=lfJxURZOAcIIg5nEj-0Ioi72nWpw5iIF9NT3n_NPAKE&at=40.7539,-73.9837&q=" +
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
            } catch {
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      clickForPlace(e) {
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
          this.branchData.location = position
          this.branch.location = {
            lat: position.lat.toString(),
            long: position.long.toString(),
          }
          let merchantForm = {
            index: this.branchesNumber,
            data: {
              key: "location",
              value: {
                lat: position.lat,
                long: position.long,
              },
            },
          }
          this.$store.commit("updateMerchantForms", merchantForm)
          const map = this.$refs.map
          map.dropMarker(position)
          this.placeIsCorrect = true
        } catch {
        }
      },
      changeImage(e) {
        var files = e.target.files || e.dataTransfer.files
        console.log(files)
        if (!files.length) return
        this.createImage(files[0])
        this.file = this.$refs.BranchImage.files[0]
      },
      createImage(file) {
        var image = new Image()
        var reader = new FileReader()
        var vm = this
        reader.onload = (e) => {
          vm.image = e.target.result
        }
        reader.readAsDataURL(file)
      },
      removeImage() {
        this.image = ""
        this.branch.image = ""
      },
      update() {
        let finalData = this.branch
        let branchData = {
            branch: {
              name: this.branch.name,
              branchId: "1",
              address: this.branch.address,
              phone: this.branch.phone,
              email: this.branch.email,
              password: this.branch.password,
              image: this.branch.image,
              location: this.branch.location
            }
          }
        let config = {
          headers: {
            authorization: localStorage.getItem("token"),
            "Content-Type": `application/json'; boundary=${finalData._boundary}`,
          },
        }
        const uploadImage = async (payload) => {
          const formDataa = new FormData()
          formDataa.append("image", this.image)
          let config = {
            headers: {
              authorization: localStorage.getItem("token"),
              "Content-Type": `application/json'; boundary=${formDataa._boundary}`,
            },
          }
          await this.$axios
            .post("/upload/image", formDataa, config)
            .then((data) => {
              branchData.image = data.data.dataimages[0].imageUrl
            })
        }

        console.log(branchData);

        const updateBranch = async () => {
          if (this.image) {
            await uploadImage()
          }
          console.log("start submit")
          let config = {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
          
          this.$axios.put("/merchants/branch/" + this.branch._id, branchData, config)
            .then((result) => {
              console.log("updated", result)
              this.success = "Updated Branch"
              this.$emit("updated")
              this.loading = false
              window.location.reload(true)
            }).catch((error) => {
            console.log("err", error)
            this.errors.push(error.response.data)
            this.loading = false
          })
        }
        updateBranch()

      },
      handleSelectedNewPlace(data) {
        console.log('Received new location', data)
        this.branchData.location = data.location;
        this.branch.location = data.location;
        this.place = data.address
    }
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

  .en-CategoryForm {
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

  .en-CategoryForm-content {
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

  input[type="file"] {
    display: none;
  }

  .custom-file-upload {
    display: inline-block;
    padding: 6px 12px;
    width: 350px;
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

  .image-error {
    color: red;
    text-align: left;
    margin-top: -3px;
  }

  @media (max-width: 992px) {
    .en-CategoryForm-content {
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
