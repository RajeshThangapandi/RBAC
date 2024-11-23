// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBxXZW2Ym-_Z4sIa--pfZU1QLsqFEvFyP0",
    authDomain: "rbac-ae918.firebaseapp.com",
    projectId: "rbac-ae918",
    storageBucket: "rbac-ae918.firebasestorage.app",
    messagingSenderId: "357757716747",
    appId: "1:357757716747:web:4a870594c3877cfb92fa0e",
    measurementId: "G-VRS938YY1M"
  };
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const usersCollection = collection(db, "users");
export const rolesCollection = collection(db, "roles");
export const permissionsCollection = collection(db, "permissions");

export { db, collection, addDoc, updateDoc, deleteDoc, doc, getDocs };
