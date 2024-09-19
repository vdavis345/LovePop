import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
import { getUserLocation } from "./public/utils.js";

export function initializeAuth(app) {
    const auth = getAuth(app);
    const database = getDatabase(app);

    // Google Sign-In
    const signInButton = document.getElementById('signInButton');
    if (signInButton) {
        signInButton.addEventListener('click', () => {
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider)
                .then((result) => {
                    const user = result.user;
                    console.log('User signed in:', user);
                    storeUserData(user);
                    window.location.href = 'video-chat.html';
                }).catch((error) => {
                    console.error('Sign-in error:', error.code, error.message);
                    // Keeping the original error handling, not adding alert
                });
        });
    }

    async function storeUserData(user) {
        const location = await getUserLocation().catch(() => null);
        set(ref(database, 'users/' + user.uid), {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastSignInTime: new Date().toISOString(),
            location: location,
            matchPreference: 'worldwide' // default preference
        });
    }

    // Listen for auth state changes
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('User is signed in:', user);
            updateUI(true, user);
        } else {
            console.log('User is signed out');
            updateUI(false);
        }
    });

    function updateUI(isSignedIn, user = null) {
        const signInButton = document.getElementById('signInButton');
        const userInfo = document.getElementById('userInfo');

        if (isSignedIn && user) {
            if (signInButton) signInButton.style.display = 'none';
            if (userInfo) {
                userInfo.style.display = 'block';
                userInfo.innerHTML = `
                    <img src="${user.photoURL}" alt="${user.displayName}" style="width: 30px; border-radius: 50%;">
                    <span>Welcome, ${user.displayName}</span>
                `;
                // Not adding sign out button to preserve original functionality
            }
        } else {
            if (signInButton) signInButton.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
        }
    }
}