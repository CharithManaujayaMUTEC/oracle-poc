"use client";
import Image from "next/image";
import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";
import { ReactNode, useEffect, useRef } from "react";

export function Icon({ name, ...p }: { name: string } & LucideProps) {
  const I = (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[name] ?? Icons.Circle;
  return <I {...p} />;
}

/** Compact lockup: emblem + wordmark. `dark` = for dark backgrounds. */
export function Logo({ size = 40, dark = false, mark = false }: { size?: number; dark?: boolean; mark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Image src="/brand/oracle-mark.png" alt="Oracle" width={size} height={size} className="shrink-0" priority />
      {!mark && (
        <div className="leading-none">
          <div className="font-wordmark text-xl font-semibold tracking-[0.18em]" style={{ color: dark ? "#D9C39A" : "#023C2E" }}>ORACLE</div>
          <div className="mt-1.5 text-[9px] font-semibold tracking-[0.28em]" style={{ color: dark ? "#B08D57" : "#8a6c3a" }}>BY VILLAGE 60 PLUS</div>
        </div>
      )}
    </div>
  );
}

/** Full Oracle by Village 60 Plus logo (transparent, for dark backgrounds). */
export function BrandLogo({ width = 320, className = "" }: { width?: number; className?: string }) {
  return <Image src="/brand/oracle-logo.png" alt="Oracle by Village 60 Plus — People · Purpose · A Brighter Tomorrow" width={width} height={Math.round(width * 0.968)} className={className} priority />;
}

/** Village 60 Plus parent-company logo (opaque white artwork, shown on a white tile). */
export function V60Logo({ width = 140, className = "" }: { width?: number; className?: string }) {
  return (
    <span className={`inline-block rounded-lg bg-white p-1.5 ${className}`}>
      <Image src="/brand/village60-logo.png" alt="Village 60 Plus — Professional Elderly Care Providers" width={width} height={Math.round(width * 0.403)} />
    </span>
  );
}

export function Avatar({ name, hue, size = 44 }: { name: string; hue: string; size?: number }) {
  const ini = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, background: hue, fontSize: size * 0.38 }}
    >
      {ini}
    </div>
  );
}

/** faceted gem used for rooms */
export function Gem({ color, size = 56 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <path d="M12 24 22 10h20l10 14-20 30z" fill={color} />
      <path d="M12 24h40L32 54z" fill="#fff" opacity=".18" />
      <path d="M22 10 28 24h-16zM42 10 36 24h16z" fill="#fff" opacity=".32" />
      <path d="M28 24 32 10 36 24z" fill="#fff" opacity=".12" />
      <path d="M28 24 32 54 36 24z" fill="#000" opacity=".1" />
    </svg>
  );
}

export function Ring({ value, size = 84, stroke = 9, color = "#023C2E", children }: { value: number; size?: number; stroke?: number; color?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#E7E5DA" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
          style={{ transition: "stroke-dashoffset 1s" }}
        />
      </svg>
      <div className="absolute text-center">{children}</div>
    </div>
  );
}

/** adds .in class when scrolled into view */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** Interactive front/back body map */
export function BodyMap({ pins, onAdd }: { pins: { x: number; y: number; side: "front" | "back" }[]; onAdd?: (p: { x: number; y: number; side: "front" | "back" }) => void }) {
  const fig = (side: "front" | "back", ox: number) => (
    <g
      key={side}
      transform={`translate(${ox},0)`}
      onClick={(e) => {
        if (!onAdd) return;
        const svg = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
        const x = ((e.clientX - svg.left) / svg.width) * 300 - ox;
        const y = ((e.clientY - svg.top) / svg.height) * 280;
        onAdd({ x, y, side });
      }}
      className="cursor-crosshair"
    >
      <rect x="-5" y="0" width="130" height="280" fill="transparent" />
      <circle cx="60" cy="28" r="20" fill="#f3ecdd" stroke="#023C2E" strokeWidth="2" />
      <path d="M38 56H82L108 66L116 150L104 154L94 96L92 150L98 262H66L60 170L54 262H22L28 150L26 96L16 154L4 150L12 66Z" fill="#f3ecdd" stroke="#023C2E" strokeWidth="2" strokeLinejoin="round" />
      {side === "back" && <path d="M60 56v110" stroke="#023C2E" strokeWidth="1.5" strokeDasharray="3 4" />}
      {pins
        .filter((p) => p.side === side)
        .map((p, i) => (
          <g key={i} className="pop">
            <circle cx={p.x} cy={p.y} r="9" fill="#c2395a" opacity=".2" />
            <circle cx={p.x} cy={p.y} r="5" fill="#c2395a" stroke="#fff" strokeWidth="1.5" />
          </g>
        ))}
    </g>
  );
  return (
    <svg viewBox="0 0 300 280" className="mx-auto w-full max-w-sm">
      {fig("front", 10)}
      {fig("back", 170)}
      <text x="70" y="276" textAnchor="middle" fontSize="10" fill="#66726C">FRONT</text>
      <text x="230" y="276" textAnchor="middle" fontSize="10" fill="#66726C">BACK</text>
    </svg>
  );
}
