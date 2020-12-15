<template>
 <b-input-group id="sub-slider-input-group">
    <b-input-group-prepend is-text class="text-monospace">
      {{ title }} funding
    </b-input-group-prepend>
    <b-form-input
      id="bg-opacity"
      :value="parseInt(subOutcomeFunding).toFixed(2)"
      type="range"
      number
      min="0"
      :max="outcomeFunding"
      step="0.01"
      @change="computeSubBudgets(subOutcomeFunding, $event)"
    ></b-form-input>
    <b-input-group-append is-text class="text-monospace">
      {{ subOutcomeFunding }} million
    </b-input-group-append>
  </b-input-group>
</template>

<script>
export default {
  name: "SubBudgetSlider",
  props: {
    outcomeFunding: Number,
    subOutcomeFunding: Number,
    oneOf: Number,
    title : String,
    index: Number,
  },
  data() {
    return {
      filler: false
    }
  },
  methods: {
    computeSubBudgets: function(oldVal, newVal) {

      var retObj = {
        oldOutcomeFunding: this.subOutcomeFunding,
        newOutcomeFunding: newVal,
        index: this.index
      }

      console.dir(retObj)

      this.$emit('compute-sub-budgets', retObj)
    },
  },
};
</script>

<style scoped>
#sub-slider-input-group {
  width: 80%;
  float: right;
  margin-top: 10px;
  margin-bottom: 5px;
}
</style>