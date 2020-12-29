<template>
 <b-input-group id="sub-slider-input-group">
    <b-input-group-prepend is-text class="text-monospace">
      {{ title }} funding
    </b-input-group-prepend>
    <b-form-input
      id="bg-opacity"
      :value="computeSubOutcomeFunding"
      type="range"
      number
      min="0"
      :max="outcomeFunding"
      step="0.01"
      @change="computeSubBudgets(subOutcomeFunding, $event)"
    ></b-form-input>
    <b-input-group-append is-text class="text-monospace">
      {{ computeSubOutcomeFunding }} million
    </b-input-group-append>
  </b-input-group>
</template>

<script>
export default {
  name: "SubBudgetSlider",
  props: {
    outcomeFunding: Number,
    oneOf: Number,
    index: Number,
    suboutcomeProp: {
      title: String,
      key: String,
      subOutcomeFunding: Number | undefined,
      parent: String,
      depts: Array
    }
  },
  data() {
    return {
      title: this.suboutcomeProp.title,
      parent: this.suboutcomeProp.parent,
      depts: this.suboutcomeProp.depts,
      subOutcomeFunding: this.suboutcomeProp.subOutcomeFunding
    }
  },
  computed: {
    computeSubOutcomeFunding : function()  {
        if (this.subOutcomeFunding) {
          return parseFloat(this.subOutcomeFunding).toFixed(2)
        }
        return 0
    },
  },
  methods: {
    computeSubBudgets: function(oldVal, newVal) {
      newVal = parseFloat(newVal)

      var retObj = {
        oldOutcomeFunding: oldVal,
        newOutcomeFunding: newVal,
        sourceOutcome: this.parent,
        index: this.index,
        difference: newVal - oldVal
      }

      this.$emit('compute-sub-budgets', retObj)
    },
  },
  mounted() {
  }
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