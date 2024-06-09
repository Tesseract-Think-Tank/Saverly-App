import { addDoc, collection, doc, getDoc, updateDoc, getDocs ,deleteDoc, where,query} from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebaseConfig';
class MonthlyPayment {
  constructor(businessName, cost, currency, date, cardHolderName) {
    this.businessName = businessName;
    this.cost = cost;
    this.currency = currency;
    this.date = date;
    this.cardHolderName = cardHolderName;
  }

  // Getters
   getBusinessName() {
    return this.businessName;
  }

  getCost() {
    return this.cost;
  }

  getCurrency() {
    return this.currency;
  }

  getDate() {
    return this.date;
  }

  getCardHolderName() {
    return this.cardHolderName;
  }

  // Setters
  setBusinessName(name) {
    this.businessName = name;
  }

  setCost(cost) {
    this.cost = cost;
  }

  setCurrency(currency) {
    this.currency = currency;
  }

  setDate(date) {
    this.date = date;
  }

  setCardHolderName(name) {
    this.cardHolderName = name;
  }
}
const addMonthlyPayment = async (monthlyPayment) => {
  try {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) throw new Error('No user is signed in.');

    // First, get the current user's income
    // const userRef = doc(FIREBASE_DB, 'users', userId);
    // const userSnap = await getDoc(userRef);
    // const userData = userSnap.data() || {};
    // const currentIncome = userData.income || 0;
    // const newIncome = currentIncome + parseFloat(monthlyPayment.cost);

    // // Update the user's income
    // await updateDoc(userRef, { income: newIncome });

    // Then, add the new monthly payment
    await addDoc(collection(FIREBASE_DB, 'users', userId, 'monthlyPayments'), {
      businessName: monthlyPayment.getBusinessName(),
      cost: monthlyPayment.getCost(),
      currency: monthlyPayment.getCurrency(),
      date: monthlyPayment.getDate(),
      cardHolderName: monthlyPayment.getCardHolderName(),
    });

    return true; // Indicate success
  } catch (error) {
    console.error('Error adding monthly payment:', error);
    return false; // Indicate failure
  }
};

const removeMonthlyPayment = async (monthlyPayment) => {
  const userId = FIREBASE_AUTH.currentUser?.uid;
  if (!userId) throw new Error('No user is signed in.');

  try {
    const monthlyPaymentsRef = collection(FIREBASE_DB, 'users', userId, 'monthlyPayments');
    // Access the businessName property directly if getBusinessName method is not available
    const businessName = monthlyPayment.businessName || monthlyPayment.getBusinessName();
    const businessQuery = query(monthlyPaymentsRef, where('businessName', '==', businessName));

    const querySnapshot = await getDocs(businessQuery);

    const deletionPromises = [];
    querySnapshot.forEach((doc) => {
      deletionPromises.push(deleteDoc(doc.ref));
    });

    await Promise.all(deletionPromises);

    return true;
  } catch (error) {
    console.error('Error removing monthly payment:', error);
    return false;
  }
};

const fetchUserMonthlyPayments = async () => {
  const userId = FIREBASE_AUTH.currentUser?.uid;
  if (!userId) throw new Error('No user is signed in.');

  const querySnapshot = await getDocs(collection(FIREBASE_DB, 'users', userId, 'monthlyPayments'));
  const monthlyPayments = [];
  querySnapshot.forEach((doc) => {
    monthlyPayments.push({ id: doc.id, ...doc.data() });
  });

  return monthlyPayments;
};


export { addMonthlyPayment, fetchUserMonthlyPayments ,removeMonthlyPayment, MonthlyPayment};