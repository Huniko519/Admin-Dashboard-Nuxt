<template>
  <v-container class="mt-5">
    <v-row>
      <v-col cols="12" sm="6">
        <v-card class="mx-auto text-center" color="red" dark max-width="600">
          <v-row>
            <v-col>
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)">
                  <v-sparkline :value="value" color="rgba(255, 255, 255, .7)" height="100" padding="24" stroke-linecap="round" smooth>
                    <template v-slot:label="item">${{ item.value }}</template>
                  </v-sparkline>
                </v-sheet>
              </v-card-text>
            </v-col>
          </v-row>

          <v-card-text>
            <div class="display-1 font-weight-thin">Total Sales</div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="justify-center">
            <v-btn block text>Go to Report</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card class="mx-auto text-center" color="green" dark max-width="600">
          <v-row>
            <v-col>
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)">
                  <v-sparkline :value="value" color="rgba(255, 255, 255, .7)" height="100" padding="24" stroke-linecap="round" smooth>
                    <template v-slot:label="item">${{ item.value }}</template>
                  </v-sparkline>
                </v-sheet>
              </v-card-text>
            </v-col>
          </v-row>

          <v-card-text>
            <div class="display-1 font-weight-thin"> Sold Coupons</div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="justify-center">
            <v-btn block text>Go to Report</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6"></v-col>

      <v-col cols="12" sm="6">
        <v-card class="mx-auto text-center" color="blue" dark max-width="600">
          <v-row>
            <v-col>
              <v-card-text>
                <v-sheet color="rgba(0, 0, 0, .12)">
                  <v-sparkline :value="value" color="rgba(255, 255, 255, .7)" height="100" padding="24" stroke-linecap="round" smooth>
                    <template v-slot:label="item">${{ item.value }}</template>
                  </v-sparkline>
                </v-sheet>
              </v-card-text>
            </v-col>
          </v-row>

          <v-card-text>
            <div class="display-1 font-weight-thin">New Users</div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="justify-center">
            <v-btn block text>Go to Report</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const gradients = [
  ['#222'],
  ['#42b3f4'],
  ['red', 'orange', 'yellow'],
  ['purple', 'violet'],
  ['#00c6ff', '#F0F', '#FF0'],
  ['#f72047', '#ffd200', '#1feaea'],
]

export default {
  layout: "adminlayout",

  middleware: ["check-auth", "auth"],

  head() {
    return {
      titleTemplate: '%s - Home',
    }
  },

  data (){
    return {
      fill: false,
      gradient: gradients[4],
      gradients,
      padding: 8,
      radius: 10,
      value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
      width: 3.5
    }
  }
}
</script>

<style scoped></style>
