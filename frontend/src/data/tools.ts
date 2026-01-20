export interface ToolInput {
    name: string;
    type: string;
    description: string;
    required: boolean;
}

export interface ToolDefinition {
    tool_id: string;
    label: string;
    description: string;
    category: "input" | "data" | "process" | "output";
    icon: string;
    color: string;
    defaultData: Record<string, any>;
    role: string;
    inputs: ToolInput[];
    output: string;
}

export const TOOLS: ToolDefinition[] = [
    {
        tool_id: "DetectSport",
        label: "Détecter Sport",
        description: "Analyse la requête pour identifier le sport concerné.",
        category: "input",
        icon: "Search",
        color: "#10b981",
        defaultData: { sport: "football" },
        role: "Interprète la requête de l'utilisateur pour extraire le sport cible et préparer le contexte du workflow.",
        inputs: [
            { name: "query", type: "string", description: "La requête textuelle de l'utilisateur", required: true }
        ],
        output: "Le nom du sport identifié (ex: 'football', 'basketball')."
    },
    {
        tool_id: "GetWeeklyNews",
        label: "Actualités Hebdo",
        description: "Récupère les dernières actualités et transferts d'une équipe.",
        category: "data",
        icon: "Newspaper",
        color: "#3b82f6",
        defaultData: { team: "" },
        role: "Interroge les APIs d'actualités sportives pour obtenir les titres et résumés des 7 derniers jours pour une équipe.",
        inputs: [
            { name: "team", type: "string", description: "Nom de l'équipe", required: true }
        ],
        output: "Liste d'articles contenant titre, date et lien."
    },
    {
        tool_id: "GetTransfers",
        label: "Transferts",
        description: "Liste les derniers mouvements de joueurs pour une équipe.",
        category: "data",
        icon: "ArrowLeftRight",
        color: "#8b5cf6",
        defaultData: { team: "" },
        role: "Extrait les données de transferts officiels et les rumeurs confirmées pour une équipe spécifique.",
        inputs: [
            { name: "team", type: "string", description: "Nom de l'équipe", required: true }
        ],
        output: "Liste des transferts entrants et sortants avec montants et clubs impliqués."
    },
    {
        tool_id: "GetPlayerStats",
        label: "Stats Joueurs",
        description: "Récupère les statistiques détaillées des joueurs.",
        category: "data",
        icon: "BarChart3",
        color: "#f59e0b",
        defaultData: { team: "", limit: 5 },
        role: "Analyse les performances individuelles des joueurs d'une équipe sur la saison en cours.",
        inputs: [
            { name: "team", type: "string", description: "Nom de l'équipe", required: true },
            { name: "limit", type: "number", description: "Nombre maximum de joueurs", required: false }
        ],
        output: "Tableau de statistiques par joueur (buts, passes, cartons, note moyenne)."
    },
    {
        tool_id: "GetStandings",
        label: "Classement",
        description: "Affiche le classement actuel d'une ligue.",
        category: "data",
        icon: "ListOrdered",
        color: "#f59e0b",
        defaultData: { league: "" },
        role: "Récupère le tableau des points d'un championnat spécifique.",
        inputs: [
            { name: "league", type: "string", description: "Nom de la ligue (ex: 'Ligue 1', 'Premier League')", required: true }
        ],
        output: "Le classement complet avec points, matchs joués et différence de buts."
    },
    {
        tool_id: "GetTopScorers",
        label: "Buteurs",
        description: "Liste les meilleurs buteurs d'une compétition.",
        category: "data",
        icon: "Award",
        color: "#eab308",
        defaultData: { league: "" },
        role: "Identifie les joueurs ayant marqué le plus de buts dans une compétition donnée.",
        inputs: [
            { name: "league", type: "string", description: "Nom de la compétition", required: true }
        ],
        output: "Liste des joueurs classés par nombre de buts."
    },
    {
        tool_id: "GetTeamInfo",
        label: "Infos Équipe",
        description: "Informations générales sur un club.",
        category: "data",
        icon: "Users",
        color: "#3b82f6",
        defaultData: { team: "" },
        role: "Donne une vue d'ensemble d'un club de sport.",
        inputs: [
            { name: "team", type: "string", description: "Nom de l'équipe", required: true }
        ],
        output: "Détails incluant le stade, l'entraîneur, l'année de fondation et l'effectif actuel."
    },
    {
        tool_id: "GetHighlights",
        label: "Highlights Vidéo",
        description: "Recherche des vidéos et résumés de matchs récents.",
        category: "data",
        icon: "Youtube",
        color: "#ef4444",
        defaultData: { query: "" },
        role: "Recherche des contenus multimédias associés aux derniers matchs d'une équipe ou compétition.",
        inputs: [
            { name: "query", type: "string", description: "Mots-clés de recherche", required: true }
        ],
        output: "Liste de liens vers des vidéos de résumés ou actions marquantes."
    },
    {
        tool_id: "MergeResults",
        label: "Fusionner",
        description: "Combine les résultats de plusieurs outils.",
        category: "process",
        icon: "GitMerge",
        color: "#64748b",
        defaultData: {},
        role: "Prend les outputs de plusieurs nœuds précédents et les agrège dans une structure de données unique.",
        inputs: [
            { name: "results", type: "array", description: "Liste des résultats à fusionner", required: true }
        ],
        output: "Un objet JSON consolidé contenant toutes les données fusionnées."
    },
    {
        tool_id: "FormatResponse",
        label: "Formater",
        description: "Transforme les données brutes en réponse textuelle.",
        category: "output",
        icon: "FileText",
        color: "#10b981",
        defaultData: {},
        role: "Convertit des données JSON complexes en un paragraphe narratif fluide pour l'utilisateur final.",
        inputs: [
            { name: "data", type: "object", description: "Données brutes à formater", required: true }
        ],
        output: "Une chaîne de caractères formatée en langage naturel."
    }
];
