import { useCallback } from "react";
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

interface WorkflowCanvasProps {
    workflow: Workflow | null;
}

// Couleurs par type de nœud
const nodeColors: Record<string, string> = {
    context: "#3b82f6", // bleu
    data: "#10b981", // vert
    transform: "#f59e0b", // orange
    output: "#8b5cf6", // violet
};

// Convertir le workflow en nodes et edges React Flow
function workflowToReactFlow(workflow: Workflow): { nodes: Node[]; edges: Edge[] } {
    const nodes: Node[] = workflow.nodes.map((node, index) => ({
        id: node.id,
        type: "default",
        position: { x: 250, y: index * 100 + 50 },
        data: {
            label: (
                <div className="text-center">
                    <div className="font-semibold text-sm">{node.tool}</div>
                    <div className="text-xs text-gray-500">{node.type}</div>
                </div>
            ),
        },
        style: {
            backgroundColor: nodeColors[node.type] || "#6b7280",
            color: "white",
            border: "2px solid white",
            borderRadius: "8px",
            padding: "12px 20px",
            minWidth: "180px",
        },
    }));

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
    const [nodes, , onNodesChange] = useNodesState(reactFlowData.nodes);
    const [edges, , onEdgesChange] = useEdgesState(reactFlowData.edges);

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
                        return nodeColors[workflowNode?.type || ""] || "#6b7280";
                    }}
                />
            </ReactFlow>
        </div>
    );
}
