<template>
   <div class="main-page">
      <div class="d-flex align-center flex-column mt-6">
         <v-card width="400" class="p-6">
            <v-card-item class="mb-6">
            <v-card-title>User Registration</v-card-title>

            <v-card-subtitle>Fill up the form.</v-card-subtitle>
            </v-card-item>

            <v-sheet class="mx-auto mb-6" width="300">
               <v-form fast-fail @submit.prevent>
                  <v-text-field
                  v-model="userCreds.email"
                  label="Username / Email"
                  ></v-text-field>

                  <v-text-field
                  v-model="userCreds.name"
                  label="Full Name"
                  ></v-text-field>

                  <v-text-field
                  type="password"
                  v-model="userCreds.password"
                  label="Password"
                  ></v-text-field>

                  <v-btn class="mt-2" type="submit" block @click="tryRegister">Register</v-btn>
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
      name: '',
   })

   // graphql queries --------------------------------
   const register = async () => {
      try {
         let user = toRaw(userCreds);
         return await GqlRegister(JSON.stringify({"email": user.email, "password": user.password, "name": user.name}));
      } catch(e) {
         console.log("Error while registering new user.", e);
         return null;
      }
   }


   // functions ----------------
   const tryRegister = async () => {
      const res = await register();

      if(res) {
         //store to localstorage
         nuxtStorage.localStorage.setData('token', res.register, 30, 'd');
         //redirect
         navigateTo('/todos');
      } else {
         nuxtStorage.localStorage.setData('token', null);
      }
   }
  
</script>
