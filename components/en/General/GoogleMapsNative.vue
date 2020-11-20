<template>
  <v-card width="800" :loading="mapLoading">
    <GmapMap
      ref="map"
      :center="{ lat: lat, lng: lng, }"
      :zoom="7"
      map-type-id="terrain"
      style="height: 300px;"
    >
      <GmapMarker
        :position="{ lat: lat, lng: lng }"
        :clickable="true"
        :draggable="true"
        @drag="updateCoordinates"
      />
    </GmapMap>
  </v-card>
</template>

<script>
  export default {
    name: "GoogleMapsNative",
    props: {
      lat: {
        type: Number,
        default: 30,
      },
      lng: {
        type: Number,
        default: 31.241699218750007,
      },
      mapLoading: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        coordinates: null,
      }
    },
    methods: {
      updateCoordinates(location) {
        this.coordinates = {
          lat: location.latLng.lat(),
          lng: location.latLng.lng(),
        }
        console.log(this.coordinates)
      },
    },
  }
</script>
<style>
  .maps-suggestions {
    position: absolute;
    top: 50px;
    left: 0;
    background-color: white !important;
    z-index: 99;
    border: 1px solid #cacaca;
    border-top: 0;
    border-radius: 0 !important;
    box-shadow: 0px 1px 2px #919191;
    width: 100% !important;
  }

  .map-suggest {
    text-align: center;
    font-size: 17px !important;
    cursor: pointer;
    color: black;
    border-bottom: 1px solid #bababa;
    padding: 8px 0;
  }

  .map-suggest:hover {
    background-color: #ebebeb;
  }

  .en-singleBranch-main-right,
  .en-singleBranch-main-left {
    position: relative !important;
  }

  .en-merchantForms-content-FourthSection {
    width: 100%;
  }
</style>
