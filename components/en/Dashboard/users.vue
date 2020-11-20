<template>
<v-container fluid>
  <v-alert
      v-if="showAlert"
      prominent
      rounded=""
      :type="alertType"
      dismissible
    >
      <v-row align="center">
        <v-col class="grow">{{alertContent}}</v-col>
        
      </v-row>
    </v-alert>
    <v-data-table :headers="headers" :items="filteredUsers"   :items-per-page="50"  :options.sync="options" :server-items-length="totalUsers.length" :loading="loading" :dense="dense" sort-by="firstName" class="elevation-5" :footer-props="{
      itemsPerPageOptions : [50, -1]
    }">
    <!-- top -->
    <template v-slot:top>
      
      <v-toolbar class="mb-5" flat color="white">
        <v-toolbar-title>Users</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-switch v-model="dense" class="d-md-none-down pa-2 mt-5 mr-md-2"></v-switch>
        <span>Dense</span>
        <v-spacer></v-spacer>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field v-model="search" class="mr-5" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <v-dialog v-model="dialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on" outlined>+ New User</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.firstName" label="First Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.lastName" label="Last name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.password" label="Password"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.phone" label="Phone"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.email" :rules="emailRules" label="Email" required autocomplete="off"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.birthDate" label="Birth Date"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.gender" label="Gender"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="addToWalletDialog" max-width="300px">
          
          <v-card>
            <v-card-title>
              <span class="headline">{{ atwFormTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="chargeAmount" label="Amount"></v-text-field>
                  </v-col>
                  
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeWalletDialog">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="saveWallet">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <!-- table header control -->
    <!-- <template slot="headers" slot-scope="props">
      <tr>
        <th v-for="header in props.headers" :key="header.text">
          {{ header.text }}
        </th>
      </tr>
    </template> -->

    <!-- looged by column -->
    <template v-slot:item.loggedIcon="{ item }">
      <v-icon v-if="item.googleId" color="#dd4b39">mdi-google</v-icon>
      <v-icon v-if="item.facebookId" color="#3b5998">mdi-facebook</v-icon>
      <v-icon v-if="item.appleId" color="#000">mdi-apple</v-icon>
    </template>

    <!-- actions column -->
    <template v-slot:item.actions="{ item }">
      <v-icon color="green" class="mr-2" @click="addToWallet(item)">mdi-wallet-plus</v-icon>
      <v-icon color="primary" class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon color="red" @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
    

    <template v-slot:no-data>
      
      <v-btn color="primary" @click="getData">Reset</v-btn>
    </template>
  </v-data-table>
</v-container>
  
</template>

<script>
export default {
  name: "Users",

  data () {
    return {
      users: [],
      totalUsers : [],
      options: {},
      headers: [
        { text: 'First Name', value: 'firstName', align: 'start', sortable: true, class: 'title'},
        { text: 'Last name', value: 'lastName', class: 'title'},
        { text: 'Logged By', value: 'loggedIcon', align: 'center', class: 'title', sortable: false},
        { text: 'Phone', value: 'phone', class: 'title'},
        { text: 'Email', value: 'email', class: 'title'},
        { text: 'Birth Date', value: 'birthDate', class: 'title', sortable: false},
        { text: 'Gender', value: 'gender', align: 'center', class: 'title', sortable: false},
        { text: 'Actions', value: 'actions', align: 'center', class: 'title', sortable: false}
      ],
      search: '',
      loading: false,
      dialog: false,
      addToWalletDialog: false,
      dense: false,
      editedIndex: -1,
      editedItem: {
        firstName: '',
        lastName: '',
        password: '',
        phone: 0,
        email: '',
        birthDate: 0,
        gender: '',
      },
      defaultItem: {
        firstName: '',
        lastName: '',
        password: '',
        phone: 0,
        email: '',
        birthDate: 0,
        gender: '',
      },
      selectedUser: undefined,
      chargeAmount: 0,
      showAlert: false,
      alertType: 'success',
      alertContent: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ]
    }
  },

  created () {
    this.getData()
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Add New User' : 'Edit User'
    },
    atwFormTitle () {
      return 'Add To Wallet'
    },
    filteredUsers() {
      const pattern = this.search.toLowerCase();
      if (!this.search) return this.users;
      return this.totalUsers.filter(user => {
        return this.headers.some(header => user[header.value] && user[header.value].includes(pattern))
        
      })
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    addToWalletDialog(val) {
      val || this.close();
    },
    options: {
      handler() {
        this.getData();
      },
      deep: true
    }
  },

  methods: {
    customFilter(pattern) {
      console.log('hiiiiii')
    },
    async getData () {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      const nextSlice = this.totalUsers.slice((page - 1) * itemsPerPage, itemsPerPage * page);
      if (page) {
        if (( nextSlice.length < itemsPerPage || this.totalUsers.length === 0) ) {
          console.log(this.totalUsers.length);
          this.loading = true;
          const config = {authorization: localStorage.getItem("token")}
          
          try {
            const res = await this.$axios.$get(`/user/getUsers?limit=${page === 1 ? 51 : 50}&skip=${this.totalUsers.length}`,{headers: config})
            this.totalUsers =  [...this.totalUsers, ...res.users]
              console.log(this.totalUsers);
              this.users = this.totalUsers.slice(((page - 1) * itemsPerPage), itemsPerPage * page);
              console.log(this.users);
          } catch(err) {
            console.log(err);
          }
          this.loading = false;
      } else {
        this.users = nextSlice;
      }
      }
      
    },

    editItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    addToWallet(item) {
      this.selectedUser = Object.assign({}, item)
      this.addToWalletDialog = true;
    },

    deleteItem (item) {
      const index = this.users.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.users.splice(index, 1)
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeWalletDialog() {
      this.addToWalletDialog = false;
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem)
      } else {
        this.users.push(this.editedItem)
      }
      this.close()
    },

    async saveWallet() {
      const amount = this.chargeAmount;
      if (amount > 0) {
        this.loading = true;
        const config = {authorization: localStorage.getItem("token")}
        try {
          console.log(this.selectedUser);
          const res = await this.$axios.$put(`/webSetting/user/wallet/${this.selectedUser._id}`,{amount},{headers: config});
          this.closeWalletDialog();
          this.alertContent = 'User wallet charged successfully';
        } catch(err) {
          this.alertType = 'error';
          this.alertContent = 'Something goes wrong, Please try agin';
          console.log(err);
        }
        this.showAlert = true;
        this.loading = false;
        
          
      }
      
    },

    customFilter(v){}
  }
}
</script>

<style scoped></style>
