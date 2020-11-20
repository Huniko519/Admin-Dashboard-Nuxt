<template>
  <div class="en-CategoryForm">
    <div v-if="success != ''" class="en-CategoryForm-errors-error">
      <notification notfi-color="greenNotfi">
        {{ success }}
      </notification>
    </div>

    <div class="en-CategoryForm-errors">
      <div v-for="error in errors" :key="error.msg" class="en-CategoryForm-errors-error">
        <notification notfi-color="redNotfi">
          {{ error.msg }}
        </notification>
      </div>
    </div>

    <v-form>
      <v-container>
        <v-card class="rounded-xl p-3" :loading="loading">
          <v-card-title>
            Add New Category
          </v-card-title>
          <v-row justify="space-around" dense>
            <v-col cols="12" md="5">
              <v-text-field v-model="CategoryName" :rules="[(v) => !!v || 'Name is required']" label="Category Name" solo dense rounded required @input="setCategoryName"/>
            </v-col>

            <v-col cols="12" md="5">
              <v-text-field v-model="CategoryDesc" :rules="[(v) => !!v || 'Description is required']" label="Category Description" solo dense rounded required @input="setCategoryDesc"/>
            </v-col>

            <v-col cols="12" md="5">
              <v-text-field v-model="ArCategoryName" :rules="[(v) => !!v || 'اسم القسم مطلوب']" label="اسم القسم" solo dense rounded required @input="setArCategoryName"/>
            </v-col>

            <v-col cols="12" md="5">
              <v-text-field v-model="ArCategoryDesc" :rules="[(v) => !!v || 'وصف القسم مطلوب']" label="وصف القسم " solo dense rounded required @input="setArCategoryDesc"/>
            </v-col>

            <v-col cols="12" md="11">
              <v-combobox v-model="Tags" :hint="Tags ? Tags + '' : 'No Tags Yet'" label="Add some tags" multiple persistent-hint small-chips solo dense rounded></v-combobox>
            </v-col>

            <v-col class="d-flex" cols="12" md="11">
              <v-select v-model="ParentCategory" :items="items" label="Parent Category" solo dense rounded @changedSelect="setParentCategory"></v-select>
            </v-col>

            <v-col cols="12" md="11">
              <div v-if="!image" class="en-CategoryForm-content-row-element">
                <v-btn color="red" class="rounded-xl" dark block>
                  <label for="category-upload" class="my-auto pointer">
                    <v-icon>mdi-upload</v-icon>
                    <span>Icon Upload</span>
                  </label>
                </v-btn>

                <input id="category-upload" ref="CategoryIcon" name="image" type="file" @change="onFileChange" >

                <div v-if="!image">
                  <div class="image-error">image is a must</div>
                </div>
              </div>

              <v-row justify="center" class="text-center">
                <v-col cols="6" v-if="image">
                  <img :src="image" width="200" alt>
                  <v-btn color="red" class="rounded-xl" @click="removeImage" block dark>Remove Image</v-btn>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="11" class="d-flex justify-content-center mt-3">
              <v-btn color="red" class="rounded-xl" dark @click="addCategeroy">Add Category</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-form>

  </div>
</template>

<script>
import Cookie from "js-cookie"
import inputWithIcon2 from "~/components/en/General/inputWithIcon2.vue"
import arinputWithIcon2 from "~/components/ar/General/arinputWithIcon2.vue"
import selectInput from "~/components/en/General/selectInput.vue"
import buttonWithColors from "~/components/en/General/buttonWithColors.vue"
import notification from "~/components/en/General/notification.vue"
import { required } from "vuelidate/lib/validators"
import { validationMixin } from "vuelidate/src"

export default {
  name: "CategoryForm",

  components: {
    inputWithIcon2,
    arinputWithIcon2,
    buttonWithColors,
    notification,
    selectInput,
  },

  props: {
    selectItems: {
      type: Array,
      default: () => [],
    }
  },

  data() {
    return {
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
        { header: "Parent:" },
        { divider: " " },
        { header: "Child (Choose parent):" },
      ],
    }
  },

  computed: {
    items() {
      const nodes = this.selectItems.map((el) => {
        // console.log(el)
        return { text: el.name, value: el._id }
      })
      return [...this.selectPlaceholders, ...nodes]
    },

    rootId() {
      if (this.selectItems.length > 0) {
        return this.selectItems[0]._id
      }
    },
  },

  validations: {
    CategoryName: { required },
    ArCategoryName: { required },
    CategoryDesc: { required },
    ArCategoryDesc: { required },
    Tags: { required }
  },

  methods: {
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.createImage(files[0])
      this.file = this.$refs.CategoryIcon.files[0]
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
    removeImage: function (e) {
      this.image = ""
    },
    setCategoryName(value) {
      this.CategoryName = value
      this.$v.CategoryName.$touch()
    },
    setArCategoryName(value) {
      this.ArCategoryName = value
      this.$v.ArCategoryName.$touch()
    },
    setParentCategory(value) {
      console.log("setParentCategory -> value", value)
      this.ParentCategory = value
      this.$v.ParentCategory.$touch()
    },
    setCategoryDesc(value) {
      this.CategoryDesc = value
      this.$v.CategoryDesc.$touch()
    },
    setArCategoryDesc(value) {
      this.ArCategoryDesc = value
      this.$v.ArCategoryDesc.$touch()
    },
    addCategeroy() {
      this.loading = true
      let caregoryData = {
        name: this.CategoryName,
        arName: this.ArCategoryName,
        parent:
          this.ParentCategory === "no_parent"
            ? this.rootId
            : this.ParentCategory,
        description: this.CategoryDesc,
        arDescription: this.ArCategoryDesc,
        tags: this.Tags,
      }

      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR"
        this.loading = false
      } else {
        let config = {
          headers: {
            authorization: this.$store.state.token,
          },
        }
        this.errors = []
        const uploadImage = async (payload) => {
          const formDataa = new FormData()
          formDataa.append("image", this.file)
          let config = {
            headers: {
              authorization: localStorage.getItem("token"),
              "Content-Type": `application/json'; boundary=${formDataa._boundary}`,
            },
          }
          await this.$axios
            .post("/upload/image", formDataa, config)
            .then((data) => {
              caregoryData.icon = data.data.dataimages[0].imageUrl
            })
        }
        const submitCategory = async () => {
          await uploadImage()
          console.log("start submit")
          console.log(this.selectItems)
          let config = {
            headers: {
              // Authorization : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZThjYjc3ODVlNGQ0YTFlMWNkZTc2YWMiLCJyb2xlIjoic3VwZXJBZG1pbiIsImlhdCI6MTU4ODM4MzM5OCwiZXhwIjoxNTg5MjQ3Mzk4fQ.RmEGN9FS26QrHXCv80hbryk6vJPMtOApa_FGK3tphu8'
              authorization: localStorage.getItem("token"),
            },
          }
          await this.$axios
            .post("/categories", caregoryData, config)
            .then((result) => {
              this.success = "Added to Categories"
              this.$emit("updated")
              this.loading = false
              window.location.reload(true)
            })
            .catch((error) => {
              this.errors.push(error.response.data)
              this.loading = false
            })
        }
        submitCategory()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.card {
  border-radius: 30px;
}

.pointer {
  cursor: pointer;
}

.en-CategoryForm {
  &-errors {
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
    width: 50%;
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
