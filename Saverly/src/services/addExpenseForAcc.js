import { addDoc, collection, doc, getDoc, updateDoc,where, query, queryEqual, querySnapshot, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebaseConfig';

const addExpenseForAcc = async (accountId, category, amount, description, currencyOfExp) => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) throw new Error('No user is signed in.');

    const accountsRef = collection(FIREBASE_DB, 'users', userId, 'accounts');
    const q = query(accountsRef, where("id", "==", accountId));
    const querySnapshot = await getDocs(q);
    console.log(accountId);
    if (querySnapshot.empty) throw new Error('[1]Account not found.');
    const accountSnap = querySnapshot.docs[0];
    const documentId = accountSnap.id; 
    const accountData = accountSnap.data();
    const accountBalance = accountData.balance || 0;
    const accountCurrency = accountData.currency || "RON";
    const userDocRef = doc(FIREBASE_DB,'users',userId);
    const userDocSnapshot = await getDoc(userDocRef);
    if (!userDocSnapshot.exists()) {
        throw new Error('User not found.');
    }

    const currentExpenses = userDocSnapshot.data().expenses;

    const exchangeRates = {
        'EUR:RON': 5, 'RON:EUR': 0.2,
        'USD:RON': 4.57, 'RON:USD': 0.22,
        'GBP:RON': 5.82, 'RON:GBP': 0.17,
        'EUR:USD': 1.09, 'USD:EUR': 0.92,
        'GBP:EUR': 1.17, 'EUR:GBP': 0.86,
        'USD:GBP': 0.79, 'GBP:USD': 1.27
    };

    const keyForExchangeRate = `${currencyOfExp}:RON`;
    const exchangeRate = exchangeRates[keyForExchangeRate] || 1; 

    const convertedAmount = amount * exchangeRate;
    
    
    if (convertedAmount > accountBalance) throw new Error("Insufficient funds in the selected account.");

    const newExpensesValue = currentExpenses+convertedAmount;
   
    const newAccountBalance = accountBalance - convertedAmount;
    const accountRef = doc(FIREBASE_DB, 'users', userId, 'accounts', documentId);
        await updateDoc(accountRef, {
        balance: newAccountBalance
    });

    await addDoc(collection(FIREBASE_DB, 'users', userId, 'expenses'), { 
        category,
        accountId:accountId,
        amount: parseFloat(amount),
        dateAndTime: new Date(),
        description,
        currency:currencyOfExp
      });
    
    await updateDoc(userDocRef,{
        expenses:newExpensesValue
    })
      
    return true; 
};
const removeExpense = async (category, description, currency, amount) => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) throw new Error('No user is signed in.');
  
    const expensesRef = collection(FIREBASE_DB, 'users', userId, 'expenses');
    const expenseQuery = query(expensesRef, where('category', '==', category), where('description', '==', description), where('currency', '==', currency), where('amount', '==', amount));
  
    const querySnapshot = await getDocs(expenseQuery);
  
    const deletionPromises = [];
    querySnapshot.forEach((doc) => {
      deletionPromises.push(deleteDoc(doc.ref));
    });
  
    await Promise.all(deletionPromises);
  
    const userDocRef = doc(FIREBASE_DB, 'users', userId);
    const userDocSnapshot = await getDoc(userDocRef);
    if (!userDocSnapshot.exists()) {
      throw new Error('User not found.');
    }
  
    const currentExpenses = userDocSnapshot.data().expenses;
    const newExpensesValue = currentExpenses - amount;
  
    await updateDoc(userDocRef, {
      expenses: newExpensesValue
    });
  
    return true;
  };
  
export{addExpenseForAcc,removeExpense}