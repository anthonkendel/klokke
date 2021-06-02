<template>
  <div class="container center">
    <h1 class="text-center">Klokke</h1>

    <div class="row center">
      <div class="column">
        <button class="k-button primary" type="button" @click="onClickNew">New</button>
      </div>
    </div>

    <div class="row center">
      <div class="column text-center">
        <form @submit.prevent="onSubmitJoin">
          <p>To join an existing session, enter the key and press Join.</p>

          <div class="k-label-input">
            <label for="session-key-to-join" class="k-label">Key</label>
            <input
              autocomplete="one-time-code"
              class="k-input"
              id="session-key-to-join"
              name="session-key-to-join"
              type="text"
              v-model="sessionKeyToJoin"
            />
          </div>

          <button class="k-button secondary display-inline" type="submit">Join</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      sessionKeyToJoin: '',
    };
  },

  methods: {
    async onClickNew(): Promise<void> {
      const session = await this.$axios.$post('http://localhost:5050/session');
      await this.$router.push(`/s/${session.key}`);
    },
    async onSubmitJoin(): Promise<void> {
      await this.$router.push(`/s/${this.sessionKeyToJoin}`);
    },
  },
});
</script>
