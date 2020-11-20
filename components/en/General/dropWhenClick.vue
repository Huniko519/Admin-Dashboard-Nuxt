<template>
  <div class="en-dropWhenClick">
    <div class="en-dropWhenClick-content" @click="toggleDropped">
      <div class="en-dropWhenClick-content-toClickOn">
        <div class="en-dropWhenClick-content-toClickOn-string">
          {{ dropLabel }}
        </div>
        <div v-if="!noArrow" class="en-dropWhenClick-toClickOn-content-arrow">
          <i :class="isDropped ? 'fas fa-angle-up' : 'fas fa-angle-down'" />
        </div>
      </div>
      <div
        v-if="isDropped"
        class="en-dropWhenClick-content-toShowOn"
        :style="marginSet"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "DropWhenClick",
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
  },
  data () {
    return {
      marginStyle: "",
      isDropped: false,
    }
  },
  mounted () {
    // Register an event listener when the Vue component is ready
    window.addEventListener("resize", this.onResize)
  },

  beforeDestroy () {
    // Unregister the event listener before destroying this Vue instance
    window.removeEventListener("resize", this.onResize)
  },
  methods: {
    toggleDropped () {
      this.isDropped = !this.isDropped
    },
    onResize (event) {
      this.isDropped = false
    },
  },
}
</script>
<style lang="scss" scoped>
.en-dropWhenClick {
  z-index: 1000;
  &-content {
    &-toClickOn {
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
    }
    &-toShowOn {
      position: fixed;
      display: flex;
      flex-flow: column;
      justify-content: space-evenly;
      align-items: center;
      margin-top: 15px;
      width: 200px;
      box-shadow: 0 5px 25px rgba(0, 0, 0, 0.281);
      background-color: white;
      border-radius: 5px;
      color: #5271ff;
    }
  }
}
</style>
