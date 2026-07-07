// Decorative restaurant-style divider shown below category headings
export default function MenuDivider({ color }) {
  const accent = color || "var(--theme-primary)";
  return (
    <div className="flex items-center gap-3 mt-1 mb-5">
      {/* Left line */}
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${accent}66)` }} />

      {/* Centre ornament — dot · fork · dot */}
      <div className="flex items-center gap-3 select-none" style={{ color: "#FFC107", opacity: 0.7 }}>
        <span className="text-[8px]">●</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 2v8a2 2 0 002 2v10h2V12a2 2 0 002-2V2h-2v7h-1V2H10v7H9V2H8zm8 0c-1.1 0-2 1.79-2 4v5a2 2 0 001 1.73V22h2v-9.27A2 2 0 0018 11V6c0-2.21-.9-4-2-4z" />
        </svg>
        <span className="text-[8px]">●</span>
      </div>

      {/* Right line */}
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${accent}66)` }} />
    </div>
  );
}