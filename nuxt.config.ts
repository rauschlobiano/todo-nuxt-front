// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 1111
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.GQL_HOST || 'http://3.107.47.74/graphql',
    },
  },  
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
    // '@sidebase/nuxt-auth',
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
    preferGETQueries: false,
    clients: {
      default: {
        host: 'localhost:8000',
        headers: {
          credentials: 'same-origin',
        }
      }
  }
  },

  // 'auth': {
  //   provider: {
  //       type: 'authjs'
  //   }
  // }
})
