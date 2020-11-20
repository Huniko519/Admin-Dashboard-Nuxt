import Vue from "vue"
import Vuetify from "vuetify"
import { mount, createLocalVue } from "@vue/test-utils"
import categories from "@/components/en/Dashboard/categories.vue"

describe("categories", () => {
  // global
  let wrapper
  const localVue = createLocalVue()
  Vue.use(Vuetify) // for shallowMount use
  const vuetify = new Vuetify()

  beforeEach(() => {
    // using mount with subtree components
    wrapper = mount(categories, {
      localVue,
      vuetify,
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })
  // tests here
  test("should be load tree", () => {
    const tree = wrapper.find(".v-treeview")

    expect(tree.exists()).toBe(true)
  })
})
