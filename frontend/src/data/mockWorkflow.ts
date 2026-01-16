import type { Workflow } from "../types/workflow";

/**
 * Workflow mocké pour le développement
 * Exemple : "Donne-moi les dernières actualités et transferts du PSG"
 */
export const mockWorkflow: Workflow = {
    id: "wf_001",
    sport: "football",
    query: "Donne-moi les dernières actualités et transferts du PSG",
    nodes: [
        {
            id: "n1",
            type: "context",
            tool: "DetectSport",
            params: { sport: "football" }
        },
        {
            id: "n2",
            type: "data",
            tool: "GetWeeklyNews",
            params: { team: "PSG" }
        },
        {
            id: "n3",
            type: "data",
            tool: "GetTransfers",
            params: { team: "PSG" }
        },
        {
            id: "n4",
            type: "data",
            tool: "GetPlayerStats",
            params: { team: "PSG", limit: 5 }
        },
        {
            id: "n5",
            type: "transform",
            tool: "MergeResults"
        },
        {
            id: "n6",
            type: "output",
            tool: "FormatResponse"
        }
    ],
    edges: [
        { from: "n1", to: "n2" },
        { from: "n2", to: "n3" },
        { from: "n3", to: "n4" },
        { from: "n4", to: "n5" },
        { from: "n5", to: "n6" }
    ]
};
