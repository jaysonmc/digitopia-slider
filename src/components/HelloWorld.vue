<template>
  <div class="container">
    <h1>Value Stream Comparative Analysis</h1>
    <div id="div-budget">
      <b-input-group prepend="Budget ($)" class="mt-3">
        <b-form-input v-model="budget"> {{ this.budget }}</b-form-input>
      </b-input-group>
    </div>
    <div class="bordered-div">
      <div class="bordered-div">
        <h2>Outcome 1</h2>
        <hr />
        <b-form-group
          label="Outcome 1 Funding"
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
              {{ outcome1Funding }}
            </b-input-group-append>
          </b-input-group>
            <b-input-group prepend="Improvement ratio" append="%">
              <b-form-input v-model="computeOutcome1" readonly></b-form-input>
            </b-input-group>
        </b-form-group>
        <hr />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  methods: {
    init() {
      this.outcome1Funding = this.budget/2
    }
  },
  data () {
      return {
        budget: 100,
        outcome1Funding: 0
      }
    },
  computed: {
    computeOutcome1 : function()  {
        var x = this.outcome1Funding
        var output = x/(1+Math.abs(x))
        return output
    }  
  },
  mounted() {
    this.init()
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  margin-top: 15px;
  margin-bottom: 20px;
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
</style>
