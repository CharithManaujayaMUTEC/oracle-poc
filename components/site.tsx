import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { Logo } from "./ui";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/"><Logo /></Link>
        <nav className="hidden gap-7 text-sm font-semibold text-forest lg:flex">
          <Link href="/residences">Residences</Link>
          <Link href="/packages">Packages</Link>
          <Link href="/services">Services</Link>
          <Link href="/staff">Our team</Link>
          <Link href="/policies">Policies</Link>
        </nav>
        <div className="flex gap-3">
          <Link href="/login" className="btn btn-ghost">Sign in</Link>
          <Link href="/signup" className="btn btn-gold hidden sm:inline-flex">Join</Link>
        </div>
      </div>
      <nav className="flex gap-5 overflow-x-auto border-t border-line/70 px-6 py-2 text-xs font-semibold text-forest lg:hidden">
        <Link href="/residences">Residences</Link>
        <Link href="/packages">Packages</Link>
        <Link href="/services">Services</Link>
        <Link href="/staff">Our team</Link>
        <Link href="/policies">Policies</Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-cream py-10 text-center">
      <div className="flex justify-center"><Logo size={32} /></div>
      <div className="mt-3 text-xs text-mute">People · Purpose · A Brighter Tomorrow — prototype with demo data</div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, image, children }: { eyebrow: string; title: string; image?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-forest text-white">
      {image && <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-30" />}
      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-gold2"><span className="h-px w-10 bg-gold2" />{eyebrow}</div>
        <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        {children}
      </div>
    </section>
  );
}
