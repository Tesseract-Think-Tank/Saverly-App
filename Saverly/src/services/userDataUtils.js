import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig';

export const fetchUserDataAsString = async () => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  if (!userId) {
    return 'No user logged in';
  }

  const userDocRef = doc(FIREBASE_DB, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    return 'No such user!';
  }

  const { income = 0, expenses = 0 } = userDocSnap.data();
  let balance = income - expenses;

  const expensesCollectionRef = collection(FIREBASE_DB, 'users', userId, 'expenses');
  const expensesSnapshot = await getDocs(expensesCollectionRef);

  const exchangeRates = {
    'EUR:RON': 5, 'RON:EUR': 0.2,
    'USD:RON': 4.57, 'RON:USD': 0.22,
    'GBP:RON': 5.82, 'RON:GBP': 0.17,
  };

  let totalConvertedExpenses = 0;
  const individualExpenses = expensesSnapshot.docs.map(doc => {
    const expenseData = doc.data();
    const exchangeRate = exchangeRates[`${expenseData.currency}:RON`] || 1;
    const convertedAmount = expenseData.amount * exchangeRate;
    totalConvertedExpenses += convertedAmount;
    return {
      id: doc.id,
      amount: convertedAmount.toFixed(2), // rounding to 2 decimal places for currency
      category: expenseData.category,
      currency: 'RON', // Since we are converting everything to RON
      date: expenseData.dateAndTime.toDate().toISOString().split('T')[0] // Adjusted for your database field
    };
  });

  balance = income - totalConvertedExpenses;

  let expensesDetails = individualExpenses.map(expense => 
    `ID: ${expense.id}, Amount: ${expense.amount} RON, Category: ${expense.category}, Date: ${expense.date}`).join('; ');

  let userDataString = `Income: ${income}, Converted Total Expenses: ${totalConvertedExpenses.toFixed(2)} RON, Balance: ${balance.toFixed(2)}, Individual Expenses: [${expensesDetails}]`;

  return userDataString;
};
