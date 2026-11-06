import Link from "next/link";
import { Logo } from "./ui";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/"><Logo /></Link>
        <nav className="hidden gap-8 text-sm font-semibold text-forest md:flex">
          <Link href="/#homes">Homes</Link>
          <Link href="/packages">Packages</Link>
          <Link href="/#life">Services</Link>
          <Link href="/#one">ONE · SAGE</Link>
          <Link href="/#path">Journey</Link>
        </nav>
        <div className="flex gap-3">
          <Link href="/login" className="btn btn-ghost">Sign in</Link>
          <Link href="/signup" className="btn btn-gold hidden sm:inline-flex">Join</Link>
        </div>
      </div>
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
