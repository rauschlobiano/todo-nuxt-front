<template>
   <div class="main-page">
      <div class="d-flex align-center flex-column mt-6">
         <v-card width="400" class="p-6">
            <v-card-title class="mb-6">
               User Login

               <v-btn
                  append-icon="mdi-home"
                  prepend-icon="mdi-arrow-left-bold-circle"
                  class="float-right ma-2"
                  variant="elevated"
                  elevation=3
                  @click="navigateTo('/')"
               >
                  <template v-slot:prepend>
                  <v-icon color="success"></v-icon>
                  </template>

                  HOME

                  <template v-slot:append>
                  <v-icon color="warning"></v-icon>
                  </template>
               </v-btn>
            </v-card-title>


            <v-sheet class="mx-auto mb-6" width="300">
               <v-form fast-fail @submit.prevent>
                  <v-text-field
                  v-model="userCreds.email"
                  label="Username / Email"
                  ></v-text-field>

                  <v-text-field
                  type="password"
                  v-model="userCreds.password"
                  label="Password (Default is 'password')"
                  ></v-text-field>

                  <v-btn class="mt-2" type="submit" block @click="tryLogin">Login</v-btn>
               </v-form>
            </v-sheet>
         </v-card>
      </div>
   </div>
</template>
<script setup>
   import nuxtStorage from 'nuxt-storage';

   let userCreds = reactive({
      email: '',
      password: '',
      device: 'web',
   })

   // graphql queries --------------------------------
   const login = async () => {
      try {
         let user = toRaw(userCreds);
         return await GqlLogin(JSON.stringify({"email": user.email, "password": user.password, "device": user.device}));
      } catch(e) {
         console.log("Error while login.", e);
         return null;
      }
   }


   // functions ----------------
   const tryLogin = async () => {
      const res = await login();

      console.log(res);
      if(res) {
         //store to localstorage
         nuxtStorage.localStorage.setData('token', res.login, 30, 'd');
         //redirect
         navigateTo('/todos');
      } else {
         nuxtStorage.localStorage.setData('token', null);
      }
   }
  
</script>
