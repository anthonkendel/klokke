<template>
  <div class="container">
    <div class="row center">
      <div class="column text-center">
        <h1>Klokke</h1>

        <template v-if="session.key && !isLoading">
          <h2>{{ session.key }}</h2>
          <h3>{{ msToTime(session.timestamp) }}</h3>

          <button class="k-button" type="button" @click="onClickStart">Start</button>
          <button class="k-button secondary" type="button" @click="onClickStop">Stop</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { KAction } from '~/models/Action';
import { KMessage } from '~/models/Message';
import { KSessionData } from '~/models/SessionData';
import { msToTime } from '~/utils/msToTime';

export default Vue.extend({
  data() {
    return {
      isLoading: true,
      interval: 0,
      session: {} as KSessionData,
      ws: null as null | WebSocket,
    };
  },

  created(): void {
    if (process.client) {
      const key = this.$route.params.key;
      this.ws = new WebSocket(`ws://localhost:5050/session/${key}`);
      this.ws.addEventListener('open', this.onOpen);
      this.ws.addEventListener('message', this.onMessage);
      this.ws.addEventListener('error', this.onError);
    }
  },

  beforeDestroy(): void {
    this.ws?.removeEventListener('message', this.onMessage);
    this.ws?.removeEventListener('error', this.onError);
    this.ws?.close();
  },

  methods: {
    msToTime,
    onMessage({ data }: MessageEvent): void {
      const session = JSON.parse(data) as KSessionData;

      this.session = session;
    },
    onOpen(event: Event): void {
      this.isLoading = false;
    },
    onError(event: Event): void {
      this.$router.push('/');
    },
    async onClickStart(): Promise<void> {
      const message: KMessage = {
        action: KAction.StartTimer,
      };
      this.ws?.send(JSON.stringify(message));
    },
    async onClickStop(): Promise<void> {
      const message: KMessage = {
        action: KAction.StopTimer,
      };
      this.ws?.send(JSON.stringify(message));
    },
  },
});
</script>
