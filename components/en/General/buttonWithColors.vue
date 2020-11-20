<template>
  <div class="div-button">
    <button
      v-if="!preventClick && !preventNoEvent"
      :class="btnColor"
      class="en-buttonWithColors-button redButton"
      @click="$emit('click')">
      {{ btnLabel }}
    </button>
    <button
      v-if="preventClick"
      :class="btnColor"
      class="en-buttonWithColors-button redButton"
      @click.prevent="$emit('click', event)">
      {{ btnLabel }}
    </button>
    <button
      v-if="preventNoEvent"
      :class="btnColor"
      class="en-buttonWithColors-button redButton"
      @click.prevent="$emit('click')">
      {{ btnLabel }}
    </button>
  </div>
</template>

<script>
export default {
  name: "ButtonWithColors",
  props: {
    btnLabel: {
      type: String,
      default: null,
    },
    btnColor: {
      type: String,
      default: null,
    },
    preventClick: {
      default: false,
      type: Boolean,
    },
    preventNoEvent: {
      default: false,
      type: Boolean,
    },
  },
}
</script>

<style lang="scss">
.en-buttonWithColors-button {
  border: 0px;
}
.PrupleBtn {
  background-color: #5271ff;
  border-radius: 3px;
  width: 100%;
  color: white;
  height: 35px;
  padding: 5px 15px;

  &:hover {
    background-color: #6682ff;
  }
  &:focus {
    outline: none;
  }
}

.RedBtn {
  background-color: #dc1f29;
  border-radius: 3px;
  color: white;
  height: 35px;
  padding: 22px 35px;
  line-height: 0px;
  &:hover {
    background-color: rgb(173, 10, 18);
  }
  &:focus {
    outline: none;
  }
}
</style>
