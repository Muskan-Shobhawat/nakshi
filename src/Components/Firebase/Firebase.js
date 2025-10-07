import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAmc-XJHs258LElj8C5IFFiKJIz1Jn5evA",
  authDomain: "nakshi-69052.firebaseapp.com",
  projectId: "nakshi-69052",
  storageBucket: "nakshi-69052.firebasestorage.app",
  messagingSenderId: "536413919228",
  appId: "1:536413919228:web:f16efc804ba962da258479",
  measurementId: "G-13NTP8WMGB"
};


const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);