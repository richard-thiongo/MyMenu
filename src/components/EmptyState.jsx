import { FiInbox } from "react-icons/fi";

export default function EmptyState({ title, description, icon: Icon }) {
  const DisplayIcon = Icon || FiInbox;

  return (
    <div className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
      <div className="mb-4 rounded-full bg-surface-alt p-4 text-text-muted">
        <DisplayIcon size={32} />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text">{title}</h3>
      <p className="max-w-sm text-sm text-text-muted">{description}</p>
    </div>
  );
}
