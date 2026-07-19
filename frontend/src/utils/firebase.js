
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "cognito-notes-v1.firebaseapp.com",
  projectId: "cognito-notes-v1",
  storageBucket: "cognito-notes-v1.firebasestorage.app",
  messagingSenderId: "1035590412781",
  appId: "1:1035590412781:web:226f35d491bc3a0e1fdfe4"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()


export {auth,provider}