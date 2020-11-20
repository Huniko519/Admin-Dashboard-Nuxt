<template>
  <div class="en-users">
    <div class="en-users-content">
      <websetting/>
    </div>
  </div>
</template>
<script>
import websetting from '~/components/en/Forms/websettings'
export default {
  head() {
    return {
      titleTemplate: "%s - Users"
    };
  },
  layout: "adminlayout",
  components : {
    websetting
  },
};
</script>

<style lang="scss" scoped>
.en-users {
  margin-top: 7%;
  display: flex;
  flex-flow: row;
  margin-bottom: 30px;
  &-content {
    display: flex;
    flex-flow: row;
    justify-content: space-around;
    width: 100%;
    padding: 30px;
    &-form {
      width: 25%;
      &-label {
        &-title {
          color: #dc1f29;
        }
      }
      &-form {
        display: flex;
        flex-flow: row;
        justify-content: flex-start;
      }
    }
    &-table {
      width: 70%;
    }
  }
}
@media (max-width: 768px) {
  .en-mainboxes {
    margin-top: 5%;
  }
  .en-users {
    justify-content: center;
    &-content {
      flex-flow: column;
      &-table {
        display: none;
      }
      &-form {
        width: 100%;
        &-form {
          justify-content: center;
        }
      }
    }
  }
}
@media (max-width: 1600px) {
  .en-users {
    margin-top: 7%;
    display: flex;
    flex-flow: row;
    margin-bottom: 30px;
    &-content {
      display: flex;
      flex-flow: column-reverse;
      justify-content: space-around;
      width: 100%;
      padding: 30px;
      &-form {
        width: 100%;
        margin-top: 30px;
        text-align: center;
        &-label {
          &-title {
            color: #dc1f29;
          }
        }
        &-form {
          display: flex;
          flex-flow: row;
          justify-content: center;
        }
      }
      &-table {
        width: 100%;
      }
    }
  }
}
</style>
