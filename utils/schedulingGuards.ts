// utils/schedulingGuards.ts

export function isBookingFeasible(
  targetDate: string,
  newJobLocation: { lat: number; lng: number },
  existingJobsOnDate: Array<{ date: string; lat: number; lng: number }>
): { allowed: boolean; reason?: string } {
  for (const job of existingJobsOnDate) {
    if (job.date === targetDate) {
      const distanceMiles = getDistanceFromLatLonInMiles(
        newJobLocation.lat,
        newJobLocation.lng,
        job.lat,
        job.lng
      );

      if (distanceMiles > 60) {
        return {
          allowed: false,
          reason: `Conflict: Crew is already assigned ~${Math.round(distanceMiles)} miles away on this date. Cross-region transit is restricted.`,
        };
      }
    }
  }

  return { allowed: true };
}

// Helper functions for Haversine formula calculation
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Radius of the earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
