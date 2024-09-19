export async function getUserLocation() {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;
    const locationDetails = await getLocationDetails(latitude, longitude);

    return {
      latitude,
      longitude,
      ...locationDetails
    };
  } catch (error) {
    console.error("Error getting location:", error);
    return null;
  }
}

async function getLocationDetails(latitude, longitude) {
  try {
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    const data = await response.json();

    return {
      city: data.city,
      state: data.principalSubdivision,
      country: data.countryName
    };
  } catch (error) {
    console.error("Error getting location details:", error);
    return {};
  }
}