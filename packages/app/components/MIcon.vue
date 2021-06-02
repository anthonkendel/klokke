<template>
  <span class="material-icons" :class="classes">
    <slot name="default"></slot>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'MIcon',

  props: {
    left: Boolean,
    right: Boolean,
  },

  computed: {
    classes(): Record<string, unknown> {
      return {
        'mr-1': this.left,
        'ml-1': this.right,
      };
    },
  },
});
</script>
