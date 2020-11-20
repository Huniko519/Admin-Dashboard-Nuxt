<template>
  <v-container class="mt-10 mt-md-1">
    <branches :items="branches" @updated="forceRerender" />
  </v-container>
</template>

<script>
  import branches from "~/components/en/Dashboard/branches.vue"

  export default {
    components: {
      branches,
    },
    props: {
      mainSide: {
        type: String,
        default: null,
      },
    },
    head() {
      return {
        titleTemplate: '%s - Merchants',
      }
    },
    data () {
      return {
        merchantsKey: 0,
        branches: [],
        flatMerchants: [],
      }
    },
    layout: "adminlayout",
    mounted() {
      let config = {
        headers: {
          authorization: localStorage.getItem("token"),
          "Content-Type": `application/json`,
        },
      }
      this.$axios.get("/merchants/branches" ,  config).then((res) => {
        this.branches  = res.data.merchants
      })
    },
    methods: {
      forceRerender () {
        this.merchantsKey += 1
      },
    }
  }
</script>

<style scoped></style>
