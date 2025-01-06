import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyD7IW--yIdWPMjIMeEtbAnZsbNPXqs5JM8",
  authDomain: "complaint-system-1ef38.firebaseapp.com",
  projectId: "complaint-system-1ef38",
  storageBucket: "complaint-system-1ef38.firebasestorage.app",
  messagingSenderId: "652542936133",
  appId: "1:652542936133:web:1a897274a242c31ca5cf2c",
//   measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
