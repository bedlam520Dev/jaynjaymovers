export type GeocodeResult = {
  lat: number;
  lng: number;
  label: string;
};

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  if (!address.trim()) return null;
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
    address
  )}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const first = data?.[0];
  if (!first) return null;
  return {
    lat: Number(first.lat),
    lng: Number(first.lon),
    label: first.display_name ?? address,
  };
}
