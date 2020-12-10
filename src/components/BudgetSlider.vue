<template>
  <div class="bordered-div">
      <div class="bordered-div">
        <h2>{{this.title}}</h2>
        <hr />
        <b-form-group
          label="Funding"
          label-for="bg-opacity"
          label-cols-sm="4"
          label-cols-lg="12"
        >
          <b-input-group>
            <b-form-input
              id="bg-opacity"
              v-model="outcome1Funding"
              type="range"
              number
              min="0"
              :max="budget"
              step="0.01"
            ></b-form-input>
            <b-input-group-append is-text class="text-monospace">
              {{ outcome1Funding }} million
            </b-input-group-append>
          </b-input-group>
            <b-input-group prepend="Improvement ratio" append="%">
              <b-form-input v-model="computeOutcome1" readonly></b-form-input>
            </b-input-group>
        </b-form-group>
        <hr />
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
  },
  methods: {
    
    init() {
      this.outcome1Funding = this.budget/2
    },
    tanh() {

      let x = this.outcome1Funding
      let vs = this.vs
      let hs = this.hs

      const reVal = (hs * ( (Math.exp(vs*x)-1) / (Math.exp(vs*x)+1) ))
      return reVal
    }
  },
  
  data () {
      return {
        outcome1Funding: 0
      }
    },
  computed: {
    computeOutcome1 : function()  {
        var x = this.outcome1Funding
        var output = this.tanh(x, 0.05)
        return output
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