<template>
   <div>
      <v-container>
         <v-row align="center" justify="center">
            <v-col cols="auto">
            <v-btn density="compact">Compact Button</v-btn>
            </v-col>

            <v-col cols="auto">
            <v-btn density="comfortable">Comfortable Button</v-btn>
            </v-col>

            <v-col cols="auto">
            <v-btn density="default">Default Button</v-btn>
            </v-col>
         </v-row>
      </v-container>
      <div class="d-flex align-center flex-column">
         <div class="text-subtitle-2">With props</div>
         <v-card
            subtitle="This is a subtitle"
            text="This is content"
            title="This is a title"
            width="400"
         ></v-card>

         <div class="mt-4 text-subtitle-2">With slots</div>

         <v-card width="400">
            <template v-slot:title>
            This is a title
            </template>

            <template v-slot:subtitle>
            This is a subtitle
            </template>

            <template v-slot:text>
            This is content
            </template>
         </v-card>

         <div class="mt-4 text-subtitle-2">With markup</div>

         <v-card width="400">
            <v-card-item>
            <v-card-title>This is a title</v-card-title>

            <v-card-subtitle>This is a subtitle</v-card-subtitle>
            </v-card-item>

            <v-card-text>
            This is content
            </v-card-text>
         </v-card>
      </div>
   </div>
</template>
<script setup>


</script>