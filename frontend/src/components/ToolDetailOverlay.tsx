import { X, ArrowRight, Info } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { type ToolDefinition } from "../data/tools";

interface ToolDetailOverlayProps {
    tool: ToolDefinition | null;
    onClose: () => void;
}

export function ToolDetailOverlay({ tool, onClose }: ToolDetailOverlayProps) {
    if (!tool) return null;

    const Icon = (LucideIcons[tool.icon as keyof typeof LucideIcons] as LucideIcon) || LucideIcons.Activity;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Color Accent */}
                <div
                    className="h-24 flex items-end px-8 pb-4 relative"
                    style={{ backgroundColor: `${tool.color}15` }}
                >
                    <div className="absolute top-6 right-6">
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/80 hover:bg-white rounded-full shadow-sm text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div
                        className="p-4 rounded-2xl bg-white shadow-xl shadow-slate-200/50 -mb-8 z-10"
                        style={{ color: tool.color }}
                    >
                        <Icon size={32} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="px-8 pt-12 pb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            {tool.label}
                        </h2>
                        <span
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white"
                            style={{ backgroundColor: tool.color }}
                        >
                            {tool.category}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                        ID: <span className="font-mono text-xs">{tool.tool_id}</span> • {tool.description}
                    </p>

                    <div className="space-y-6">
                        {/* Role Section */}
                        <section>
                            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-2.5">
                                <Info size={14} className="text-slate-300" />
                                Rôle de l'outil
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                {tool.role}
                            </p>
                        </section>

                        {/* Inputs Section */}
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                                Inputs attendus
                            </h3>
                            <div className="grid gap-2.5">
                                {tool.inputs.map((input, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-colors shadow-sm">
                                        <div className="mt-1 p-1 bg-slate-100 rounded text-slate-400">
                                            <ArrowRight size={12} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-sm font-bold text-slate-800">{input.name}</span>
                                                <span className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded lowercase">
                                                    {input.type}
                                                </span>
                                                {input.required && (
                                                    <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter">requis</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500">{input.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Output Section */}
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2.5">
                                Output / Sortie
                            </h3>
                            <div className="p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl flex items-start gap-3">
                                <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                                    <LucideIcons.FileOutput size={16} />
                                </div>
                                <p className="text-sm font-medium text-emerald-800/80 leading-relaxed">
                                    {tool.output}
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="px-8 py-6 bg-slate-50 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs text-slate-400 italic">
                        Glissez l'outil sur le canevas pour l'utiliser
                    </span>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
