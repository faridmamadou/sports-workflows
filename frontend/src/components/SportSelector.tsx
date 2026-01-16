import type { SportType } from "../types/workflow";

interface SportSelectorProps {
    value: SportType;
    onChange: (sport: SportType) => void;
}

const sports: { value: SportType; label: string }[] = [
    { value: "football", label: "Football" },
    { value: "basketball", label: "Basketball" },
    { value: "tennis", label: "Tennis" },
    { value: "rugby", label: "Rugby" },
];

export function SportSelector({ value, onChange }: SportSelectorProps) {
    return (
        <div className="w-full">
            <label htmlFor="sport-select" className="block text-xs font-medium text-slate-700 mb-2 uppercase tracking-wide">
                Sport
            </label>
            <select
                id="sport-select"
                value={value}
                onChange={(e) => onChange(e.target.value as SportType)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
                {sports.map((sport) => (
                    <option key={sport.value} value={sport.value}>
                        {sport.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
