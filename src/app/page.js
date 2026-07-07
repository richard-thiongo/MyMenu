"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import useAuthStore from "@/hooks/useAuthStore";
import {
  FiArrowRight,
  FiCheck,
  FiMail,
  FiPhone,
  FiMonitor,
  FiLink,
  FiGrid,
  FiInstagram,
  FiCreditCard,
  FiPrinter,
  FiStar,
  FiMenu,
  FiX,
} from "react-icons/fi";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-scale, .reveal-fade");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function Home() {
  const token = useAuthStore((state) => state.token);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useReveal();

  return (
    <div className="flex min-h-screen flex-col bg-surface text-text">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-surface/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <Image src="/logo.png" alt="Kenyan.menu logo" width={32} height={32} className="rounded-lg sm:h-10 sm:w-10" priority />
          <span className="font-logo text-2xl sm:text-3xl tracking-tight text-primary-500 dark:text-white">
            Kenyan.menu
          </span>
        </div>
        
        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-text-muted">
          <a href="#services" className="hover:text-primary-500 transition-colors">Services</a>
          <a href="#features" className="hover:text-primary-500 transition-colors">Features</a>
          <a href="#use-cases" className="hover:text-primary-500 transition-colors">Use Cases</a>
          <a href="#pricing" className="hover:text-primary-500 transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/signin" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-primary-500 transition-colors">
            Log in <FiArrowRight className="h-4 w-4" />
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
          <button 
            className="md:hidden p-2 text-text hover:text-primary-500 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative ml-auto flex h-full w-4/5 max-w-xs flex-col bg-surface py-6 px-6 shadow-2xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-primary-500">Menu</span>
              <button 
                className="p-2 text-text-muted hover:text-primary-500 transition-colors rounded-full bg-surface-alt"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-6 text-base font-semibold text-text">
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary-500 transition-colors">Services</a>
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary-500 transition-colors">Features</a>
              <a href="#use-cases" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary-500 transition-colors">Use Cases</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary-500 transition-colors">Pricing</a>
            </nav>

            <div className="mt-auto flex flex-col gap-4 border-t border-border pt-6">
              <Link 
                href="/signin" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-surface-alt py-3 font-bold text-text hover:border-primary-500 transition-colors"
              >
                Log in
              </Link>
              <Link 
                href="/signup" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary-500 py-3 font-bold text-white hover:bg-primary-600 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="flex flex-1 flex-col">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden min-h-[85vh] flex items-center">
          {/* Parallax Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed bg-no-repeat"
            style={{ backgroundImage: "url('/restaurant 1.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="reveal mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <FiStar className="h-4 w-4 text-yellow-400" />
              Digital menus for Kenya
            </div>
            <h1 className="reveal delay-100 font-[family-name:var(--font-playfair)] text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl mb-6">
              Your menu,
              <span className="block text-primary-400">everywhere.</span>
            </h1>
            <p className="reveal delay-200 mx-auto max-w-xl text-lg text-white/80 mb-10">
              Build a stunning digital menu in minutes. Share via QR code or link.
            </p>
            <div className="reveal delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link id="cta-explore" href="/signup" className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary-500 px-8 py-4 text-base font-bold text-white transition-all hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30 active:scale-95">
                Get Started <FiArrowRight className="h-5 w-5" />
              </Link>
              <Link id="cta-login" href="/signin" className="flex w-full sm:w-auto items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:border-white/60 active:scale-95">
                Log in
              </Link>
            </div>
          </div>
        </section>

        {/* ── WHO IS IT FOR? ── */}
        <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface scroll-mt-20">
          <div className="mx-auto max-w-5xl">
            <div className="reveal mb-16 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-3">Services</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-extrabold text-text sm:text-4xl">Who is it for?</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-8 items-stretch">
              <div className="reveal reveal-scale relative overflow-hidden rounded-3xl shadow-2xl">
                <Image src="/restaurant 1.jpg" alt="Restaurant" width={600} height={500} className="h-80 w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-1">For</p>
                  <h3 className="text-2xl font-extrabold text-white">Restaurants &amp; Hotels</h3>
                  <p className="mt-1 text-sm text-white/70">Full menus, categories, and item details.</p>
                </div>
              </div>
              <div className="reveal reveal-scale delay-200 relative overflow-hidden rounded-3xl shadow-2xl">
                <Image src="/retaurant 2.jpg" alt="Cafe food" width={600} height={500} className="h-80 w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-1">Also for</p>
                  <h3 className="text-2xl font-extrabold text-white">Cafes, Bars &amp; Food Trucks</h3>
                  <p className="mt-1 text-sm text-white/70">Fast setup, no technical skills needed.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT DO WE OFFER? ── */}
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-alt scroll-mt-20">
          <div className="mx-auto max-w-5xl">
            <div className="reveal mb-16 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-3">What we offer</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-extrabold text-text sm:text-4xl">What do you get?</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: FiGrid, title: "Digital Menu", desc: "Categories, items, images, prices — all in one place." },
                { icon: FiMonitor, title: "QR Code", desc: "A scannable code generated automatically for your menu." },
                { icon: FiLink, title: "Shareable Link", desc: "A branded URL: kenyan.menu/YourRestaurant" },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className={`reveal delay-${(i + 1) * 100} rounded-2xl border border-border bg-surface p-8 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/5 transition-all`}>
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10">
                    <Icon className="h-7 w-7 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">{title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHERE TO USE IT? ── */}
        <section id="use-cases" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface scroll-mt-20">
          <div className="mx-auto max-w-5xl">
            <div className="reveal mb-16 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-3">Use cases</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-extrabold text-text sm:text-4xl">Where can you use it?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {[
                  { icon: FiGrid, label: "Table QR Stickers", sub: "Customers scan and browse instantly — no app needed." },
                  { icon: FiInstagram, label: "Social Media Bios", sub: "Drop your link in Instagram or Facebook bio." },
                  { icon: FiCreditCard, label: "Business Cards", sub: "Print your QR on cards and hand them out." },
                  { icon: FiPrinter, label: "Posters &amp; Flyers", sub: "Put your menu anywhere people can scan it." },
                ].map(({ icon: Icon, label, sub }, i) => (
                  <div key={label} className={`reveal delay-${(i + 1) * 100} flex items-start gap-4`}>
                    <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10">
                      <Icon className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text mb-0.5" dangerouslySetInnerHTML={{ __html: label }} />
                      <p className="text-sm text-text-muted" dangerouslySetInnerHTML={{ __html: sub }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="reveal reveal-scale delay-200 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-3xl bg-primary-500/10 blur-2xl" />
                  <Image src="/qr example image.jpeg" alt="QR Code Example" width={360} height={360} className="relative rounded-3xl border-4 border-surface-alt shadow-2xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY DOES IT MATTER? ── */}
        <section className="relative overflow-hidden py-28 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0">
            <Image src="/retaurant 2.jpg" alt="Experience" fill className="object-cover" />
            <div className="absolute inset-0 bg-primary-900/85" />
          </div>
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="reveal">
              <p className="text-sm font-bold uppercase tracking-widest text-primary-300 mb-4">Why it matters</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-5xl font-extrabold text-white mb-6">Does your menu impress?</h2>
              <p className="text-white/75 text-lg leading-relaxed mb-8">
                Customers decide in seconds. A clean, fast, visual menu keeps them interested — and coming back.
              </p>
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-primary-700 hover:bg-primary-50 transition-all active:scale-95">
                Make Yours Today <FiArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── HOW MUCH DOES IT COST? ── */}
        <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface scroll-mt-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="reveal mb-16">
              <p className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-3">Pricing</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-extrabold text-text sm:text-4xl">How much does it cost?</h2>
              <p className="mt-3 text-text-muted">Create your menu for free. Pay only when you are ready to publish it.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-8 text-left">

              {/* Basic */}
              <div className="reveal reveal-scale rounded-3xl border-2 border-border bg-surface p-8 hover:border-primary-500/40 hover:shadow-xl transition-all">
                <h3 className="text-xl font-bold text-text mb-1">Basic</h3>
                <div className="flex items-end gap-2 mt-4 mb-1">
                  <span className="text-4xl font-extrabold text-text">2,300 KES</span>
                  <span className="text-text-muted mb-1">/mo</span>
                </div>
                <p className="text-sm text-primary-500 font-semibold mb-8">~ $18 USD / month</p>
                <ul className="space-y-3 mb-10">
                  {["Unlimited scans", "Branded QR Code", "Up to 90 items"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium text-text-muted">
                      <FiCheck className="h-4 w-4 shrink-0 text-primary-500" /> {f}
                    </li>
                  ))}
                </ul>

              </div>

              {/* Advanced */}
              <div className="reveal reveal-scale delay-200 relative rounded-3xl border-2 border-primary-500 bg-primary-500/5 p-8 shadow-lg">
                <div className="absolute -top-4 right-8 rounded-full bg-primary-500 px-5 py-1.5 text-xs font-extrabold uppercase tracking-widest text-white shadow-lg">
                  Large Menus
                </div>
                <h3 className="text-xl font-bold text-text mb-1">Advanced</h3>
                <div className="flex items-end gap-2 mt-4 mb-1">
                  <span className="text-4xl font-extrabold text-text">3,000 KES</span>
                  <span className="text-text-muted mb-1">/mo</span>
                </div>
                <p className="text-sm text-primary-500 font-semibold mb-8">~ $23 USD / month</p>
                <ul className="space-y-3 mb-10">
                  {["Everything in Basic", "90+ food items", "Unlimited categories"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium text-text-muted">
                      <FiCheck className="h-4 w-4 shrink-0 text-primary-500" /> {f}
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          </div>
        </section>

        {/* ── NEED HELP? ── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-alt border-t border-border">
          <div className="reveal mx-auto max-w-xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-3">Support</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-extrabold text-text mb-3">Need help?</h2>
            <p className="text-text-muted mb-10">We are here for you. Reach out anytime.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-surface px-6 py-4 font-semibold text-text w-full sm:w-auto justify-center select-all cursor-text">
                <FiMail className="h-5 w-5 shrink-0 text-primary-500" />
                kenyamenu8@gmail.com
              </div>
              <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-surface px-6 py-4 font-semibold text-text w-full sm:w-auto justify-center select-all cursor-text">
                <FiPhone className="h-5 w-5 shrink-0 text-primary-500" />
                +254 704 286 209
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl flex flex-col items-center justify-between gap-4 sm:flex-row text-sm text-text-muted">
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-primary-500 transition-colors">Terms and Conditions</Link>
            <span className="text-border-strong">&middot;</span>
            <Link href="/privacy" className="hover:text-primary-500 transition-colors">Privacy Policy</Link>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Kenyan.menu — All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
