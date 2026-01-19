import type { Workflow, SportType } from "../types/workflow";

const API_BASE_URL = "http://localhost:8000";

export class ApiClient {
    static async generateWorkflow(sport: SportType, query: string): Promise<Workflow> {
        const response = await fetch(`${API_BASE_URL}/workflows/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sport, query }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to generate workflow: ${response.status} ${errorText}`);
        }

        return response.json();
    }

    static async executeWorkflow(workflow: Workflow): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/workflows/execute`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ workflow }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to execute workflow: ${response.status} ${errorText}`);
        }

        return response.json();
    }
}
