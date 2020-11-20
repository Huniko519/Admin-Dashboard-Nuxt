<template>
  <div class="en-dropWhenHover">
    <div class="en-dropWhenHover-content">
      <div class="en-dropWhenHover-content-toHoverOn">
        <div v-if="!noArrow" class="en-dropWhenHover-toHoverOn-content-arrow">
          <i class="fa-lg" style="margin-top: 6px;" :class="iconClass" />
        </div>
        <div class="en-dropWhenHover-content-toHoverOn-string">
          {{ dropLabel }}
        </div>
      </div>
      <div class="en-dropWhenHover-content-toShowOn" :style="marginSet">
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "DropWhenHover",
  props: {
    noArrow: {
      type: Boolean,
      default: false,
    },
    dropLabel: {
      type: String,
      default: null,
    },
    marginSet: {
      type: String,
      default: null,
    },
    iconClass: {
      type: String,
      default: null,
    },
  },
  data () {
    return {
      marginStyle: "",
    }
  },
}
</script>
<style lang="scss" scoped>
.en-dropWhenHover {
  &-content {
    &-toHoverOn {
      width: auto;
      display: flex;
      flex-flow: row;
      align-items: center;
      cursor: pointer;
      &-string {
        width: 80%;
        text-align: center;
      }
      &-arrow {
        width: 20%;
        display: flex;
        flex-flow: row;
        justify-content: space-around;
        align-items: center;
      }
      &:hover + .en-dropWhenHover-content-toShowOn {
        display: flex;
      }
    }
    &-toShowOn {
      display: none;
      position: fixed;
      flex-flow: column;
      justify-content: space-evenly;
      align-items: center;
      margin-top: 1px;
      width: 200px;
      box-shadow: 0 5px 25px rgba(0, 0, 0, 0.281);
      background-color: white;
      border-radius: 5px;
      color: #5271ff;
      &:hover {
        display: flex;
      }
    }
  }
}
</style>
