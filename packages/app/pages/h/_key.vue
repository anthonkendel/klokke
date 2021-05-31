<template>
  <div class="container">
    <div>
      <h1>Stopwatch</h1>

      <template v-if="session.key">
        <h2>{{ session.key }}</h2>

        <div>
          <nuxt-link :to="`/s/${session.key}`">
            Join {{ session.key }}
          </nuxt-link>
        </div>

        <h2>{{ msToTime(session.elapsedInMs) }}</h2>
      </template>

      <button class="button" type="button" @click="onClickStart">START</button>
      <button class="button" type="button" @click="onClickStop">STOP</button>
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
    async onClickStart(): Promise<void> {
      const intervalInMs = 500
      await this.updateSession('start')
      this.interval = window.setInterval(async () => {
        await this.loadSession()
      }, intervalInMs)
    },
    async onClickStop(): Promise<void> {
      await this.updateSession('stop')
    },
  },
})
</script>
