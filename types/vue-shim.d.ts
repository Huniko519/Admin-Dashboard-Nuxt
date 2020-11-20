
declare module '*.vue' {
  import VueRouter, { Route } from 'vue-router'
  import { NuxtAxiosInstance } from '@nuxtjs/axios'
  import { Validation } from 'vuelidate'
  import { Store } from 'vuex'
  interface Vue {
    $router: VueRouter
    $route: Route
    $store: Store<any>
    $axios: NuxtAxiosInstance
    $v: Validation
  }
}
