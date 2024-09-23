// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDb26hIjEVQF1eK5QIM4ToiD2EQHKZZXbI",
    authDomain: "lovepop-382f9.firebaseapp.com",
    projectId: "lovepop-382f9",
    storageBucket: "lovepop-382f9.appspot.com",
    messagingSenderId: "355578771131",
    appId: "1:355578771131:web:0466db3dc40285473edb9e",
    measurementId: "G-VB84E590HQ"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();