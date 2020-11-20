<template>
  <v-container fluid>
    <v-row>
      <v-col sm="12" md="6" lg="3">
        <v-card
          class="m-auto text-center mt-4 pa-5"
          color="#58595B"
          dark
          max-width="800"
        >
          <div style="padding:10px" class="d-flex flex-no-wrap justify-space-between">
            <v-card elevation="6" color="green" style="top:-40px;margin-bottom:-30px">
              <v-icon class="ma-3" style="font-size:60px;">
                mdi-currency-usd-circle
              </v-icon>
            </v-card>
          </div>
        </v-card>

        <h4>Revenue</h4>
        <v-card-subtitle style="font-size:30px;margin:auto;">
          $3,452
        </v-card-subtitle>
      </v-col>
      <v-col
        sm="12"
        md="6"
        lg="3"
      >
        <v-card
          class="m-auto text-center mt-4 pa-5"
          color="#58595B"
          dark
          max-width="800"
        >
          <div style="padding:10px" class="d-flex flex-no-wrap justify-space-between">
            <v-card elevation="6" color="#FFAD32" style="top:-40px;margin-bottom:-30px">
              <v-icon class="ma-3" style="font-size:60px;">
                mdi-database
              </v-icon>
            </v-card>
            <h5>Used space</h5>
          </div>
          <v-card-subtitle style="font-size:30px;margin:auto;">
            49/50 GB
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col
        sm="12"
        md="6"
        lg="3"
      >
        <v-card
          class="m-auto text-center mt-4 pa-5"
          color="#58595B"
          dark
          max-width="800"
        >
          <div style="padding:10px" class="d-flex flex-no-wrap justify-space-between">
            <v-card elevation="6" color="red" style="top:-40px;margin-bottom:-30px">
              <v-icon class="ma-3" style="font-size:60px;">
                mdi-help-circle-outline
              </v-icon>
            </v-card>
          </div>
        </v-card>
        <h5>Fixed issues</h5>
        <v-card-subtitle style="font-size:45px;margin:auto;">
          75
        </v-card-subtitle>
      </v-col>
      <v-col
        sm="12"
        md="6"
        lg="3"
      >
        <v-card
          class="m-auto text-center mt-4 pa-5"
          color="#58595B"
          dark
          max-width="800"
        >
          <div style="padding:10px" class="d-flex flex-no-wrap justify-space-between">
            <v-card elevation="6" color="#00DFC8" style="top:-40px;margin-bottom:-30px">
              <v-icon class="ma-3" style="font-size:60px;">
                mdi-twitter
              </v-icon>
            </v-card>
            <h4>Followers</h4>
          </div>
          <v-card-subtitle style="font-size:45px;margin:auto;">
            +245
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col sm="12" md="6" lg="4">
        <v-card
          class="mx-auto text-center mt-10"
          color="#58595B"
          dark
          max-width="800"
          cols="6"
        >
          <v-card-text>
            <v-card elevation="6" color="#64E408" style="top:-50px;margin-bottom:-40px">
              <v-sparkline
                :value="salesValue"
                color="rgba(255, 255, 255, .7)"
                height="100"
                padding="24"
                stroke-linecap="round"
                smooth
              >
                <template v-slot:label="item">
                  ${{ item.value }}
                </template>
              </v-sparkline>
            </v-card>
          </v-card-text>

          <v-card-text>
            <div class="display-1 font-weight-thin">
              Top Sales
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions class="justify-center">
            <v-btn block text>
              Go to Report
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col sm="12" md="6" lg="4">
        <v-card
          class="mx-auto text-center mt-10"
          color="#58595B"
          dark
          max-width="800"
        >
          <v-card-text>
            <v-card elevation="6" color="#0070A5" style="top:-50px;margin-bottom:-40px">
              <v-sparkline
                :value="dealsValue"
                color="rgba(255, 255, 255, .7)"
                height="100"
                padding="24"
                stroke-linecap="round"
                smooth
              >
                <template v-slot:label="item">
                  {{ item.value }}
                </template>
              </v-sparkline>
            </v-card>
          </v-card-text>
          <v-card-text>
            <div class="display-1 font-weight-thin">
              Top Deals
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions class="justify-center">
            <v-btn block text>
              Go to Report
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col sm="12" md="12" lg="4">
        <v-card
          class="mx-auto text-center mt-10"
          color="#58595B"
          dark
          max-width="800"
          cols="6"
        >
          <v-card-text>
            <v-card elevation="6" color="#FE2F57" style="top:-50px;margin-bottom:-40px">
              <v-sparkline
                :value="usersValue"
                color="rgba(255, 255, 255, .7)"
                height="100"
                padding="24"
                stroke-linecap="round"
                smooth
              >
                <template v-slot:label="item">
                  {{ item.value }}
                </template>
              </v-sparkline>
            </v-card>
          </v-card-text>

          <v-card-text>
            <div class="display-1 font-weight-thin">
              Top Users
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions class="justify-center">
            <v-btn block text>
              Go to Report
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col sm="12" md="6" lg="6">
        <v-card
          class="mx-auto text-center"
          color="grey lighten-1"
          dark
          cols="4"
        >
          <v-card-text id="app">
            <v-card color="#58595B" elevation="8">
              <vc-donut background="#58595B" v-bind="trafficProps">
                <strong>Traffic source</strong>
              </vc-donut>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col sm="12" md="6" lg="6">
        <v-card
          class="mx-auto text-center"
          color="grey lighten-1"
          dark
          cols="4"
        >
          <v-card-text id="app">
            <v-card color="#58595B" elevation="8">
              <vc-donut background="#58595B" v-bind="categoryProps">
                <strong>Top Categories</strong>
              </vc-donut>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VueAnalytics from "vue-analytics" // Doc:https://github.com/MatteoGabriele/vue-analytics
import Donut from "vue-css-donut-chart" // npm install vue-css-donut-chart
import "vue-css-donut-chart/dist/vcdonut.css" // Doc:https://vuejsexamples.com/lightweight-vue-component-for-drawing-pure-css-donut-charts/
import Vue from "vue"
Vue.use(Donut)

Vue.use(VueAnalytics, {
  id: "UA-126900785-1",
})

export default {
  name: "Homepage",
  data: () => ({
    salesValue: [1000, 3000, 3241, 6231, 2031, 6500, 7123],
    dealsValue: [423, 446, 675, 510, 590, 610, 760],
    usersValue: [300, 446, 820, 1500, 2031, 3002, 3700],
    trafficProps: {
      size: 250,
      sections: [
        { label: "Referral", value: 12, },
        { label: "Organic search", value: 32, },
        { label: "Social", value: 25, },
        { label: "Direct", value: 11, },
        { label: "Email", value: 9, },
        { label: "Display", value: 11, }
      ],
      thickness: 20,
      hasLegend: true,
    },
    categoryProps: {
      size: 250,
      sections: [
        { label: "Reading", value: 8, },
        { label: "Food", value: 21, },
        { label: "Social", value: 31, },
        { label: "Sports", value: 11, },
        { label: "Natural", value: 12, },
        { label: "Drawing", value: 17, }
      ],
      thickness: 20,
      hasLegend: true,
    },
  }),
  mounted () {
    this.$ga.page("/categories")
  },
}
</script>
