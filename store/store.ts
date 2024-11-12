import { atom } from 'jotai';
import { ITransformedToday } from '@/types/prayers';

// App Status
export const isLoadingAtom = atom<boolean>(true);
export const hasErrorAtom = atom<boolean>(false);

// Prayer Data
export const todaysPrayersAtom = atom<ITransformedToday>({});
export const tomorrowsPrayersAtom = atom<ITransformedToday>({});
export const nextPrayerIndexAtom = atom<number>(-1);
export const selectedPrayerIndexAtom = atom<number>(-1);
export const lastSelectedPrayerIndexAtom = atom<number>(-1);

// Overlay
interface OverlayItem {
  name: string;
  component: React.ReactNode;
  measurements: PageCoordinates;
}

// Overlay State
export const overlayVisibleToggleAtom = atom<boolean>(false);
export const overlayContentAtom = atom<OverlayItem[]>([]);
export const overlayStartOpeningAtom = atom<boolean>(false);
export const overlayFinishedOpeningAtom = atom<boolean>(false);
export const overlayStartClosingAtom = atom<boolean>(false);
export const overlayFinishedClosingAtom = atom<boolean>(false);
export const overlayControlsAtom = atom<{
  open?: () => void;
  close?: () => void;
}>({});

// Measurement Types
export interface PageCoordinates {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
}

// Measurements State
export const absoluteNextPrayerMeasurementsAtom = atom<PageCoordinates | null>(null);
export const absolutePrayerMeasurementsAtom = atom<PageCoordinates[]>([]);
export const absoluteDateMeasurementsAtom = atom<PageCoordinates| null>(null);
export const absolutePrayerListMeasurementsAtom = atom<PageCoordinates | null>(null);
