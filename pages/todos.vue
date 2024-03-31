<template>
   <div class="main-page">
      <div class="d-flex align-center flex-column mt-6">
         <v-card width="70%" class="p-6">
            <div v-if="loggedIn">
               <v-card-title class="py-4">
                     Welcome, {{user.name}} ({{user.email}})
                     <v-btn density="compact" color="red" class="float-right" icon="mdi-power" title="Logout" @click="logout"></v-btn>
               </v-card-title>

               <v-card-subtitle>These are your Todos</v-card-subtitle>
               <v-row class="pa-2">
                  <v-col>
                     <v-btn v-if="user.todos.length > 0" color="red" size="small" class="text-none float-right mr-2" @click="deleteMultiple()">
                        <v-icon>mdi-delete</v-icon>
                        All Tasks
                     </v-btn>
                     <v-btn v-if="user.todos.filter(t => t.isDone == true).length > 0" color="red" size="small" 
                        class="text-none float-right mr-1"  @click="deleteMultiple('doneOnly')">
                        <v-icon>mdi-delete</v-icon>
                        Done
                     </v-btn>
                     <v-btn color="default" size="small" class="text-none float-right mr-6">
                        Done
                        <v-badge color="secondary" :content="user.todos.filter(t => t.isDone == true).length" size="x-large">
                           <v-icon>mdi-calendar-check-outline</v-icon>
                        </v-badge>
                     </v-btn>
                     <v-btn color="default" size="small" class="text-none float-right mr-1">
                        Pending
                        <v-badge color="success" :content="user.todos.filter(t => t.isDone == false).length" size="x-large">
                           <v-icon>mdi-calendar-check-outline</v-icon>
                        </v-badge>
                     </v-btn>
                     <v-btn color="default" size="small" class="text-none float-right mr-1">
                        All Tasks
                        <v-badge color="primary" :content="user.todos.length" size="x-large">
                           <v-icon>mdi-calendar-check-outline</v-icon>
                        </v-badge>
                     </v-btn>

                  </v-col>
               </v-row>
               
               <v-text-field
                  v-model="user.newTodo.description"
                  class="pa-6"
                  hint="Example: 'Find a good paying job to support the family's everlasting needs.'"
                  label="Type here to add a new Todo"
                  color="primary"
                  variant="underlined"
                  :append-inner-icon="user.newTodo.description ? 'mdi-send' : 'mdi-cancel'"
                  persistent-hint
                  @click:append-inner="addNewTodo"
                  @keyup="handleDescriptionChange"
               ></v-text-field>
               
               <v-list density="compact" class="todos-content">
                  <v-list-item v-for="userTodo in user.todos" :key="userTodo.id">
                     <div class="todo-item" :class="userTodo.isDone ? 'is-done' : 'not-done'">
                        <span v-if="!userTodo.editFlag" class="flex-row">
                           <v-btn 
                              class="ma-3"
                              density="compact"
                              :color="userTodo.isDone ? 'gray' : 'green'"
                              icon="mdi-check"
                              @click="clickUpdateTodoStatus(userTodo)"
                           >
                           </v-btn>
                           <span class="todo-description">
                              {{userTodo.description}}
                           </span>
                           <v-btn 
                              class="ma-3 float-right"
                              density="compact"
                              color="red"
                              icon="mdi-delete"
                              @click="clickDelete(userTodo)"
                           >
                           </v-btn>
                           <v-btn v-if="!userTodo.isDone"
                              class="ma-3 float-right"
                              density="compact"
                              color="blue"
                              icon="mdi-pencil"
                              @click="clickEdit(userTodo)"
                           >
                           </v-btn>
                        </span>
                        <span v-if="userTodo.editFlag" class="d-flex">
                           <v-text-field
                              class="ms-4"
                              v-model="userTodo.description"
                              color="primary"
                              variant="underlined"
                              @keyup="handleEditDescriptionChange($event, userTodo)"
                           ></v-text-field>
                           <v-btn 
                              class="ma-3 float-right"
                              density="compact"
                              color="success"
                              icon="mdi-content-save"
                              @click="clickSaveEdit(userTodo)"
                           >
                           </v-btn>
                           <v-btn 
                              class="ma-3 float-right"
                              density="compact"
                              color="red"
                              icon="mdi-cancel"
                              @click="clickCancelEdit(userTodo)"
                           >
                           </v-btn>
                        </span>
                     </div>
                  </v-list-item>
               </v-list>
            </div>
            <div v-else>
               <v-card-subtitle class="py-4">
                     Loading...
               </v-card-subtitle>
            </div>
            
         </v-card>
      </div>
   </div>
