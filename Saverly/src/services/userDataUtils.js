// userDataUtils.js
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig'; // Make sure this path matches your project structure

export const fetchUserDataAsString = async () => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  if (!userId) {
    return 'No user logged in';
  }

  // Fetch user's income and expenses
  const userDocRef = doc(FIREBASE_DB, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    return 'No such user!';
  }

  const { income = 0, expenses = 0 } = userDocSnap.data();
  const balance = income - expenses;

  // Fetch individual expenses
  const expensesCollectionRef = collection(FIREBASE_DB, 'users', userId, 'expenses');
  const expensesSnapshot = await getDocs(expensesCollectionRef);
  const individualExpenses = expensesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Format the data as a string
  let expensesDetails = individualExpenses.map(expense => `ID: ${expense.id}, Amount: ${expense.amount}, Category: ${expense.category}`).join('; ');
  let userDataString = `Income: ${income}, Expenses: ${expenses}, Balance: ${balance}, Individual Expenses: [${expensesDetails}]`;

  return userDataString;
};
