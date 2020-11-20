import Vue from "vue"
import Vuelidate from "vuelidate"
import VuetifyGoogleAutocomplete from "~/node_modules/vuetify-google-autocomplete/lib"
import * as VueGoogleMaps from "~/node_modules/vue2-google-maps/dist/main.js"

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBBb0pba3vw7x1JXTM_umY012djw0mMpSM",
    libraries: "places",
  },
  installComponents: true,
})

Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: "AIzaSyBBb0pba3vw7x1JXTM_umY012djw0mMpSM",
})
