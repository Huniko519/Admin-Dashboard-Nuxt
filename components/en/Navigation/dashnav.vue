<template>
  <nav>
    <!-- desctop nav bar -->
    <v-toolbar class="hidden-sm-and-down" dense>
      <v-toolbar-title>
        <img width="170px" class="h-100" src="~/assets/images/logo.png">
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items v-for="(items, i) in navItems" :key="i" color="red" class="mr-lg-5 mr-1">
        <!-- if there are sub menu -->
        <v-menu v-if="items.subMenu" :close-on-content-click="false" open-on-hover bottom offset-y>
          <template v-slot:activator="{ on }">
            <v-btn x-small color="red" dark v-on="on">
              <v-icon left v-text="items.icon"></v-icon>
              <span>{{ items.title }}</span>
            </v-btn>
          </template>
          <!-- sub menu -->
          <v-list v-for="(subItem, i) in items.subMenu" :key="i" dense>
            <v-list-group v-if="subItem.subsubMenu" sub-group>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title v-text="subItem.subTitle"></v-list-item-title>
                </v-list-item-content>
              </template>
              <!-- sub sub menu -->
              <v-list-item v-for="(subsubItem, i) in subItem.subsubMenu" :key="i" :to="subsubItem.subsubLink" router exact class="text-decoration-none">
                <v-icon v-if="subsubItem.subsubIcon">{{ subsubItem.subsubIcon }}</v-icon>
                <v-list-item-title v-text="subsubItem.subsubTitle"></v-list-item-title>
              </v-list-item>
            </v-list-group>

            <!-- else without sub menu -->
            <v-list-item v-else :to="subItem.subLink" router excat class="text-decoration-none">
              <v-icon v-if="subItem.subIcon" left>{{ subItem.subIcon }}</v-icon>
              <v-list-item-title v-text="subItem.subTitle"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- else -->
        <v-btn x-small v-else color="red">
          <nuxt-link :to="items.link" class="text-decoration-none white--text">
            <v-icon left v-text="items.icon"></v-icon>
            <span v-text="items.title"></span>
          </nuxt-link>
        </v-btn>
      </v-toolbar-items>

      <!-- log out btn -->
      <v-toolbar-items class="mr-3">
        <v-btn x-small color="red" dark @click="logout()">
          <v-icon left small>mdi-logout</v-icon>
          <span>log out</span>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>


    <!-- --------------------------------------------------------------- -->


    <!-- mobile nav bar header -->
    <v-app-bar class="hidden-md-and-up" :clipped-left="clipped" app dense>
      <!-- side nav btn && img -->
      <v-app-bar-nav-icon @click="drawer=!drawer"/>
      <img width="170px" src="~/assets/images/logo.png">
    </v-app-bar>

    <!-- mobile nav content -->
    <v-navigation-drawer disable-resize-watcher v-model="drawer" app>
      <!-- close btn -->
      <template v-slot:prepend>
        <v-list-item @click="drawer=false" dark class="red">
          <v-list-item-title>Close</v-list-item-title>
          <v-list-item-icon>
            <!-- <v-icon >mdi-close</v-icon> -->
            <v-icon>mdi-close-outline</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </template>
      <!-- if nav contains sub menu -->
      <v-list v-for="(item, i) in navItems" :key="i" nav class="py-1" dense>
        <!-- sub menu -->
        <v-list-group v-if="item.subMenu" :prepend-icon="item.icon">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item v-for="(subItem, i) in item.subMenu" :key="i" link exact>
            <v-list-group v-if="subItem.subsubMenu" :prepend-icon="subItem.subIcon" sub-group>
              <!-- sub sub menu -->
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title v-text="subItem.subTitle"></v-list-item-title>
                </v-list-item-content>
              </template>
              <!-- sub sub menu list -->
              <v-list-item v-for="(subsubItem, i) in subItem.subsubMenu" :key="i" :to="subsubItem.subsubLink" router exact class="text-decoration-none">
                <v-icon v-if="subsubItem.subsubIcon" left>{{ subsubItem.subsubIcon }}</v-icon>
                <v-list-item-title v-text="subsubItem.subsubTitle"></v-list-item-title>
              </v-list-item>
            </v-list-group>
            <!-- else sub menu only -->
            <v-list-item v-else :to="subItem.subLink" router exact class="text-decoration-none">
              <v-icon v-if="subItem.subIcon" left>{{ subItem.subIcon }}</v-icon>
              <v-list-item-title v-text="subItem.subTitle"></v-list-item-title>
            </v-list-item>
          </v-list-item>
        </v-list-group>
        <!-- else nav item only -->
        <v-list-item v-else :to="item.link" router exact class="text-decoration-none">
          <v-icon v-if="item.icon" left>{{ item.icon }}</v-icon>
          <v-list-item-title v-text="item.title" class="ml-5"></v-list-item-title>
        </v-list-item>
      </v-list>
      <!-- log out btn -->
      <v-list nav dense>
        <v-list-item to="/" class="text-decoration-none red" dark @click="logout()" router exact>
          <v-list-item-icon>
            <v-icon left>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="ml-5">Log Out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import Vue from "vue"
