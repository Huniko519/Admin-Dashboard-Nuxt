<template>
  <div class="en-inputWithIcon2">
    <div class="en-inputWithIcon2-content">
      <div class="en-inputWithIcon2-content-inputArea">
        <div class="en-inputWithIcon2-content-inputArea-icon">
          <i :class="iconClass" />
        </div>
        <div class="en-inputWithIcon2-content-inputArea-inputDiv">
          <input
            v-if="!isTextArea"
            class="en-inputWithIcon2-content-inputArea-inputDiv-input"
            :placeholder="placeholder"
            :value="value"
            v-bind="$attrs"
            @input="$emit('input', $event.target.value)"
          >
          <textarea
            v-if="isTextArea"
            class="en-inputWithIcon2-content-inputArea-inputDiv-input"
            :placeholder="placeholder"
            :value="value"
            v-bind="$attrs"
            @input="$emit('input', $event.target.value)"
          />
        </div>
      </div>
      <div class="en-inputWithIcon2-content-error">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputWithIcon2",
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
    isTextArea: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style lang="scss" scoped>
.en-inputWithIcon2 {
  &-content {
    &-inputArea {
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      border: 1px solid rgb(45, 105, 233);
      padding: 6px;
      border-radius: 10px;
      &-inputDiv {
        width: 75%;
        &-input {
          width: 100%;
          border: 0px;
          color: rgb(45, 105, 233);
          font-size: 18px;
          background-color: transparent;
          &:focus {
            outline: none;
            background-color: transparent;
          }
          &::placeholder {
            color: rgba(34, 37, 42, 0.87);
            background-color: transparent;
          }
        }
      }

      &-icon {
        width: 15%;
        color: rgb(45, 105, 233);
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
