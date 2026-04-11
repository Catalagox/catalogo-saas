"use client";

interface Props {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ label, value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">
        {label}
      </label>

      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 h-10"
      />
    </div>
  );
}