"use client";

import { FiCheck, FiDroplet } from "react-icons/fi";

const PRESET_COLORS = [
  // ===== Neutrals =====
  "#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5f5", "#94a3b8", "#64748b",
  "#475569", "#334155", "#1e293b", "#0f172a", "#020617",

  // ===== Reds =====
  "#fef2f2", "#fee2e2", "#fecaca", "#fca5a5", "#f87171", "#ef4444",
  "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d", "#450a0a",

  // ===== Oranges =====
  "#fff7ed", "#ffedd5", "#fed7aa", "#fdba74", "#fb923c", "#f97316",
  "#ea580c", "#c2410c", "#9a3412", "#7c2d12", "#431407",

  // ===== Ambers/Yellows =====
  "#fffbeb", "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b",
  "#d97706", "#b45309", "#92400e", "#78350f", "#451a03",

  "#fefce8", "#fef9c3", "#fef08a", "#fde047", "#facc15", "#eab308",
  "#ca8a04", "#a16207", "#854d0e", "#713f12", "#422006",

  // ===== Greens =====
  "#f0fdf4", "#dcfce7", "#bbf7d0", "#86efac", "#4ade80", "#22c55e",
  "#16a34a", "#15803d", "#166534", "#14532d", "#052e16",

  // ===== Lime =====
  "#f7fee7", "#ecfccb", "#d9f99d", "#bef264", "#a3e635", "#84cc16",
  "#65a30d", "#4d7c0f", "#3f6212", "#365314", "#1a2e05",

  // ===== Teal =====
  "#f0fdfa", "#ccfbf1", "#99f6e4", "#5eead4", "#2dd4bf", "#14b8a6",
  "#0d9488", "#0f766e", "#115e59", "#134e4a", "#042f2e",

  // ===== Cyan =====
  "#ecfeff", "#cffafe", "#a5f3fc", "#67e8f9", "#22d3ee", "#06b6d4",
  "#0891b2", "#0e7490", "#155e75", "#164e63", "#083344",

  // ===== Sky =====
  "#f0f9ff", "#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9",
  "#0284c7", "#0369a1", "#075985", "#0c4a6e", "#082f49",

  // ===== Blue =====
  "#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6",
  "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a", "#172554",

  // ===== Indigo =====
  "#eef2ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1",
  "#4f46e5", "#4338ca", "#3730a3", "#312e81", "#1e1b4b",

  // ===== Purple =====
  "#faf5ff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7",
  "#9333ea", "#7e22ce", "#6b21a8", "#581c87", "#3b0764",

  // ===== Pink =====
  "#fdf2f8", "#fce7f3", "#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899",
  "#db2777", "#be185d", "#9d174d", "#831843", "#500724",

  // ===== Rose =====
  "#fff1f2", "#ffe4e6", "#fecdd3", "#fda4af", "#fb7185", "#f43f5e",
  "#e11d48", "#be123c", "#9f1239", "#881337", "#4c0519",

  // ===== Brown =====
  "#efebe9", "#d7ccc8", "#bcaaa4", "#8d6e63", "#795548",
  "#6d4c41", "#5d4037", "#4e342e", "#3e2723",
];

export default function ColorPicker({ color, onChange, disabled }) {
  return (
    <div className="space-y-4">
      {/* Preset Colors */}
      <div className="flex flex-wrap gap-3">
        {PRESET_COLORS.map((preset) => (
          <button
            key={preset}
            type="button"
            disabled={disabled}
            onClick={() => onChange(preset)}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 ${color.toLowerCase() === preset.toLowerCase()
              ? "ring-2 ring-primary-500 ring-offset-2 ring-offset-surface"
              : "hover:scale-110 shadow-sm"
              }`}
            style={{ backgroundColor: preset }}
            aria-label={`Select color ${preset}`}
          >
            {color.toLowerCase() === preset.toLowerCase() && (
              <FiCheck className="h-5 w-5 text-white drop-shadow-md" />
            )}
          </button>
        ))}
      </div>

      {/* Custom Color Input */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiDroplet className="h-5 w-5 text-text-muted" />
          </div>
          <input
            type="text"
            maxLength={7}
            className="block w-full rounded-lg border border-border bg-surface px-10 py-3 font-mono text-text placeholder-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="#6366f1"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : "#6366f1"}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="absolute -inset-2 h-16 w-20 cursor-pointer border-0 p-0 disabled:cursor-not-allowed opacity-0"
            title="Pick a custom color"
          />
          <div
            className="absolute inset-1 rounded-md pointer-events-none"
            style={{ backgroundColor: /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#6366f1" }}
          />
        </div>
      </div>
    </div>
  );
}
