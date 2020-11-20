<template>
  <div class="en-inputWithIcon">
    <div class="en-inputWithIcon-content">
      <div class="en-inputWithIcon-content-inputArea">
        <div class="en-inputWithIcon-content-inputArea-icon">
          <i :class="iconClass" />
        </div>
        <div class="en-input-withIcon-content-inputArea-inputDiv">
          <input
            class="en-inputWithIcon-content-inputArea-inputDiv-input"
            :placeholder="placeholder"
            :value="value"
            v-bind="$attrs"
            @input="$emit('input', $event.target.value)"
          >
        </div>
      </div>
      <div class="en-inputWithIcon-content-error">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputWithIcon",
  props: {
    placeholder: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
    iconClass: {
      type: String,
      default: null,
    },
  },
}
</script>
<style lang="scss" scoped>
.en-inputWithIcon {
  &-content {
    &-inputArea {
      display: flex;
      flex-flow: row;
      align-items: center;
      width: 100%;
      border-bottom: 2px solid #5271ff;
      &-inputDiv {
        width: 80%;
        &-input {
          width: 300px;
          border: 0px;
          color: #5271ff;
          font-size: 18px;
          background-color: transparent;
          font-size: 20px;
          &:focus {
            outline: none;
            background-color: transparent;
          }
          &::placeholder {
            color: #989899;
            background-color: transparent;
          }
        }
      }

      &-icon {
        width: 20%;
        color: #5271ff;
        font-size: 20px;
      }
    }
    &-error {
      color: red;
    }
  }
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  box-shadow: 0 0 0 1000px #fafafa inset !important;
  -webkit-box-shadow: 0 0 0 1000px #fafafa inset !important;
}
</style>
