<template>
  <div class="mb-4">
    <v-text-field :id="mapInputUniqId" placeholder="Search for a place"></v-text-field>
    <div :id="mapUniqId" class="map-container"></div>
  </div>
</template>

<script>
export default {
  props: {
    location: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      firstLoad: true,
      mapUniqId: "",
      mapInputUniqId: "",
      mapData: {
        place: null,
        placeLocation: "",
      },
      mapElement: null,
      markers: [],
      mapInput: null,
      searchInput: null,
    };
  },
  created() {
    this.mapUniqId = this.generateId();
    this.mapInputUniqId = this.generateId();
  },
  mounted() {
    this.initAutocomplete();
    console.log("The code is updated (map-search-place) v3");
  },
  methods: {
    generateId() {
      return "xxxx-xxxx-yxxx-yxxx-xxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    initAutocomplete() {
      console.log("EL", document.getElementById(this.mapUniqId));
      this.mapElement = new google.maps.Map(
        document.getElementById(this.mapUniqId),
        {
          // set your default location here
          center: { lat: 30.04, lng: 31.23 },
          zoom: 15,
          mapTypeId: "roadmap",
          disableDefaultUI: true,
        }
      );

      // Create the search box and link it to the UI element.
      this.searchInput = document.getElementById(this.mapInputUniqId);
      if (!this.searchInput) {
        return;
      }
      const searchBox = new google.maps.places.SearchBox(this.searchInput);

      // Bias the SearchBox results towards current map's viewport.
      this.mapElement.addListener("bounds_changed", () => {
        searchBox.setBounds(this.mapElement.getBounds());
      });

      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      if (this.mapData.place) {
        this.setMarker([this.mapData.place]);
        this.searchInput.value = this.mapData.place.formatted_address || "";
      }
      searchBox.addListener("places_changed", () => {
        console.log("AN", searchBox.getPlaces());
        var places = searchBox.getPlaces();
        this.setMarker(places);
      });
    },
    setMarker(places) {
      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      this.markers.forEach(function (marker) {
        marker.setMap(null);
      });
      this.markers = [];

      // For each place, get the name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        // Create a marker for each place.
        this.markers.push(
          new google.maps.Marker({
            map: this.mapElement,
            title: place.formatted_address,
            position: place.geometry.location,
          })
        );
        this.mapData.place = {
          geometry: place.geometry,
          formatted_address: place.formatted_address,
        };
        const location = JSON.parse(JSON.stringify(place.geometry.location));
        location.lat = location.lat + "";
        location.long = location.lng + "";
        delete location.lng;
        const data = {
          address: place.name,
          location,
        };
        console.log("Emit selected new place", data);
        this.$emit("onSelectedNewPlace", data);
        this.mapData.placeLocation = JSON.parse(
          JSON.stringify(this.mapData.place)
        ).geometry.location;

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.mapElement.fitBounds(bounds);
    },
    getLocationFromLatLng() {
      const geocoder = new google.maps.Geocoder();
      const infowindow = new google.maps.InfoWindow();
      const latlng = {
        lat: +this.location.lat,
        lng: +this.location.long,
      };
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK") {
          this.firstLoad = false;
          if (results[0]) {
            this.mapElement.setZoom(11);
            const marker = new google.maps.Marker({
              position: latlng,
              map: this.mapElement,
            });
            this.searchInput.value = results[0].formatted_address;
            infowindow.setContent(results[0].formatted_address);
            infowindow.open(this.mapElement, marker);
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      });
    },
  },
  watch: {
    location() {
      if (this.location && this.location.lat && this.firstLoad) this.getLocationFromLatLng();
    },
  },
};
</script>

<style scoped>
.map-container {
  min-height: 360px;
  height: 100%;
}

#description {
  font-family: Roboto;
  font-size: 15px;
  font-weight: 300;
}

#infowindow-content .title {
  font-weight: bold;
}

#infowindow-content {
  display: none;
}

#map #infowindow-content {
  display: inline;
}

.pac-card {
  margin: 10px 10px 0 0;
  border-radius: 2px 0 0 2px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  outline: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  background-color: #fff;
  font-family: Roboto;
}

#pac-container {
  padding-bottom: 12px;
  margin-right: 12px;
}

.pac-controls {
  display: inline-block;
  padding: 5px 11px;
}

.pac-controls label {
  font-family: Roboto;
  font-size: 13px;
  font-weight: 300;
}

#pac-input {
  background-color: #fff;
  font-size: 15px;
  font-weight: 300;
  margin-left: 12px;
  text-overflow: ellipsis;
  width: 400px;
}

#pac-input:focus {
  border: none !important;
}

#title {
  color: #fff;
  background-color: #4d90fe;
  font-size: 25px;
  font-weight: 500;
  padding: 6px 12px;
}
#target {
  width: 345px;
}
</style>
