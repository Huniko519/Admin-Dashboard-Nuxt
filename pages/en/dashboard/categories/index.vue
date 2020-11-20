<template>
  <v-container class="mt-10 mt-md-1">
    <categories-list :key="categoriesKey" :items="categories" :treeview-items="categories"/>
  </v-container>
</template>

<script>
import categories from "~/components/en/Dashboard/categories.vue"

export default {
  layout: "adminlayout",

  components: {
    categoriesList: categories,
  },

  data () {
    return {
      categoriesKey: 0,
      categories: [],
      flatCategories: [],
    }
  },

  mounted () {
    this.$axios.get("/categories/front").then((res) => {
      const { data } = res.data
      this.categories = data
      this.flattenCategoriesRecursively(data)
    })
  },

  methods: {
    forceRerender () {
      this.categoriesKey += 1
    },

    flattenCategoriesRecursively (items) {
      items.forEach((cat) => {
        this.flatCategories.push(cat)
        // if (cat.root.length) { this.flattenCategoriesRecursively(cat.root) }
      })
    }
  }
}
</script>

<style scoped></style>
