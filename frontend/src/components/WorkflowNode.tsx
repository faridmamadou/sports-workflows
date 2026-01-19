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
    };
}

export function WorkflowNode({ data }: WorkflowNodeProps) {
    // Get the icon component dynamically or fallback to Activity
    const IconComponent = (LucideIcons[data.icon as keyof typeof LucideIcons] as LucideIcon) || LucideIcons.Activity;

    const accentColor = data.color || "#64748b";

    return (
        <div className="group relative flex items-center min-w-[200px] bg-white rounded-xl shadow-md border border-slate-200 hover:border-blue-400 transition-all duration-200 p-3 select-none">
            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white hover:!bg-blue-500 transition-colors"
            />

            {/* Node Content */}
            <div className="flex items-center gap-3 w-full">
                {/* Icon Container */}
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 overflow-hidden"
                    style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                >
                    <IconComponent size={20} strokeWidth={2.5} />
                </div>

                {/* Text Container */}
                <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate">
                        {data.tool_id.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 truncate">
                        {data.label}
                    </span>
                    {data.sublabel && (
                        <span className="text-[10px] text-slate-400 italic truncate">
                            {data.sublabel}
                        </span>
                    )}
                </div>
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Right}
                className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white hover:!bg-blue-500 transition-colors"
            />

            {/* Selection Ring (visible on hover/select) */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-100 pointer-events-none" />
        </div>
    );
}
