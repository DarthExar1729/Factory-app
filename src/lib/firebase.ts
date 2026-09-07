import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0625706161",
  appId: "1:162992494219:web:7e664a0f2287c9c042668e",
  apiKey: "AIzaSyD2gzLtgQCWt5hiUCDLSHydCaDP-yA_Y2Q",
  authDomain: "gen-lang-client-0625706161.firebaseapp.com",
  storageBucket: "gen-lang-client-0625706161.firebasestorage.app",
  messagingSenderId: "162992494219",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-87119f76-3f03-4052-9639-ba8e0cbc07dd");

export const getUserRole = async (uid: string) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data().role;
  }
  return null;
};
