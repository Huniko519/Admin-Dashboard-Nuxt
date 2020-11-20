<template>
  <div class="en-sidenavitem">
    <div class="en-sidenavitem-content" @click="toggleDropped">
      <div class="en-sidenavitem-content-icon">
        <i :class="iconClass" />
      </div>
      <div class="en-sidenavitem-content-labelwitharrow">
        <div class="en-sidenavitem-content-labelwitharrow-label">
          {{ dropLabel }}
        </div>
        <div class="en-sidenavitem-content-labelwitharrow-arrow">
          <i :class="isDropped ? 'fas fa-angle-up' : 'fas fa-angle-down'" />
        </div>
      </div>
    </div>
    <div v-if="isDropped" class="en-sidenavitem-dropdown">
      <div class="en-sidenavitem-dropdown-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideNavItem",
  props: {
    dropLabel: {
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
.en-sidenavitem {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  &-content {
    width: 85%;
    background-color: #dc1f29;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 50px;
    color: #ffffff;
    border-radius: 8px;
    &-icon {
      font-size: 20px;
      width: 10%;
    }
    &-labelwitharrow {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      width: 75%;
    }
  }
  &-dropdown {
    width: 85%;
    margin-top: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    &-contnet {
    }
  }
}
</style>
