import { atom } from 'jotai';
import { ITransformedToday } from '@/types/prayers';

// App Status
export const isLoadingAtom = atom<boolean>(true);
export const hasErrorAtom = atom<boolean>(false);

// Prayer Data
export const todaysPrayersAtom = atom<ITransformedToday>({});
export const tomorrowsPrayersAtom = atom<ITransformedToday>({});
export const nextPrayerIndexAtom = atom<number>(-1);

// Overlay
interface OverlayItem {
  name: string;
  component: React.ReactNode;
  measurements: PageCoordinates;
}

// Overlay State
export const overlayVisibleAtom = atom<boolean>(false);
export const overlayContentAtom = atom<OverlayItem[]>([]);
export const selectedPrayerIndexAtom = atom<number>(-1);

// Measurement Types
export interface PageCoordinates {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
}

interface Coordinates {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
}

// Measurements State
export const absoluteNextPrayerMeasurementsAtom = atom<PageCoordinates | null>(null);

export const absolutePrayerMeasurementsAtom = atom<PageCoordinates[]>([]);
export const relativePrayerMeasurementsAtom = atom<Coordinates[]>([]);

export const absoluteTimerMeasurementsAtom = atom<PageCoordinates | null>(null);
export const absoluteDateMeasurementsAtom = atom<PageCoordinates| null>(null);
