import Vue from "vue"
import Vuetify from "vuetify"
import { mount, createLocalVue } from "@vue/test-utils"
import arinputWithIcon2 from "@/components/ar/general/arinputWithIcon2.vue"

describe("arinputWithIcon2", () => {
  // global
  let wrapper
  const localVue = createLocalVue()
  Vue.use(Vuetify) // for shallowMount use
  const vuetify = new Vuetify()

  beforeEach(() => {
    // using mount with subtree components
    wrapper = mount(arinputWithIcon2, {
      localVue,
      vuetify,
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })
  // tests here
  test("should be load input & text area", () => {
    const input = wrapper.find("input")

    expect(input.exists()).toBe(true)
    expect(input.classes()).toContain("ar-inputWithIcon2-content-inputArea-inputDiv-input")
  })
})
