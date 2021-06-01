<template>
  <div class="container">
    <div>
      <h1>Klokke</h1>
      <button class="button" type="button" @click="onClickNew">NEW</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      interval: 0,
      session: {} as Record<string, any>,
    };
  },

  beforeDestroy(): void {
    clearInterval(this.interval);
  },

  methods: {
    async onClickNew(): Promise<void> {
      const session = await this.$axios.$post('http://localhost:5050/session');
      this.session = session;
      await this.$router.push(`/s/${this.session.key}`);
    },
  },
});
</script>
