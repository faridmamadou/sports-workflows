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
            tool_id: "DetectSport",
            label: "Detection du Sport",
            position: { x: 50, y: 150 },
            data: { sport: "football" }
        },
        {
            id: "n2",
            tool_id: "GetWeeklyNews",
            label: "Actualités PSG",
            position: { x: 350, y: 50 },
            data: { team: "PSG" }
        },
        {
            id: "n3",
            tool_id: "GetTransfers",
            label: "Transferts PSG",
            position: { x: 350, y: 150 },
            data: { team: "PSG" }
        },
        {
            id: "n4",
            tool_id: "GetPlayerStats",
            label: "Stats Joueurs",
            position: { x: 350, y: 250 },
            data: { team: "PSG", limit: 5 }
        },
        {
            id: "n5",
            tool_id: "MergeResults",
            label: "Fusion des Résultats",
            position: { x: 650, y: 150 },
            data: {}
        },
        {
            id: "n6",
            tool_id: "FormatResponse",
            label: "Formatage Final",
            position: { x: 950, y: 150 },
            data: {}
        }
    ],
    edges: [
        { from: "n1", to: "n2" },
        { from: "n1", to: "n3" },
        { from: "n1", to: "n4" },
        { from: "n2", to: "n5" },
        { from: "n3", to: "n5" },
        { from: "n4", to: "n5" },
        { from: "n5", to: "n6" }
    ]
};
