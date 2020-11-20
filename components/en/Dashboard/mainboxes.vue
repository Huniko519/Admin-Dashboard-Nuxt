<template>
  <div class="en-mainboxes">
    <div class="en-mainboxes-box">
      <box
        to="/en/dashboard/categories"
        title="Categories Section"
        icon-class="fas fa-puzzle-piece"
      />
    </div>
    <div class="en-mainboxes-box">
      <box
        to="/en/dashboard/merchants"
        title="Merchants Section"
        icon-class="fas fa-file-invoice"
      />
    </div>
    <div class="en-mainboxes-box">
      <box
        to="/en/dashboard/deals"
        title="Deals Section"
        icon-class="fas fa-check-circle"
      />
    </div>
  </div>
</template>

<script>
import box from "~/components/en/General/box.vue"

export default {
  name: "Mainboxes",
  components: {
    box,
  },
}
</script>
<style lang="scss" scoped>
.en-mainboxes {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 15%;
}
@media (max-width: 992px) {
  .en-mainboxes {
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    align-items: center;
    margin-top: 5%;
  }
}
</style>
