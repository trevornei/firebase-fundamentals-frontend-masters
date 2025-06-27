import testing from "@firebase/rules-unit-testing"
import { readFileSync } from 'fs';
import test from 'ava';

const {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} = testing;

let testEnv = await initializeTestEnvironment({
  projectId: 'frontend-masters-firebase',
  firestore: {
    rules: readFileSync('firestore.rules', 'utf8'),
    host: 'localhost',
    port: 8080,
  },
});

function assertPermissionDenied(t, result) {
  t.is(result.code, 'permission-denied');
}

/*
// 1
test('An unauthenticated user fails to write to a profile', async (t) => {
  const context = testEnv.unauthenticatedContext('david_123');
  const userDoc = context.firestore().doc('users/david_123');
  const result = await assertSucceeds(userDoc.set({ name: 'Im david', email: 'blah@email.com' }));
  assertPermissionDenied(t, result);
});

// 2
test('An authenticated user can write their profile', async (t) => {
  // This time we will check what happens when the user is authenticated!!
  const context = testEnv.authenticatedContext('david_123');
  const userDoc = context.firestore().doc('users/david_123');
  // Test if the assertion succeeds!
  const result = await assertSucceeds(userDoc.set({ name: 'Im david', email: 'blah@email.com' }));
  t.is(result, undefined);
});




// 3
test('An unauthenticated user fails to write to expenses', async (t) => {

});

// 4
test('An authenticated user can write to expenses', async (t) => {

});
*/

// 4
test('A user must have a first name and email', async (t) => {
  // first name and email from the user object...
  const context = testEnv.authenticatedContext('david_123');
  const userDoc = context.firestore().doc('users/david_123');
  const result = await assertSucceeds(userDoc.set({ name: 'Im david', email: 'blah@email.com' }));
  t.is(result, undefined);
});

// 5
test('An expense must have a cost greater than 0', async (t) => {
  const context = testEnv.authenticatedContext('david_123');
  const expenseDoc = context.firestore().doc('expense/some_expense');
  const result = await assertFails(expenseDoc.set({cost: -11}));
  assertPermissionDenied(t, result); 
});

// 6
test('After expenses are created you cannot modify their dates', async (t) => {

});

// 7
test('Collaborators can read expenses', async (t) => {

});

// 8
test('Unauthenticated users cant read budgets', async (t) => {

});

// 9
test('Authenticated users can read budgets', async (t) => {

});
