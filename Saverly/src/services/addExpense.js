import { addDoc, collection, doc, getDoc, updateDoc, query, queryEqual, querySnapshot, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebaseConfig';


const getAccounts = async() =>{
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) throw new Error('No user is signed in.');
    const userRef = doc(FIREBASE_DB, 'users', userId);
    const accountsRef = collection(FIREBASE_DB, 'users', userId, 'accounts');
    const querySnapshot = await getDocs(accountsRef);
    const accounts = [];
    querySnapshot.forEach((doc) => {
        accounts.push(doc.data());
    });
    return accounts;
};

const addExpense = async (accountCurrency, accountType, category, amount, description, currencyOfExp) => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) throw new Error('No user is signed in.');

    // Create a query for the accounts with the given currency and type
    const accountsRef = collection(FIREBASE_DB, 'users', userId, 'accounts');
    const q = query(accountsRef, where("currency", "==", accountCurrency), where("type", "==", accountType));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) throw new Error('Account not found.');
    // Assuming that the currency and type combination is unique, take the first document.
    const accountSnap = querySnapshot.docs[0];
    const accountId = accountSnap.id; // Now you have the account's ID.
    const accountData = accountSnap.data();
    const accountBalance = accountData.balance || 0;
    // Define the exchange rates (ideally these should be updated dynamically or through a service)
    const exchangeRates = {
        'EUR:RON': 5, 'RON:EUR': 0.2,
        'USD:RON': 4.57, 'RON:USD': 0.22,
        'GBP:RON': 5.82, 'RON:GBP': 0.17,
        'EUR:USD': 1.09, 'USD:EUR': 0.92,
        'GBP:EUR': 1.17, 'EUR:GBP': 0.86,
        'USD:GBP': 0.79, 'GBP:USD': 1.27
    };

    const keyForExchangeRate = `${currencyOfExp}:${currencyOfAccount}`;
    const exchangeRate = exchangeRates[keyForExchangeRate] || 1; // If no conversion is needed, the rate is 1

    const convertedAmount = amount * exchangeRate;
    
    if (convertedAmount > accountBalance) throw new Error("Insufficient funds in the selected account.");

    // Update the account balance
    const newAccountBalance = accountBalance - convertedAmount;
    await updateDoc(accountRef, {
        balance: newAccountBalance
    });

    // Add the expense document
    await addDoc(collection(FIREBASE_DB, 'users', userId, 'accounts', accountId, 'expenses'), {
        category,
        amount: convertedAmount, // Store the converted amount in the account's currency
        dateAndTime: new Date(),
        description,
        currency: currencyOfAccount // Store the account's currency
    });

    return true; 
};
export{addExpense,getAccounts}
