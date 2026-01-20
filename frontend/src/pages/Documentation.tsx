import * as LucideIcons from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { TOOLS } from "../data/tools";

interface DocumentationProps {
    onBack?: () => void;
}

export function Documentation({ onBack }: DocumentationProps) {
    const categories = {
        input: { label: "Entrée", color: "#10b981" },
        data: { label: "Données", color: "#3b82f6" },
        process: { label: "Traitement", color: "#64748b" },
        output: { label: "Sortie", color: "#10b981" },
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <LucideIcons.ArrowLeft size={20} />
                        </button>
                        <h1 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                            Documentation
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                        <LucideIcons.BookOpen size={14} className="text-slate-500" />
                        <span className="text-xs font-bold text-slate-600">{TOOLS.length} Outils</span>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-6 pt-12">
                <div className="mb-16">
                    <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                        Catalogue des Outils
                    </h2>
                    <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
                        Découvrez comment chaque outil de notre système peut vous aider à construire des workflows d'analyse sportive puissants et automatisés.
                    </p>
                </div>

                <div className="space-y-24">
                    {(Object.entries(categories) as [keyof typeof categories, { label: string, color: string }][]).map(([catId, catConfig]) => {
                        const catTools = TOOLS.filter(t => t.category === catId);
                        if (catTools.length === 0) return null;

                        return (
                            <section key={catId} className="relative">
                                {/* Category Sidebar Marker */}
                                <div className="absolute -left-12 top-0 bottom-0 w-1 bg-slate-200 rounded-full opacity-20 hidden lg:block" />

                                <div className="flex items-center gap-3 mb-10">
                                    <div
                                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg"
                                        style={{ backgroundColor: catConfig.color }}
                                    >
                                        {catId === 'input' && <LucideIcons.LogIn size={16} />}
                                        {catId === 'data' && <LucideIcons.Database size={16} />}
                                        {catId === 'process' && <LucideIcons.Cpu size={16} />}
                                        {catId === 'output' && <LucideIcons.LogOut size={16} />}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                        {catConfig.label}s
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {catTools.map((tool) => {
                                        const Icon = (LucideIcons[tool.icon as keyof typeof LucideIcons] as LucideIcon) || LucideIcons.Activity;
                                        return (
                                            <div
                                                key={tool.tool_id}
                                                className="group bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                                            >
                                                <div className="flex items-start justify-between mb-6">
                                                    <div
                                                        className="p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300"
                                                        style={{ backgroundColor: `${tool.color}10`, color: tool.color }}
                                                    >
                                                        <Icon size={24} strokeWidth={2.5} />
                                                    </div>
                                                    <span className="font-mono text-[10px] text-slate-400 font-medium">
                                                        {tool.tool_id}
                                                    </span>
                                                </div>

                                                <h4 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                    {tool.label}
                                                </h4>
                                                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                                                    {tool.description}
                                                </p>

                                                <div className="space-y-6 pt-6 border-t border-slate-50">
                                                    <div>
                                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                                                            <LucideIcons.Target size={12} /> Rôle
                                                        </h5>
                                                        <p className="text-sm text-slate-700 leading-relaxed italic">
                                                            "{tool.role}"
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4">
                                                        <div>
                                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                                                                Inputs
                                                            </h5>
                                                            <div className="flex flex-wrap gap-2">
                                                                {tool.inputs.map((input, i) => (
                                                                    <div key={i} className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs border border-slate-100">
                                                                        <span className="font-bold text-slate-900">{input.name}</span>
                                                                        <span className="ml-1 text-slate-400">({input.type})</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                                                                Output
                                                            </h5>
                                                            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium border border-emerald-100/50 inline-block">
                                                                {tool.output}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
