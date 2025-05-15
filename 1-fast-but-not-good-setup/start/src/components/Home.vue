<script setup>
import { useRouter } from 'vue-router'
// Import: initializeApp, config, var for firebaseApp
import { initializeApp } from 'firebase/app';
import { config } from '../config';
// Remember every subpackage has a getter function!!!!
import { getAuth, signInAnonymously } from 'firebase/auth';

const app = initializeApp(config.firebase);
const auth = getAuth(app)
const router = useRouter();

async function signIn() {
  const results = await signInAnonymously(auth);

  router.push(`/dashboard`);
}

</script>

<template>
  <h1>I am the home page</h1>
  <h5>You should sign in here</h5>
  <button @click="signIn">Sign In</button>
</template>
