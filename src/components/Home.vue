<template>
  <div class="container">
    <h1>Value Stream Comparative Analysis</h1>
    <div id="div-budget">
      <b-input-group prepend="Budget ($)" append="million" class="mt-3">
        <b-form-input v-model="budget"> {{ this.budget }}</b-form-input>
      </b-input-group>
      <b-input-group
        id="totalSpent"
        prepend="Total spent ($)"
        append="million"
        class="mt-3"
      >
        <b-form-input v-model="totalSpent" readonly></b-form-input>
      </b-input-group>
      <div class="row checkbox-div">
        <b-form-checkbox
          id="checkbox-freeze-spending"
          v-model="freezeSpending"
          name="checkbox-freeze-spending"
          value="frozen"
          unchecked-value="not_frozen"
        >
          Freeze spending
        </b-form-checkbox>
      </div>
      <div class="row checkbox-div">
        <b-form-checkbox
          id="checkbox-analysis"
          v-model="showAnalysis"
          name="checkbox-analysis"
          value="analysis"
          unchecked-value="no_analysis"
          @change="setAnalysis()"
        >
          Analysis
        </b-form-checkbox>
      </div>
      <budget-slider
        v-for="(item, index) in this.outcomes"
        ref="slider"
        :key="item.key"
        :title="item.title"
        :budget="parseInt(budget)"
        :vs="item.verticalScaleValue"
        :hs="item.horizontalScaleValue"
        :index="index"
        :totalOutcomes="outcomes.length"
        :outcomeFunding="parseFloat(item.outcomeBudget)"
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
        item.outcomeBudget = (this.budget / this.outcomes.length)
        return item;
      });
    },
    computedOutcome(retObj) {
      this.outcomes[retObj.index].computedOutcome = retObj.computedOutcome;
    },
    computeSpent(retObj) {

      let newVal = retObj.newOutcomeFunding
      let oldVal = retObj.oldOutcomeFunding

      this.outcomes[retObj.index].outcomeBudget = retObj.newOutcomeFunding

      if (this.freezeSpending == "frozen") {

        this.adjustBudgets(this.outcomes[retObj.index], (newVal - oldVal) )
      }

    },
    adjustBudgets(adjustedOutcome, difference) {
      let diffVal = difference/ (this.outcomes.length-1)
  
      this.outcomes.forEach(outcome => {
        if (outcome.title != adjustedOutcome.title) {
          outcome.outcomeBudget = (outcome.outcomeBudget - diffVal)
          outcome.key = parseInt(adjustedOutcome.key) + outcome.key
        } 
      })
    },
    setAnalysis() {
      this.$refs.slider.forEach(component => {
        if(this.showAnalysis == "analysis") component.setAnalysis(true)
        else component.setAnalysis(false)
      })
    }
  },
  data() {
    return {
      outcomes: [
        {
          title: "Reconciliation",
          computedOutcome: null,
          verticalScaleValue: 0.05,
          horizontalScaleValue: 1,
          outcomeBudget: undefined,
          key: 1,
        },
        {
          title: "Diversity and inclusion",
          computedOutcome: null,
          verticalScaleValue: 0.1,
          horizontalScaleValue: 1,
          outcomeBudget: undefined,
          key: 2
        },
        {
          title: "Climate",
          computedOutcome: null,
          verticalScaleValue: 0.01,
          horizontalScaleValue: 1,
          outcomeBudget: undefined,
          key: 3
        },
      ],
      budget: 100,
      freezeSpending: "not_frozen",
      showAnalysis: "no_analysis",
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
#totalSpent {
  margin-bottom: 20px;
}
.checkbox-div {
  margin-left: 0px;
  height: 40px;
}
</style>
