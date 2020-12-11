<template>
  <div class="container">
    <h1>Value Stream Comparative Analysis</h1>
    <div id="div-budget">
      <b-input-group prepend="Budget ($)" append="million" class="mt-3">
        <b-form-input v-model="budget"> {{ this.budget }}</b-form-input>
      </b-input-group>
      <b-input-group prepend="Total spent ($)" append="million" class="mt-3">
        <b-form-input v-model="totalSpent" readonly> {{}}</b-form-input>
      </b-input-group>
      <budget-slider
        v-for="(item, index) in this.outcomes"
        v-bind:key="index"
        :title="item.title"
        :budget="parseInt(budget)"
        :vs="item.verticalScaleValue"
        :hs="item.horizontalScaleValue"
        :index="index"
        :totalOutcomes="outcomes.length"
        @compute-budget="computeSpent"
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
  methods: {
    init() {
      this.outcomes = this.outcomes.map((item) => {
        item.outcomeBudget = (this.budget / this.outcomes.length).toFixed(2);
        return item;
      });
    },
    computedOutcome(retObj) {
      this.outcomes[retObj.index].computedOutcome = retObj.computedOutcome;
    },
    computeSpent(retObj) {
      this.outcomes[retObj.index].outcomeBudget = retObj.outcomeFunding;
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
          outcomeBudget: undefined,
        },
        {
          title: "Outcome 2",
          computedOutcome: null,
          verticalScaleValue: 0.1,
          horizontalScaleValue: 1,
          outcomeBudget: undefined,
        },
        {
          title: "Outcome 3",
          computedOutcome: null,
          verticalScaleValue: 0.01,
          horizontalScaleValue: 1,
          outcomeBudget: undefined,
        },
      ],
      budget: 100,
    };
  },
  computed: {
    totalSpent() {
      let total = 0;
      this.outcomes.forEach(function(item) {
        total += parseFloat(item.outcomeBudget);
      });
      return total.toFixed(2);
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped>
h1 {
  margin-top: 15px;
  margin-bottom: 20px;
}
</style>
