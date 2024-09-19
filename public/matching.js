import { getDatabase, ref, get, query, orderByChild } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const db = getDatabase();

export async function findMatch(userId, preference) {
  const userRef = ref(db, `users/${userId}`);
  const userSnapshot = await get(userRef);
  const user = userSnapshot.val();

  let matchQuery;
  switch(preference) {
    case 'inRadius':
      matchQuery = query(ref(db, 'users'), orderByChild('location/latitude'));
      // You'd implement a more sophisticated nearby search here
      break;
    case 'outOfState':
      // Implement out-of-state logic
      matchQuery = query(ref(db, 'users'));
      break;
    case 'worldwide':
    default:
      matchQuery = query(ref(db, 'users'));
      break;
  }

  const matchSnapshot = await get(matchQuery);
  const potentialMatches = [];

  matchSnapshot.forEach(childSnapshot => {
    const potentialMatch = childSnapshot.val();
    if (childSnapshot.key !== userId && potentialMatch.matchPreference === preference) {
      potentialMatches.push({ id: childSnapshot.key, ...potentialMatch });
    }
  });

  if (potentialMatches.length > 0) {
    const randomIndex = Math.floor(Math.random() * potentialMatches.length);
    return potentialMatches[randomIndex];
  }

  return null;
}