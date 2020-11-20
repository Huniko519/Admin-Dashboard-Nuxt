<template>
  <v-card elevation="10" class="pa-4 mb-10">
    <v-container>
      <v-form ref="form" v-model="valid" @submit.prevent="createPromo()">
        <v-text-field outlined v-model="promo.code" label="Code"></v-text-field>

        <v-checkbox label="Percentage(%)" @change="changePercentage()" v-model="is_percentage"></v-checkbox>

        <v-text-field
          v-if="is_percentage"
          outlined
          v-model="promo.percentage"
          label="Percentage"
          suffix="%"
        ></v-text-field>
        <v-text-field v-else outlined v-model="promo.value" label="Value"></v-text-field>

        <v-text-field outlined v-model="promo.type" label="Type"></v-text-field>

        <v-menu v-model="menuExpirationDate">
          <template v-slot:activator=" { on } ">
            <v-text-field
              outlined
              label="Expiration Date"
              readonly
              v-model="promo.expirationDate"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker no-title scrollable v-model="promo.expirationDate"></v-date-picker>
        </v-menu>

        <v-checkbox
          label="Requires Minimum Order on Cart"
          @change="changeMinOrder()"
          v-model="requiresMinOrder"
        ></v-checkbox>
        <v-text-field
          v-if="requiresMinOrder"
          v-model="promo.totalPayments"
          label="Minimum Order on Cart"
          outlined
        ></v-text-field>

        <v-checkbox
          @change="changeSpecificProduct()"
          label="This Promo Code is only for specific products"
          v-model="forSpecificProduct"
        ></v-checkbox>
        <v-autocomplete
          @change="changeSpecificProduct()"
          outlined
          label="Choose Products"
          v-model="promo.category"
          v-if="forSpecificProduct"
          :items="specificProductsList"
          item-value="id"
          item-text="name"
        ></v-autocomplete>

        <v-textarea
          v-model="promo.description"
          auto-grow
          label="Description"
          rows="3"
          outlined
          shaped
        ></v-textarea>
        <v-alert v-if="success" type="success">Promo Code created successfully</v-alert>
        <v-btn large @click="createPromo()" rounded color="primary" :loading="loading">
          Submit
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      promo: {
        expirationDate: null,
        type: "normal"
      },
      menuExpirationDate: false,
      loading: false,
      valid: true,
      requiresMinOrder: false,
      forSpecificProduct: false,
      specificProductsList: [],
      success: false,
      is_percentage: false
    };
  },
  mounted() {
    var config = {
      headers: {
        authorization: localStorage.getItem("token")
      }
    };
    this.$axios
      .get("categories/", config)
      .then(res => {
        var categories = res.data.data;
        categories.forEach(e => {
          this.specificProductsList.push({ id: e._id, name: e.description });
        });
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    createPromo() {
      this.loading = true;
      var config = {
        headers: {
          authorization: localStorage.getItem("token")
        }
      };
      this.$axios
        .post("pormotions", this.promo, config)
        .then(res => {
          this.$refs.form.reset();
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 3000);
        })
        .catch(err => {
          console.log("ERR CREATING PROMO CODE");
          console.log(err);
        });
      this.loading = false;
    },

    changeMinOrder() {
      if (this.requiresMinOrder == false) {
        delete this.promo["totalPayments"];
      }
    },
    changeSpecificProduct() {
      if (
        this.forSpecificProduct == false ||
        this.promo.specificProducts == 0
      ) {
        delete this.promo["specificProducts"];
      }
    },
    changePercentage() {
      if (this.is_percentage) {
        delete this.promo.value;
      } else {
        delete this.promo.percentage;
      }
    }
  }
};
</script>

<style>
</style>