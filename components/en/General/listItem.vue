<template>
  <div class="en-listItem">
    <div class="en-listItem-item">
      <nuxt-link v-if="!isLink" class="en-listItem-item-link" :to="to">
        {{ itemLabel }}
      </nuxt-link>
      <a v-if="isLink" class="en-listItem-item-link" @click="$emit('click')">{{
        itemLabel
      }}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListItem",
  props: {
    to: {
      type: String,
      default: null,
    },
    itemLabel: {
      type: String,
      default: null,
    },
    isLink: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.en-listItem {
  text-align: center;
  margin-bottom: 8px;
  cursor: pointer;
  &-item {
    &-link {
      color: #8f94ab;
      font-size: 16px;
      &:hover {
        color: #3c405a;
      }
    }
  }
}
a {
  text-decoration: none;
}
a.nuxt-link-active {
  color: #5271ff;
}
</style>
