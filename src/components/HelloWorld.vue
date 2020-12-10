<template>
  <div class="container">
    <h1>Value Stream Comparative Analysis</h1>
    <div id="div-budget">
      <b-input-group prepend="Budget ($)" append="million" class="mt-3">
        <b-form-input v-model="budget"> {{ this.budget }}</b-form-input>
      </b-input-group>
      <budget-slider title="Outcome 1" :budget=parseInt(this.budget) :vs=0.1 :hs=1 />
      <budget-slider title="Outcome 2" :budget=parseInt(this.budget) :vs=0.1 :hs=1 />
      <budget-slider title="Outcome 3" :budget=parseInt(this.budget) :vs=0.01 :hs=2 />
    </div>
  </div>
</template>

<script>

import BudgetSlider from './BudgetSlider.vue'

export default {
  name: "HelloWorld",
  components: {
    BudgetSlider
  },
  props: {
    msg: String,
  },
  methods: {
  },
  data () {
      return {
        budget: 100,
      }
    },
};
</script>

<style scoped>
h1 {
  margin-top: 15px;
  margin-bottom: 20px;
}
</style>
