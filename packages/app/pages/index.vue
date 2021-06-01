<template>
  <div class="container">
    <div>
      <h1>Klokke</h1>
      <button class="button" type="button" @click="onClickNew">NEW</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      interval: 0,
      session: {} as Record<string, any>,
    }
  },

  beforeDestroy(): void {
    clearInterval(this.interval)
  },

  methods: {
    async onClickNew(): Promise<void> {
      const session = await this.$axios.$post('http://localhost:5050/stopwatch')
      this.session = session
      await this.$router.push(`/h/${this.session.key}`)
    },
  },
})
</script>

<style>
.container {
  margin: 0 auto;
  padding: 1rem;
  max-width: 80rem;
  min-height: 100vh;
  display: flex;
}
</style>
