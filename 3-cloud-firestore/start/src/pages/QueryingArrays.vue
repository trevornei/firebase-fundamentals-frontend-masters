<script setup>
import { onMounted, reactive, onBeforeUnmount } from 'vue';
import ExpenseExcersize from '../components/ExpenseExcersize.vue'
import { getFirebase } from '../firebase';
import { collection, onSnapshot, limit, query, where, orderBy } from 'firebase/firestore';

const { firestore } = getFirebase();
const expensesCol = collection(firestore, 'expenses');


// // 1. Get the first 100 categories that are categorized as 'fun' AND 'kids'
//const expensesQuery = query(
//  expensesCol,
//  where('categories', '==', ['fun', 'kids'])
//);


// // 2. Get the first 25 categories that are categorized as ONLY 'fun' OR 'kids'
//const expensesQuery = query(
//  expensesCol, 
//  where('categories', 'array-contains-any', ['kids', 'fun'])
//);

// // 3. Get the first 10 categories that contain the 'fun' category
//const expensesQuery = query(
//  expensesCol,
//  where('categories', 'array-contains', 'fun'),
//  limit(10)
//);

// // 4. Get the first 25 categories that contain the 'fun' OR 'kids' category
//const expensesQuery = query(

//);

// // 5. Get the first 25 expenses that occurred in January 2021, 
// // but not on 12/30/2021, 12/26/2021, 12/23/2021, or 12/28/2021
const expensesQuery = query(
  expensesCol,
  where('category', 'in', ['food']),
  where('date', '>', new Date('11/31/2021')),
  where('date', '<', new Date('01/1/2022')),
  where('date', '!=', [
    new Date('12/30/2021'),
    new Date('12/26/2021'),
    new Date('12/28/2021')
  ]),
);

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

function bindToState(state, query, transform) {
  return onSnapshot(query, snapshot => {
    const callbackFn = transform == null ? formatExpense : transform;
    state.results = snapshot.docs.map(d => {
      return callbackFn(snapshot, d);
    });
  });
}

function formatExpense(snapshot, d) {
  const { uid, cost, categories, date: rawDate } = d.data();
  const dateConfig = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Intl.DateTimeFormat('en', dateConfig).format(rawDate.toDate());
  const { fromCache } = snapshot.metadata;
  return { uid, cost, categories: categories.join(', ') , fromCache, date };
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
