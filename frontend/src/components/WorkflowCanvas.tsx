import { useCallback, useEffect } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    MarkerType,
} from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Workflow } from "../types/workflow";
import { WorkflowNode } from "./WorkflowNode";

const nodeTypes = {
    custom: WorkflowNode,
};

interface WorkflowCanvasProps {
    workflow: Workflow | null;
}

// Map tool_id to visual configuration
const getToolConfig = (tool_id: string): { icon: string; color: string; sublabel: string } => {
    const id = tool_id.toLowerCase();

    // Start / Input
    if (id.includes("start") || id.includes("query") || id.includes("input")) {
        return { icon: "Play", color: "#10b981", sublabel: "Trigger" };
    }

    // Brain / AI
    if (id.includes("llm") || id.includes("agent") || id.includes("router") || id.includes("brain")) {
        return { icon: "Brain", color: "#8b5cf6", sublabel: "AI Orchestrator" };
    }

    // Tools
    if (id.includes("match") || id.includes("sport") || id.includes("api")) {
        return { icon: "Search", color: "#3b82f6", sublabel: "Data Retrieval" };
    }
    if (id.includes("weather") || id.includes("cloud")) {
        return { icon: "Cloud", color: "#0ea5e9", sublabel: "Outer Tool" };
    }
    if (id.includes("calendar") || id.includes("odds")) {
        return { icon: "Calendar", color: "#f59e0b", sublabel: "Schedules" };
    }

    // Output
    if (id.includes("output") || id.includes("result") || id.includes("end")) {
        return { icon: "CheckCircle", color: "#64748b", sublabel: "Final Result" };
    }

    return { icon: "Activity", color: "#64748b", sublabel: "Action" };
};

// Convertir le workflow en nodes et edges React Flow
function workflowToReactFlow(workflow: Workflow): { nodes: Node[]; edges: Edge[] } {
    const nodes: Node[] = workflow.nodes.map((node, index) => {
        const config = getToolConfig(node.tool_id);

        return {
            id: node.id,
            type: "custom",
            position: { x: index * 300 + 50, y: 150 }, // Horizontal layout
            data: {
                label: node.label,
                tool_id: node.tool_id,
                icon: config.icon,
                color: config.color,
                sublabel: config.sublabel,
            },
        };
    });

    const edges: Edge[] = workflow.edges.map((edge, index) => ({
        id: `e-${edge.from}-${edge.to}-${index}`,
        source: edge.from,
        target: edge.to,
        type: "smoothstep",
        animated: true,
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#94a3b8",
        },
        style: {
            stroke: "#94a3b8",
            strokeWidth: 2,
        },
    }));

    return { nodes, edges };
}

export function WorkflowCanvas({ workflow }: WorkflowCanvasProps) {
    const reactFlowData = workflow ? workflowToReactFlow(workflow) : { nodes: [], edges: [] };
    const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowData.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowData.edges);

    // Sync state when workflow prop changes
    useEffect(() => {
        if (workflow) {
            const { nodes: newNodes, edges: newEdges } = workflowToReactFlow(workflow);
            setNodes(newNodes);
            setEdges(newEdges);
        } else {
            setNodes([]);
            setEdges([]);
        }
    }, [workflow, setNodes, setEdges]);

    const onConnect = useCallback(() => {
        // Pour l'instant, on ne permet pas de connecter manuellement
        console.log("Connection non autorisée pour le moment");
    }, []);

    if (!workflow) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">
                    👆 Entrez une requête et générez un workflow pour le visualiser
                </p>
            </div>
        );
    }

    return (
        <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={true}
            >
                <Background color="#e5e7eb" gap={16} />
                <Controls />
                <MiniMap
                    nodeColor={(node) => {
                        const workflowNode = workflow.nodes.find((n) => n.id === node.id);
                        if (!workflowNode) return "#6b7280";
                        return getToolConfig(workflowNode.tool_id).color;
                    }}
                />
            </ReactFlow>
        </div>
    );
}
