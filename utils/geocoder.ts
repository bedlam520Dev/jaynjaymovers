// utils/geocoder.ts
export async function geocodeAddress(addressString: string) {
  try {
    const encodedAddress = encodeURIComponent(addressString);
    // Using OpenStreetMap Nominatim endpoint with address details enabled
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=geojson&addressdetails=1&limit=1`,
      {
        headers: {
          'User-Agent': 'TrezurMarketScheduler/1.0', // Nominatim requires a custom User-Agent
        },
      }
    );

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error('No geographic results found for this address.');
    }

    const result = data[0];

    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name,
      county: result.address?.county || result.address?.city || 'Unknown County',
      state: result.address?.state || 'Unknown State',
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
