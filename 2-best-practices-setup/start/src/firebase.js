// This is not definitively the best way to write some firebase initialization logic.
// ... but foundationally this is a great way to manage things like.
// { initializeApp, firestore, firebase, yatta-yatta } 

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { config } from './config' 

// Delta: Firebase has connect to emulators.

export function initialize() {
  const firebaseApp = initializeApp(config.firebase);
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  
  // Let's connect out to the emulators... if connection is local host!
  // We COULD use webpack and other build tools to do this logic but this is fine for now!

  if (location.hostname === 'localhost') {
    console.log(`The hostname for this project is: ${location.hostname}`);
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: false});
    connectFirestoreEmulator(firestore, 'localhost', 8080 );
  }

  return { firebaseApp, auth, firestore }
};

