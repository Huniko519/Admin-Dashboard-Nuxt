<template>
  <v-container class="mt-10 mt-md-1">
    <v-data-table :headers="headers" :items="items" :search="search" :loading="loading" :dense="dense" sort-by="name" class="elevation-1" >
      <template v-slot:top>
        <v-toolbar class="mb-5" flat color="white">
          <v-toolbar-title>Categories</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-switch v-model="dense" class="d-md-none-down pa-2 mt-5 mr-md-2"></v-switch>
          <span>Dense</span>
          <v-spacer></v-spacer>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field v-model="search" class="mr-5" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:item.icon="{ item }">
        <img :src="item.icon" :alt="item.icon" width="30px">
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon color="primary" class="mr-2" @click="editCat(item)">mdi-pencil</v-icon>
        <v-icon color="red" @click="deleteCat(item)">mdi-delete</v-icon>
      </template>

      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="editDialog">
      <editForm :cat="activeCat" :select-items="items"/>
    </v-dialog>
  </v-container>
</template>

<script>
import editForm from "~/components/en/Forms/editCategoryForm"
export default {
  name: "Categories",

  components: {
    editForm
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },

    treeviewItems: {
      type: Array,
      default: () => [],
    },
  },

  data () {
    return {
      headers: [
        { text: 'Icon', value: 'icon', align: 'start', class: 'title', sortable: false},
        { text: 'Name', value: 'name', class: 'title'},
        { text: 'Category', value: 'parent.name', class: 'title'},
        { text: 'Description', value: 'description', class: 'title', sortable: false},
        { text: 'Tags', value: 'tags', class: 'title', sortable: false},
        { text: 'Actions', value: 'actions', align: 'center', class: 'title', sortable: false}
      ],
      search: '',
      loading: false,
      dialog: false,
      dense: false,
      editedIndex: -1,
      editDialog: false,
      activeCat: {}
    }
  },

  created () {
    this.initialize()
  },

  computed: {
    updatedImg() {
      return this.editedItem.icon;
    }
  },

  methods: {
    initialize () {
      this.loading = true;
      this.items;
      setTimeout(() => {this.loading = false}, 1000);
    },

    deleteCat (cat) {
      const index = this.items.indexOf(cat);
      if (confirm('Do you really want to delete this?')) {
        const config = {
          headers: {
            authorization: localStorage.getItem("token"),
          },
          data: {
            name: cat.name,
            description: cat.description,
            tags: cat.tags,
          },
        }
        this.$axios.delete("/categories/" + cat._id, config).then((data) => {
          this.$emit("deleted")
          this.items.splice(index, 1)
        })
      }
    },

    editCat(cat) {
      this.editDialog = true;
      this.activeCat = cat;
      console.log(this.activeCat);
    },
  }
}
</script>

<style scoped></style>
