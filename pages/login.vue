<template>
   <div class="main-page">
      <div class="d-flex align-center flex-column mt-6">
         <v-card width="400" class="p-6">
            <v-card-item>
            <v-card-title>User Login</v-card-title>

            <v-card-subtitle>Please use on of the emails from the index page.</v-card-subtitle>
            </v-card-item>

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
