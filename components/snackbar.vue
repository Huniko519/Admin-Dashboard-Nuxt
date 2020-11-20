<template>
  <v-snackbar :color="options.snackbarColor" :timeout='timeout' v-model="show" class="pa-0">
    <p class="mb-0" :class="options.textColor" v-show="!!message">{{message}}</p>
    <v-btn small text fab @click="show = false" :class="options.textColor"><v-icon>mdi-close</v-icon></v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    show: false,
    message: null,
    timeout: 3500,
    options: {
      snackbarColor: 'black',
      textColor: 'white--text'
    }
  }),
  methods: {
    open(message, timeout, type) {
      this.options = this.checkTypeColor(type)
      this.show = true
      this.message = message
      this.timeout = timeout
    },
    checkTypeColor(type) {
      if (type == 'error') {
        return {
          snackbarColor: 'red',
          textColor: 'white--text'
        };
      } else if (type == 'warning') {
        return {
          snackbarColor: 'yellow',
          textColor: 'black--text'
        };
      } else if (type == 'info') {
        return {
          snackbarColor: 'blue',
          textColor: 'white--text'
        };
      } else if (type == 'success') {
        return {
          snackbarColor: 'green',
          textColor: 'white--text'
        };
      } else {
        return {
          snackbarColor: 'black',
          textColor: 'white--text'
        };
      }
    }
  }
}
</script>