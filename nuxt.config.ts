// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  build: {
    transpile: ['vuetify'],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    'nuxt-graphql-client',
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  
  'graphql-client':{
    watch: true,
    autoImport: true,
    functionPrefix: 'Gql',
    documentPaths: ['./queries/'],
    preferGETQueries: false
  }
})