</template>
<script setup>
   import nuxtStorage from 'nuxt-storage';
   const loggedIn = ref(false);
   const userInfo = reactive({});
   let user = reactive({
      token: '',
      id: null,
      email: '',
      name: '',
      todos: [],
      newTodo: {
         description: ''
      },
      oldTodo: {}
   })
   let showNotification = ref(false);
   let notificationMessage = ref("");
   let notificationColor = ref("success");

   onMounted(() => {
      console.log('Mounted User Todos page.');
      //get token
      user.token = nuxtStorage.localStorage.getData('token');
      
      if(user.token) {
         //get user info
         getAuthProfile();
      } else {
         //relogin
         navigateTo('/login');
      }
   })

   //graphql queries --------------------
   const getAuthProfile = async () => {
      console.log('Getting getAuthProfile.');
      try {
         attachAuthHeader();
         const {profile} = await GqlProfile();
         console.log(profile);

         if(profile) {
            loggedIn.value = true;
            user.id = profile.id,
            user.email = profile.email;
            user.name = profile.name;

            //get User Todos
            getAuthProfileTodos();
         }
      } catch(e) {
         loggedIn.value = false;
         user.id = null;
         user.email = '';
         user.name = '';
         console.log("Error while getting getAuthProfile.", e)
      }
   }
   const getAuthProfileTodos = async () => {
      console.log('Getting Profile Todos.');
      try {
         attachAuthHeader();
         const {profileTodos} = await GqlProfileTodos(JSON.stringify({"user_id": user.id}));
         console.log(profileTodos);

         if(profileTodos) {
            profileTodos.forEach(todo => {
               todo.editFlag = false;
            });
            user.todos = profileTodos;
         }
      } catch(e) {
         console.log("Error while getting getAuthProfile.", e)
      }
   }

   const addTodo = async (description) => {
      if(description.length > 0) {
         let tempTodo = null;
         try {
            // insert in-memory data first - spoofing the user/app
            let now = new Date();
            tempTodo = {"id": now.getTime(),"description": description, "user_id": user.id, isDone: false};
            user.todos.push(tempTodo);

            //actual database query via graphql
            attachAuthHeader();
            const res = await GqlCreateProfileTodo(JSON.stringify({"description": description, "user_id": user.id}));
            user.newTodo.description = '';
            
            getAuthProfileTodos();
            console.log('Reloaded Todos: ', res);
            showNotificationMessage("A Todo item has been added.", "success");
            return res;
         } catch(e) {
            console.log("Error while creating new Todo item.", e);
            showNotificationMessage("Sorry, an error occured while adding a new Todo item", "error");
            //revert
            let todoIndex = user.todos.findIndex(t => t.id == tempTodo.id);
            user.todos.splice(todoIndex, 1);
            return null;
         }
      } else {
         console.log('Description and User ID must have a value.');
         showNotificationMessage("Please input Todo description", "warning");
      }
   }

   const updateTodo = async (data) => {
      let todo = toRaw(data);
      if(todo) {
         try {
            attachAuthHeader();
            const res = await GqlUpdateProfileTodo(JSON.stringify({"todo_id": todo.id, "description": todo.description, "isDone" : todo.isDone}));
            console.log(res)
            return res;
         } catch(e) {
            console.log("Error while editing todo.", e);
            showNotificationMessage("Sorry, an error occured while updating a Todo item", "error");
            return null;
         }
      } else {
         console.log('Data is empty.')
      }
   }

   const deleteTodo = async (data) => {
      let todo = toRaw(data);
      if(todo) {
         try {
            //keep a copy of the old todo
            user.oldTodo = todo;
            const res = await GqlDeleteProfileTodo(JSON.stringify({"todo_id": todo.id}));
            return res;
         } catch(e) {
            console.log("Error while deleting todo.", e);
            //restore the old copy
            user.todos.push(user.oldTodo);
            showNotificationMessage("Sorry, an error occured while deleting a Todo item", "error");
            return null;
         }
      } else {
         console.log('Data is empty.')
      }
   }

   //functions ---------------------------
   const clickEdit = (todo) => {
      todo.editFlag = true;
      
      //keep a copy of the original for error purposes
      user.oldTodo = todo;
      
      //store the original description just in case the user cancels the edit
      todo.origDescription = todo.description;
   }

   const clickCancelEdit = (todo) => {
      //revert
      todo.description = todo.origDescription;

      todo.editFlag = false;
   }

   const clickSaveEdit = (todo) => {
      //query
      if(updateTodo(todo)){
         todo.editFlag = false;
         showNotificationMessage("A Todo item has been updated.", "success");
      } else {
         //revert
         todo.description = todo.origDescription;
      }
   }
   

   const attachAuthHeader = () => {
      //attach auth header before doing query
      return useGqlHeaders({'Authorization': `Bearer ${user.token}`});
   }
   const clickUpdateTodoStatus = (todo) => {
      //update in-memory data first
      todo.isDone = !todo.isDone;
      //query
      if(updateTodo(todo)) {
         showNotificationMessage("A Todo item has been updated.", "success");
      } else {
         //revert back the change
         todo.isDone = !todo.isDone;
      }
   }

   const clickDelete = (todo) => {
      //delete in-memory data first
      let todoIndex = user.todos.findIndex(t => t.id == todo.id);
      user.todos.splice(todoIndex, 1);

      if(deleteTodo(todo)) {
         showNotificationMessage("A Todo item has been deleted.", "success");
      }
      //the revert is inside the deleteTodo()
   }

   const addNewTodo = () => {
      //get the raw value before sending to API
      let newTodo = toRaw(user.newTodo);
      
      addTodo(newTodo.description)
   }

   const handleDescriptionChange = (event) => {
      user.newTodo.description = event.target.value

      //when user presses Enter key, perform addNewTodo()
      if(event.keyCode == 13) {
         addNewTodo();
      }
   }
   
   const handleEditDescriptionChange = (event, todo) => {
      if(event.keyCode == 13) {
         clickSaveEdit(todo);
      }
   }

   const deleteMultiple = (scope) => {
      //get raw copy
      let userTodosRaw = toRaw(user.todos);

      //delete only todos with isDone is true
      if(scope == 'doneOnly') {
         let toDelete = userTodosRaw.filter(t => t.isDone == true);
         //spoof delete
         user.todos = userTodosRaw.filter(t => t.isDone == false);

         //actual delete
         toDelete.forEach(todo => {
            deleteTodo(todo);
         });

         showNotificationMessage("Done Todos have been deleted.", "success");
      } else {
         //spoof delete all
         user.todos = [];
         //delete all
         userTodosRaw.forEach(todo => {
            deleteTodo(todo);
         });

         showNotificationMessage("All Todos have been deleted.", "success");
      }
      getAuthProfileTodos();
   }

   const logout = () => {
      user.id = null;
      user.email = '';
      user.name = '';
      loggedIn.value = false;
      //remove token
      nuxtStorage.localStorage.setData('token', null);
      navigateTo('/login');
   }
   const showNotificationMessage = (errorMsg, color) => {
      notificationMessage.value = errorMsg;
      notificationColor.value = color;
      showNotification.value = true;
   }

</script>