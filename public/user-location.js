// Initialize Firebase (your config is correct, no changes needed)
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
const auth = firebase.auth();
// Get Firestore instance
const db = firebase.firestore();

// Function to get and display user location
function getUserLocation() {
    console.log("Attempting to get user location");
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("User is signed in, UID:", user.uid);
            db.collection('users').doc(user.uid).get()
                .then((doc) => {
                    console.log("Firestore document retrieved");
                    if (doc.exists) {
                        const userData = doc.data();
                        console.log("User data:", userData);
                        if (userData.location) {
                            displayUserLocation(userData.location.city, userData.location.state);
                        } else {
                            console.log("No location data found");
                            displayUserLocation('Not set', 'Not set');
                        }
                    } else {
                        console.log("No user data found");
                        displayUserLocation('Not set', 'Not set');
                    }
                })
                .catch((error) => {
                    console.error("Error getting user data:", error);
                    displayUserLocation('Not set', 'Not set');
                });
        } else {
            console.log("No user is signed in");
            displayUserLocation('Not set', 'Not set');
        }
    });
}

// Function to display user location
function displayUserLocation(city, state) {
    console.log("Displaying location:", city, state);
    const container = document.querySelector('.matching-section');
    let locationElement = document.getElementById('userLocation');
    if (!locationElement) {
        locationElement = document.createElement('div');
        locationElement.id = 'userLocation';
        container.appendChild(locationElement);
    }
    locationElement.innerHTML = `<p>Your Location: ${city}, ${state}</p>`;
}

// Function to sign in with Google
function signIn() {
    console.log("Attempting to sign in");
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
        console.log("User signed in:", result.user.uid);
        getUserLocation(); // Fetch location after sign-in
    }).catch((error) => {
        console.error("Sign-in error:", error);
    });
}

// Call the function when the page loads
window.addEventListener('load', getUserLocation);