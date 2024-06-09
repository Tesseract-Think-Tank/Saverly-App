import { addDoc, collection, doc, getDoc, updateDoc, query, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebaseConfig';

// Helper function to get user expenses
async function getUserExpenses(userId) {
  const userRef = doc(FIREBASE_DB, 'users', userId);
  const expensesCollectionRef = collection(userRef, 'expenses');
  const expensesQuery = query(expensesCollectionRef);
  const expensesSnapshot = await getDocs(expensesQuery);

  const expenses = [];
  expensesSnapshot.forEach((expenseDoc) => {
    expenses.push(expenseDoc.data());
  });

  return expenses;
}

// Function to get category prices for a specific month
const getCategoryPrices = async (month) => {
  try {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) throw new Error('No user is signed in.');

    const userExpenses = await getUserExpenses(userId);

    const categories = {};
    const valutarChangeFromRon = { "USD": 4.57, "EUR": 5, "GBP": 5.82, "RON": 1 };

    // Iterate over each expense and sum up the amount spent on each category
    userExpenses.forEach(expense => {
      const dateAndTime = expense.dateAndTime;
      const milliseconds = dateAndTime.seconds * 1000 + Math.round(dateAndTime.nanoseconds / 1000000);
      const date = new Date(milliseconds);

      const category = expense.category;
      const currency = expense.currency;
      const price = parseFloat(expense.amount) * valutarChangeFromRon[currency];

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const expenseMonth = monthNames[date.getMonth()];

      if (expenseMonth === month) {
        if (!categories[category]) {
          categories[category] = price;
        } else {
          categories[category] += price;
        }
      }
    });

    return categories;
  } catch (error) {
    console.error('Error fetching expenses by category:', error);
    throw error; 
  }
};

export { getCategoryPrices };