import VueCookie from "vue-cookie"

Vue.use(VueCookie)

export default {
  name: "Dashnav",

  data () {
    return {
      drawer: false,
      clipped: true,
      navItems: [
        {
          icon: 'mdi-home-outline',
          title: 'Home',
          link: '/en/dashboard'
        },
        {
          icon: 'mdi-account-group-outline',
          title: 'Users',
          link: '/en/dashboard/users',
          subMenu: [
            {subTitle: 'Add New User', subLink: '/en/dashboard/users'},
            {subTitle: 'User List', subLink: '/en/dashboard/users'},
            {subTitle: 'Disabled User', subLink: '/en/dashboard/users'}
          ]
        },
        {
          icon: 'mdi-card-text-outline',
          title: 'Category',
          link: '/en/dashboard/categories',
          subMenu: [
            {subTitle: 'Add Category', subLink: '/en/dashboard/categories/add'},
            {subTitle: 'Category List', subLink: '/en/dashboard/categories'},
            {subTitle: 'Sub Categories', subLink: '/en/dashboard/categories'}
          ]
        },
        {
          icon: 'mdi-store-outline',
          title: 'Merchant',
          link: '/en/dashboard/merchants',
          subMenu: [
            {subTitle: 'Add Merchants', subLink: '/en/dashboard/merchants/create'},
            {subTitle: 'Merchant List', subLink: '/en/dashboard/merchants'},
            {subTitle: 'Add Branch', subLink: '/en/dashboard/branches/create'},
            {subTitle: 'Branch List', subLink: '/en/dashboard/branches'}
          ]
        },
        {
          icon: 'mdi-handshake-outline',
          title: 'Deals',
          link: '/en/dashboard/deals',
          subMenu: [
            {subTitle: 'Add Deal', subLink: '/en/dashboard/deals/create'},
            {subTitle: 'Deal List', subLink: '/en/dashboard/deals/'},
            {subTitle: 'Upcoming Deals', subLink: '/en/dashboard/deals/upcomming'},
            {subTitle: 'Deactive / Expired Deals', subLink: '/en/dashboard/deals/expired'}
          ]
        },
        {
          icon: 'mdi-bell-outline',
          title: 'Push',
          link: '/en/dashboard/push'
        },
        {
          icon: 'mdi-format-list-bulleted',
          title: 'Oder Lists',
          link: '/en/dashboard/orders'
        },
        {
          icon: 'mdi-cog-outline',
          title: 'Setting',
          link: '/setting',
          subMenu: [
            // {subTitle: 'Web Title', subLink: '/en/dashboard/homeTitle'},
            {subTitle: 'Web Settings', subLink: '/en/dashboard/websettings'},
            {subTitle: 'Static Pages', subLink: '/setting'},
            {subTitle: 'Google Analytics', subLink: '/setting'},
            {subTitle: 'System Users', subLink: '/setting',
              subsubMenu: [
                {subsubTitle: 'Create Admin User',subsubLink: '/en/dashboard/admins'},
                {subsubTitle: 'Create User',subsubLink: '/en/dashboard/createUser'},
                {subsubTitle: 'System User List', subsubLink: '/setting'},
                {subsubTitle: 'Promo Code', subsubLink: '/setting'},
                {subsubTitle: 'Create Promotion code', subsubLink: '/en/dashboard/promotions'},
                {subsubTitle: 'Promo Code List', subsubLink: '/setting'},
                {subsubTitle: 'Promo Codes Expired', subsubLink: '/setting'}
              ]
            }
          ]
        }
      ],
      thisUserName: ""
    }
  },

  methods: {
    logout () {
      console.log("clicked")
      this.$store.dispatch("logout")
      this.$router.push("/")
    }
  }
}
</script>

<style scoped></style>
