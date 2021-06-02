<template>
  <div class="container center">
    <h1 class="text-center">Klokke</h1>

    <div class="row center">
      <div class="column text-center">
        <div v-if="showSessionDetails">
          <h2>{{ session.key }}</h2>
          <h3>{{ msToTime(session.timestamp) }}</h3>

          <button class="k-button primary" type="button" @click="onClickStart">
            <m-icon left>play_arrow</m-icon>
            <span>Start</span>
          </button>
          <button class="k-button secondary" type="button" @click="onClickPause">
            <m-icon left>pause</m-icon>
            <span>Pause</span>
          </button>
          <button class="k-button" type="button" @click="onClickReset">
            <m-icon left>replay</m-icon>
            <span>Reset</span>
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
      this.ws = new WebSocket(`ws://localhost:5050/session/${key}`);
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
      this.$router.push('/');
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
  },
});
</script>
