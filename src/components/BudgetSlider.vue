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

      const reVal = (hs * ( (Math.exp(vs*x)-1) / (Math.exp(vs*x)+1) ))
      return reVal
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
</style>