const appName = 'Klokke';

export default {
  head: {
    title: appName,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Klokke - Session-based Stopwatch' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Nunito&family=Open+Sans&family=Material+Icons&display=swap',
      },
    ],
  },

  css: ['@/assets/main.scss'],

  plugins: [],

  components: true,

  buildModules: ['@nuxt/typescript-build'],

  modules: ['@nuxtjs/axios', '@nuxtjs/pwa', '@nuxt/content'],

  axios: {
    baseURL: 'http://localhost:5050',
  },

  pwa: {
    manifest: {
      lang: 'en',
    },
    meta: {
      name: appName,
    },
  },

  content: {},

  build: {},

  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL,
    },
  },
};
