<template>
  <v-container>
    <v-row justify="center" class="text-center" dense>
      <v-col cols="12" md="8">
        <v-card elevation="5" class="p-4 mt-10 mt-md-3">
          <v-card-title>Message Form</v-card-title>
          <v-container>
            <v-form @submit.prevent="submitForm()" ref="form" v-model="valid">
              <v-row justify="center" dense>
                <v-col cols="10" >
                  <v-alert type="success" v-model="messageSent">Message succesfully sent</v-alert>
                </v-col>
                <v-col cols="12"></v-col>
                <v-col cols="9" class="ml-5">
                  <v-text-field :rules="requiredRule" label="Title" v-model="messageForm.title" solo rounded dense></v-text-field>
                </v-col>
                <v-col cols="9" class="ml-5">
                  <v-textarea :rules="requiredRule" label="Description" rows="3" auto-grow v-model="messageForm.description" outlined dense></v-textarea>
                </v-col>
                <v-col cols="10">
                  <v-btn v-if="!image" color="red" class="rounded-xl" dark block>
                    <label for="image-upload" class="my-auto pointer">
                      <v-icon>mdi-upload</v-icon>
                      <span>Upload Image</span>
                    </label>
                  </v-btn>
                  <v-file-input v-show="image" id="image-upload" @change="uploadImage()" v-model="image" label="Image" outlined rounded dense></v-file-input>
                </v-col>
                <v-col cols="10" md="6">
                  <v-btn color="primary" large @click="submitForm()">Submit</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      messageForm: { image: "" },
      image: null,
      messageSent: false,
      valid: true,
      requiredRule: [v => !!v || "This field is required"]
    };
  },
  methods: {
    submitForm() {
      this.$refs.form.validate();
      if (this.valid) {
        const config = {
          headers: {
            authorization: localStorage.getItem("token")
          }
        };

        this.$axios
          .post("webSetting/notification/", this.messageForm, config)
          .then(res => {
            this.$refs.form.reset();
            messageSent = true;
            this.setTimeout(() => {
              this.messageSent = false;
            }, 3000);
          })
          .catch(err => {
            console.log("ERROR SUBMITTING FORM");
            console.log(err);
          });
      }
    },
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
          this.messageForm.image = res.data.dataimages[0].imageUrl;
        })
        .catch(err => {
          console.log("ERROR UPLOADING IMAGEA");
          console.log(err);
        });
    }
  }
};
</script>

<style scoped >
  .pointer {
    cursor: pointer;
  }
</style>