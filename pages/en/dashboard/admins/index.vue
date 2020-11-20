<template>
  <div class="en-admins">
    <div class="en-admins-content">
      <h2>Create User Admin</h2>
      <adminForm />
    </div>
  </div>
</template>

<script>
import adminForm from "~/components/en/Forms/adminForm.vue"
export default {
  layout: "adminlayout",
  components: {
    adminForm,
  },
}
</script>

<style lang="scss" scoped>
.en-admins {
  display: flex;
  justify-content: center;
  &-content {
    margin-top: 10%;
    width: 90%;
  }
}
</style>
