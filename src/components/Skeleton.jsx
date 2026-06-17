export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-surface-alt border border-border ${className}`}
      aria-hidden="true"
    />
  );
}
