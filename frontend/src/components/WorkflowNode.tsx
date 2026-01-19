import { Handle, Position } from "@xyflow/react";
import * as LucideIcons from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface WorkflowNodeProps {
    data: {
        label: string;
        tool_id: string;
        icon?: string;
        sublabel?: string;
        color?: string;
        [key: string]: any; // Allow other parameters
    };
}

export function WorkflowNode({ data }: WorkflowNodeProps) {
    // Get the icon component dynamically or fallback to Activity
    const IconComponent = (LucideIcons[data.icon as keyof typeof LucideIcons] as LucideIcon) || LucideIcons.Activity;

    const accentColor = data.color || "#64748b";

    // Filter out visual props to get only business parameters
    const params = Object.entries(data).filter(([key]) =>
        !["label", "tool_id", "icon", "sublabel", "color"].includes(key) &&
        data[key] !== null &&
        data[key] !== undefined
    );

    return (
        <div className="group relative flex flex-col min-w-[220px] bg-white rounded-2xl shadow-lg border border-slate-200 hover:border-blue-400 hover:shadow-blue-200/50 transition-all duration-300 overflow-hidden select-none ring-1 ring-slate-900/5">
            {/* Header / Accent Bar */}
            <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />

            <div className="p-4">
                {/* Input Handle */}
                <Handle
                    type="target"
                    position={Position.Left}
                    className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white hover:!bg-blue-500 transition-colors"
                />

                {/* Node Content */}
                <div className="flex items-start gap-3 w-full">
                    {/* Icon Container */}
                    <div
                        className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 shadow-inner"
                        style={{ backgroundColor: `${accentColor}10`, color: accentColor }}
                    >
                        <IconComponent size={22} strokeWidth={2.5} />
                    </div>

                    {/* Text Container */}
                    <div className="flex flex-col overflow-hidden flex-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate mb-0.5">
                            {data.tool_id.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm font-bold text-slate-800 truncate leading-tight">
                            {data.label}
                        </span>
                        {data.sublabel && (
                            <span className="text-[10px] text-slate-400 font-medium italic truncate mt-0.5">
                                {data.sublabel}
                            </span>
                        )}
                    </div>
                </div>

                {/* Parameters Section (if any) */}
                {params.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-50 flex flex-wrap gap-1.5">
                        {params.map(([key, value]) => (
                            <div key={key} className="px-2 py-0.5 bg-slate-100/80 rounded-md ring-1 ring-slate-200/50">
                                <span className="text-[9px] font-bold text-slate-400 uppercase mr-1">{key}:</span>
                                <span className="text-[10px] font-semibold text-slate-600 truncate max-w-[100px] inline-block align-middle">
                                    {String(value)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Output Handle */}
                <Handle
                    type="source"
                    position={Position.Right}
                    className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white hover:!bg-blue-500 transition-colors"
                />
            </div>

            {/* Selection Ring (visible on hover/select) */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400/20 pointer-events-none" />
        </div>
    );
}
