<template>
   <div class="main-page">
      <v-app-bar :elevation="2" rounded >
         <v-app-bar-title>Simple Todo App</v-app-bar-title>
      </v-app-bar>
      <v-row v-if="appData.users" class="todo-container">
         <v-col cols="4">
            <v-card class="left-container">
               <v-card-title>Users</v-card-title>
               <v-card-subtitle>Click one to load Todos.</v-card-subtitle>
               <v-card-text>
                  <v-list density="compact" class="container-content">
                     <v-list-item v-for="user in appData.users" :key="user.id" :title="user.name" 
                        :value="user.id" class="" @click="setSelectedUser(user)">
                        <span class="text-caption">{{user.email}}</span>
                     </v-list-item>
                  </v-list>
               </v-card-text>
               <div class="text-caption pa-5 mt-3">
                  Note: This is not the ideal implementation of a Todo-App but to save your time from logging-in and logging-out, 
                  I supplied this handy list to view each User's respective Todos.
               </div>
            </v-card>
         </v-col>
         <v-col cols="8">
            <v-card class="right-container">
               <v-card-title>
                  User Todos
               </v-card-title>
               
               <v-card-text>
                  <div v-if="appData.selectedUser.id">
                     <v-row class="pr-2">
                        <v-col>
                           <v-btn v-if="appData.userTodos.length > 0" color="red" size="small" class="text-none float-right mr-2" @click="deleteMultiple()">
                              <v-icon>mdi-delete</v-icon>
                              All Tasks
                           </v-btn>
                           <v-btn v-if="appData.userTodos.filter(t => t.isDone == true).length > 0" color="red" size="small" 
                              class="text-none float-right mr-1" @click="deleteMultiple('doneOnly')">
                              <v-icon>mdi-delete</v-icon>
                              Done
                           </v-btn>
                           <v-btn color="default" size="small" class="text-none float-right mr-6">
                              Done
                              <v-badge color="secondary" :content="appData.userTodos.filter(t => t.isDone == true).length" size="x-large">
                                 <v-icon>mdi-calendar-check-outline</v-icon>
                              </v-badge>
                           </v-btn>
                           <v-btn color="default" size="small" class="text-none float-right mr-1">
                              Pending
                              <v-badge color="success" :content="appData.userTodos.filter(t => t.isDone == false).length" size="x-large">
                                 <v-icon>mdi-calendar-check-outline</v-icon>
                              </v-badge>
                           </v-btn>
                           <v-btn color="default" size="small" class="text-none float-right mr-1">
                              All Tasks
                              <v-badge color="primary" :content="appData.userTodos.length" size="x-large">
                                 <v-icon>mdi-calendar-check-outline</v-icon>
                              </v-badge>
                           </v-btn>

                        </v-col>
                     </v-row>
                     
                     <v-text-field
                        v-model="appData.newTodo.description"
                        class="pa-6"
                        hint="Example: 'Find a good paying job to support the family's everlasting needs.'"
                        label="Type here to add a new Todo"
                        color="primary"
                        variant="underlined"
                        :append-inner-icon="appData.newTodo.description ? 'mdi-send' : 'mdi-cancel'"
                        persistent-hint
                        @click:append-inner="addNewTodo"
                        @keyup="handleDescriptionChange"
                     ></v-text-field>
                     
                     <v-list density="compact" class="container-content">
                        <v-list-item v-for="userTodo in appData.userTodos" :key="userTodo.id">
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
                     <h5>Select a User from the sidebar.</h5>
                  </div>
               </v-card-text>
            </v-card>
         </v-col>
      </v-row>
      <div v-else>
         <h3>No Users data to load</h3>
      </div>
      <v-snackbar
         v-model="showNotification"
         :color="notificationColor" 
      >
         {{notificationMessage}}
         <template v-slot:actions>
            <v-btn
               color="white"
               variant="text"
               @click="showNotification = false"
            >
               Close
            </v-btn>
         </template>
      </v-snackbar>
   </div>
