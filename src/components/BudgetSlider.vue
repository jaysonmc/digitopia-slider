<template>
  <div class="bordered-div">
      <div class="bordered-div">
        <h2>{{this.title}}</h2>
        <hr />
        <b-form-group>
          <b-input-group>
            <b-input-group-prepend is-text class="text-monospace">
              Funding
            </b-input-group-prepend>
            <b-form-input
              id="bg-opacity"
              :value="parseInt(outcomeFunding).toFixed(2)"
              type="range"
              number
              min="0"
              :max="budget"
              step="0.01"
              @change="computeBudget(outcomeFunding, $event)"
            ></b-form-input>
            <b-input-group-append is-text class="text-monospace">
              {{ outcomeFunding }} million
            </b-input-group-append>
          </b-input-group>
          <b-input-group v-if="showAnalysis" prepend="Improved by" append="%">
            <b-form-input v-model="computeOutcome" readonly></b-form-input>
          </b-input-group>
          <b-input-group  v-if="showAnalysis" prepend="Rate of change">
            <b-form-input v-model="rateOfChange" readonly></b-form-input>
          </b-input-group>
          <div v-if='outcomeFunding'> 
            <sub-budget-slider 
              v-for="(item, index) in this.subOutcomes"
              :key="item.key"
              :outcomeFunding="outcomeFunding"
              :subOutcomeFunding="item.subOutcomeFunding"
              :oneOf="subOutcomes.length"
              :title="item.title"
              :index="index"
              @compute-sub-budgets="computeSubBudgets"
              ref="subslider"
            >
            </sub-budget-slider>
          </div>
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
    title: String,
    budget: Number,
    vs: Number,
    hs: Number,
    index: Number,
    totalOutcomes: Number,
    outcomeFunding: Number,
  },
  data() {
    return {
      showAnalysis: false,
      subOutcomes: [
        {
          title: "Suboutcome 1",
          key: "1",
          subOutcomeFunding: undefined,
        },
        {
          title: "Suboutcome 2",
          key: "2",
          subOutcomeFunding: undefined,
        },
      ]
    }
  },
  methods: {
    tanh() {

      let x = this.outcomeFunding
      let vs = this.vs
      let hs = this.hs

      const reVal = (hs * ( this.tanhNumerator(x, vs) / this.tanhDenominator(x, vs) ))
      return reVal
    },
    tanhNumerator (x, vs) {
      return Math.exp(vs*x)-1
    },
    tanhDenominator (x, vs) {
      return Math.exp(vs*x)+1
    },
    tanhPrime() {

      let x = this.outcomeFunding
      let vs = this.vs
      let hs = this.hs

      // conveniently, the numerator and denominator have the same derivative
      let derivative = vs * Math.exp(vs*x);

      let quotientRuleNumerator = (derivative * this.tanhDenominator(x, vs)) - (this.tanhNumerator(x, vs) * derivative)
      let quotientRuleDenominator = Math.pow(this.tanhDenominator(x, vs), 2)

      return hs * (quotientRuleNumerator / quotientRuleDenominator)
    },
    computeBudget: function(oldVal, newVal) {

      var retObj = {
        oldOutcomeFunding: oldVal,
        newOutcomeFunding: newVal,
        index: this.index
      }

      this.$emit('compute-budget', retObj)
    },
    setAnalysis(bool) {
      this.showAnalysis = bool
    },
    computeSubBudgets(retObj) {
      const newVal = retObj.newOutcomeFunding
      const oldVal = retObj.oldOutcomeFunding

      const difference = (newVal - oldVal)
      const budgetDelta = (difference / (this.subOutcomes.length - 1))      

      let adjustedOutcome = this.subOutcomes[retObj.index]
      adjustedOutcome.subOutcomeFunding = newVal

      this.subOutcomes.forEach(suboutcome => {
        if (adjustedOutcome.key != suboutcome.key) {
          suboutcome.subOutcomeFunding = (suboutcome.subOutcomeFunding - budgetDelta)
        }

        suboutcome.key = suboutcome.key + adjustedOutcome.key
      })
    }
  },
  computed: {
    computeOutcome : function()  {
        var retObj = {
          computedOutcome: this.tanh(),
          index: this.index
        }

        this.$emit('computed-outcome', retObj)
        return (retObj.computedOutcome * 100).toFixed(2)
    },
    rateOfChange: function() {
      return this.tanhPrime()
    }
  },
  updated() {      
    
    this.subOutcomes.map( suboutcome => {
      if (!suboutcome.subOutcomeFunding)
        suboutcome.subOutcomeFunding = this.$props.outcomeFunding / this.subOutcomes.length
    })
  }
};
</script>

<style scoped>

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
.form-group .input-group-prepend .input-group-text {
  width: 165px;
}
</style>