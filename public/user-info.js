import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

function displayUserInfo(user, userData) {
    const userInfoElement = document.getElementById('userInfo');
    if (user && userData) {
        const locationStr = userData.location 
            ? `${userData.location.city}, ${userData.location.state}, ${userData.location.country}`
            : 'Location not available';
        
        userInfoElement.innerHTML = `
            <img src="${user.photoURL}" alt="${user.displayName}" class="user-avatar">
            <div class="user-details">
                <span class="user-name">${user.displayName}</span>
                <span class="user-location">${locationStr}</span>
            </div>
        `;
    } else {
        userInfoElement.innerHTML = '<p>User information not available</p>';
    }
}

async function fetchUserData(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userData = await fetchUserData(user.uid);
        displayUserInfo(user, userData);
    } else {
        displayUserInfo(null, null);
    }
});