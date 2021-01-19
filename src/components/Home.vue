<template>
  <div class="container">
    <h1>Value Stream Comparative Analysis</h1>
    <div id="div-budget">
      <div class="flex-grid">
        <div class="flex-grid-item large">
          <b-input-group prepend="Budget ($)" append="million" class="mt-3">
            <b-form-input v-model="budget"> {{ this.budget }}</b-form-input>
          </b-input-group>
        </div>
        <div class="flex-grid-item small">
          <b-input-group
            id="totalSpent"
            prepend="Total spent ($)"
            append="million"
            class="mt-3"
          >
            <b-form-input v-model="totalSpent" readonly></b-form-input>
          </b-input-group>
        </div>
        <div class="flex-grid-item tiny">
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
        <div class="flex-grid-item tiny">
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
      </div>
      <div class="row checkbox-div">
        <b-form-checkbox
          id="checkbox-depts"
          v-model="showDepts"
          name="checkbox-depts"
          value="show_depts"
          unchecked-value="hide_depts"
          @change="setShowDepartments()"
        >
          Show Departments
        </b-form-checkbox>
      </div>
      <budget-slider
        v-for="(item, index) in this.outcomes"
        ref="slider"
        :key="item.key"
        :budget="budget"
        :outcomeProp="item"
        :index="index"
        :totalOutcomes="outcomes.length"
        @compute-budget="computeBudget"
        @computed-outcome="computedOutcome"
        @adjust-sub-budgets="adjustSubBudgets"
      />
    </div>
  </div>
</template>

<script>
import BudgetSlider from "./BudgetSlider.vue";
import * as outcomeTree from "../assets/lib/outcometree.ts";

export default {
  name: "HelloWorld",
  components: {
    BudgetSlider,
  },
  methods: {
    init() {
      this.outcomes = this.outcomes.map((item) => {
        item.outcomeBudget = this.budget / this.outcomes.length;
        return item;
      });

      outcomeTree.init(this.outcomes);
    },
    computedOutcome(retObj) {
      this.outcomes[retObj.index].computedOutcome = retObj.computedOutcome;
    },
    computeBudget(retObj) {
      outcomeTree.adjustOutcomeValue(
        this.outcomes[retObj.index],
        parseInt(retObj.newOutcomeFunding),
        this.freezeSpending == "frozen"
      );
    },
    setAnalysis() {
      this.$refs.slider.forEach((component) => {
        if (this.showAnalysis == "analysis") component.setAnalysis(true);
        else component.setAnalysis(false);
      });
    },
    setShowDepartments() {
      this.$refs.slider.forEach((component) => {
        if (this.showDepts == "show_depts") component.setShowDepts(true);
        else component.setShowDepts(false);
      });
    },
    adjustSubBudgets(retObj) {
      outcomeTree.adjustSuboutcomeValue(
        retObj.adjustedSuboutcome,
        parseInt(retObj.newOutcomeFunding),
        this.freezeSpending == "frozen"
      );
    },
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
          subOutcomes: [
            {
              title: "Suboutcome 1",
              key: "1",
              subOutcomeFunding: undefined,
              parent: "Reconciliation",
              depts: [
                "Dept of Offense",
                "Dept of Spending",
                "Dept of Rule Setting",
              ],
            },
            {
              title: "Suboutcome 2",
              key: "2",
              subOutcomeFunding: undefined,
              parent: "Reconciliation",
              depts: [
                "Dept of Old",
                "Dept of Collection",
                "Dept of Rule Setting",
              ],
            },
            {
              title: "Suboutcome 3",
              key: "3",
              subOutcomeFunding: undefined,
              parent: "Reconciliation",
              depts: ["Dept of Trends", "Dept of Rule Setting"],
            },
          ],
        },
        {
          title: "Diversity and inclusion",
          computedOutcome: null,
          verticalScaleValue: 0.1,
          horizontalScaleValue: 1,
          outcomeBudget: undefined,
          key: 2,
          subOutcomes: [
            {
              title: "Suboutcome 3",
              key: "3",
              subOutcomeFunding: undefined,
              parent: "Diversity and inclusion",
              depts: ["Dept of Rule Setting", "Dept of Departments"],
            },
            {
              title: "Suboutcome 4",
              key: "4",
              subOutcomeFunding: undefined,
              parent: "Diversity and inclusion",
              depts: ["Dept of Old", "Dept of Collection"],
            },
            {
              title: "Suboutcome 7",
              key: "7",
              subOutcomeFunding: undefined,
              parent: "Diversity and inclusion",
              depts: [
                "Dept of Old",
                "Dept of Collection",
                "Dept of Departments",
              ],
            },
          ],
        },
        {
          title: "Climate",
          computedOutcome: null,
          verticalScaleValue: 0.01,
          horizontalScaleValue: 1,
          outcomeBudget: undefined,
          key: 3,
          subOutcomes: [
            {
              title: "Suboutcome 8",
              key: "8",
              subOutcomeFunding: undefined,
              parent: "Climate",
              depts: ["Dept of Spending", "Dept of Old"],
            },
            {
              title: "Suboutcome 5",
              key: "5",
              subOutcomeFunding: undefined,
              parent: "Climate",
              depts: ["Dept of Rule Setting", "Dept of Collection"],
            },
            {
              title: "Suboutcome 6",
              key: "6",
              subOutcomeFunding: undefined,
              parent: "Climate",
              depts: ["Dept of Spending", "Dept of Old"],
            },
            {
              title: "Suboutcome 9",
              key: "9",
              subOutcomeFunding: undefined,
              parent: "Reconciliation",
              depts: ["Dept of Trends", "Dept of Collection", "Dept of Old"],
            },
          ],
        },
      ],
      budget: 100,
      freezeSpending: "not_frozen",
      showAnalysis: "no_analysis",
      showDepts: "hide_depts",
    };
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped>
h1 {
  font-weight: 600;
  margin: 0 0 5rem 0;
}
#totalSpent {
  margin-bottom: 20px;
}
.flex-grid {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.flex-grid-item {
  flex: 1;
}
@media screen and (min-width: 40em) {
  .flex-grid {
    flex-direction: initial;
  }
  .flex-grid-item.large {
    flex: calc((100% / 3) * 2);
    padding: 0 .5rem 0 0;
  }
  .flex-grid-item.small {
    flex: calc(100% / 3);
    padding: 0 0 0 .5rem;
  }
  .flex-grid-item.tiny {
    flex: calc(100% / 5);
    max-width: calc(100% / 5);
    text-align: left;
  }
} 
.checkbox-div {
  margin-left: 0px;
  height: 40px;
}
</style>
