"use client";

import { useRef, useEffect, useCallback } from "react";

export interface RangeSliderProps {
  total: number;
  startIndex: number;
  endIndex: number;
  onChange: (start: number, end: number) => void;
  sparklineData: number[];
  startLabel: string;
  endLabel: string;
}

export function RangeSlider({
  total,
  startIndex,
  endIndex,
  onChange,
  sparklineData,
  startLabel,
  endLabel,
}: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"left" | "right" | "range" | null>(null);
  const dragStartX = useRef(0);
  const dragStartIndices = useRef({ start: 0, end: 0 });

  const toX = (idx: number) => (idx / (total - 1)) * 100;
  const toIdx = useCallback(
    (px: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return 0;
      return Math.round(Math.max(0, Math.min(1, (px - rect.left) / rect.width)) * (total - 1));
    },
    [total]
  );

  const onMouseDown = (e: React.MouseEvent, handle: "left" | "right" | "range") => {
    e.preventDefault();
    dragging.current = handle;
    dragStartX.current = e.clientX;
    dragStartIndices.current = { start: startIndex, end: endIndex };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const dx = e.clientX - dragStartX.current;
      const dIdx = Math.round((dx / rect.width) * (total - 1));

      if (dragging.current === "left") {
        const newStart = Math.max(0, Math.min(dragStartIndices.current.start + dIdx, endIndex - 1));
        onChange(newStart, endIndex);
      } else if (dragging.current === "right") {
        const newEnd = Math.min(total - 1, Math.max(dragStartIndices.current.end + dIdx, startIndex + 1));
        onChange(startIndex, newEnd);
      } else {
        const span = dragStartIndices.current.end - dragStartIndices.current.start;
        let newStart = dragStartIndices.current.start + dIdx;
        let newEnd = dragStartIndices.current.end + dIdx;
        if (newStart < 0) { newStart = 0; newEnd = span; }
        if (newEnd > total - 1) { newEnd = total - 1; newStart = total - 1 - span; }
        onChange(newStart, newEnd);
      }
    };
    const onUp = () => { dragging.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [total, startIndex, endIndex, onChange]);

  // Touch support
  useEffect(() => {
    const onMove = (e: TouchEvent) => {
      if (!dragging.current || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const dx = e.touches[0].clientX - dragStartX.current;
      const dIdx = Math.round((dx / rect.width) * (total - 1));

      if (dragging.current === "left") {
        const newStart = Math.max(0, Math.min(dragStartIndices.current.start + dIdx, endIndex - 1));
        onChange(newStart, endIndex);
      } else if (dragging.current === "right") {
        const newEnd = Math.min(total - 1, Math.max(dragStartIndices.current.end + dIdx, startIndex + 1));
        onChange(startIndex, newEnd);
      } else {
        const span = dragStartIndices.current.end - dragStartIndices.current.start;
        let newStart = dragStartIndices.current.start + dIdx;
        let newEnd = dragStartIndices.current.end + dIdx;
        if (newStart < 0) { newStart = 0; newEnd = span; }
        if (newEnd > total - 1) { newEnd = total - 1; newStart = total - 1 - span; }
        onChange(newStart, newEnd);
      }
    };
    const onUp = () => { dragging.current = null; };
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [total, startIndex, endIndex, onChange]);

  const onTouchStart = (e: React.TouchEvent, handle: "left" | "right" | "range") => {
    dragging.current = handle;
    dragStartX.current = e.touches[0].clientX;
    dragStartIndices.current = { start: startIndex, end: endIndex };
  };

  // Sparkline path
  const sparkMin = Math.min(...sparklineData);
  const sparkMax = Math.max(...sparklineData);
  const sparkRange = sparkMax - sparkMin || 1;
  const H = 44;
  const sparkPath = sparklineData.length > 1
    ? sparklineData
        .map((v, i) => {
          const x = (i / (sparklineData.length - 1)) * 100;
          const y = H - ((v - sparkMin) / sparkRange) * H;
          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ")
    : "";
  const sparkFill = sparkPath
    ? `${sparkPath} L 100 ${H} L 0 ${H} Z`
    : "";

  const leftPct = toX(startIndex);
  const rightPct = toX(endIndex);

  // Click on track to jump
  const onTrackClick = (e: React.MouseEvent) => {
    if (dragging.current) return;
    const idx = toIdx(e.clientX);
    const span = endIndex - startIndex;
    const half = Math.floor(span / 2);
    let newStart = idx - half;
    let newEnd = idx + (span - half);
    if (newStart < 0) { newStart = 0; newEnd = span; }
    if (newEnd > total - 1) { newEnd = total - 1; newStart = total - 1 - span; }
    onChange(newStart, newEnd);
  };

  return (
    <div className="mt-4 select-none" style={{ userSelect: "none" }}>
      {/* Labels */}
      <div className="flex justify-between mb-1 px-1">
        <span className="text-xs font-medium" style={{ color: "#7ba7d4" }}>{startLabel}</span>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          Glisser pour zoomer
        </span>
        <span className="text-xs font-medium" style={{ color: "#7ba7d4" }}>{endLabel}</span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative cursor-pointer"
        style={{ height: 56 }}
        onClick={onTrackClick}
      >
        {/* Background rail */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Sparkline SVG */}
          <svg
            viewBox={`0 0 100 ${H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.35 }}
          >
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            {sparkFill && <path d={sparkFill} fill="url(#sparkGrad)" />}
            {sparkPath && <path d={sparkPath} fill="none" stroke="#2563eb" strokeWidth="0.8" />}
          </svg>

          {/* Dimmed overlay outside selection */}
          <div
            className="absolute inset-y-0"
            style={{
              left: 0,
              width: `${leftPct}%`,
              backgroundColor: "rgba(0,0,0,0.55)",
            }}
          />
          <div
            className="absolute inset-y-0"
            style={{
              left: `${rightPct}%`,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.55)",
            }}
          />

          {/* Selected zone */}
          <div
            className="absolute inset-y-0"
            style={{
              left: `${leftPct}%`,
              width: `${rightPct - leftPct}%`,
              backgroundColor: "rgba(37,99,235,0.10)",
              borderLeft: "2px solid rgba(37,99,235,0.6)",
              borderRight: "2px solid rgba(37,99,235,0.6)",
              cursor: "grab",
            }}
            onMouseDown={(e) => onMouseDown(e, "range")}
            onTouchStart={(e) => onTouchStart(e, "range")}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Left handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-md cursor-ew-resize z-10"
          style={{
            left: `calc(${leftPct}% - 10px)`,
            width: 20,
            height: 36,
            backgroundColor: "#1d4ed8",
            border: "1.5px solid rgba(255,255,255,0.35)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
          onMouseDown={(e) => { e.stopPropagation(); onMouseDown(e, "left"); }}
          onTouchStart={(e) => { e.stopPropagation(); onTouchStart(e, "left"); }}
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="8" height="16" viewBox="0 0 8 16" fill="none">
            <line x1="2" y1="3" x2="2" y2="13" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="6" y1="3" x2="6" y2="13" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Right handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-md cursor-ew-resize z-10"
          style={{
            left: `calc(${rightPct}% - 10px)`,
            width: 20,
            height: 36,
            backgroundColor: "#1d4ed8",
            border: "1.5px solid rgba(255,255,255,0.35)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
          onMouseDown={(e) => { e.stopPropagation(); onMouseDown(e, "right"); }}
          onTouchStart={(e) => { e.stopPropagation(); onTouchStart(e, "right"); }}
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="8" height="16" viewBox="0 0 8 16" fill="none">
            <line x1="2" y1="3" x2="2" y2="13" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="6" y1="3" x2="6" y2="13" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
