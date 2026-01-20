import { useState } from "react";
import type { SportType, Workflow } from "../types/workflow";
import { mockWorkflow } from "../data/mockWorkflow";
import { SportSelector } from "../components/SportSelector";
import { QueryInput } from "../components/QueryInput";
import { WorkflowCanvas } from "../components/WorkflowCanvas";
import { WorkflowResult } from "../components/WorkflowResult";
import { Toolbox } from "../components/Toolbox";
import { ApiClient } from "../api/client";

interface HomeProps {
    onOpenDocs?: () => void;
}

export function Home({ onOpenDocs }: HomeProps) {
    const [sport, setSport] = useState<SportType>("football");
    const [query, setQuery] = useState("");
    const [workflow, setWorkflow] = useState<Workflow | null>(mockWorkflow);
    const [loading, setLoading] = useState(false);
    const [executionResult, setExecutionResult] = useState<any>(null);
    const [executing, setExecuting] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setExecutionResult(null);
        try {
            console.log("Generating workflow for:", { sport, query });
            const generatedWorkflow = await ApiClient.generateWorkflow(sport, query);
            setWorkflow(generatedWorkflow);
        } catch (error) {
            console.error("Error generating workflow:", error);
            alert("Failed to generate workflow. See console for details.");
        } finally {
            setLoading(false);
        }
    };

    const handleExecute = async () => {
        if (!workflow) return;
        setExecuting(true);
        setExecutionResult(null);
        try {
            console.log("Executing workflow:", workflow.id);
            const result = await ApiClient.executeWorkflow(workflow);
            setExecutionResult(result);
        } catch (error) {
            console.error("Error executing workflow:", error);
            alert("Failed to execute workflow. See console for details.");
        } finally {
            setExecuting(false);
        }
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
                            <button
                                onClick={onOpenDocs}
                                className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                Documentation
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
                {/* Horizontal Toolbox Section */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm backdrop-blur-sm">
                    <Toolbox />
                </div>

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
                                {loading && <p className="text-sm text-blue-600">Generating...</p>}
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
                                        <span className="font-mono text-xs text-slate-900 truncate max-w-[150px]" title={workflow.id}>
                                            {workflow.id}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Total Nodes</span>
                                        <span className="font-semibold text-slate-900">
                                            {workflow.nodes.length}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                                    <button
                                        onClick={handleExecute}
                                        disabled={executing}
                                        className="flex-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                    >
                                        {executing ? "Executing..." : "Run Workflow"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setWorkflow(null);
                                            setExecutionResult(null);
                                        }}
                                        className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                                        title="Effacer le workflow"
                                    >
                                        Effacer
                                    </button>
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

                {/* Execution Results - Full Width */}
                {executionResult && (
                    <div className="mt-8">
                        <WorkflowResult result={executionResult.results} />
                    </div>
                )}
            </main>
        </div>
    );
}
