<template>
  <div class="en-promotions">
    <div class="en-promotions-content">
      <h2>Create Promotion Code</h2>
      <promoForm/>
    </div>
  </div>
</template>

<script>
import promoForm from "~/components/en/Forms/promoForm.vue"
export default {
  layout: "adminlayout",
  components: {
    promoForm,
  },
}
</script>

<style lang="scss" scoped>
.en-promotions {
  display: flex;
  justify-content: center;
  &-content {
    margin-top: 10%;
    width: 90%;
  }
}
</style>
