import { addDoc, collection, doc, getDoc, updateDoc, query, queryEqual, querySnapshot, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebaseConfig';


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

const getCategoryPrices = async () => {
    try {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) throw new Error('No user is signed in.');
  
    const userExpenses = await getUserExpenses(userId);

    const categories = {};

    // Iterate over each expense and sum up the amount spent on each category
    userExpenses.forEach(expense => {
        const category = expense.category;
        const price = parseFloat(expense.amount);

        if (!categories[category]) {
          categories[category] = price;
        } else {
          categories[category] += price;
        }
      });

      return categories;
    } catch (error) {
      console.error('Error fetching expenses by category:', error);
      throw error; // Rethrow the error for handling at a higher level if necessary
    }

    const currentIncome = userData.income || 0;
    const currencyOfAccount = userData.currency;
    const eurToRon = 5;
    const ronToEur = 0.2;

    const ronToUsd = 0.22;
    const usdToRon = 4.57;
    
    const ronToGbp = 0.17;
    const gbpToRon = 5.82;

    const eurToUsd = 1.09;
    const usdToEur = 0.92;

    const gbpToEur = 1.17;
    const eurToGbp = 0.86;

    const usdToGbp = 0.79;
    const gbpToUsd = 1.27;

    let exchangeRate;

    if(currencyOfExp == "RON" && currencyOfAccount == "EUR")
        exchangeRate =  ronToEur;
    else if(currencyOfExp == "EUR" && currencyOfAccount == "RON")
         exchangeRate = eurToRon;
    else if(currencyOfExp == "USD" && currencyOfAccount == "RON")
        exchangeRate = usdToRon;
    else if(currencyOfExp == "RON" && currencyOfAccount == "USD")
        exchangeRate = ronToUsd;
    else if(currencyOfExp == "GBP" && currencyOfAccount == "RON")
        exchangeRate = gbpToRon;
    else if(currencyOfExp == "RON" && currencyOfAccount == "GBP")
        exchangeRate = ronToGbp;
    else if(currencyOfExp == "EUR" && currencyOfAccount == "GBP")
        exchangeRate = eurToGbp;
    else if(currencyOfExp == "GBP" && currencyOfAccount == "EUR")
        exchangeRate = gbpToEur;
    else if(currencyOfExp == "EUR" && currencyOfAccount == "USD")
        exchangeRate = eurToUsd;
    else if(currencyOfExp == "USD" && currencyOfAccount == "EUR")
        exchangeRate = usdToEur;
    else if(currencyOfExp == "USD" && currencyOfAccount == "GBP")
        exchangeRate = usdToGbp;
    else if(currencyOfExp == "GBP" && currencyOfAccount == "USD")
        exchangeRate = gbpToUsd;
    const convertedAmount = amount * exchangeRate;
    
  };
  
export{ getCategoryPrices };
