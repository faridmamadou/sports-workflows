/**
 * Type de nœud dans le workflow
 */
export type WorkflowNode = {
    id: string;
    type: string;
    tool: string;
    params?: Record<string, any>;
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
