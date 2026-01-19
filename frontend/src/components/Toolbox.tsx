import * as LucideIcons from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { TOOLS, type ToolDefinition } from "../data/tools";

export function Toolbox() {
    const onDragStart = (event: React.DragEvent, tool: ToolDefinition) => {
        event.dataTransfer.setData("application/reactflow", JSON.stringify(tool));
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Outils disponibles
                </h2>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-200/50">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" /> Entrée
                    </span>
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full ring-1 ring-blue-200/50">
                        <span className="w-1 h-1 rounded-full bg-blue-500" /> Données
                    </span>
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full ring-1 ring-slate-200/50">
                        <span className="w-1 h-1 rounded-full bg-slate-500" /> Traitement
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 px-1 custom-scrollbar no-scrollbar">
                {TOOLS.map((tool) => {
                    const Icon = (LucideIcons[tool.icon as keyof typeof LucideIcons] as LucideIcon) || LucideIcons.Activity;
                    return (
                        <div
                            key={tool.tool_id}
                            draggable
                            onDragStart={(e) => onDragStart(e, tool)}
                            className="group flex flex-col items-center justify-center min-w-[100px] p-2.5 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md hover:shadow-blue-100/50 transition-all cursor-grab active:cursor-grabbing relative"
                            title={tool.description}
                        >
                            <div
                                className="p-2 rounded-lg mb-1.5"
                                style={{ backgroundColor: `${tool.color}10`, color: tool.color }}
                            >
                                <Icon size={18} strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 truncate w-full text-center">
                                {tool.label}
                            </span>

                            {/* Category Indicator Dot */}
                            <div
                                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full border border-white"
                                style={{ backgroundColor: tool.color }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
