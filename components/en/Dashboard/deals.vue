<template>
  <div class="en-dashCategories">
    <!-- deals table -->
    <v-row  class="mr-5 ml-1">
      <v-data-table :headers="headers" :items="items" :search="search" :loading="loading" sort-by="name" class="elevation-1 w-100">
        <!-- top -->
        <template v-slot:top>
          <v-toolbar class="mb-5" flat color="white">
            <v-toolbar-title>Deals</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" class="mr-5" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
            <v-spacer></v-spacer>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-btn color="primary" @click="$router.push('/en/dashboard/deals/create')" dark outlined>+ New Deal</v-btn>
          </v-toolbar>
        </template>

        <template v-slot:item.image="{ item }">
          <img :src="item.images[0] ? item.images[0] : null" :alt="item.icon" width="70px">
        </template>

        <!-- details column -->
        <template v-slot:item.details="{ item }">
          <v-btn color="red" class="mt-1" outlined dark block @click="showDetails(item)">Details</v-btn>
          <!-- <v-btn color="red" class="my-1" outlined dark block @click="showVoucher(item)">Voucher</v-btn> -->
          <!-- <v-btn color="red" class="mb-1" outlined dark block @click="showMerchant(item)">Merchant</v-btn> -->
        </template>

        <!-- actions column -->
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" class="mr-2" @click="$router.push('/en/dashboard/deals/'+item._id)">mdi-pencil</v-icon>
          <v-icon color="red" @click="deleteDeal(item)">mdi-delete</v-icon>
        </template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reload</v-btn>
        </template>
      </v-data-table>
    </v-row>

    <v-dialog v-model="detailsDialog">
      <v-card>
        <v-card-title>Prices</v-card-title>
        <div class="en-dashCategories">
          <div class="en-dashCategories-content">
            <table class="en-dashCategories-content-table">
              <tr class="en-dashCategories-content-table-tr">
                <th class="en-dashCategories-content-table-th">
                  Original Price
                </th>
                <th class="en-dashCategories-content-table-th">
                  Final Price
                </th>
                <th class="en-dashCategories-content-table-th">
                  description
                </th>
              </tr>
              <tr v-for="(price) in prices" :key="price.branchId"
                  class="en-dashCategories-content-table-tr">
                <td>{{ price.originalPrice }}</td>
                <td>{{ price.finalPrice }}</td>
                <td>{{ price.description }}</td>
              </tr>
            </table>
          </div>
        </div>
      </v-card>
      <v-card class="my-1">
        <v-card-title>Voucher</v-card-title>
        <div class="en-dashCategories">
          <div class="en-dashCategories-content">
            <table class="en-dashCategories-content-table">
              <tr class="en-dashCategories-content-table-tr">
                <th class="en-dashCategories-content-table-th">
                  Valid For
                </th>
                <th class="en-dashCategories-content-table-th">
                  Valid On
                </th>
                <th class="en-dashCategories-content-table-th">
                  Valid Until
                </th>
                <th class="en-dashCategories-content-table-th">
                  Allowed Quantity
                </th>
                <th class="en-dashCategories-content-table-th">
                  Maximum Quantity Allowed
                </th>
                <th class="en-dashCategories-content-table-th">
                  Minimum Quantity Allowed
                </th>
                <th class="en-dashCategories-content-table-th">
                  Minimum Age
                </th>
                <th class="en-dashCategories-content-table-th">
                  Minimum Quantity Allowed
                </th>
                <th class="en-dashCategories-content-table-th">
                  User Allowed Up to
                </th>
              </tr>
              <tr class="en-dashCategories-content-table-tr" v-if="voucher">
                <td>{{ voucher.validFor }}</td>
                <td>{{ voucher.validOn }}</td>
                <td>{{ voucher.validUntil }}</td>
                <td>{{ voucher.allowedQuantity }}</td>
                <td>{{ voucher.maximumQuantityAllowed }}</td>
                <td>{{ voucher.minimumQuantityAllowed }}</td>
                <td>{{ voucher.minimumAge }}</td>
                <td>{{ voucher.minimumQuantityAllowed }}</td>
                <td>{{ voucher.userAllowedUpto }}</td>
              </tr>
            </table>
          </div>
        </div>
      </v-card>
      <v-card>
        <v-card-title>Merchant</v-card-title>
        <div class="en-dashCategories">
          <div class="en-dashCategories-content">
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
                  Image
                </th>
                <th class="en-dashCategories-content-table-th">
                  Address
                </th>
              </tr>
              <tr v-if="merchant">
                <td>{{ merchant.name }}</td>
                <td>{{ merchant.phone }}</td>
                <td>{{ merchant.email }}</td>
                <td><img :src="merchant.image ? merchant.image : ''" width="50"></td>
                <td>{{ merchant.address }}</td>
              </tr>
            </table>
          </div>
        </div>
      </v-card>
      <v-card>
        <v-row>
          <v-col class="d-flex justify-content-center">
            <v-btn color="red" width="200" @click="detailsDialog = false" dark rounded>Close</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <!-- Prices dialog -->
    <!-- <v-dialog v-model="pricesDialog" width="700px">
      <v-card>
        <v-card-title>Prices</v-card-title>
        <div class="en-dashCategories">
          <div class="en-dashCategories-content">
            <table class="en-dashCategories-content-table">
              <tr class="en-dashCategories-content-table-tr">
                <th class="en-dashCategories-content-table-th">
                  Original Price
                </th>
                <th class="en-dashCategories-content-table-th">
                  Final Price
                </th>
                <th class="en-dashCategories-content-table-th">
                  description
                </th>
              </tr>
              <tr v-for="(price) in prices" :key="price.branchId"
                  class="en-dashCategories-content-table-tr">
                <td>{{ price.originalPrice }}</td>
                <td>{{ price.finalPrice }}</td>
                <td>{{ price.description }}</td>
              </tr>
            </table>
          </div>
        </div>
      </v-card>
    </v-dialog> -->

    <!-- Voucher dialog -->
    <!-- <v-dialog v-model="voucherDialog" width="800px">
      <v-card>
        <v-card-title>Voucher</v-card-title>
        <div class="en-dashCategories">
          <div class="en-dashCategories-content">
            <table class="en-dashCategories-content-table">
              <tr class="en-dashCategories-content-table-tr">
                <th class="en-dashCategories-content-table-th">
                  Valid For
                </th>
                <th class="en-dashCategories-content-table-th">
                  Valid On
                </th>
                <th class="en-dashCategories-content-table-th">
                  Valid Until
                </th>
                <th class="en-dashCategories-content-table-th">
                  Allowed Quantity
                </th>
                <th class="en-dashCategories-content-table-th">
                  Maximum Quantity Allowed
                </th>
                <th class="en-dashCategories-content-table-th">
                  Minimum Quantity Allowed
                </th>
                <th class="en-dashCategories-content-table-th">
                  Minimum Age
                </th>
                <th class="en-dashCategories-content-table-th">
                  Minimum Quantity Allowed
                </th>
                <th class="en-dashCategories-content-table-th">
                  User Allowed Up to
                </th>
              </tr>
              <tr class="en-dashCategories-content-table-tr" v-if="voucher">
                <td>{{ voucher.validFor }}</td>
                <td>{{ voucher.validOn }}</td>
                <td>{{ voucher.validUntil }}</td>
                <td>{{ voucher.allowedQuantity }}</td>
                <td>{{ voucher.maximumQuantityAllowed }}</td>
                <td>{{ voucher.minimumQuantityAllowed }}</td>
                <td>{{ voucher.minimumAge }}</td>
                <td>{{ voucher.minimumQuantityAllowed }}</td>
                <td>{{ voucher.userAllowedUpto }}</td>
              </tr>
            </table>
          </div>
        </div>
      </v-card>
    </v-dialog> -->

    <!-- Merchant dialog -->
    <!-- <v-dialog v-model="merchantDialog" width="700px">
      <v-card>
        <v-card-title>Merchant</v-card-title>
        <div class="en-dashCategories">
          <div class="en-dashCategories-content">
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
                  Image
                </th>
                <th class="en-dashCategories-content-table-th">
                  Address
                </th>
              </tr>
              <tr v-if="merchant">
                <td>{{ merchant.name }}</td>
                <td>{{ merchant.phone }}</td>
                <td>{{ merchant.email }}</td>
                <td><img :src="merchant.image ? merchant.image : ''" width="50"></td>
                <td>{{ merchant.address }}</td>
              </tr>
            </table>
          </div>
        </div>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<script>
  import editForm from "../Forms/editCategoryForm"

  export default {
    name: "deals",

    components: {editForm},

    props: { items: {type: Array,default: () => []} },

    data() {
      return {
        // merchantDialog: false,
        // voucherDialog: false,
        // pricesDialog: false,
        detailsDialog: false,
        merchant: {},
        branch: {},
        voucher: {},
        prices: {},
        search: '',
        loading: false,
        headers: [
          { text: 'Name', value: 'name', align: 'start', class: 'title'},
          { text: 'Deal Start Date', value: 'dealStartDate', class: 'title'},
          { text: 'Deal End Date', value: 'dealEndDate', align: 'center', class: 'title'},
          { text: 'Deal Type', value: 'dealType', class: 'title', sortable: false},
          { text: 'Rate', value: 'rate', align: 'center', class: 'title'},
          { text: 'Total Users Rated', align: 'center', value: 'totalUsersRated', class: 'title', sortable: false},
          { text: 'Image', value: 'image', align: 'center', class: 'title', sortable: false},
          { text: 'Show', value: 'details', align: 'center', class: 'title', sortable: false},
          { text: 'Actions', value: 'actions', align: 'center', class: 'title', sortable: false}
        ]
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      deleteDeal(deal) {
        const index = this.items.indexOf(deal);
        if (confirm('DO you realy want to delete this?')) {
          const config = {
            headers: {
              authorization: localStorage.getItem("token"),
            }
          }
          console.log("clicked", deal)
          this.$axios.delete("/deals/" + deal._id, config).then((data) => {
            this.$emit("deleted")
            this.items.splice(index, 1)
          })
        }
      },

      showDetails(deal){
        this.prices = deal.prices;
        this.voucher = deal.voucher;
        this.merchant = deal.merchant;
        this.detailsDialog = true;
      },

      // showPrices(deal) {
      //   this.prices = deal.prices;
      //   this.pricesDialog = true;
      // },

      // showVoucher(deal) {
      //   this.voucher = deal.voucher;
      //   this.voucherDialog = true;
      // },

      // showMerchant(deal) {
      //   this.merchant = deal.merchant;
      //   this.merchantDialog = true;
      // },

      initialize () {
        this.loading = true;
        this.items;
        setTimeout(() => {this.loading = false}, 1000);
      }
    },
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
