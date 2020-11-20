<template>
  <div class="en-dashCategories">

    <v-row  class="mr-5 ml-1">
      <v-data-table :headers="headers" :items="items" :search="search" :loading="loading" :dense="dense" sort-by="name" class="elevation-1 w-100">
        <!-- top -->
        <template v-slot:top>
          <v-toolbar class="mb-5" flat color="white">
            <v-toolbar-title>Merchants</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-switch v-model="dense" class="d-md-none-down pa-2 mt-5 mr-md-2"></v-switch>
            <span>Dense</span>
            <v-spacer></v-spacer>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-text-field v-model="search" class="mr-5" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
            <v-btn color="primary" @click="$router.push('/en/dashboard/merchants/create')" dark outlined>+ New Merchant</v-btn>
          </v-toolbar>
        </template>

        <template v-slot:item.image="{ item }">
          <img :src="item.image" :alt="item.icon" width="40px">
        </template>
        <template v-slot:item.imageCode="{ item }">
          <img v-if="item.imageCode" :src="item.imageCode" :alt="item.name" width="40px" @click="downloadQr($event, item.name)" style="cursor:pointer">
        </template>

        <!-- contact by column -->
        <template v-slot:item.contact="{ item }">
          <v-btn color="info" @click="showContactPerson(item)">Show</v-btn>
        </template>

        <!-- actions column -->
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" class="mr-2" @click="$router.push('/en/dashboard/merchants/'+item._id)">mdi-pencil</v-icon>
          <v-icon color="red" @click="deleteMerch(item)">mdi-delete</v-icon>
        </template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
    </v-row>

    <v-dialog v-model="editDialog">
      <editForm :cat="activeMerchant"/>
    </v-dialog>

    <!-- person contact -->
    <v-dialog v-model="contactPersonDialog" width="600px">
      <v-card>
        <div class="en-dashCategories">
          <div class="en-dashCategories-content text-center">
            <table class="en-dashCategories-content-table">
              <tr class="en-dashCategories-content-table-tr">
                <th class="en-dashCategories-content-table-th">
                  Name
                </th>
                <th class="en-dashCategories-content-table-th">
                  Phone
                </th>
                <th class="en-dashCategories-content-table-th">
                  Email
                </th>
                <th class="en-dashCategories-content-table-th">
                  Job Title
                </th>
                <th class="en-dashCategories-content-table-th">
                  PayOutBy
                </th>
              </tr>
              <tr>
                <td>{{ contactPerson.name }}</td>
                <td>{{ contactPerson.phone }}</td>
                <td>{{ contactPerson.email }}</td>
                <td>{{ contactPerson.jobTitle }}</td>
                <td>{{ contactPerson.payOutBy }}</td>
              </tr>
            </table>
            <v-btn color="red" class="mt-5" dark rounded @click="contactPersonDialog = false">Close</v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Merchants",

  props: {
    items: {type: Array, default: () => []}
  },

  data() {
    return {
      editDialog: false,
      // branchesDialog: false,
      contactPerson: {},
      branches: {},
      contactPersonDialog: false,
      activeMerchant: {},
      headers: [
        { text: 'Logo', value: 'image', align: 'center', class: 'title', sortable: false},
        { text: 'Name', value: 'name', align: 'start', class: 'title mb-5'},
        { text: 'Phone', value: 'phone', class: 'title', class: 'title'},
        { text: 'Email', value: 'email', align: 'center', class: 'title'},
        { text: 'QR', value: 'imageCode', align: 'center', class: 'title'},
        { text: 'Account Type', value: 'accountType', align: 'center', class: 'title'},
        { text: 'Person Contact', value: 'contact', align: 'center', class: 'title', sortable: false},
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
    deleteMerch(merchant) {
      const index = this.items.indexOf(merchant);
      if (confirm('DO you realy want to delete this?')) {
        const config = {
          headers: {
            authorization: localStorage.getItem("token"),
          }
        }
        this.$axios.delete("/merchants/" + merchant._id, config).then((data) => {
          this.$emit("deleted")
          this.items.splice(index, 1)
        })
      }
    },

    downloadQr(e, name = 'download') {
      const qr = e.target.src;

      const downloadLink = document.createElement("a");
      const fileName = `${name}.png`;
      downloadLink.href = qr;
      downloadLink.download = fileName;
      downloadLink.click();
    },

    showContactPerson(merchant) {
      this.contactPerson = merchant.contactPerson;
      this.contactPersonDialog = true;
    },

    showBranches(merchant) {
      this.branches = merchant.branches;
      this.branchesDialog = true;
    },

    initialize () {
      this.loading = true;
      this.items;
      setTimeout(() => {this.loading = false}, 1000);
    }
  }
}
</script>

<style lang="scss" scoped>
  .en-dashCategories {
    width: 100%;

    &-content {
      margin-top: 15px;
      width: 100%;
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
