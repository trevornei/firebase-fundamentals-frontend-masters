<script setup>
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router'
import { snarkdownEnhanced as snarkdown } from '../util';
import { initializeApp } from 'firebase/app';
import { config } from '../config';
// Each subpackage will have getter methods...
import { getFirestore, collection, doc, onSnapshot } from 'firebase/firestore';

const firebaseApp = initializeApp(config.firebase);
const firestore = getFirestore(firebaseApp);
// Lets grab data using collections!
const markdownsCol = collection(firestore, "markdowns");
const route = useRoute();
const markdownDoc = doc(markdownsCol, route.params.id);
const state = reactive({ });



onMounted(() => {

// onSnaphot() allows us to synchronize data in realtime within our editor.
  // When there is a document, use snapshot to sync data from the database.
  onSnapshot(markdownDoc, snapshot => {
    const data = snapshot.data(); 
    state.markdown = data.markdown;
    state.converted = data.converted;
  })

})

function convert(event) {
  const markdown = event.target.value;
  const converted = snarkdown(markdown);
  state.converted = converted;
}

</script>

<template>
  <h3>Editor</h3>
  <router-link to="/dashboard">&lt; Dashboard</router-link>
  <div id="editor">
    <textarea @keyup="convert" v-model="state.markdown"></textarea>
    <div class="output" v-html="state.converted"></div>
  </div>
</template>

<style>
#editor {
  display: grid;
  gap: 40px;
  grid-template-columns: 1fr 1fr;
  margin-block-start: 8px;
  height: 100vh;
}
#editor h1,
#editor h2,
#editor h3,
#editor h4,
#editor h5 {
  margin-block-end: 8px;
}
#editor .output p {
  line-height: 1.5;
  margin-block-end: 12px;
}
</style>
