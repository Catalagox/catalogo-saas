"use client";

interface Props {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ label, value, onChange }: Props) {
  return (
    <div className="flex items-center justify-between bg-[var(--bg-tertiary)] border border-[var(--border-card)] rounded-xl p-3">
      <label className="text-sm text-[var(--text-secondary)] font-medium">
        {label}
      </label>

      <div className="flex items-center gap-3">
        {/* Preview del color */}
        <div
          className="w-6 h-6 rounded-full border border-[var(--border-card)]"
          style={{ backgroundColor: value }}
        />

        {/* Input */}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 bg-transparent border-none cursor-pointer"
        />
      </div>
    </div>
  );
}
