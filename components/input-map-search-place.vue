<template>
  <v-text-field id="search-map-input" placeholder="Type your store's name or address" outlined></v-text-field>
</template>

<script>
export default {
  data() {
    return {
      mapInputAutocomplete: null,
    };
  },

  mounted() {
    this.initAutocomplete();
    console.log("The code is updated (input-map-search-place)");
  },
  methods: {
    initAutocomplete() {
      // Create the search box and link it to the UI element.
      const searchInput = document.querySelector("#search-map-input");
      if (!searchInput) {
        return;
      }
      this.mapInputAutocomplete = new google.maps.places.SearchBox(searchInput);

      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      this.mapInputAutocomplete.addListener("places_changed", () => {
        const place = this.mapInputAutocomplete.getPlaces()[0];
        if ((place.geometry || {}).location) {
          const location = JSON.parse(JSON.stringify(place.geometry.location));
          const data = {
            address: place.formatted_address,
            location
          }
          console.log("Emit selected new place", data);
          this.$emit("onSelectedNewPlace", data);
        } else {
          searchInput.placeholder = "Enter a place";
        }
      });
    },
  },
};
</script>