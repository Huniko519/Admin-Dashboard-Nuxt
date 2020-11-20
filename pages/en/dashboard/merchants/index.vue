<template>
  <merchants :items="merchants" @updated="forceRerender" />
</template>

<script>
import merchants from "~/components/en/Dashboard/merchants.vue"

export default {
  layout: "adminlayout",

  components: { merchants },

  props: { mainSide: { type: String, default: null } },

  head() { return { titleTemplate: '%s - Merchants'} },

  data () {
    return {
      merchantsKey: 0,
      merchants: [],
      flatMerchants: [],
    }
  },

  mounted() {
    let config = {
      headers: {
        authorization: localStorage.getItem("token"),
        "Content-Type": `application/json`,
      },
    }
    this.$axios.get("/merchants" , config).then((res) => {
      this.merchants  = res.data.merchants
    })
  },

  methods: {
    forceRerender () {
      this.merchantsKey += 1
    }
  }
}
</script>

<style scoped></style>
