<template>
  <v-card class="pa-4" elevation="10">
    <v-card-title>Web Settings</v-card-title>
    <v-container>
      <v-form ref="form">
        <v-textarea v-model="settings.enPageTitle" outlined label="Page Title" rows="1" auto-grow></v-textarea>
        <v-textarea
          v-model="settings.arPageTitle"
          outlined
          label="Page Title(Arabic)"
          rows="1"
          auto-grow
        ></v-textarea>
        <v-textarea
          v-model="settings.enMetaDescription"
          outlined
          label="Meta Description"
          rows="1"
          auto-grow
        ></v-textarea>
        <v-textarea
          v-model="settings.arMetaDescription"
          outlined
          label="Meta Description(Arabic)"
          rows="1"
          auto-grow
        ></v-textarea>
        <v-textarea v-model="settings.enAboutus" outlined label="About Us" rows="1" auto-grow></v-textarea>
         <vue-editor class="mb-8" v-model="settings.enAboutusDescription" placeholder="About Us Description"></vue-editor>

        <v-textarea
          v-model="settings.arAboutus"
          outlined
          label="About Us(Arabic)"
          rows="1"
          auto-grow
        ></v-textarea>
          <vue-editor class="mb-8" v-model="settings.arAboutusDescription" placeholder="About Us Description(Arabic)"></vue-editor>
        <v-textarea v-model="settings.enContactus" outlined label="Contact Us" rows="1" auto-grow></v-textarea>
        <vue-editor class="mb-8" v-model="settings.enContactusDescription" placeholder="Contact Us Description"></vue-editor>
        <v-textarea
          v-model="settings.arContactus"
          outlined
          label="Contact Us(Arabic)"
          rows="1"
          auto-grow
        ></v-textarea>
        <vue-editor class="mb-8" v-model="settings.arContactusDescription" placeholder="Contact Us Description (Arabic)"></vue-editor>
        <v-textarea v-model="settings.enTerms" outlined label="Terms" rows="1" auto-grow></v-textarea>
        <vue-editor class="mb-8" v-model="settings.enTermsDescription" placeholder="Terms Description"></vue-editor>
        <v-textarea v-model="settings.arTerms" outlined label="Terms(Arabic)" rows="1" auto-grow></v-textarea>
        <vue-editor class="mb-8" v-model="settings.arTermsDescription" placeholder="Terms Description (Arabic)"></vue-editor>
        <v-textarea v-model="settings.enPrivacy" outlined label="Privacy" rows="1" auto-grow></v-textarea>
        <vue-editor class="mb-8" v-model="settings.enPrivacyDescription" placeholder="Privacy Description"></vue-editor>
        <v-textarea
          v-model="settings.arPrivacy"
          outlined
          label="Privacy(Arabic)"
          rows="1"
          auto-grow
        ></v-textarea>
        <vue-editor class="mb-8" v-model="settings.arPrivacyDescription" placeholder="Privacy Description (Arabic)"></vue-editor>
        <v-textarea v-model="settings.enPolicy" outlined label="Policy" rows="1" auto-grow></v-textarea>
        <vue-editor class="mb-8" v-model="settings.enPolicyDescription" placeholder="Policy Description"></vue-editor>
        <v-textarea v-model="settings.arPolicy" outlined label="Policy(Arabic)" rows="1" auto-grow></v-textarea>

         <vue-editor class="mb-8" v-model="settings.arPolicyDescription" placeholder="Policy Description (Arabic)"></vue-editor>

        <v-file-input @change="uploadImage()" v-model="image" outlined label="Home Banner"></v-file-input>
        <v-file-input
          @change="uploadImage2()"
          v-model="image2"
          outlined
          label="Home Banner(English)"
        ></v-file-input>

        <v-alert v-model="success" type="success">Updated Successfully</v-alert>
        <v-alert v-if="error" type="error">{{error}}</v-alert>
        <v-btn @click="submit()" large color="primary">Update</v-btn>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
import { VueEditor } from "vue2-editor";
export default {
  components: {VueEditor},
  data() {
    return {
      success: false,
      error: null,
      settings: {homeBanner : '',enhomeBanner : '' },
      content: "",
      id: null,
      image: null,
      image2: null
    };
  },
  mounted() {
    var config = {
      headers: {
        authorization: localStorage.getItem("token")
      }
    };
    this.$axios
      .get("webSetting", config)
      .then(res => {
        var d = res.data.data;
        this.id = res.data.data._id;
        delete d._id;
        delete d.isArchived;

        this.settings = Object.assign({}, this.settings, d);

      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    uploadImage() {
      // This uploads the selected image and get the image url
      let fd = new FormData();
      fd.append("image", this.image);
      const config = {
        headers: {
          authorization: localStorage.getItem("token")
        }
      };
      this.$axios
        .post("upload/image/", fd, config)
        .then(res => {
          this.settings.homeBanner = res.data.dataimages[0].imageUrl;
        })
        .catch(err => {
          console.log("ERROR UPLOADING IMAGE");
          console.log(err);
        });
    },
    uploadImage2() {
      // This uploads the selected image and get the image url
      let fd = new FormData();
      fd.append("image", this.image2);
      const config = {
        headers: {
          authorization: localStorage.getItem("token")
        }
      };
      this.$axios
        .post("upload/image/", fd, config)
        .then(res => {
          console.log(res.data.dataimages[0].imageUrl);
          this.settings.enhomeBanner = res.data.dataimages[0].imageUrl;
        })
        .catch(err => {
          console.log("ERROR UPLOADING IMAGE");
          console.log(err);
        });
    },
    submit() {
      var config = {
        headers: {
          authorization: localStorage.getItem("token")
        }
      };
      this.$axios
        .put("webSetting/" + this.id, this.settings, config)
        .then(res => {
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 3000);
        })
        .catch(err => {
          console.log(err);
          this.error = err.response.data.message;
          setTimeout(() => {
            this.error = null;
          }, 3000);
        });
    }
  }
};
</script>

<style>
</style>