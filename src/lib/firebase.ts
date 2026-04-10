import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const saveAssessment = async (healthData: any, result: any) => {
  try {
    const docRef = await addDoc(collection(db, 'assessments'), {
      healthData,
      result,
      timestamp: serverTimestamp(),
      userId: auth.currentUser?.uid || 'anonymous'
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving assessment to Firestore", error);
    throw error;
  }
};