</template>
<script setup>
   //data --------------------------------------------
   let appData = reactive({
      users: [],
      userTodos: [],
      selectedUser: {},
      newTodo: {
         description: ''
      },
      oldTodo: {}
      
   });
   let showNotification = ref(false);
   let notificationMessage = ref("");
   let notificationColor = ref("success");

   //hooks -------------------------------------------------------
   onMounted(async () => {
      console.log("Index is mounted.")
      await getAllUsers();
   })
   
   //graphql queries ----------------------------------------------
   const getAllUsers = async () => {
      console.log('Getting all users.')
      try {
         const { users } = await GqlAllUsers();
         if(users.data) {
            appData.users = users.data;
         }
      } catch(e) {
         console.log("Error while getting all users.", e)
         showNotificationMessage("Sorry, an error occured while getting all Users", "error");
      }
   }
   const getUserTodos = async (user_id) => {
      console.log('Getting userTodos.')
      try {
         const { todos } = await GqlUserTodos(JSON.stringify({"user_id": user_id}));
         console.log('todos: ', todos)
         if(todos) {
            todos.forEach(todo => {
               todo.editFlag = false;
            });
            appData.userTodos = todos;
         }
      } catch(e) {
         console.log("Error while getting user todos.", e)
         showNotificationMessage("Sorry, an error occured while getting all Todos", "error");
      }
   }

   const addTodo = async (description) => {
      if(description.length > 0) {
         try {
            // insert in-memory data first - spoofing the user/app
            let now = new Date();
            let tempTodo = {"id": now.getTime(),"description": description, "user_id": appData.selectedUser.id, isDone: false};
            appData.userTodos.push(tempTodo);

            //actual database query via graphql
            const res = await GqlCreateTodo(JSON.stringify({"description": description, "user_id": appData.selectedUser.id}));
            appData.newTodo.description = '';
            
            getUserTodos(appData.selectedUser.id);
            console.log('TRUE: ', res);
            showNotificationMessage("A Todo item has been added.", "success");
            return res;
         } catch(e) {
            console.log("Error while creating new Todo item.", e);
            showNotificationMessage("Sorry, an error occured while adding a new Todo item", "error");
            //revert
            let todoIndex = appData.userTodos.findIndex(t => t.id == tempTodo.id);
            appData.userTodos.splice(todoIndex, 1);
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
            const res = await GqlUpdateTodo(JSON.stringify({"todo_id": todo.id, "description": todo.description, "isDone" : todo.isDone}));
            
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
            appData.oldTodo = todo;
            
            const res = await GqlDeleteTodo(JSON.stringify({"todo_id": todo.id}));

            return res;
         } catch(e) {
            console.log("Error while deleting todo.", e);
            //restore the old copy
            appData.userTodos.push(appData.oldTodo);
            showNotificationMessage("Sorry, an error occured while deleting a Todo item", "error");
            return null;
         }
      } else {
         console.log('Data is empty.')
      }
   }


   //functions ---------------------------------------------------

   const setSelectedUser = (user) => {
      appData.selectedUser = user;
      getUserTodos(user.id);
   }

   const clickEdit = (todo) => {
      todo.editFlag = true;
      
      //keep a copy of the original for error purposes
      appData.oldTodo = todo;
      
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
      let todoIndex = appData.userTodos.findIndex(t => t.id == todo.id);
      appData.userTodos.splice(todoIndex, 1);

      if(deleteTodo(todo)) {
         showNotificationMessage("A Todo item has been deleted.", "success");
      }
      //the revert is inside the deleteTodo()
   }


   const addNewTodo = () => {
      //get the raw value before sending to API
      let newTodo = toRaw(appData.newTodo);
      let userID = toRaw(appData.selectedUser);
      
      addTodo(newTodo.description, userID.id)
   }

   const handleDescriptionChange = (event) => {
      appData.newTodo.description = event.target.value

      //when user presses Enter key, perform addNewTodo()
      if(event.keyCode == 13) {
         addNewTodo();
      }
   }

   const deleteMultiple = (scope) => {
      //get raw copy
      let userTodosRaw = toRaw(appData.userTodos);

      //delete only todos with isDone is true
      if(scope == 'doneOnly') {
         let toDelete = userTodosRaw.filter(t => t.isDone == true);
         //spoof delete
         appData.userTodos = userTodosRaw.filter(t => t.isDone == false);

         //actual delete
         toDelete.forEach(todo => {
            deleteTodo(todo);
         });

         showNotificationMessage("Done Todos have been deleted.", "success");
      } else {
         //spoof delete all
         appData.userTodos = [];
         //delete all
         userTodosRaw.forEach(todo => {
            deleteTodo(todo);
         });

         showNotificationMessage("All Todos have been deleted.", "success");
      }
      getUserTodos(appData.selectedUser.id);
   }

   const showNotificationMessage = (errorMsg, color) => {
      notificationMessage.value = errorMsg;
      notificationColor.value = color;
      showNotification.value = true;
   }

</script>
<style lang="scss" scoped>
   .main-page {
      background: radial-gradient(circle at top, #268253 , #80cb8d);
      height: 100%;
   }
   .todo-container {
      margin-top: 80px;
      height: 80%;
   }
   .left-container {
      margin-left: 20px;
      height: 100%;

   }
   .right-container {
      margin-right: 20px;
      height: 100%;
   }

   .container-content {
      max-height: 500px;
      overflow-x: hidden;
      overflow-y: auto;
   }
   .todo-item {
      border-radius: 10px;
      background: transparent !important;
   }
   .is-done {
      color: gray;
      text-decoration: line-through;
      border: 2px solid lightgray;
   }
   .not-done {
      color: darkgreen;
      text-decoration: none;
      border: 2px solid lightgreen;
   }
</style>