"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useTour } from "./TourContext";

interface TooltipRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function getTargetRect(target: string): TooltipRect | null {
  const el = document.querySelector(`[data-tour="${target}"]`);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
}

function calcTooltipStyle(targetRect: TooltipRect, position: string): React.CSSProperties {
  const GAP = 12;
  const tooltipW = 300;
  const tooltipH = 200; // estimated tooltip height
  const scrollY = window.scrollY;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top: number;
  let left: number;

  switch (position) {
    case "bottom":
    case "bottom-right":
      top = targetRect.top + targetRect.height + GAP + scrollY;
      left = Math.min(targetRect.left, vw - tooltipW - 16);
      break;
    case "bottom-left":
      top = targetRect.top + targetRect.height + GAP + scrollY;
      left = Math.max(16, targetRect.left + targetRect.width - tooltipW);
      break;
    case "top":
    case "top-right":
      top = targetRect.top - GAP - tooltipH + scrollY;
      left = Math.min(targetRect.left, vw - tooltipW - 16);
      break;
    case "top-left":
      top = targetRect.top - GAP - tooltipH + scrollY;
      left = Math.max(16, targetRect.left + targetRect.width - tooltipW);
      break;
    case "left":
      top = targetRect.top + scrollY;
      left = targetRect.left - tooltipW - GAP;
      break;
    case "right":
      top = targetRect.top + scrollY;
      left = targetRect.left + targetRect.width + GAP;
      break;
    default:
      top = targetRect.top + targetRect.height + GAP + scrollY;
      left = targetRect.left;
  }

  // Clamp to viewport
  left = Math.max(16, Math.min(left, vw - tooltipW - 16));
  const minTop = scrollY + 16;
  const maxTop = scrollY + vh - tooltipH - 16;
  if (top < minTop) top = minTop;
  if (top > maxTop) top = maxTop;

  return { top, left };
}

export default function OnboardingTour() {
  const { isActive, currentStep, totalSteps, steps, nextStep, prevStep, skipTour } = useTour();
  const [targetRect, setTargetRect] = useState<TooltipRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => { setMounted(true); }, []);

  const step = steps[currentStep];

  const updateRect = useCallback(() => {
    if (!step?.target) return;
    const rect = getTargetRect(step.target);
    if (rect) setTargetRect(rect);
  }, [step?.target]);

  useEffect(() => {
    if (!isActive || !step) return;
    setTargetRect(null);
    if (step.target) {
      if (step.mobileSkip && isMobile) { nextStep(); return; }
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      const t = setTimeout(updateRect, 300);
      return () => clearTimeout(t);
    }
  }, [isActive, step, updateRect, nextStep, isMobile]);

  useEffect(() => {
    const handler = () => updateRect();
    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler);
    return () => { window.removeEventListener("resize", handler); window.removeEventListener("scroll", handler); };
  }, [updateRect]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isActive) return;
      if (e.key === "Escape") skipTour();
      if (e.key === "ArrowLeft") nextStep();
      if (e.key === "ArrowRight") prevStep();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isActive, nextStep, prevStep, skipTour]);

  if (!mounted || !isActive || !step) return null;

  const isWelcome = step.type === "welcome";
  const isCompletion = step.type === "completion";
  const isCentered = isWelcome || isCompletion;
  const isLastStep = currentStep === totalSteps - 1;

  const overlayContent = (
    <div className="fixed inset-0 z-[9999]">
      {/* Dark overlay */}
      {isCentered || !targetRect ? (
        <div className="absolute inset-0 bg-black/60" onClick={isCentered ? skipTour : undefined} />
      ) : (
        <>
          {/* Spotlight: use 4 dark rectangles around the target */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(0,0,0,0.55)" }} />
          {/* Cut-out: white hole in overlay via box shadow trick */}
          <div
            className="absolute rounded-xl pointer-events-none"
            style={{
              top: targetRect.top - 6,
              left: targetRect.left - 6,
              width: targetRect.width + 12,
              height: targetRect.height + 12,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
              border: "2px solid rgba(255,255,255,0.3)",
            }}
          />
        </>
      )}

      {/* Centered card for welcome/completion */}
      {isCentered && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl tour-fade-in">
            {isCompletion ? (
              <div className="mb-6">
                <div className="tour-completion-circle w-20 h-20 rounded-full bg-[#f0fdf4] border-4 border-[#bbf7d0] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} className="text-[#16a34a] tour-check" />
                </div>
                <div className="flex justify-center gap-1.5 mb-4">
                  {["#2563eb", "#16a34a", "#d97706", "#ef4444", "#8b5cf6"].map((c, i) => (
                    <div key={i} className="w-2 h-2 rounded-full tour-confetti" style={{ background: c, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#eff6ff] flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">👋</span>
              </div>
            )}
            <h2 className="text-[20px] font-bold text-[#1e293b] mb-3">{step.title}</h2>
            <p className="text-[14px] text-[#64748b] leading-relaxed mb-6">{step.description}</p>
            <div className="flex gap-3 justify-center">
              {!isCompletion && (
                <button onClick={skipTour} className="px-4 py-2.5 rounded-xl border border-[#e8ecf4] text-[13px] text-[#64748b] font-medium hover:bg-[#f8f9fc] transition-colors">
                  דלג על הסיור
                </button>
              )}
              <button onClick={isCompletion ? skipTour : nextStep} className="px-6 py-2.5 rounded-xl bg-[#2563eb] text-white text-[13px] font-semibold hover:bg-[#1d4ed8] transition-colors">
                {isCompletion ? "סגור" : "בואו נתחיל!"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tooltip for highlight steps */}
      {!isCentered && (
        <div
          className="absolute bg-white rounded-2xl p-5 shadow-2xl tour-slide-tooltip"
          style={{
            width: 300,
            ...(targetRect ? calcTooltipStyle(targetRect, step.position ?? "bottom") : { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }),
            zIndex: 10000,
          }}
        >
          {/* Step counter */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1">
              {steps.filter(s => s.type === "highlight").map((_, i) => {
                const highlightIdx = steps.filter(s => s.type === "highlight").indexOf(steps.filter(s => s.type === "highlight")[i]);
                const currentHighlightIdx = steps.slice(0, currentStep).filter(s => s.type === "highlight").length;
                return (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full transition-colors"
                    style={{ background: i <= currentHighlightIdx ? "#2563eb" : "#e2e8f0" }}
                  />
                );
              })}
            </div>
            <button onClick={skipTour} className="p-1.5 rounded-lg hover:bg-[#f8f9fc] text-[#94a3b8] hover:text-[#64748b] transition-colors">
              <X size={14} />
            </button>
          </div>

          <h3 className="text-[15px] font-bold text-[#1e293b] mb-2">{step.title}</h3>
          <p className="text-[13px] text-[#64748b] leading-relaxed mb-4">{step.description}</p>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#94a3b8]">{currentStep + 1} / {totalSteps}</span>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button onClick={prevStep} className="p-2 rounded-xl border border-[#e8ecf4] text-[#64748b] hover:bg-[#f8f9fc] transition-colors">
                  <ChevronRight size={14} />
                </button>
              )}
              <button onClick={nextStep} className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-[12px] font-semibold hover:bg-[#1d4ed8] transition-colors flex items-center gap-1.5">
                {isLastStep ? "סיים" : "הבא"}
                {!isLastStep && <ChevronLeft size={12} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(overlayContent, document.body);
}
