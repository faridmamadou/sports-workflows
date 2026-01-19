import { useState } from "react";

interface WorkflowResultProps {
    result: any;
}

export function WorkflowResult({ result }: WorkflowResultProps) {
    const [showJson, setShowJson] = useState(false);
    const [copied, setCopied] = useState(false);

    // Helper to copy JSON to clipboard
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Helper to render readable content
    const renderReadable = (data: any) => {
        if (Array.isArray(data)) {
            if (data.length === 0) return <p className="text-gray-500 italic">Empty list</p>;
            return (
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={index} className="border border-slate-200 rounded-md p-3 bg-slate-50">
                            <div className="text-xs font-semibold text-slate-400 mb-1">Item {index + 1}</div>
                            {renderReadable(item)}
                        </div>
                    ))}
                </div>
            );
        }

        if (typeof data === "object" && data !== null) {
            return (
                <div className="grid grid-cols-1 gap-2">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                            <span className="text-sm font-medium text-slate-700 min-w-[120px]">{key}:</span>
                            <div className="text-sm text-slate-600 break-words flex-1">
                                {typeof value === 'object' ? renderReadable(value) : String(value)}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return <span>{String(data)}</span>;
    };

    return (
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">Execution Results</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowJson(false)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${!showJson ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Readable
                    </button>
                    <button
                        onClick={() => setShowJson(true)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${showJson ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        JSON
                    </button>
                </div>
            </div>

            <div className="p-4 max-h-[500px] overflow-auto">
                {showJson ? (
                    <div className="relative group">
                        <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 px-2 py-1 text-xs bg-white/80 backdrop-blur border border-slate-200 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
                        >
                            {copied ? "Copied!" : "Copy JSON"}
                        </button>
                        <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap break-all">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                ) : (
                    <div className="prose prose-sm max-w-none">
                        {renderReadable(result)}
                    </div>
                )}
            </div>
        </div>
    );
}
