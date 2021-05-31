<template>
  <div class="container">
    <div>
      <h1>Stopwatch</h1>

      <h2 v-show="session.key">{{ session.key }}</h2>
      <h2 v-show="session.elapsedInMs">{{ msToTime(session.elapsedInMs) }}</h2>

      <button class="button" @click="onClickStop">STOP</button>
    </div>
  </div>
</template>

<script lang="ts">
import { msToTime } from '~/utils/msToTime'
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      interval: 0,
      session: {} as Record<string, any>,
    }
  },

  async mounted(): Promise<void> {
    const intervalInMs = 500
    await this.loadSession()
    this.interval = window.setInterval(async () => {
      await this.loadSession()
    }, intervalInMs)
  },

  beforeDestroy(): void {
    clearInterval(this.interval)
  },

  methods: {
    msToTime,
    async loadSession(): Promise<void> {
      const session = await this.$axios.$get(
        `http://localhost:5050/stopwatch/${this.$route.params.key}`
      )
      this.session = session
    },
    async updateSession(action: 'start' | 'stop'): Promise<void> {
      const session = await this.$axios.$patch(
        `http://localhost:5050/stopwatch/${this.$route.params.key}`,
        { action }
      )
      this.session = session
    },
    async onClickStop(): Promise<void> {
      await this.updateSession('stop')
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
