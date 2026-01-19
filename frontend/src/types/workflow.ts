/**
 * Type de nœud dans le workflow
 */
export type WorkflowNode = {
    id: string;
    tool_id: string; // Changed from 'tool' to match backend Pydantic model
    label: string;   // Added label
    position: { x: number; y: number }; // Added position
    data: Record<string, any>; // Changed from 'params' to 'data'
};

/**
 * Arête/lien entre deux nœuds
 */
export type WorkflowEdge = {
    from: string;
    to: string;
};

/**
 * Workflow complet
 */
export type Workflow = {
    id: string;
    sport: string;
    query?: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
};

/**
 * Types de sports supportés
 */
export type SportType = "football" | "basketball" | "tennis" | "rugby";
