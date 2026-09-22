"use client";

import { useState } from "react";
import {
  FiFolder,
  FiPlus,
  FiEyeOff,
  FiShoppingCart,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiArrowRight,
  FiZap,
  FiSettings,
} from "react-icons/fi";
import Link from "next/link";

const STEPS = [
  {
    id: "visibility",
    icon: FiEyeOff,
    label: "Hide & Show",
    title: "Hide and unhide items",
    body: "Every item card has a small toggle switch. Flip it OFF to hide that dish from your public menu — perfect for \"out of stock\" situations. Flip it back ON when it's available.",
    detail:
      'Hidden items show a "Hidden" badge on your dashboard so you never lose track of what\'s off-menu.',
    tip: "You can hide an entire category too by editing it — useful for seasonal menus.",
    gradientFrom: "#d97706",
    gradientTo: "#ea580c",
    hasCta: false,
  },
  {
    id: "settings",
    icon: FiSettings,
    label: "Settings",
    title: "Master your Settings",
    body: "The Settings page gives you complete control over your brand and operations. Update your restaurant name, change your brand colors, and manage your billing securely.",
    detail:
      "All your changes are applied instantly to your public menu, so you can always keep your brand fresh and up to date without any coding.",
    tip: "Customizing your brand color makes your menu feel unique and premium!",
    gradientFrom: "#2563eb",
    gradientTo: "#1d4ed8",
    hasCta: true,
    ctaLabel: "Explore Settings",
    ctaIsLink: true,
    ctaHref: "/dashboard/settings",
  },
  {
    id: "ordering",
    icon: FiShoppingCart,
    label: "Ordering",
    title: "Activate WhatsApp ordering",
    body: 'Go to Settings and open the "WhatsApp Orders" card. Toggle "Accept Orders" ON and enter your WhatsApp number, then hit Save.',
    detail:
      'Once enabled, an "Order" button appears next to every item. Customers tap it and a beautifully formatted order lands straight in your WhatsApp — zero third-party apps!',
    tip: "You can disable ordering at any time from the same Settings screen.",
    gradientFrom: "#16a34a",
    gradientTo: "#059669",
    hasCta: true,
    ctaLabel: "Go to Settings",
    ctaIsLink: true,
    ctaHref: "/dashboard/settings",
  },
];

function StepDots({ total, current, onGo }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onGo(i)}
          aria-label={`Go to step ${i + 1}`}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? "w-7 h-2.5 bg-white"
              : i < current
              ? "w-2.5 h-2.5 bg-white/50"
              : "w-2.5 h-2.5 bg-white/25"
          }`}
        />
      ))}
    </div>
  );
}

export default function MenuSetupGuide({ onAddCategory, onComplete }) {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("steps"); // "steps" | "confirm"

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  const goNext = () => {
    if (isLast) {
      setPhase("confirm");
    } else {
      setStep((s) => s + 1);
    }
  };

  const goPrev = () => {
    if (phase === "confirm") {
      setPhase("steps");
    } else {
      setStep((s) => Math.max(0, s - 1));
    }
  };

  // ── Confirmation screen ──────────────────────────────────────────────────
  if (phase === "confirm") {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center py-8 px-4">
        <div className="w-full max-w-md text-center">
          {/* Animated checkmark */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-500/10 text-primary-500">
            <FiCheckCircle size={40} />
          </div>

          <h2 className="text-2xl font-extrabold text-text mb-3">
            You're all set!
          </h2>
          <p className="text-text-muted leading-relaxed mb-8">
            You now know how to hide out-of-stock items and receive orders via WhatsApp. 
          </p>

          {/* Yes CTA */}
          <button
            onClick={onComplete}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-primary-500/30 transition-all hover:bg-primary-600 active:scale-95 mb-3"
          >
            <FiZap size={18} />
            Got it, take me to dashboard!
          </button>

          {/* Skip link */}
          <button
            onClick={goPrev}
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            Go back to the guide
          </button>
        </div>
      </div>
    );
  }

  // ── Steps screen ─────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-8 px-4">
      {/* Card */}
      <div className="w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl">
        {/* Gradient header */}
        <div
          className="relative px-7 pt-8 pb-10"
          style={{
            background: `linear-gradient(135deg, ${current.gradientFrom}, ${current.gradientTo})`,
          }}
        >
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-6">
            <StepDots
              total={STEPS.length}
              current={step}
              onGo={setStep}
            />
            <span className="text-xs font-bold text-white/70 uppercase tracking-widest">
              {step + 1} / {STEPS.length}
            </span>
          </div>

          {/* Icon */}
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm">
            <Icon size={28} />
          </div>

          {/* Label badge */}
          <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-white/90">
            {current.label}
          </span>

          <h2 className="text-2xl font-extrabold text-white leading-tight">
            {current.title}
          </h2>
        </div>

        {/* White body */}
        <div className="bg-surface px-7 py-6">
          <p className="text-text-muted leading-relaxed mb-4">{current.body}</p>

          <p className="text-sm text-text leading-relaxed mb-5">
            {current.detail}
          </p>

          {/* Tip */}
          <div className="flex items-start gap-2.5 rounded-xl border border-border bg-surface-alt p-3.5 mb-6">
            <FiCheckCircle
              size={15}
              className="mt-0.5 shrink-0 text-primary-500"
            />
            <p className="text-xs text-text-muted leading-relaxed">
              <span className="font-semibold text-text">Pro tip: </span>
              {current.tip}
            </p>
          </div>

          {/* Action row */}
          <div className="flex items-center gap-3">
            {/* Back */}
            {step > 0 && (
              <button
                onClick={goPrev}
                className="flex items-center gap-1 rounded-xl border border-border bg-surface-alt px-4 py-2.5 text-sm font-semibold text-text-muted transition-colors hover:bg-surface-elevated hover:text-text"
              >
                <FiChevronLeft size={16} />
                Back
              </button>
            )}

            {/* Optional step-level CTA */}
            {current.hasCta && (
              current.ctaIsLink ? (
                <Link
                  href={current.ctaHref}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all active:scale-95 hover:opacity-90 shadow-md"
                  style={{ backgroundColor: current.gradientFrom }}
                >
                  {current.ctaLabel}
                  <FiArrowRight size={15} />
                </Link>
              ) : (
                <button
                  onClick={onAddCategory}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all active:scale-95 hover:opacity-90 shadow-md"
                  style={{ backgroundColor: current.gradientFrom }}
                >
                  <FiPlus size={15} />
                  {current.ctaLabel}
                </button>
              )
            )}

            {/* Spacer when no step CTA */}
            {!current.hasCta && <div className="flex-1" />}

            {/* Next / Finish */}
            <button
              onClick={goNext}
              className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all active:scale-95 hover:opacity-90 shadow-md"
              style={{ backgroundColor: current.gradientFrom }}
            >
              {isLast ? "Finish" : "Next"}
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Skip guide link */}
      <button
        onClick={onComplete}
        className="mt-5 text-xs text-text-muted hover:text-text transition-colors"
      >
        Skip guide — go straight to dashboard
      </button>
    </div>
  );
}
