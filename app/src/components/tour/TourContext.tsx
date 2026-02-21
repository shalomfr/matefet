"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type { TourStep } from "./tourSteps";

interface TourContextValue {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  steps: TourStep[];
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}

interface TourProviderProps {
  tourId: string;
  steps: TourStep[];
  children: ReactNode;
}

export function TourProvider({ tourId, steps, children }: TourProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const storageKey = `tour-${tourId}-completed`;

  useEffect(() => {
    // Auto-start on first visit (after 1.5s delay for data load)
    const completed = typeof window !== "undefined" && localStorage.getItem(storageKey);
    if (!completed) {
      const timer = setTimeout(() => setIsActive(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => {
      const next = prev + 1;
      if (next >= steps.length) {
        setIsActive(false);
        if (typeof window !== "undefined") localStorage.setItem(storageKey, "1");
        return prev;
      }
      return next;
    });
  }, [steps.length, storageKey]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const skipTour = useCallback(() => {
    setIsActive(false);
    if (typeof window !== "undefined") localStorage.setItem(storageKey, "1");
  }, [storageKey]);

  return (
    <TourContext.Provider value={{ isActive, currentStep, totalSteps: steps.length, steps, startTour, nextStep, prevStep, skipTour }}>
      {children}
    </TourContext.Provider>
  );
}
