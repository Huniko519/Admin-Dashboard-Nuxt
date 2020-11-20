<template>
  <div class="en-user">
    <div class="en-user-content">
      <h2>Create User</h2>
      <userForm />
    </div>
  </div>
</template>

<script>
import userForm from "~/components/en/Forms/userForm.vue"
export default {
  layout: "adminlayout",
  components: {
    userForm,
  },
}
</script>

<style lang="scss" scoped>
.en-user {
  display: flex;
  justify-content: center;
  &-content {
    margin-top: 10%;
    width: 90%;
  }
}
</style>
