import { addDoc, collection, doc, getDocs,query, updateDoc,where} from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebaseConfig';

const updateAccountBalance = async (accountId, amount, currency) => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) throw new Error('No user is signed in.');
  
    if (isNaN(amount)) {
      throw new Error('Amount must be a number');
    }
    console.log(accountId);
    const accountsRef = collection(FIREBASE_DB, 'users', userId, 'accounts');
    const q = query(accountsRef, where("id", "==", accountId));
    const querySnapshot = await getDocs(q);
 
    if (querySnapshot.empty) throw new Error('[1]Account not found.');
    const accountSnap = querySnapshot.docs[0];
    const documentId = accountSnap.id;

    if (!accountSnap.exists()) {
      throw new Error('Account does not exist');
    }
  
    const accountData = accountSnap.data();
    const currentBalance = accountData.balance || 0;
    const accountCurrency = accountData.currency;
  
    // If currency conversion is needed, calculate accordingly
    // In this example, we assume all transactions are in the account's currency.
    const exchangeRates = {
        'EUR:RON': 5, 'RON:EUR': 0.2,
        'USD:RON': 4.57, 'RON:USD': 0.22,
        'GBP:RON': 5.82, 'RON:GBP': 0.17,
        'EUR:USD': 1.09, 'USD:EUR': 0.92,
        'GBP:EUR': 1.17, 'EUR:GBP': 0.86,
        'USD:GBP': 0.79, 'GBP:USD': 1.27
    };

    const keyForExchangeRate = `${currency}:${accountCurrency}`;
    const exchangeRate = exchangeRates[keyForExchangeRate] || 1; 

    const convertedAmount = amount * exchangeRate;
    const newBalance = currentBalance + parseFloat(convertedAmount);
  
    const accountRef = doc(FIREBASE_DB, 'users', userId, 'accounts', documentId);
    await updateDoc(accountRef, {
    balance: newBalance
    });
  
    console.log(`Account ${accountId} updated with new balance: ${newBalance}`);
  };

export default updateAccountBalance;
