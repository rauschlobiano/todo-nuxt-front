// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],
  
  build: {
    transpile: ['vuetify', '@nuxtjs/laravel-echo',],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    'nuxt-graphql-client',
    'nuxt-particles'
    // '@sidebase/nuxt-auth',
  ],

  nitro: {
    experimental: {
      websocket: true,
    }
  },

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

  particles: {
    mode: 'full', // 'full' | 'slim' | 'basic' | 'custom'
    lazy: true
  },
  
  plugins: [
    {src: '~/plugins/echo', ssr: false}
  ],
  // 'auth': {
  //   provider: {
  //       type: 'authjs'
  //   }
  // }
})
