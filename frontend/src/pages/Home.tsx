import { useState } from "react";
import type { SportType, Workflow } from "../types/workflow";
import { SportSelector } from "../components/SportSelector";
import { QueryInput } from "../components/QueryInput";
import { WorkflowCanvas } from "../components/WorkflowCanvas";
import { mockWorkflow } from "../data/mockWorkflow";

export function Home() {
    const [sport, setSport] = useState<SportType>("football");
    const [query, setQuery] = useState("");
    const [workflow, setWorkflow] = useState<Workflow | null>(null);

    const handleGenerate = () => {
        console.log("Generating workflow for:", { sport, query });
        setWorkflow(mockWorkflow);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">
                                Sports Workflow
                            </h1>
                            <p className="mt-0.5 text-sm text-slate-600">
                                Generate intelligent workflows for sports data analysis
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                                Documentation
                            </button>
                            <button className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 py-8">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Sidebar - Controls */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* Query Section */}
                        <div className="rounded-lg border border-slate-200 bg-white p-5">
                            <h2 className="text-sm font-semibold text-slate-900 mb-4">
                                New Workflow
                            </h2>
                            <div className="space-y-4">
                                <SportSelector value={sport} onChange={setSport} />
                                <QueryInput
                                    value={query}
                                    onChange={setQuery}
                                    onGenerate={handleGenerate}
                                />
                            </div>
                        </div>

                        {/* Workflow Stats */}
                        {workflow && (
                            <div className="rounded-lg border border-slate-200 bg-white p-5">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                                    Workflow Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Workflow ID</span>
                                        <span className="font-mono text-xs text-slate-900">
                                            {workflow.id}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Total Nodes</span>
                                        <span className="font-semibold text-slate-900">
                                            {workflow.nodes.length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Connections</span>
                                        <span className="font-semibold text-slate-900">
                                            {workflow.edges.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Node Types Legend */}
                                <div className="mt-5 pt-4 border-t border-slate-200">
                                    <h4 className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                                        Node Types
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
                                            <span className="text-xs text-slate-600">Context</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-3 h-3 rounded-sm bg-emerald-600"></div>
                                            <span className="text-xs text-slate-600">Data</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-3 h-3 rounded-sm bg-amber-600"></div>
                                            <span className="text-xs text-slate-600">Transform</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-3 h-3 rounded-sm bg-purple-600"></div>
                                            <span className="text-xs text-slate-600">Output</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Content - Workflow Canvas */}
                    <div className="col-span-12 lg:col-span-8">
                        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden h-[calc(100vh-200px)]">
                            <WorkflowCanvas workflow={workflow} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
