import { initializeApp } from "firebase/app";
import {GoogleAuthProvider, getAuth, signInWithPopup, signInWithRedirect} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyCSh6JSYbe1LOqfqzYGxRQf2U_XtL5v3hs",
  authDomain: "react-portfolio-builder.firebaseapp.com",
  projectId: "react-portfolio-builder",
  storageBucket: "react-portfolio-builder.firebasestorage.app",
  messagingSenderId: "40879822153",
  appId: "1:40879822153:web:a2ab1d5dd81e73eab1b698",
  measurementId: "G-8Q7HR8F7JC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

//Google Auth
const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async() => {
    let user = null;


    await signInWithPopup(auth, provider)
    .then((result) => {
        user = result.user
    })
    .catch((error)=>{
        console.log(error)
    })

    return user;

}

