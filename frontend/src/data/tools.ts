export interface ToolDefinition {
    tool_id: string;
    label: string;
    description: string;
    category: "input" | "data" | "process" | "output";
    icon: string;
    color: string;
    defaultData: Record<string, any>;
}

export const TOOLS: ToolDefinition[] = [
    {
        tool_id: "DetectSport",
        label: "Détecter Sport",
        description: "Analyse la requête pour identifier le sport concerné (football, basketball, etc.).",
        category: "input",
        icon: "Search",
        color: "#10b981",
        defaultData: { sport: "football" }
    },
    {
        tool_id: "GetWeeklyNews",
        label: "Actualités Hebdo",
        description: "Récupère les dernières actualités et transferts d'une équipe pour la semaine en cours.",
        category: "data",
        icon: "Newspaper",
        color: "#3b82f6",
        defaultData: { team: "" }
    },
    {
        tool_id: "GetTransfers",
        label: "Transferts",
        description: "Liste les derniers mouvements de joueurs pour une équipe spécifique.",
        category: "data",
        icon: "ArrowLeftRight",
        color: "#8b5cf6",
        defaultData: { team: "" }
    },
    {
        tool_id: "GetPlayerStats",
        label: "Stats Joueurs",
        description: "Récupère les statistiques détaillées (buts, passes, notes) des joueurs d'une équipe.",
        category: "data",
        icon: "BarChart3",
        color: "#f59e0b",
        defaultData: { team: "", limit: 5 }
    },
    {
        tool_id: "GetStandings",
        label: "Classement",
        description: "Affiche le classement actuel d'une ligue ou d'un championnat.",
        category: "data",
        icon: "ListOrdered",
        color: "#f59e0b",
        defaultData: { league: "" }
    },
    {
        tool_id: "GetTopScorers",
        label: "Buteurs",
        description: "Liste les meilleurs buteurs d'une compétition donnée.",
        category: "data",
        icon: "Award",
        color: "#eab308",
        defaultData: { league: "" }
    },
    {
        tool_id: "GetTeamInfo",
        label: "Infos Équipe",
        description: "Informations générales sur un club (stade, ville, effectif).",
        category: "data",
        icon: "Users",
        color: "#3b82f6",
        defaultData: { team: "" }
    },
    {
        tool_id: "GetHighlights",
        label: "Highlights Vidéo",
        description: "Recherche des vidéos et résumés de matchs récents.",
        category: "data",
        icon: "Youtube",
        color: "#ef4444",
        defaultData: { query: "" }
    },
    {
        tool_id: "MergeResults",
        label: "Fusionner",
        description: "Combine les résultats de plusieurs outils en un seul flux de données.",
        category: "process",
        icon: "GitMerge",
        color: "#64748b",
        defaultData: {}
    },
    {
        tool_id: "FormatResponse",
        label: "Formater",
        description: "Transforme les données brutes en une réponse textuelle claire et lisible.",
        category: "output",
        icon: "FileText",
        color: "#10b981",
        defaultData: {}
    }
];
