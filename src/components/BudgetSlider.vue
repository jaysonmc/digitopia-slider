<template>
  <div>
    <div>
      <h2>{{ title }}</h2>
      <b-form-group>
        <b-input-group>
          <b-input-group-prepend is-text class="text-monospace">
            Funding
          </b-input-group-prepend>
          <b-form-input
            id="bg-opacity"
            :value="computedOutcomeBudget"
            type="range"
            number
            min="0"
            :max="budget"
            step="0.01"
            @change="computeBudget(outcomeBudget, $event)"
          ></b-form-input>
          <b-input-group-append is-text class="text-monospace">
            {{ computedOutcomeBudget }} million
          </b-input-group-append>
        </b-input-group>
        <div class="flex-grid">
          <div class="flex-grid-item half">
            <b-input-group v-if="showAnalysis" prepend="Improved by" append="%">
              <b-form-input v-model="computeOutcome" readonly></b-form-input>
            </b-input-group>
          </div>
          <div class="flex-grid-item half">
            <b-input-group v-if="showAnalysis" prepend="Rate of change">
              <b-form-input v-model="rateOfChange" readonly></b-form-input>
            </b-input-group>
          </div>
        </div>
        <sub-budget-slider
          v-for="(item, index) in this.subOutcomes"
          :key="item.key"
          :suboutcomeProp="item"
          :outcomeFunding="outcomeBudget"
          :oneOf="subOutcomes.length"
          :index="index"
          @compute-sub-budgets="computeSubBudgets"
          ref="subslider"
        >
        </sub-budget-slider>
      </b-form-group>
    </div>
  </div>
</template>

<script>
import SubBudgetSlider from "./SubBudgetSlider.vue";

export default {
  name: "BudgetSlider",
  components: {
    SubBudgetSlider,
  },
  props: {
    budget: Number,
    index: Number,
    totalOutcomes: Number,
    outcomeProp: {
      title: String,
      outcomeBudget: Number,
      verticalScaleValue: Number,
      horizontalScaleValue: Number,
      computedOutcome: null | Number,
      key: Number,
      subOutcomes: {
        title: String,
        key: String,
        subOutcomeFunding: Number | undefined,
        parent: String,
        depts: Array,
      },
    },
  },
  data() {
    return {
      title: this.outcomeProp.title,
      outcomeBudget: this.outcomeProp.outcomeBudget,
      vs: this.outcomeProp.verticalScaleValue,
      hs: this.outcomeProp.horizontalScaleValue,
      showAnalysis: false,
      outcome: this.outcomeProp,
      subOutcomes: this.outcomeProp.subOutcomes,
      depts: this.outcomeProp.subOutcomes.depts,
    };
  },
  methods: {
    tanh() {
      let x = this.outcomeBudget;
      let vs = this.vs;
      let hs = this.hs;

      const reVal =
        hs * (this.tanhNumerator(x, vs) / this.tanhDenominator(x, vs));
      return reVal;
    },
    tanhNumerator(x, vs) {
      return Math.exp(vs * x) - 1;
    },
    tanhDenominator(x, vs) {
      return Math.exp(vs * x) + 1;
    },
    tanhPrime() {
      let x = this.outcomeBudget;
      let vs = this.vs;
      let hs = this.hs;

      // conveniently, the numerator and denominator have the same derivative
      let derivative = vs * Math.exp(vs * x);

      let quotientRuleNumerator =
        derivative * this.tanhDenominator(x, vs) -
        this.tanhNumerator(x, vs) * derivative;
      let quotientRuleDenominator = Math.pow(this.tanhDenominator(x, vs), 2);

      return hs * (quotientRuleNumerator / quotientRuleDenominator);
    },
    computeBudget: function(oldVal, newVal) {
      var retObj = {
        newOutcomeFunding: newVal,
        index: this.index,
      };

      this.$emit("compute-budget", retObj);
    },
    setAnalysis(bool) {
      this.showAnalysis = bool;
    },
    setShowDepts(bool) {
      this.$refs.subslider.forEach((component) => {
        component.setShowDepts(bool);
      });
    },
    computeSubBudgets(retObj) {
      retObj.adjustedSuboutcome = this.subOutcomes[retObj.index];
      this.$emit("adjust-sub-budgets", retObj);
    },
  },
  computed: {
    computeOutcome: function() {
      var retObj = {
        computedOutcome: this.tanh(),
        index: this.index,
      };

      this.$emit("computed-outcome", retObj);
      return (retObj.computedOutcome * 100).toFixed(2);
    },
    rateOfChange: function() {
      return this.tanhPrime();
    },
    computedOutcomeBudget: function() {
      return parseFloat(this.outcomeBudget).toFixed(2);
    },
  },
  mounted() {
    if (!this.outcomeProp.outcomeBudget) {
      this.outcomeBudget = this.budget / this.totalOutcomes;
    }
  },
  updated() {
    this.subOutcomes.map((suboutcome) => {
      if (!suboutcome.subOutcomeFunding) {
        suboutcome.subOutcomeFunding = parseFloat(
          this.$props.outcomeProp.outcomeBudget / this.subOutcomes.length
        );
        suboutcome.key += 1;
      }
    });
  },
};
</script>

<style scoped>
h2 {
  font-weight: 600;
  margin: 4rem 0 1rem 0;
  text-align: left;
}
#div-budget {
  margin-top: 10px;
}
.bordered-div {
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  padding: 20px;
}
.progress {
  margin-top: 5px;
  margin-bottom: 5px;
}
.input-group {
  margin: 0 0 1rem 0;
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
  .flex-grid-item.half {
    flex: calc(100% / 2);
    padding: 0 0.5rem 0 0;
  }
  .flex-grid-item.half:nth-child(odd) {
    padding: 0 1rem 0 0;
  }
  .flex-grid-item.half:nth-child(even) {
    padding: 0 0 0 1rem;
  }
}
.input-group .input-group-prepend .input-group-text {
  background: rgba(216, 230, 251, 1);
}
.form-group .input-group-prepend .input-group-text {
  width: 201px;
}
</style>
