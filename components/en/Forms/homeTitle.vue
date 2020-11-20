<template>
  <div class="en-CategoryForm">
    <div v-if="success != ''" class="en-CategoryForm-errors-error">
      <notification notfi-color="greenNotfi">
        Edited successfully
      </notification>
    </div>
    <div class="en-CategoryForm-errors">
      <div
        v-for="error in errors"
        :key="error.msg"
        class="en-CategoryForm-errors-error"
      >
        <notification notfi-color="redNotfi">
          {{ error.error }}
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
        @submit.prevent="addHomeTitle"
      >
        <div class="en-CategoryForm-content-row">
          <v-text-field
            v-model="enPageTitle"
            :rules="[(v) => !!v || 'Title is required']"
            label="Home Title"
            required
          />
        </div>

        <div class="en-CategoryForm-content-row">
          <v-text-field
            v-model="arPageTitle"
            :rules="[(v) => !!v || 'اسم القسم مطلوب']"
            label="عنوان الرئيسية"
            required
            :placeholder="settings.data.arPageTitle"
          />
        </div>
        <div class="en-categoryForm-content-button">
          <div class="en-CategoryForm-content-button-TheButton">
            <buttonWithColors btn-color="RedBtn" btn-label="Edit home title" />
          </div>
        </div>
      </form>
    </v-card>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators"
import buttonWithColors from "~/components/en/General/buttonWithColors.vue"
import notification from "~/components/en/General/notification.vue"

export default {
  name: "HomeTitle",
  components: {
    buttonWithColors,
    notification,
  },
  props: {
    settings: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      enPageTitle: this.settings.data.enPageTitle,
      arPageTitle: this.settings.data.arPageTitle,
      errors: [],
      success: "",
      loading: false,
    }
  },
  validations: {
    enPageTitle: {
      required,
    },
    arPageTitle: {
      required,
    },
  },
  methods: {
    addHomeTitle () {
      const config = {
        authorization: localStorage.getItem("token"),
      }
      this.loading = true
      this.$axios
        .$put(
          "/webSetting/" + this.settings.data._id,
          {
            enPageTitle: this.enPageTitle,
            arPageTitle: this.arPageTitle,
            // added because they are required in api
            enMetaDescription: "YallaDealz description",
            arMetaDescription: "وصف",
            enAboutus: "about yalladealz",
            arAboutus: "عن يالا ديلز",
            enContactus: "contactus yalladealz",
            arContactus: "للتواصل معنا",
            enTerms: "terms yalladealz",
            arTerms: "الشروط والاحكام",
            enPrivacy: "privacy yalladealz",
            arPrivacy: "الخصوصية",
            enPolicy: "ploicy yalladealz",
            arPolicy: "السياسات",
            homeBanner:
              "https://yalladealzcdn.fra1.digitaloceanspaces.com/cf05c638-0565-42c4-a705-924a147b654d78777267_2647365372013535_4926030470048645120_o.jpg",
          },
          {
            headers: config,
          }
        )
        .then((res) => {
          this.loading = false
          this.success = res
          this.error = []
        })
        .catch((error) => {
          this.errors.push(error.response.data)
          this.loading = false
        })
    },
  },
  head () {
    return {
      title: this.settings.data.enPageTitle,
    }
  },
}
</script>

<style lang="scss" scoped>
.en-CategoryForm {
  &-errors {
    margin-top: 30px;
    width: 80%;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    &-error {
      margin-top: 30px;
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
