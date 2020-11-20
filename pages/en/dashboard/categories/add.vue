<template>
  <caregoryForm :select-items="categories" @updated="forceRerender" />
</template>

<script>
import caregoryForm from "~/components/en/Forms/categoryForm.vue"

export default {
  layout: "adminlayout",

  components: {
    caregoryForm
  },

  data (){
    return {
      categories: [],
      flatCategories: []
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

    flattenCategoriesRecursively (items){ items.forEach((cat) => {this.flatCategories.push(cat)}) }
  }
}
</script>

<style></style>