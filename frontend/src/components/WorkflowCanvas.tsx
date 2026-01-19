import { useCallback, useEffect } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    MarkerType,
    useReactFlow,
    ReactFlowProvider,
} from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Workflow, WorkflowNode } from "../types/workflow";
import { WorkflowNode as CustomNode } from "./WorkflowNode";
import { type ToolDefinition } from "../data/tools";

const nodeTypes = {
    custom: CustomNode,
};

interface WorkflowCanvasProps {
    workflow: Workflow | null;
    onWorkflowChange?: (workflow: Workflow) => void;
}

// Map tool_id to visual configuration
const getToolConfig = (tool_id: string): { icon: string; color: string; sublabel: string } => {
    const id = tool_id.toLowerCase();

    // Start / Input
    if (id.includes("start") || id.includes("query") || id.includes("input")) {
        return { icon: "Play", color: "#10b981", sublabel: "Trigger" };
    }

    // AI / Brain
    if (id.includes("llm") || id.includes("agent") || id.includes("router") || id.includes("brain")) {
        return { icon: "Brain", color: "#8b5cf6", sublabel: "AI Orchestrator" };
    }

    // New Specific Tools
    if (id.includes("standings")) {
        return { icon: "ListOrdered", color: "#f59e0b", sublabel: "League Table" };
    }
    if (id.includes("topscorers") || id.includes("scorer")) {
        return { icon: "Award", color: "#eab308", sublabel: "Top Players" };
    }
    if (id.includes("team_info") || id.includes("team")) {
        return { icon: "Users", color: "#3b82f6", sublabel: "Team Details" };
    }
    if (id.includes("video") || id.includes("highlight")) {
        return { icon: "Youtube", color: "#ef4444", sublabel: "Match Videos" };
    }

    // Specific Tools
    if (id.includes("news")) {
        return { icon: "Newspaper", color: "#3b82f6", sublabel: "News Feed" };
    }
    if (id.includes("transfer")) {
        return { icon: "ArrowLeftRight", color: "#8b5cf6", sublabel: "Market Updates" };
    }
    if (id.includes("stats") || id.includes("player")) {
        return { icon: "BarChart3", color: "#f59e0b", sublabel: "Performance Data" };
    }
    if (id.includes("merge") || id.includes("join")) {
        return { icon: "GitMerge", color: "#64748b", sublabel: "Data Joiner" };
    }
    if (id.includes("format") || id.includes("output")) {
        return { icon: "FileText", color: "#10b981", sublabel: "Report Generator" };
    }

    // Tools
    if (id.includes("match") || id.includes("sport") || id.includes("api")) {
        return { icon: "Search", color: "#6366f1", sublabel: "Data Retrieval" };
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
            position: node.position || { x: index * 300 + 50, y: 150 },
            data: {
                label: node.label,
                tool_id: node.tool_id,
                icon: config.icon,
                color: config.color,
                sublabel: config.sublabel,
                ...node.data, // Pydantic data -> RF data
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

function WorkflowCanvasInner({ workflow, onWorkflowChange }: WorkflowCanvasProps) {
    const reactFlowData = workflow ? workflowToReactFlow(workflow) : { nodes: [], edges: [] };
    const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowData.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowData.edges);
    const { screenToFlowPosition } = useReactFlow();

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

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const data = event.dataTransfer.getData("application/reactflow");
            if (!data) return;

            const tool: ToolDefinition = JSON.parse(data);
            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNodeId = `node_${Math.random().toString(36).substr(2, 9)}`;

            const newNode: Node = {
                id: newNodeId,
                type: "custom",
                position,
                data: {
                    label: tool.label,
                    tool_id: tool.tool_id,
                    icon: tool.icon,
                    color: tool.color,
                    sublabel: tool.category,
                    ...tool.defaultData,
                },
            };

            setNodes((nds) => nds.concat(newNode));

            // Sync back to workflow if needed
            if (workflow && onWorkflowChange) {
                const newWorkflowNode: WorkflowNode = {
                    id: newNodeId,
                    tool_id: tool.tool_id,
                    label: tool.label,
                    position,
                    data: tool.defaultData,
                };

                onWorkflowChange({
                    ...workflow,
                    nodes: [...workflow.nodes, newWorkflowNode],
                });
            }
        },
        [screenToFlowPosition, setNodes, workflow, onWorkflowChange]
    );

    return (
        <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
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
                        // Find node in local state first for manually added nodes
                        const localNode = nodes.find(n => n.id === node.id);
                        if (localNode?.data?.color) return localNode.data.color as string;

                        const workflowNode = workflow?.nodes.find((n) => n.id === node.id);
                        if (!workflowNode) return "#6b7280";
                        return getToolConfig(workflowNode.tool_id).color;
                    }}
                />
            </ReactFlow>
        </div>
    );
}

export function WorkflowCanvas(props: WorkflowCanvasProps) {
    return (
        <ReactFlowProvider>
            <WorkflowCanvasInner {...props} />
        </ReactFlowProvider>
    );
}
