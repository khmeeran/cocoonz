// ========================================
// COCOONZ — Firebase Configuration
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyAGSQLm6ebfbFC_e6u9RfpqdBJwk8d5emE",
    authDomain: "cocoonz.firebaseapp.com",
    projectId: "cocoonz",
    storageBucket: "cocoonz.firebasestorage.app",
    messagingSenderId: "130876732731",
    appId: "1:130876732731:web:8554af6f3f687a9711331e",
    measurementId: "G-YMMBP8MX3E"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();
const analytics = firebase.analytics();

console.log('✅ Firebase initialized successfully');
console.log('📊 Firestore ready');
console.log('📦 Storage ready');
