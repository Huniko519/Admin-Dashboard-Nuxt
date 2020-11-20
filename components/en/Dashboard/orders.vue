<template>
  <div>
    <!-- <v-expansion-panels focusable hover>
      <v-expansion-panel v-for="(order, index) in orders" :key="index">
        <v-expansion-panel-header>
          <v-col class="d-none d-sm-flex">{{index+1}}. {{order._id}}</v-col>
          <v-col class="d-sm-none d-flex">{{index+1}}. {{order._id.substr(0,10)}}...</v-col>
          <v-col class="d-none d-sm-flex">{{dateFromNow(order.createdAt)}}</v-col>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          ID : {{order._id}}
          <div>
            Status : {{order.status}}
            <v-icon v-if="order.status=='pending'" color="warning">mdi-clock</v-icon>
            <v-icon v-else color="success">mdi-check</v-icon>
          </div>
          <div>Total Price : {{order.totalPrice}}</div>
          <div>Discount : {{order.discount}}</div>
          <div v-if="order.paymentMethod">Payment Methods : {{order.paymentMethod}}</div>
          <div v-if="order.type">Type : {{order.type}}</div>
          <div>Created At : ({{order.createdAt}}) {{dateFromNow(order.createdAt)}}</div>
          <div v-if="order.merchant[0]">
            Merchants :
            <div class="ml-4" v-for="(m, index) in order.merchant" :key="index">{{m}}</div>
          </div>
          <div v-if="order.user">
            User Details :
            <p class="ml-4">
              ID : {{order.user._id}}
              <br />
              Name : {{order.user.firstName + ' ' + order.user.lastName}}
              <br />
              Phone : {{order.user.phone}}
            </p>
          </div>
          <div v-if="order.deals[0]">
            Deals :
            <div class="ml-2">
              <div class="mb-5" v-for="(deal, deal_index) in order.deals" :key="deal_index">
                {{deal_index+1}}.
                <div class="ml-4">
                  Price : {{deal.price}}
                  <br />
                  Description : {{deal.description}}
                  <br />
                  Description(Arabic) : {{deal.arDescription}}
                  <br />
                  Total Price : {{deal.totalPrice}}
                  <br />
                  Quantity : {{deal.quantity}}
                  <br />
                  _ID : {{deal._id}}
                  <br />
                  Price ID : {{deal.priceId}}
                  <br />
                  Deal : {{deal.deal}}
                  <br />
                  Name : {{deal.name}}
                  <br />
                  Name(Arabic) : {{deal.arName}}
                  <br />
                  Size : {{deal.size}}
                  <br />
                  Color : {{deal.color}}
                  <br />
                  <div>
                    Merchant :
                    <p class="ml-4">
                      ID : {{deal.merchant._id}}
                      <br />
                      Location : {{deal.merchant.location.lat}}, {{deal.merchant.location.long}} (Lat, Long)
                      <br />
                      Name : {{deal.merchant.name}}
                    </p>
                  </div>
                  Date From : {{deal.dateFrom}}
                  <br />
                  Date To : {{deal.dateTo}}
                  <br />
                </div>
              </div>
              <div>We Accept ID : {{order.weAcceptId}}</div>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels> -->

    <v-data-table :headers="headers" :items="orders" :search="search" :single-expand="singleExpand" :expanded.sync="expanded" :dense="dense" show-expand item-key="createdAt" sort-by="createdAt" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Expandable Table</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" class="mr-5" append-icon="mdi-magnify" label="Search" single-line hide-details :dense="dense"></v-text-field>
          <v-switch v-model="dense" label="Dense" class="d-md-none-down pa-2 mt-5 mr-md-2"></v-switch>
          <v-switch v-model="singleExpand" label="Single expand" class="pa-2 mt-5 mr-md-2"></v-switch>
        </v-toolbar>
      </template>

      <template v-slot:expanded-item="{ item }">
        <td colspan="6">
          <v-row justify="center" class="m-1" :dense="dense">
            <v-col cols="12" v-for="(deal, index) in item.deals" :key="index">
              <p class="m-2">
                <span class="blue white--text rounded p-1 mr-2">Quantity : </span>
                <span>{{ deal.quantity }}</span>
              </p>
              <p class="m-2">
                <span class="blue white--text rounded p-1 mr-2">Price : </span>
                <span>{{ deal.price }}</span>
              </p>
              <p class="m-2">
                <span class="blue white--text rounded p-1 mr-2">Deal : </span>
                <span>{{ deal.name }}</span>
              </p>
              <p class="m-2">
                <span class="blue white--text rounded p-1 mr-2">Merchant name : </span>
                <span>{{ deal.merchant.name }}</span>
              </p>
            </v-col>
          </v-row>
        </td>
      </template>

      <template v-slot:item.orderedFrom="{ item }">
        <div>{{dateFromNow(item.createdAt)}}</div>
      </template>
    </v-data-table>

  </div>
</template>

<script>
import Moment from "moment";
export default {
  data() {
    return {
      orders: [],
      search: '',
      dense: true,
      expanded: [],
      singleExpand: true,
      headers: [
        { text: 'User Name', value: 'user.firstName', align: 'start', class: 'title'},
        { text: 'User Phone', value: 'user.phone', align: 'start', class: 'title'},
        { text: 'Status', value: 'status', class: 'title', sortable: false},
        { text: 'Order From', value: 'orderedFrom', class: 'title', sortable: false},
        { text: 'Order Time', value: 'createdAt', class: 'title'},
        { text: 'Total Price', value: 'totalPrice', class: 'title'},
        { text: 'More', value: 'data-table-expand', class: 'title', sortable: false},
      ]
    };
  },

  mounted() {
    this.getOrders();
  },

  methods: {
    dateFromNow(d) { return Moment(d).fromNow() },

    getOrders() {
      const config = { headers: { authorization: localStorage.getItem("token")} };

      this.$axios
        .get("orders/", config)
        .then(res => { this.orders.push(...res.data.orders) })
        .catch(err => { console.log(err) });
    }
  }
};
</script>

<style>
</style>