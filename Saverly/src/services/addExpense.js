import { addDoc, collection, doc, getDoc, updateDoc, query, queryEqual, querySnapshot, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebaseConfig';

const axios = require('axios');
const xml2js = require('xml2js');

class CursBNR {
  constructor() {
    this.date = '';
    this.currency = {};
  }
}

const fetchAndParseXMLDocument = async (url) =>{
  try {
    const response = await axios.get(url);
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(response.data);

    this.date = result.DataSet.Header.PublishingDate;

    result.DataSet.Body.Cube.Rate.forEach((rate) => {
      const currencyCode = rate.$.currency;
      const multiplier = rate.$.multiplier ? parseInt(rate.$.multiplier, 10) : 1;
      this.currency[currencyCode] = parseFloat(rate._) / multiplier;
    });
    this.currency['RON'] = 1;
  } catch (error) {
    console.error('Error fetching or parsing XML:', error);
  }
};

const getExchangeRate = async(fromCurrency,toCurrency) =>{
  if (this.currency[fromCurrency] && this.currency[toCurrency]) {
    return this.currency[toCurrency] / this.currency[fromCurrency];
  } else {
    throw new Error('Incorrect or unsupported currency!');
  }
};

const addExpense= async (category, amount,description,currencyOfExp) => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) throw new Error('No user is signed in.');
  
    const userRef = doc(FIREBASE_DB, 'users', userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() || {};
    const currentIncome = userData.income || 0;
    const currencyOfAccount = userData.currency;

    const cursBNR = new CursBNR();
    await cursBNR.fetchAndParseXMLDocument('https://www.bnr.ro/nbrfxrates.xml');

    const exchangeRate = cursBNR.getExchangeRate(currencyOfExp, currencyOfAccount);
    const convertedAmount = amount * exchangeRate;
    
    if(convertedAmount > currentIncome)
        throw new Error("Insufficient funds");

    const newIncome = currentIncome-convertedAmount;
    const newExpensesValue = parseFloat(userData.expenses || 0) + convertedAmount;

    await updateDoc(userRef, {
      income: newIncome,
      expenses: newExpensesValue
    });
  

    await addDoc(collection(FIREBASE_DB, 'users', userId, 'expenses'), { 
      category,
      amount: parseFloat(amount),
      dateAndTime: new Date(),
      description,
      currency:currencyOfAccount
    });
  
    return true; 
  };
  
export{addExpense}
