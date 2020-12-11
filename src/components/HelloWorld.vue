<template>
  <div class="container">
    <h1>Value Stream Comparative Analysis</h1>
    <div id="div-budget">
      <b-input-group prepend="Budget ($)" append="million" class="mt-3">
        <b-form-input v-model="budget"> {{ this.budget }}</b-form-input>
      </b-input-group>
      <budget-slider
        v-for="(item, index) in this.outcomes"
        v-bind:key="index"
        :title="item.title"
        :budget="parseInt(budget)"
        :vs="item.verticalScaleValue"
        :hs="item.horizontalScaleValue"
        :index="index"
        @computed-outcome="computedOutcome"
      />
    </div>
  </div>
</template>

<script>
import BudgetSlider from "./BudgetSlider.vue";

export default {
  name: "HelloWorld",
  components: {
    BudgetSlider,
  },
  props: {
    msg: String,
  },
  methods: {
    computedOutcome(retObj) {
      this.outcomes[retObj.index].computedOutcome = retObj.computedOutcome
    },
  },
  data() {
    return {
      outcomes: [
        {
          title: "Outcome 1",
          computedOutcome: null,
          verticalScaleValue: 0.05,
          horizontalScaleValue: 1,
        },
        {
          title: "Outcome 2",
          computedOutcome: null,
          verticalScaleValue: 0.1,
          horizontalScaleValue: 1,
        },
        {
          title: "Outcome 3",
          computedOutcome: null,
          verticalScaleValue: 0.01,
          horizontalScaleValue: 1,
        },
      ],
      budget: 100,
    };
  },
};
</script>

<style scoped>
h1 {
  margin-top: 15px;
  margin-bottom: 20px;
}
</style>
