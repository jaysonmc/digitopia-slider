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
      <budget-slider
        v-for="(item, index) in this.outcomes"
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
    {{this.outcomes}}
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
      this.outcomes[retObj.index].outcomeBudget = retObj.newOutcomeFunding;

      if (this.freezeSpending == "frozen") {
        this.adjustBudgets(this.outcomes[retObj.index], (retObj.oldOutcomeFunding - retObj.newOutcomeFunding) )
      }

    },
    adjustBudgets(adjustedOutcome, difference) {
      let diffVal = Math.abs(difference/this.outcomes.length)
    
      this.outcomes.forEach(outcome => {

        console.log("iterating over " + outcome.title)  
        if (outcome.title == adjustedOutcome.title) {
          console.log("outcome.title == adjustedOutcome.title") 
          console.log(outcome.title + " == " + adjustedOutcome.title)
        } else {
          console.log("else ... ")
          outcome.outcomeBudget = (outcome.outcomeBudget - diffVal)
          outcome.key = parseInt(adjustedOutcome.key) + outcome.key
          
        }
      })
      console.dir(this.outcomes)
    }
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
          key: 1
        },
        {
          title: "Outcome 2",
          computedOutcome: null,
          verticalScaleValue: 0.1,
          horizontalScaleValue: 1,
          outcomeBudget: undefined,
          key: 2
        },
        {
          title: "Outcome 3",
          computedOutcome: null,
          verticalScaleValue: 0.01,
          horizontalScaleValue: 1,
          outcomeBudget: undefined,
          key: 3
        },
      ],
      budget: 100,
      freezeSpending: "not_frozen",
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
  margin-bottom: 10px;
}
.checkbox-div {
  margin-left: 0px;
  margin-top: 15px;
  height: 40px;
}
</style>
