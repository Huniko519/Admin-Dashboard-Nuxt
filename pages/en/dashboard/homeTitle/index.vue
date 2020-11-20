<template>
  <home-title v-if="webSetting" :settings="webSetting" />
</template>

<script>
import HomeTitle from "~/components/en/Forms/homeTitle.vue"
export default {
  name: "Index",
  layout: "adminlayout",
  components: {
    HomeTitle,
  },
  asyncData ({ $axios, }) {
    return $axios.$get("/webSetting", {
      headers: { authorization: "yalla eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTQ4MjliYjE1MmFjYTA3YTRlNjUwYjUiLCJyb2xlIjoidXNlciIsImlhdCI6MTU4NDc0MTAxNywiZXhwIjoxNTg1NjA1MDE3fQ.JaEMQ3qMdY8kUNh-TfLQOIL8YOFMbYOvgyZFSjC46iE", },
    }).then((res) => {
      return {
        webSetting: res,
      }
    })
  },
}
</script>

<style scoped></style>
