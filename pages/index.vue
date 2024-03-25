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
                  <div v-if="appData.userTodos">
                     <v-text-field
                        v-model="appData.newTodo.description"
                        class="pa-4"
                        hint="Example: 'Find a good paying job to support the family's needs.'"
                        label="Add a new Todo"
                        variant="outlined"
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
                                 >
                                 </v-btn>
                                 <v-btn 
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
                     <h5>User has no Todos.</h5>
                  </div>
               </v-card-text>
            </v-card>
         </v-col>
      </v-row>
      <div v-else>
         <h3>No Data to load</h3>
      </div>
   </div>
</template>
<script setup>
   //data --------------------------------------------
   let appData = reactive({
      users: [],
      userTodos: [],
      selectedUser: {},
      newTodo: {
         description: null
      }
   })
   let editFlag = ref(false);

   //no need to be reactive
   let origDescription = '';

   //hooks --------------------------------------------
   onMounted(async () => {
      console.log("Index is mounted.")
      await getAllUsers();
   })
   
   //queries ------------------------------------------
   const getAllUsers = async () => {
      console.log('Getting all users.')
      try {
         const { users } = await GqlAllUsers();
         if(users.data) {
            appData.users = users.data;
         }
      } catch(e) {
         console.log("Error while getting all users.", e)
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
      }
   }

   const addTodo = async (description) => {
      if(description) {
         try {
            const res = await GqlCreateTodo(JSON.stringify({"description": description, "user_id": appData.selectedUser.id}));
            
            console.log('Res: ', res);
            getUserTodos(appData.selectedUser.id);
            appData.newTodo.description = '';
         } catch(e) {
            console.log("Error while creating new todo.", e)
         }
      } else {
         console.log('Description and User ID must have a value.')
      }
   }

   const clickEdit = (todo) => {
      console.log('Start editing')
      todo.editFlag = true;
      //store the original description just in case the user cancels the edit
      todo.origDescription = todo.description;
   }

   const clickCancelEdit = (todo) => {
      console.log('Cancel editing');
      todo.description = todo.origDescription;
      todo.editFlag = false;
   }

   const clickSaveEdit = (todo) => {
      console.log('Save editing')
      //query
      updateTodo(todo);

      todo.editFlag = false;
   }

   const clickUpdateTodoStatus = (todo) => {
      //update in-memory data first
      todo.isDone = !todo.isDone;
      // let todoIndex = appData.userTodos.findIndex(t => t.id == todo.id);
      // appData.userTodos[todoIndex].isDone = !todo.isDone;
      
      //query
      updateTodo(todo);
   }

   const updateTodo = async (data) => {
      // then update database
      let todo = toRaw(data);
      if(todo) {
         try {
            const res = await GqlUpdateTodo(JSON.stringify({"todo_id": todo.id, "description": todo.description, "isDone" : todo.isDone}));
            console.log('Res: ', res);
         } catch(e) {
            console.log("Error while editing todo.", e)
         }
      } else {
         console.log('Description and User ID must have a value.')
      }
   }

   //functions ----------------------------------------

   const setSelectedUser = (user) => {
      console.log('setSelectedUser', user);
      appData.selectedUser = user;
      getUserTodos(user.id);
   }

   const addNewTodo = async () => {
      //get the raw value before sending to API
      let newTodo = toRaw(appData.newTodo)
      let userID = toRaw(appData.selectedUser)
      console.log('Add new', newTodo);
      await addTodo(newTodo.description, userID.id);
   }
   const handleDescriptionChange = (event) => {
      appData.newTodo.description = event.target.value
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