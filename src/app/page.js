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
  FiBookOpen,
} from "react-icons/fi";

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
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-border bg-surface/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <Image src="/logo.png" alt="OurMenu.Click logo" width={32} height={32} className="rounded-lg bg-white p-1 sm:h-10 sm:w-10" priority />
          <span className="font-logo text-2xl sm:text-3xl tracking-tight text-primary-500 dark:text-white">
            OurMenu.Click
          </span>
        </div>
        
        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-text-muted">
          <a href="#services" className="hover:text-primary-500 transition-colors">Services</a>
          <a href="#features" className="hover:text-primary-500 transition-colors">Features</a>
          <a href="#use-cases" className="hover:text-primary-500 transition-colors">Use Cases</a>
          <a href="#pricing" className="hover:text-primary-500 transition-colors">Pricing</a>
          <Link href="/guide" className="hover:text-primary-500 transition-colors">Guide</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/signin" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-primary-500 transition-colors">
            Log in <FiArrowRight className="h-4 w-4" />
          </Link>
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
              <Link href="/guide" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary-500 transition-colors">Guide</Link>
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
        <section className="relative overflow-hidden min-h-[70vh] sm:min-h-[85vh] flex items-center">
          {/* Parallax Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed bg-no-repeat"
            style={{ backgroundImage: "url('/restaurant 1.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <FiStar className="h-4 w-4 text-yellow-400" />
              Digital menus for Kenya
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl mb-8 sm:mb-12">
              Use us to get your menu <span className="text-blue-400">visible to everyone</span>
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
        <section id="services" className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-surface scroll-mt-20">
          {/* Decorative Solid Shapes */}
          <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-blue-100 dark:bg-blue-900/50 pointer-events-none animate-[bounce_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 -left-16 h-48 w-48 rounded-3xl bg-indigo-100 dark:bg-indigo-900/50 pointer-events-none animate-[bounce_10s_ease-in-out_infinite]" />
          <div className="absolute top-1/2 left-1/4 h-24 w-24 rounded-full bg-sky-200 dark:bg-sky-900/40 pointer-events-none animate-[bounce_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 right-1/4 h-32 w-32 rounded-[2rem] bg-cyan-100 dark:bg-cyan-900/30 pointer-events-none animate-[bounce_12s_ease-in-out_infinite]" />
          <div className="relative mx-auto max-w-5xl">
            <div className="reveal mb-16 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-3">Services</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-extrabold text-text sm:text-4xl">Who is it for?</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-8 items-stretch">
              <div className="reveal relative group">
                <div className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 group-hover:shadow-primary-500/20 group-hover:-translate-y-2 border border-border h-56 sm:h-72">
                  <Image src="/restaurant 1.jpg" alt="Restaurant" fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:bg-black/50" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">Restaurants &amp; Hotels</h3>
                  </div>
                </div>
              </div>
              <div className="reveal delay-200 relative group">
                <div className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 group-hover:shadow-primary-500/20 group-hover:-translate-y-2 border border-border h-56 sm:h-72">
                  <Image src="/retaurant 2.jpg" alt="Cafe food" fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:bg-black/50" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">Cafes, Bars &amp; Food Trucks</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT DO WE OFFER? ── */}
        <section id="features" className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-surface-alt scroll-mt-20">
          <div className="absolute top-1/3 left-10 h-40 w-40 rounded-full bg-cyan-200 dark:bg-cyan-900/50 pointer-events-none animate-[bounce_9s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 right-20 h-56 w-56 rounded-[40px] bg-blue-200 dark:bg-blue-900/50 pointer-events-none animate-[bounce_11s_ease-in-out_infinite]" />
          <div className="absolute top-10 right-1/4 h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900/40 pointer-events-none animate-[bounce_7s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/3 left-1/4 h-28 w-28 rounded-2xl bg-purple-100 dark:bg-purple-900/40 pointer-events-none animate-[bounce_10s_ease-in-out_infinite]" />
          <div className="relative mx-auto max-w-5xl">
            <div className="reveal mb-16 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-3">What we offer</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-extrabold text-text sm:text-4xl">What do you get?</h2>
            </div>
            <ul className="space-y-4 max-w-2xl mx-auto text-lg text-text-muted">
              {[
                { title: "Interactive Menu", desc: "Show categories, food items, images, and prices in real-time." },
                { title: "QR Code Generator", desc: "A clean scannable code generated automatically for tables." },
                { title: "Your Own Link", desc: "Get a branded link like ourmenu.click/yourplace, share it anywhere. No website required." },
                { title: "WhatsApp Ordering", desc: "Customers can order directly from your menu via WhatsApp." },
              ].map(({ title, desc }, i) => (
                <li key={title} className={`reveal delay-${(i + 1) * 100} flex items-start gap-3`}>
                  <FiCheck className="mt-1 h-6 w-6 shrink-0 text-primary-500" />
                  <div>
                    <strong className="text-text">{title}:</strong> {desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── WHERE TO USE IT? ── */}
        <section id="use-cases" className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-surface scroll-mt-20">
          <div className="absolute top-20 right-1/4 h-32 w-32 rounded-xl bg-purple-200 dark:bg-purple-900/50 pointer-events-none animate-[bounce_12s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 left-1/4 h-48 w-48 rounded-full bg-sky-200 dark:bg-sky-900/50 pointer-events-none animate-[bounce_8s_ease-in-out_infinite]" />
          <div className="absolute top-1/2 left-10 h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/30 pointer-events-none animate-[bounce_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-20 right-10 h-40 w-40 rounded-[2rem] bg-indigo-200 dark:bg-indigo-900/40 pointer-events-none animate-[bounce_14s_ease-in-out_infinite]" />
          <div className="relative mx-auto max-w-5xl">
            <div className="reveal mb-16 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-3">Use cases</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-extrabold text-text sm:text-4xl">Where can you use it?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {[
                  { label: "Table QR Stickers", sub: "Customers scan and browse instantly no app needed." },
                  { label: "Social Media Bios", sub: "Drop your link in Instagram or Facebook bio." },
                  { label: "Business Cards", sub: "Print your QR on cards and hand them out." },
                  { label: "Posters &amp; Flyers", sub: "Put your menu anywhere people can scan it." },
                ].map(({ label, sub }, i) => (
                  <div key={label} className={`reveal delay-${(i + 1) * 100} flex items-start gap-4`}>
                    <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white font-bold text-lg">
                      {i + 1}
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

        {/* ── HOW DOES IT WORK? (GUIDE) ── */}
        <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-surface-alt scroll-mt-20 border-t border-b border-border">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none gap-20 opacity-50">
            <div className="h-64 w-64 rounded-full bg-blue-200 dark:bg-blue-900/50 animate-[bounce_9s_ease-in-out_infinite]" />
            <div className="h-48 w-48 rounded-3xl bg-indigo-200 dark:bg-indigo-900/50 animate-[bounce_11s_ease-in-out_infinite]" />
            <div className="absolute top-10 left-1/4 h-32 w-32 rounded-full bg-cyan-200 dark:bg-cyan-900/40 animate-[bounce_7s_ease-in-out_infinite]" />
            <div className="absolute bottom-10 right-1/4 h-40 w-40 rounded-[3rem] bg-purple-200 dark:bg-purple-900/40 animate-[bounce_13s_ease-in-out_infinite]" />
          </div>
          <div className="relative mx-auto max-w-5xl">
            <div className="reveal text-center mb-12">
              <p className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-3">Learn the ropes</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-extrabold text-text sm:text-4xl mb-4">How does it work?</h2>
              <p className="text-text-muted max-w-2xl mx-auto text-lg">
                Setting up your menu is incredibly easy and takes just a few minutes. Check out our comprehensive guide to see exactly what the dashboard looks like and how to manage your digital presence.
              </p>
            </div>
            <div className="reveal reveal-scale flex justify-center">
              <Link href="/guide" className="inline-flex items-center gap-3 rounded-2xl bg-primary-500 px-8 py-5 font-bold text-white hover:bg-primary-600 transition-all active:scale-95 shadow-lg shadow-primary-500/30 text-lg">
                <FiBookOpen className="h-6 w-6" /> Read the Setup Guide <FiArrowRight className="h-5 w-5" />
              </Link>
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
                Customers decide in seconds. A clean, fast, visual menu keeps them interested and coming back.
              </p>
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-primary-700 hover:bg-primary-50 transition-all active:scale-95">
                Make Yours Today <FiArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>


        {/* ── HOW MUCH DOES IT COST? ── */}
        <section id="pricing" className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-surface scroll-mt-20">
          <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-cyan-200 dark:bg-cyan-900/50 pointer-events-none animate-[bounce_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 right-10 h-56 w-56 rounded-[3rem] bg-blue-200 dark:bg-blue-900/50 pointer-events-none animate-[bounce_10s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 right-1/4 h-24 w-24 rounded-full bg-indigo-100 dark:bg-indigo-900/40 pointer-events-none animate-[bounce_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 left-1/4 h-32 w-32 rounded-[2rem] bg-purple-100 dark:bg-purple-900/30 pointer-events-none animate-[bounce_12s_ease-in-out_infinite]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="reveal mb-16">
              <p className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-3">Pricing</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-extrabold text-text sm:text-4xl">How much does it cost?</h2>
              <p className="mt-3 text-text-muted">Create your menu for free. Pay only when you are ready to publish it.</p>
            </div>
            <div className="flex justify-center text-left">
              <div className="reveal reveal-scale w-full max-w-md rounded-3xl border-2 border-primary-500 bg-surface p-8 hover:border-primary-500/40 hover:shadow-xl transition-all">
                <h3 className="text-xl font-bold text-text mb-1">Standard Plan</h3>
                <div className="flex items-end gap-2 mt-4 mb-1">
                  <span className="text-4xl font-extrabold text-text">1,999 KES</span>
                  <span className="text-text-muted mb-1">/mo</span>
                </div>
                <p className="text-sm text-primary-500 font-semibold mb-8">~ $15 USD / month</p>
                <ul className="space-y-3 mb-10">
                  {["Unlimited scans", "Branded QR Code", "Unlimited food items", "Unlimited categories", "Real-time updates"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium text-text-muted">
                      <FiCheck className="h-4 w-4 shrink-0 text-primary-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-3 text-base font-bold text-white transition-all hover:bg-primary-600 active:scale-95">
                  Start Creating <FiArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── NEED HELP? ── */}
        <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-surface-alt border-t border-border">
          <div className="absolute top-10 right-20 h-32 w-32 rounded-2xl bg-purple-200 dark:bg-purple-900/50 pointer-events-none animate-[bounce_11s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 left-20 h-40 w-40 rounded-full bg-blue-200 dark:bg-blue-900/50 pointer-events-none animate-[bounce_9s_ease-in-out_infinite]" />
          <div className="absolute top-1/2 left-1/3 h-20 w-20 rounded-full bg-cyan-200 dark:bg-cyan-900/30 pointer-events-none animate-[bounce_7s_ease-in-out_infinite]" />
          <div className="absolute bottom-20 right-1/3 h-28 w-28 rounded-3xl bg-indigo-200 dark:bg-indigo-900/40 pointer-events-none animate-[bounce_10s_ease-in-out_infinite]" />
          <div className="relative reveal mx-auto max-w-xl text-center">
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
      <footer className="bg-primary-500 px-4 py-16 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-white mb-4">Platform</h3>
              <ul className="space-y-3 text-sm text-white/80">
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#use-cases" className="hover:text-white transition-colors">Use Cases</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/guide" className="hover:text-white transition-colors">Guide</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Account</h3>
              <ul className="space-y-3 text-sm text-white/80">
                <li><Link href="/signin" className="hover:text-white transition-colors">Log In</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-3 text-sm text-white/80">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="OurMenu.Click logo" width={28} height={28} className="rounded-md bg-white p-0.5" />
                <span className="font-logo font-bold text-xl text-white">OurMenu.Click</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                The modern digital menu platform for hospitality businesses in Kenya.
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-white/20 flex items-center justify-center text-sm text-white/80">
            <p>&copy; {new Date().getFullYear()} OurMenu.Click. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
