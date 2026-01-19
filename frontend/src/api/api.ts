import type { Workflow } from "../types/workflow";

const API_BASE_URL = "http://localhost:8000";

export const api = {
    generateWorkflow: async (sport: string, query: string): Promise<Workflow> => {
        const response = await fetch(`${API_BASE_URL}/workflows/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sport, query }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate workflow");
        }

        return response.json();
    },

    executeWorkflow: async (workflow: Workflow): Promise<any> => {
        const response = await fetch(`${API_BASE_URL}/workflows/execute`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ workflow }),
        });

        if (!response.ok) {
            throw new Error("Failed to execute workflow");
        }

        return response.json();
    },

    getTools: async () => {
        const response = await fetch(`${API_BASE_URL}/tools`);
        if (!response.ok) {
            throw new Error("Failed to fetch tools");
        }
        return response.json();
    }
};
