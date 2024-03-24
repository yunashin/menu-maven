import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyCYNxmpUN2ERIAi-quLB-ioTxmPlh1CukI",
  authDomain: "menu-maven.firebaseapp.com",
  databaseURL: "https://menu-maven-default-rtdb.firebaseio.com",
  projectId: "menu-maven",
  storageBucket: "menu-maven.appspot.com",
  messagingSenderId: "104158324793",
  appId: "1:104158324793:web:aecbc1c13ce92b274005e8",
  measurementId: "G-VK3BN4B5S6"
};

const app = initializeApp(config);

export const db = getFirestore(app);
