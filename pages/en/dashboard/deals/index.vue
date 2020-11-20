<template>
  <v-container class="mt-10 mt-md-1">
    <v-row>
      <deals  :items="deals" @updated="forceRerender" />
      <v-btn v-if="deals.length >= dealsLimit" color="red" class="mx-auto mt-3" @click="seeMore()" dark outlined>See More</v-btn>
    </v-row>
  </v-container>
</template>

<script>
  import deals from "~/components/en/Dashboard/deals.vue"

  export default {
    components: {
      deals,
    },
    head() {
      return {
        titleTemplate: '%s - Deals',
      }
    },
    props: {
      mainSide: {
        type: String,
        default: null,
      },
    },
    data () {
      return {
        merchantsKey: 0,
        deals: [],
        dealsLimit: 50,
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
      // https://api.yalladealz.com/api/deals/?skip=20&limit=20  :: skip will skip ?? deals and limit displays limited deals
      this.$axios.get(`/deals/?limit=${this.dealsLimit}` , config).then((res) => {
        this.deals  = res.data.deals;
      });
    },

    methods: {
      forceRerender () {
        this.merchantsKey += 1
      },

      seeMore(){
        this.dealsLimit+= 50;
      },

      // showLess(){
      //   this.dealsLimit-= 50;
      // }
    },

    watch: {
      dealsLimit() {
        let config = {
          headers: {
            authorization: localStorage.getItem("token"),
            "Content-Type": `application/json`,
          },
        }
        this.$axios.get(`/deals/?limit=${this.dealsLimit}` , config).then((res) => {
          this.deals  = res.data.deals;
        });
      }
    }
  }
</script>

<style scoped>
  .control-btns {
    margin: 10px;
  }
</style>
