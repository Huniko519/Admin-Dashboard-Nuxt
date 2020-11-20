<template>
  <div>
    <v-row  class="mr-5 ml-1">
      <v-data-table :headers="headers" :items="items" :search="search" :loading="loading" :dense="dense" sort-by="name" class="elevation-1 w-100">
        <!-- top -->
        <template v-slot:top>
          <v-toolbar class="mb-5" flat color="white">
            <v-toolbar-title>Branches</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-switch v-model="dense" class="d-md-none-down pa-2 mt-5 mr-md-2"></v-switch>
            <span>Dense</span>
            <v-spacer></v-spacer>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-text-field v-model="search" class="mr-5" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
            <v-btn color="primary" @click="$router.push('/en/dashboard/branches/create')" dark outlined>+ New Branch</v-btn>
          </v-toolbar>
        </template>

        <template v-slot:item.image="{ item }">
          <img :src="item.image" :alt="item.icon" width="40px">
        </template>

        <template v-slot:item.imageCode="{ item }">
          <img v-if="item.imageCode" :src="item.imageCode" :alt="item.name" width="40px" @click="downloadQr($event, item.name)" style="cursor:pointer">
        </template>

        <!-- actions column -->
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" class="mr-2" @click="editBranch(item)">mdi-pencil</v-icon>
          <!-- deleteBranch(item) -->
          <v-icon color="red" @click="deleteConfirmation(item)">mdi-delete</v-icon>
        </template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
    </v-row>

    <v-dialog v-model="deleteDialog" width="700">
      <v-card class="rounded-lg">
        <v-row justify="center" class="w-50 mx-auto p-3 text-center" dense>
          <v-col class="d-flex justify-content-center mt-2" cols="10">
            <p>Do you realy want to delete this?</p>
          </v-col>
          <v-col class="d-flex justify-content-between" cols="10">
            <v-btn width="100" color="red" dark rounded dense @click="delBranch()">Delete</v-btn>
            <v-btn width="100" color="blue" dark rounded dense @click="deleteDialog = false">
              <span>Cancle</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <v-dialog v-if="editDialog" v-model="editDialog" width="700">
      <editForm :branch="activeBranch" />
    </v-dialog>
  </div>
</template>

<script>
  import editForm from "../Forms/editBranchForm.vue"

  export default {
    name: "Branches",

    components: {editForm},

    props: { items: {type: Array,default: () => []} },

    data() {
      return {
        selectedBranch: null,
        editDialog: false,
        deleteDialog: false,
        activeBranch: {},
        headers: [
          { text: 'Branch Name', value: 'name', align: 'center', class: 'title mb-5'},
          { text: 'Branch Phone', value: 'phone', align: 'center', class: 'title', class: 'title'},
          { text: 'Branch Email', value: 'email', align: 'center', class: 'title'},
          { text: 'Branch Image', value: 'image', align: 'center', class: 'title', sortable: false},
          { text: 'QR', value: 'imageCode', align: 'center', class: 'title', sortable: false},
          { text: 'Actions', value: 'actions', align: 'center', class: 'title', sortable: false}
        ],
        search: '',
        loading: false,
        dense: false
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      deleteConfirmation (item){
        this.deleteDialog = true;
        this.selectedBranch = item;
      },

      deleteBranch(branch) {
        const index = this.items.indexOf(branch);
          const config = { headers: {authorization: localStorage.getItem("token")} }
          console.log("clicked", branch)
          this.$axios.delete("/merchants/branch/" + branch._id, config).then((data) => {
            this.$emit("deleted")
            this.items.splice(index, 1)
          })
      },

      delBranch() {
        let branch = this.selectedBranch;
        this.deleteBranch(branch);
        this.selectedBranch = null;
        this.deleteDialog = false;
      },

      editBranch(branch) {
        
        this.activeBranch = branch
        this.editDialog = true
      },

      initialize() {
        this.loading = true;
        this.items;
        setTimeout(() => {this.loading = false}, 1000);
      },
      
    downloadQr(e, name = 'download') {
      const qr = e.target.src;

      const downloadLink = document.createElement("a");
      const fileName = `${name}.png`;
      downloadLink.href = qr;
      downloadLink.download = fileName;
      downloadLink.click();
    },
    },
  }
</script>

<style lang="scss" scoped>
  .en-dashCategories {
    width: 100%;

    &-content {
      margin-top: 15px;
      width: 100%;
      height: 600px;
      overflow: scroll;
      box-shadow: 0 5px 25px rgba(0, 0, 0, 0.281);
      padding: 20px;
      border-radius: 20px;

      &-table {
        width: 100%;
        text-align: center;

        &-th {
          color: #dc1f29;
        }

        &-tr {
          height: 50px;

          &-options {
            color: #dc1f29;
            cursor: pointer;

            &-edit {
              color: rgb(32, 182, 32);
              margin-left: 20px;
            }
          }

          &:hover {
            background-color: #e6e3e3;
          }
        }
      }
    }
  }
</style>
