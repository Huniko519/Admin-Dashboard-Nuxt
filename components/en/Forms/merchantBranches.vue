<template>
  <form class="en-merchantBranches">
    <snackbar ref="snackbar"></snackbar>
    <p class="h3 title1">
      Branches:
    </p>
    <div class="en-merchantBranches-options">
      <div class="en-merchantBranches-options-add" @click="addBranch">
        <i class="fas fa-plus"/>
      </div>
      <div class="en-merchantBranches-options-remove" @click="removeBranch">
        <i class="fas fa-minus"/>
      </div>
    </div>
    <div v-for="(n, index) of branchesNumber" :key="index" class="">
      <div>
        <singleBranch ref="branchesForm" :show-map="showMap" :branches-number="index"/>
      </div>
    </div>
    <div v-if="loading" class="spinner"/>
    <div v-if="!loading" class="en-dealForm-main-left-form-row">
      <v-btn color="primary" @click="storeBranches">Confirm</v-btn>
    </div>
  </form>
</template>

<script>
  import singleBranch from "~/components/en/Forms/singleBranch"
  import buttonWithColors from "~/components/en/General/buttonWithColors.vue"
  import snackbar from '~/components/snackbar.vue'

  export default {
    name: "MerchantBranches",
    components: {
      singleBranch,
      buttonWithColors,
      snackbar
    },
    props: {
      showMap: Boolean,
    },
    data() {
      return {
        branchesNumber: 1,
        loading: false,
        req_status: false,
      }
    },
    computed: {},
    methods: {
      removeBranch() {
        if (this.branchesNumber !== 0) {
          this.branchesNumber--
          this.$store.commit("removeBranch")
          this.$store.commit("removeMerchantFormBranch")
        }
      },
      addBranch() {
        this.branchesNumber++
        const branch = {
          name: "",
          branchId: "" + this.branchesNumber,
          phone: "",
          merchant: "",
          email: "",
          password: "",
          address: "",
          image: "",
          location: {},
        }
        this.$store.commit("addBranch", branch)
        this.$store.commit("addMerchantFormBranch", {
          branchId: "" + this.branchesNumber,
          status: false,
        })
      },
      storeBranches() {
        let branches = this.$store.state.branchesData
        console.log(branches)
        if (this.$store.state.branchesDataValidated == true) {
          this.loading = true
          let config = {
            headers: {
              authorization: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
          for (let x = 0; x < branches.length; x++) {
            let branch = branches[x];
            let data = {
              merchant: branch.merchant,
              branches: [{
                name: branch.name,
                branchId: branch.branchId,
                address: branch.address,
                phone: branch.phone,
                email: branch.email,
                password: branch.password,
                image: branch.image,
                location: branch.location
              }]
            }
            this.$axios.post("/merchants/branch", data, config).then((result) => {
              if (result.status == 200) {
                this.req_status = true;
              }
            }).catch((error) => {
                this.req_status = false;
                this.error = "Sorry, something happened!"
                this.loading = false
                this.$refs.snackbar.open("Sorry, something happened!", 4500, 'error');
              })
          }
          this.loading = false
          if (this.req_status == true) {
            this.success = "Added Successfully!"
            this.$refs.snackbar.open("Added Successfully!", 4500, 'info');
            this.$router.push('/en/dashboard/branches');
            return;
          }
        }
        this.error = "Fill all fields"
        this.loading = false
        this.$refs.snackbar.open("Fill all fields!", 4500, 'error');
      },
    },
  }
</script>

<style lang="scss" scoped>
  .en-merchantBranches {
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

    &-options {
      &-add {
        color: green;
        cursor: pointer;
      }

      &-remove {
        color: red;
        cursor: pointer;
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
    border: 1px solid #ccc;
    display: inline-block;
    padding: 6px 12px;
    width: 100%;
    text-align: center;
    border: 1px solid rgb(45, 105, 233);
    border-radius: 10px;
    cursor: pointer;
    font-size: 18px;
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

  .en-merchantBranches-main {
    direction: ltr;
  }
</style>
