const functions = require('firebase-functions');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

const firebaseApp = initializeApp(functions.config().firebase);
const firestore = getFirestore();
const auth = getAuth();

exports.ssr = functions.https.onRequest((request, response) => {
  response.set('cache-control', 'public, max-age=500, s-maxage=1000')
  response.send(`<h1>${Date.now()}</h1>`); 
});

exports.updateUserExpenses = functions.firestore
  .document('/users/{uid}')
  .onUpdate(async (change, context) => {
  // Get expenses collection!
      const { after } = change;
      const { uid } = context.params;
      const user = after.data();
      const expensesQuery = firestore.collection('expenses')
      .where('uid', '==', 'uid');
      const batch = firestore.batch();
      const snapshot = expenseQuery.get();
      snapshot.forEach(() => {
        // .ref bc we are referencing a doc... and we are grabbing the user's data.
        batch.update(snapshot.ref, { user });
      });
      return batch.commit();
});

// 3. When a user adds a collaboratorRequest to their "budget", look up the
// uid by their email, and if they exist add them as a collaborator.
exports.addCollaborator = functions.firestore
  .document('/budgets/{budgetId}/collaboratorRequests/{email}')
  .onCreate(async (snapshot, context) => {
    const { email } = context.params;
      // /budgets/{budgetId}/collaborators/{uid}
      // now create a varaibe for the uID document
      const uidDoc = firestore.collection('budgets')
      .doc(budgetId)
      .collection('collaborators') 
      .doc(userRecord.uid)

      return uidDoc.set({ role: 'collaborator' })
  });

// 4. When a user is created, check if they have any collaboratorRequests that
// exist and set them as collaborators.

exports.userCreated = functions.auth.user().onCreate(async user => {
  const db = getFirestore(firebaseApp);
  const groupQuery = db.collectionGroup('collaboratorRequests')
    .where('email', '==', user.email);
  // Add to collaboratos for each one
  const snapshots = await groupQuery.get();
  const batch = db.batch();
  snapshots.docs.forEach(d => {
    // bugdets/good_budget
    const budgetRef = d.ref.parent.parent;
    // budgets/good_budget/collaborators/david_123
    const collabDoc = budgetRef.collection('collaborators').doc(user.uid);
    batch.set(collabDoc, { role: 'admin' });
  });
  return batch.commit();
})

