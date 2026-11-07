"use client";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { BrandLogo, Logo, V60Logo } from "./ui";

export function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-[1fr_1.05fr]">
      <div className="relative hidden overflow-hidden bg-night md:block">
        <Image src="/images/lounge.jpg" alt="" fill sizes="50vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(4,106,78,.55),transparent),linear-gradient(rgba(9,10,9,.75),rgba(9,10,9,.9))]" />
        <div className="relative flex h-full flex-col items-center justify-center p-12">
          <BrandLogo width={380} />
        </div>
        <div className="absolute inset-x-0 bottom-8 text-center text-[11px] font-semibold tracking-[0.3em] text-gold/80">ONE &amp; SAGE · MANAGEMENT SYSTEM</div>
      </div>
      <div className="flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="md:hidden"><Logo size={40} /></Link>
            <V60Logo width={150} className="!bg-transparent !p-0 md:ml-0 ml-auto" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-forest">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}
