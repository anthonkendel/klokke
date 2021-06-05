<template>
  <div class="container center">
    <h1 class="text-center mb-2">Klokke</h1>

    <div class="row center">
      <div class="column text-center">
        <div v-if="showSessionDetails">
          <div class="mb-3">
            <h2>{{ session.key }}</h2>
            <h2>{{ msToTime(session.timestamp) }}</h2>
          </div>

          <button
            @click="onClickStart"
            aria-label="Start Timer"
            class="k-button primary round"
            type="button"
            title="Start"
          >
            <m-icon>play_arrow</m-icon>
          </button>

          <button
            @click="onClickPause"
            aria-label="Pause Timer"
            class="k-button secondary round"
            type="button"
            title="Pause"
          >
            <m-icon>pause</m-icon>
          </button>

          <button @click="onClickReset" aria-label="Reset Timer" class="k-button round" title="Reset" type="button">
            <m-icon>replay</m-icon>
          </button>

          <button
            @click="onClickCloseSession"
            aria-label="Close Session"
            class="k-button danger round"
            title="Close Session"
            type="button"
          >
            <m-icon>delete_forever</m-icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MIcon from '~/components/MIcon.vue';
import { KAction } from '~/models/Action';
import { KMessage } from '~/models/Message';
import { KSessionData } from '~/models/SessionData';
import { msToTime } from '~/utils/msToTime';

export default Vue.extend({
  head() {
    const vm = this as any;
    return {
      title: ['Klokke', vm?.session?.key].filter((v) => v).join(' | '),
    };
  },

  components: { MIcon },

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
      const socket = window.location.protocol.includes('https') ? 'wss' : 'ws';
      this.ws = new WebSocket(`${socket}://${window.location.host}/ws/session-ws/${key}`);
      this.ws.addEventListener('open', this.onOpen);
      this.ws.addEventListener('message', this.onMessage);
      this.ws.addEventListener('error', this.onError);
    }
  },

  computed: {
    showSessionDetails(): boolean {
      return Boolean(this.session.key) && this.isLoading === false;
    },
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
      this.$router.replace('/');
    },
    onClickStart(): void {
      const message: KMessage = {
        action: KAction.StartTimer,
      };
      this.ws?.send(JSON.stringify(message));
    },
    onClickPause(): void {
      const message: KMessage = {
        action: KAction.PauseTimer,
      };
      this.ws?.send(JSON.stringify(message));
    },
    onClickReset(): void {
      const message: KMessage = {
        action: KAction.ResetTimer,
      };
      this.ws?.send(JSON.stringify(message));
    },
    async onClickCloseSession(): Promise<void> {
      await this.$axios.$delete(`/api/session/${this.session.key}`);
      this.$router.replace('/');
    },
  },
});
</script>
