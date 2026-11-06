"use client";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { Logo } from "./ui";

export function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-[1fr_1.1fr]">
      <div className="relative hidden overflow-hidden bg-forest p-10 md:block">
        <div className="relative z-10"><Logo dark /></div>
        <Image src="/images/lounge.jpg" alt="" fill sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-forest/75" />
        <div className="absolute z-10 bottom-10 left-10 text-4xl font-semibold leading-tight text-white">
          Care, <span className="text-gold2">connected.</span>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 md:hidden"><Link href="/"><Logo /></Link></div>
          <h1 className="text-4xl font-semibold text-forest">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}
