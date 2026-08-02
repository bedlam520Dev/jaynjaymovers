import { PRICING } from '@/lib/constants';
import type { ServiceType, HomeSize, EstimateBreakdown } from '@/types';

export function calculateEstimate(
  serviceType: ServiceType,
  homeSize: HomeSize
): EstimateBreakdown {
  const multiplier = PRICING.sizeMultipliers[homeSize] ?? 1;
  const crewSize = PRICING.crewSizes[homeSize] ?? 3;
  const estimatedHours = Math.round(4 * multiplier * 2) / 2;
  const laborCost = PRICING.baseHourly * estimatedHours;
  const truckFee = PRICING.truckFee;
  const lineItems: { label: string; amount: number }[] = [
    { label: `Crew labor (${crewSize} movers, ${estimatedHours}h)`, amount: laborCost },
    { label: 'Truck & equipment', amount: truckFee },
  ];
  let additionalFees = 0;
  if (serviceType === 'long_distance') {
    const mileage = 50;
    const mileageFee = PRICING.longDistancePerMile * mileage;
    additionalFees += mileageFee;
    lineItems.push({ label: `Long distance (${mileage} mi)`, amount: mileageFee });
  }
  if (serviceType === 'packing') {
    const roomCount: Record<string, number> = {
      studio: 1,
      '1br': 1,
      '2br': 2,
      '3br': 3,
      '4br_plus': 4,
      office: 3,
      custom: 2,
    };
    const rooms = roomCount[homeSize] ?? 2;
    const packingFee = PRICING.packingPerRoom * rooms;
    additionalFees += packingFee;
    lineItems.push({ label: `Packing (${rooms} rooms)`, amount: packingFee });
  }
  if (serviceType === 'storage') {
    additionalFees += PRICING.storagePerMonth;
    lineItems.push({ label: 'Storage (1 month)', amount: PRICING.storagePerMonth });
  }
  if (serviceType === 'specialty') {
    const itemCount: Record<string, number> = {
      studio: 1,
      '1br': 1,
      '2br': 2,
      '3br': 2,
      '4br_plus': 3,
      office: 2,
      custom: 2,
    };
    const items = itemCount[homeSize] ?? 2;
    const specialtyFee = PRICING.specialtyItemFee * items;
    additionalFees += specialtyFee;
    lineItems.push({ label: `Specialty items (${items})`, amount: specialtyFee });
  }
  const total = laborCost + truckFee + additionalFees;
  return {
    serviceType,
    homeSize,
    estimatedHours,
    crewSize,
    laborCost,
    truckFee,
    additionalFees,
    total,
    lineItems,
  };
}
