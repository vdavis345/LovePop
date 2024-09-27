import { getFirestore, collection, doc, getDoc, query, where, limit, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const db = getFirestore();

export async function findMatch(userId, preference) {
    // Get the current user's data
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        console.error("User not found");
        return null;
    }

    const user = userSnap.data();

    // Build the query based on preference
    let matchQuery;
    const usersRef = collection(db, "users");

    switch(preference) {
        case 'state':
            matchQuery = query(usersRef, 
                where("location.state", "==", user.location.state),
                where("matchPreference", "in", ["state", "worldwide"]),
                limit(50)
            );
            break;
        case 'outOfState':
            // This is trickier in Firestore and might require a different approach
            matchQuery = query(usersRef,
                where("matchPreference", "in", ["outOfState", "worldwide"]),
                limit(50)
            );
            break;
        case 'worldwide':
        default:
            matchQuery = query(usersRef, 
                where("matchPreference", "==", "worldwide"),
                limit(50)
            );
            break;
    }

    // Execute the query
    const querySnapshot = await getDocs(matchQuery);
    const potentialMatches = [];

    querySnapshot.forEach((doc) => {
        if (doc.id !== userId) {
            const matchData = doc.data();
            if (preference === 'outOfState' && matchData.location.state === user.location.state) {
                return; // Skip if it's the same state for 'outOfState' preference
            }
            potentialMatches.push({ id: doc.id, ...matchData });
        }
    });

    if (potentialMatches.length > 0) {
        const randomIndex = Math.floor(Math.random() * potentialMatches.length);
        return potentialMatches[randomIndex];
    }

    return null;
}