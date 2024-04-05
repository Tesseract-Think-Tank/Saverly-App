import { setDoc, doc, addDoc, collection } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig';

const initializeUserDetails = async (userId, email) => {
    try {
        // Create a user document in Firestore with the email field
        await setDoc(doc(FIREBASE_DB, "users", userId), {
            email: email,
            income: 0,
            expenses: 0,
            currency: 'RON',
        });

        // Add a default account to the 'accounts' subcollection for this user
        await addDoc(collection(FIREBASE_DB, "users", userId, "accounts"), {
            type: 'Cash',
            balance: 0,
            currency: 'RON',
            id: 'defaultAccountId',
        });
    } catch (error) {
        throw new Error(`Error initializing user details: ${error.message}`);
    }
};

export { initializeUserDetails };
