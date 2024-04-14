<template>
   <div class="chatter-main">
         <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h1 class="text-h4 font-weight-thin mb-4">
               Engr. Rausch Lobiano
            </h1>
            
            <h4 class="subheading">
               Let's build your Software today!
            </h4>
            <small>
               Send me an email at rauschlobiano34@gmail.com
            </small>

            <v-carousel
               height="400"
               show-arrows="hover"
               cycle
               hide-delimiter-background
            >
               <v-carousel-item
                  v-for="(slide, i) in slides"
                  :key="i"
               >
                  <v-sheet
                  color="transparent"
                  height="100%"
                  >
                  <div class="d-flex fill-height justify-center align-center">
                     <div class="slide-wrapper">
                        <span class="text-h4">
                           {{slide.title}}   
                        </span>
                        <br>
                        <span class="text-h6">
                           {{slide.description}}
                        </span>
                     </div>
                     
                  </div>
                  </v-sheet>
               </v-carousel-item>
            </v-carousel>
         </div>
      <NuxtParticles
         id="tsparticles"
         :options="options"
         @load="onLoad"
         class="particles-wrapper"
      ></NuxtParticles>
   </div>
</template>
<script setup lang="ts">
import type { Container } from '@tsparticles/engine';
import burning from '/burning.jpg';


const slides = [
         {title: "Experiences", description: "9 years System Administrator, 5 years Deskop Application Development, 5 years Fullstack Web Development, 1 year AI Development and Research"},
         {title: "Fields", description: "Desktop Apps, Frontend Development, Backend Development, Database Design, Basic DevOps, Software Maintenance"},
         {title: "Programming Languages", description: "Javascript, Python, PHP, C#, C"},
         {title: "Technologies", description: "OpenAI, ES6, JQuery, React, Vue, Svelte, Angular, Express, Nest, Laravel, .Net, MS PowerApps"},
         {title: "Frameworks", description: "Nuxt, Next, Laravel, Express, FastAPI, LangChain, Meteor"},
        ];

const options = {
      background: {
         color: {
            value: 'transparent'
         }
      },
      fpsLimit: 80,
      interactivity: {
         events: {
               onClick: {
                  enable: true,
                  mode: 'push'
               },
               onHover: {
                  enable: true,
                  mode: 'repulse'
               },
         },
         modes: {
               bubble: {
                  distance: 400,
                  duration: 2,
                  opacity: 0.8,
                  size: 40
               },
               push: {
                  quantity: 4
               },
               repulse: {
                  distance: 200,
                  duration: 0.4
               }
         }
      },
      particles: {
         color: {
               value: '#ffffff'
         },
         links: {
               color: '#ffffff',
               distance: 150,
               enable: true,
               opacity: 0.5,
               width: 1
         },
         move: {
            direction: 'none',
            enable: true,
            outModes: 'bounce',
            random: false,
            speed: 2,
            straight: false
         },
         number: {
            density: {
               enable: true,
            },
            value: 120
         },
         opacity: {
               value: 0.5
         },
         shape: {
            type: 'circle'
         },
         size: {
            value: { min: 1, max: 5 }
         }
      },
      detectRetina: true
   }

   const onLoad = (container: Container) => {
   // Do something with the container
   container.pause()
   setTimeout(() => container.play(), 2000)
   }
</script>
<style scoped>
   .chatter-main {
      background: rgb(2,0,36);
background: radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(140,228,255,1) 0%, rgba(0,212,255,1) 0%, rgba(2,175,230,1) 31%, rgba(4,137,205,1) 61%, rgba(83,83,205,1) 100%);
      height: 100%;
      widows: 100%;
   }
   .slide-wrapper {
      max-width: 50%;
   }
</style>