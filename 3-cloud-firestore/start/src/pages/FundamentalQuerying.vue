<script setup>
import { onMounted, reactive, onBeforeUnmount } from 'vue';
import ExpenseExcersize from '../components/ExpenseExcersize.vue'
import { getFirebase } from '../firebase';
import { collection, onSnapshot, limit, query, where, orderBy } from 'firebase/firestore';

const { firestore } = getFirebase();
const usersCol = collection(firestore, 'users');
const expensesCol = collection(firestore, 'expenses');
// // 1. Get the first 200 expenses.

// Patterns:
// 1) Pass in the collection that you want to query.
// 2) Set your limit(<value>)


/*
const expensesQuery = query(
  expensesCol,
  limit(200)
);
*/

 // 2. Get all expenses categorized as 'pets'
const expensesQuery = query(
  expensesCol, 
  where('category', '==', 'pets'),
  limit(20)
);

// // 3. Get all expenses less than $200, ordered from greatest to least

//const expensesQuery = query(
//  expensesCol,
//  where('cost', '<', '200'),
//  orderBy('cost', 'desc'),
//  limit(20)
//);

// // 4. Get all expenses that occurred before July of 2021
//const expensesQuery = query(
//  expensesCol,
//  where('date', '<', new Date('07/01/2021')),
//);

// 5. Get all expenses between July 2021 and October 2021
//const expensesQuery = query(
//  expensesCol,
//  where('date', '>', new Date('07/01/2021')),
//  where('date', '<', new Date('10/01/2021'))
//  limit(100)
//);

// Composite queries below

// 6. Get all expenses between July 2021 and October 2021 categorized as 'fun'
//const expensesQuery = query(
//  expensesCol,
//  where('date', '>', new Date('07/01/2021')),
//  where('date', '<', new Date('10/01/2021')),
//  where('category', '==', 'fun'),
//  limit(100)
//);

// // 7. Get all expenses are NOT categorized as 'fun', 
// 'clothes', 'gifts', 'home', and 'personal'
//const expensesQuery = query(
//  expensesCol, 
//  where('category', 'not-in', ['fun', 'clothes', 'gifts', 'home', 'personal'])
//  limit(100)
//);

// 8. Get all expenses are categorized as 'food' that occurred in January 2021,
// but not on 12/26/2021
//const expensesQuery = query(
//  expensesCol,
//  where('category', 'in', ['food']),
//  where('date', '>', new Date('11/31/2021')),
//  where('date', '<', new Date('01/1/2022')),
//  where('date', '!=', new Date('12/26/2021')),
//);

const state = bindToTable(expensesQuery)

function bindToTable(expensesQuery) {
  const state = reactive({ results: [] });
  let subscription = null;
  onMounted(() => {
    subscription = bindToState(state, expensesQuery);
  });
  onBeforeUnmount(() => {
    subscription();
  });
  return state;
}

function bindToState(state, query, transform = formatExpense) {
  return onSnapshot(query, snapshot => {
    state.results = snapshot.docs.map(transform);
  });
}

function formatExpense(docSnapshot) {
  const { uid, cost, category, date: rawDate } = docSnapshot.data();
  const dateConfig = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Intl.DateTimeFormat('en', dateConfig).format(rawDate.toDate());
  const { fromCache } = docSnapshot.metadata;
  return { uid, cost, category, fromCache, date };
}
</script>

<template>
  <main>    
    <ExpenseExcersize 
      number="2"
      subtitle="The basics of querying"
      :results="state.results" />
  </main>

</template>

<style>

</style>
