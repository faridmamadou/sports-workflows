interface QueryInputProps {
    value: string;
    onChange: (query: string) => void;
    onGenerate: () => void;
}

export function QueryInput({ value, onChange, onGenerate }: QueryInputProps) {
    return (
        <div className="w-full space-y-3">
            <label htmlFor="query-input" className="block text-sm font-medium text-gray-700">
                Votre requête
            </label>
            <textarea
                id="query-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Ex: Donne-moi les dernières actualités et transferts du PSG..."
                rows={4}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all text-base"
            />
            <button
                onClick={onGenerate}
                disabled={!value.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                ✨ Générer le workflow
            </button>
        </div>
    );
}
