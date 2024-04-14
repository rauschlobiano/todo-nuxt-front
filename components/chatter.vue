<template>
   <div class="chat-main">
      <v-card
         class="mx-auto"
         prepend-icon="mdi-chat"
         width="700"
      >
         <template v-slot:title>
            Chatter
         </template>
         <!-- <form @submit.prevent="sendMessage">
            <input type="text" v-model="message">
            <button type="submit">Send</button>
         </form>

         <div class="chat-container">
            <p v-for="(msg, index) in history" :key="msg+index">
               {{msg}}
            </p>
         </div> -->
      </v-card>
      
   </div>
</template>
<script setup lang="ts">

   // const { status, data, send, open, close} = useWebSocket(`ws://${location.host}/api/websocket`);
   // const history = ref<string[]>([]);
   // const message = ref('');

   // watch(data, (newValue: any) => {
   //    history.value.push(`Server: ${newValue}`)
   // })

   // const sendMessage = () => {
   //    send(message.value);
   //    message.value = '';
   // }

</script>
<style>
   .chat-main {
      position: absolute;
      z-index: 9999;
   }
   .chat-container {
      max-height: 500px;
      overflow: auto;
   }
</style>