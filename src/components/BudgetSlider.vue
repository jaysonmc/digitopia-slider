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
              v-model="outcomeFunding"
              type="range"
              number
              min="0"
              :max="budget"
              step="0.01"
              @change="computeBudget"
            ></b-form-input>
            <b-input-group-append is-text class="text-monospace">
              {{ outcomeFunding }} million
            </b-input-group-append>
          </b-input-group>
          <b-input-group prepend="Improvement ratio" append="%">
            <b-form-input v-model="computeOutcome" readonly></b-form-input>
          </b-input-group>
          <b-input-group prepend="Rate of change">
            <b-form-input v-model="rateOfChange" readonly></b-form-input>
          </b-input-group>
        </b-form-group>
      </div>
    </div>
</template>

<script>
export default {
  name: "BudgetSlider",
  props: {
    title: String,
    budget: Number,
    vs: Number,
    hs: Number,
    index: Number,
    totalOutcomes: Number,
  },
  methods: {
    init() {
      this.outcomeFunding = (this.budget/this.totalOutcomes).toFixed(2)
    },
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
    computeBudget: function() {

      var retObj = {
        outcomeFunding: this.outcomeFunding,
        index: this.index
      }

      this.$emit('compute-budget', retObj)
    }
  },
  data () {
      return {
        outcomeFunding: 0
      }
    },
  computed: {
    computeOutcome : function()  {
        let computedOutcome = this.tanh()

        var retObj = {
          computedOutcome: computedOutcome,
          index: this.index
        }

        this.$emit('computed-outcome', retObj)
        return computedOutcome
    },
    rateOfChange: function() {
      return this.tanhPrime()
    }
  },
  mounted() {
    this.init()
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