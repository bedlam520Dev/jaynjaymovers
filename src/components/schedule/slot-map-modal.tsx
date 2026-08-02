'use client';

import { useSchedule } from '@/hooks/use-schedule';
import { geocodeAddress } from '@/utils/geocoder';
import * as maplibregl from 'maplibre-gl';
import { useEffect, useMemo, useRef, useState } from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';

export type ClientLiveLocation = {
  lng: number;
  lat: number;
  lastUpdated: number;
};

// Crew is simulated as working around the Salem, OR metro (business base).
const SALEM_CENTER: [number, number] = [-123.0351, 44.9429];
const DRIFT_INTERVAL_MS = 3000;
const DRIFT_RADIUS_DEG = 0.015; // ~1.5km, keeps the marker plausibly "on a job"

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/bright';

function jitter(base: number, radius: number) {
  return base + (Math.random() - 0.5) * 2 * radius;
}

export function useClientLiveLocation(): ClientLiveLocation {
  const [loc, setLoc] = useState<ClientLiveLocation>({
    lng: SALEM_CENTER[0],
    lat: SALEM_CENTER[1],
    lastUpdated: Date.now(),
  });

  useEffect(() => {
    const id = setInterval(() => {
      setLoc({
        lng: jitter(SALEM_CENTER[0], DRIFT_RADIUS_DEG),
        lat: jitter(SALEM_CENTER[1], DRIFT_RADIUS_DEG),
        lastUpdated: Date.now(),
      });
    }, DRIFT_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return loc;
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function formatDistance(km: number): string {
  if (km >= 1) return `${km.toFixed(1)} km away`;
  return `${Math.round(km * 1000)} m away`;
}

type SlotMapModalProps = {
  date: string;
  timeWindow: string;
  fromAddress: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SlotMapModal({
  date,
  timeWindow,
  fromAddress,
  isOpen,
  onOpenChange,
}: SlotMapModalProps) {
  const clientLoc = useClientLiveLocation();
  const { slots } = useSchedule();
  const [userLoc, setUserLoc] = useState<{ lng: number; lat: number } | null>(null);
  const [locating, setLocating] = useState(true);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const crewMarkerRef = useRef<maplibregl.Marker | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  const liveSlot = useMemo(
    () => slots.find((s) => s.date === date && s.time_window === timeWindow),
    [slots, date, timeWindow]
  );
  const spotsLeft = liveSlot ? liveSlot.max_bookings - liveSlot.current_bookings : 0;
  const isFull = !liveSlot || spotsLeft <= 0;

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [clientLoc.lng, clientLoc.lat],
      zoom: 11,
      attributionControl: false,
    });
    mapRef.current = map;

    crewMarkerRef.current = new maplibregl.Marker({
      color: '#2563eb',
      anchor: 'bottom',
    })
      .setLngLat([clientLoc.lng, clientLoc.lat])
      .addTo(map);
    userMarkerRef.current = new maplibregl.Marker({
      color: '#16a34a',
      anchor: 'bottom',
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      crewMarkerRef.current = null;
      userMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Keep crew marker pinned to live location.
  useEffect(() => {
    if (!mapRef.current || !crewMarkerRef.current) return;
    crewMarkerRef.current.setLngLat([clientLoc.lng, clientLoc.lat]);
  }, [clientLoc]);

  useEffect(() => {
    if (!isOpen) return;
    setLocating(true);
    setGeocodeError(null);

    let cancelled = false;

    const resolveFromGeolocation = () => {
      if (!('geolocation' in navigator)) {
        setLocating(false);
        setGeocodeError(
          'Location unavailable. Enable browser location to see distance.'
        );
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (cancelled) return;
          setUserLoc({ lng: pos.coords.longitude, lat: pos.coords.latitude });
          setLocating(false);
        },
        () => {
          if (cancelled) return;
          setLocating(false);
          setGeocodeError(
            'Location unavailable. Enable browser location to see distance.'
          );
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    };

    if (fromAddress.trim()) {
      geocodeAddress(fromAddress)
        .then((res) => {
          if (cancelled) return;
          if (res) {
            setUserLoc({ lng: res.lng, lat: res.lat });
            setLocating(false);
          } else {
            resolveFromGeolocation();
          }
        })
        .catch(() => resolveFromGeolocation());
    } else {
      resolveFromGeolocation();
    }

    return () => {
      cancelled = true;
    };
  }, [isOpen, fromAddress]);

  useEffect(() => {
    if (!mapRef.current || !userMarkerRef.current || !userLoc) return;
    userMarkerRef.current.setLngLat([userLoc.lng, userLoc.lat]);
    mapRef.current.flyTo({ center: [clientLoc.lng, clientLoc.lat], zoom: 11 });
  }, [userLoc, clientLoc]);

  const distanceKm =
    userLoc && !locating
      ? haversineKm(userLoc.lat, userLoc.lng, clientLoc.lat, clientLoc.lng)
      : null;

  return (
    <div className='space-y-3'>
      <div
        ref={containerRef}
        className='h-72 w-full overflow-hidden rounded-xl border'
      />
      <div className='flex items-center justify-between font-mono text-xs'>
        <span className='text-muted-foreground flex items-center gap-1.5'>
          <span className='bg-primary h-2 w-2 animate-pulse rounded-full' />
          Crew working nearby
        </span>
        {locating ? (
          <span className='text-muted-foreground'>Locating you…</span>
        ) : userLoc && distanceKm !== null ? (
          <span className='text-success'>{formatDistance(distanceKm)}</span>
        ) : geocodeError ? (
          <span className='text-muted-foreground'>{geocodeError}</span>
        ) : null}
      </div>
      {isFull ? (
        <p className='text-destructive text-sm'>
          This window just filled up while you were looking. Please pick another slot.
        </p>
      ) : (
        <p className='text-muted-foreground text-sm'>
          {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left in this window.
        </p>
      )}
      <button
        type='button'
        className='text-muted-foreground text-xs underline'
        onClick={() => onOpenChange(false)}
      >
        Close
      </button>
    </div>
  );
}
