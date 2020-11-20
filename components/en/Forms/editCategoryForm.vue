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
      <div class="sk-cube1 sk-cube" />
      <div class="sk-cube2 sk-cube" />
      <div class="sk-cube4 sk-cube" />
      <div class="sk-cube3 sk-cube" />
    </div>
    <v-card elevation="10" class="pa-5">
      <form
        v-if="!loading"
        class="en-CategoryForm-content"
        @submit.prevent="addCategeroy"
      >
        <div class="en-CategoryForm-content-row">
          <v-text-field
            v-model="cat.name"
            :rules="[
              (v) => !!v || 'Name is required',
            ]"
            label="Category Name"
            required
            @input="setCategoryName"
          />
        </div>

        <div class="en-CategoryForm-content-row">
          <v-text-field
            v-model="cat.arName"
            :rules="[
              (v) => !!v || 'اسم القسم مطلوب',
            ]"
            label="اسم القسم"
            required
            @input="setArCategoryName"
          />
        </div>

        <div class="en-CategoryForm-content-row">
          <template>
            <v-select
              v-model="cat.parent._id"
              label="Parent Category"
              :items="items"
              @changedSelect="setParentCategory"
            />
          </template>
        </div>

        <div class="en-CategoryForm-content-row">
          <v-text-field
            v-model="cat.description"
            :rules="[(v) => !!v || 'Description is required']"
            label="Category Description"
            required
            @input="setCategoryDesc"
          />
        </div>

        <div class="en-CategoryForm-content-row">
          <v-text-field
            v-model="cat.arDescription"
            :rules="[(v) => !!v || 'وصف القسم مطلوب']"
            label="وصف القسم "
            required
            @input="setArCategoryDesc"
          />
        </div>

        <div class="en-CategoryForm-content-row">
          <b-form-tags input-id="tags-basic" v-model="cat.tags" class="mb-2" placeholder="Tags"></b-form-tags>
        </div>

        <div class="en-CategoryForm-content-row">
          <div v-if="!image" class="en-CategoryForm-content-row-element">
            <img :src="cat.icon" class="en-CategoryForm-content-row-element-img">
            <label for="edit-category-upload" class="custom-file-upload">
              <v-icon style="color: white;">mdi-upload</v-icon>Upload
            </label>
            <input id="edit-category-upload" ref="CategoryIcon" name="image" type="file" @change="changeImage">
          </div>
          <div v-else class="en-CategoryForm-content-row-element">
            <img :src="image" class="en-CategoryForm-content-row-element-img" alt>
            <buttonWithColors
              prevent-click
              btn-color="RedBtn"
              btn-label="Remove Icon"
              @click="removeImage"
            />
          </div>
        </div>

        <div class="en-categoryForm-content-button">
          <div class="en-CategoryForm-content-button-TheButton">
            <buttonWithColors
              btn-color="RedBtn"
              btn-label="Update Category"
              @click="update()"
            />
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
import { required } from "vuelidate/lib/validators"
export default {
  name: "EditCategoryForm",
  components: {
    inputWithIcon2,
    arinputWithIcon2,
    buttonWithColors,
    notification,
    selectInput,
  },
  props: {
    cat: {},
    selectItems: {
      type: Array,
      default: () => [],
    },
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
        return { text: el.name, value: el._id }
      })
      return [...this.selectPlaceholders, ...nodes]
    },
    rootId() {
      return this.selectItems[0]._id
    },
  },
  watch: {
    image(val) {
      this.cat.icon = val
    },
  },
  validations: {
    CategoryName: {
      required,
    },
    ArCategoryName: {
      required,
    },
    ParentCategory: {
      required,
    },
    CategoryDesc: {
      required,
    },
    ArCategoryDesc: {
      required,
    },
    Tags: {
      required,
    },
  },
  methods: {
    changeImage(e) {
      var files = e.target.files || e.dataTransfer.files
      console.log(files)
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
    setTags(value) {
      this.Tags = value
      this.$v.Tags.$touch()
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
        tags: this.Tags.split(","),
      }
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR"
        this.loading = false
      }
      else {
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
              caregoryData.icon = data.data.imageUrl
            })
        }
        const submitCategory = async () => {
          await uploadImage()
          console.log("start submit")
          let config = {
            headers: {
              // Authorization : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZThjYjc3ODVlNGQ0YTFlMWNkZTc2YWMiLCJyb2xlIjoic3VwZXJBZG1pbiIsImlhdCI6MTU4ODM4MzM5OCwiZXhwIjoxNTg5MjQ3Mzk4fQ.RmEGN9FS26QrHXCv80hbryk6vJPMtOApa_FGK3tphu8'
              authorization: localStorage.getItem("token"),
            },
          }
          await this.$axios
            .put("/categories" + this.cat._id, this.cat, config)
            .then((result) => {
              this.success = "Updated Category"
              this.$emit("updated")
              this.loading = false
            })
            .catch((error) => {
              this.errors.push(error.response.data)
              this.loading = false
            })
        }
        submitCategory()
      }
    },
    update() {
      let finalData = this.cat
      let caregoryData = {
        name: this.cat.name,
        arName: this.cat.arName,
        parent: this.cat.parent,
        description: this.cat.description,
        arDescription: this.cat.arDescription,
        tags: this.cat.tags,
        icon: this.cat.icon,
      }

      let config = {
        headers: {
          authorization: localStorage.getItem("token"),
          "Content-Type": `application/json'; boundary=${finalData._boundary}`,
        },
      }
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

      const updateCategory = async () => {
        if (this.image) {
          await uploadImage()
        }
        console.log("start submit")
        let config = {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
        this.$axios
          .put("/categories/" + this.cat._id, caregoryData, config)
          .then((result) => {
            console.log("updated", result)
            this.success = "Updated Category"
            this.$emit("updated")
            this.loading = false
            window.location.reload(true)
          })
          .catch((error) => {
            console.log("err", error)
            this.errors.push(error.response.data)
            this.loading = false
          })
      }
      updateCategory()

    },
  },
}
</script>

<style lang="scss" scoped>
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
