<template>
  <div class="container">
    <div class="row">
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
    </div>
    <div v-if="showDepts" class="row">
      <b-list-group>
        <b-list-group-item v-for="(dept, index) in this.depts" :key="index">
          {{ dept }}
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
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
      depts: Array,
    },
  },
  data() {
    return {
      title: this.suboutcomeProp.title,
      parent: this.suboutcomeProp.parent,
      depts: this.suboutcomeProp.depts,
      subOutcomeFunding: this.suboutcomeProp.subOutcomeFunding,
      showDepts: false,
    };
  },
  computed: {
    computeSubOutcomeFunding: function() {
      if (this.subOutcomeFunding) {
        return parseFloat(this.subOutcomeFunding).toFixed(2);
      }
      return 0;
    },
  },
  methods: {
    computeSubBudgets: function(oldVal, newVal) {
      newVal = parseFloat(newVal);

      var retObj = {
        oldOutcomeFunding: oldVal,
        newOutcomeFunding: newVal,
        sourceOutcome: this.parent,
        index: this.index,
        difference: newVal - oldVal,
      };

      this.$emit("compute-sub-budgets", retObj);
    },
    setShowDepts(bool) {
      this.showDepts = bool;
    },
  },
  mounted() {},
};
</script>

<style scoped>
#sub-slider-input-group {
  width: 100%;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.row .list-group {
  padding-bottom: 10px;
}

div#sub-slider-input-group .input-group-prepend {
  display: block;
  width: 100%;
}

div#sub-slider-input-group .input-group-prepend .input-group-text {
  white-space: inherit;
}
</style>
