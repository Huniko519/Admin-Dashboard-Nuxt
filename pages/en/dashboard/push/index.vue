<template>
  <push/>
</template>

<script>
import push from '~/components/en/Dashboard/push'
export default {
  head() {
    return { titleTemplate: "%s - Users" };
  },

  layout: "adminlayout",

  components : {push},
}
</script>

<style scoped></style>
