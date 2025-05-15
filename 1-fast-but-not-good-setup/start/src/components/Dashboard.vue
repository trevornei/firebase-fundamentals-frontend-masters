<script setup>
import { onMounted, reactive, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { config } from '../config';
import { getFirestore, collection, doc, onSnapshot, setDoc } from 'firebase/firestore';

const state = reactive({ markdowns: [] });
const router = useRouter();
const firebaseApp = initializeApp(config.firebase)
const auth = getAuth(firebaseApp)
const firestore = getFirestore(firebaseApp);
const markdownsCol = collection(firestore, "markdowns");

console.log(`Testing the value of firebasApp variable: ${firebaseApp}`);
console.log(`Testing the value of Auth variable: ${auth}`);

onBeforeMount(async () => {
  state.user = auth.currentUser;
  console.log(`Test Output Authenticated Anon User: ${auth.currentUser}`)
})

onMounted(() => {
  onSnapshot(markdownsCol, snapshot => {
    state.markdowns = snapshot.docs.map(d => {})
  })  
})

function newMarkdown() {
  const newId = Math.random().toString(36).substr(2, 5);
  router.push(`/editor/${newId}`)
}
</script>

<template>
  <h1>I am the dashboard</h1>

  <ul v-for="markdown in state.markdowns" :key="markdown.id">
    <li>
      <router-link :to="{ path: `/editor/${markdown.id}` }">{{ markdown.id }}</router-link>
    </li>
  </ul>

  <button @click="newMarkdown">New</button>

</template>
