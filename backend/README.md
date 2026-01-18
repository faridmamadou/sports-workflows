# Sports Workflow Backend API

Backend pour la plateforme d'automatisation de workflows sportifs.

## Stack Technique

- **Langage**: Python 3.11+
- **Framework**: FastAPI
- **Validation**: Pydantic v2
- **Gestionnaire de paquets**: uv

### Match Info Tool
Récupère les scores et informations des matchs terminés.
- **Mots-clés déclencheurs** : "match", "score", "résultat"
- **Variable d'environnement** : `ALL_SPORTS_API_KEY`
- **Exemple de requête** : "Donne-moi le score du dernier match du PSG"
- **Réponse type** :
  ```json
  {
    "type": "match_info",
    "sport": "football",
    "team": "PSG",
    "matches": [
      {
        "home_team": "PSG",
        "away_team": "Marseille",
        "home_score": 2,
        "away_score": 1,
        "date": "2024-01-10",
        "league": "Ligue 1",
        "status": "finished"
      }
    ]
  }
  ```

## Installation et Démarrage

1. Assurez-vous d'avoir [uv](https://github.com/astral-sh/uv) installé.

2. Installez les dépendances :
   ```bash
   uv sync
   ```

3. Lancez le serveur de développement :
   ```bash
   uv run uvicorn app.main:app --reload
   ```

## Architecture

Le projet suit une architecture modulaire :

- `app/api`: Routes de l'API (endpoints).
- `app/core`: Configuration globale et sécurité (CORS).
- `app/models`: Modèles de données Pydantic (schémas).
- `app/services`: Logique métier (générateur de workflow, exécuteur, registre d'outils).
- `app/tools`: Implémentation des outils (News, Transfers, Performance).

## Endpoints Principaux

- `GET /health`: Vérification de l'état du service.
- `GET /tools`: Liste les outils disponibles.
- `POST /workflows/generate`: Génère un workflow à partir d'une requête textuelle.
- `POST /workflows/execute`: Exécute un workflow.

## Outils Disponibles (Mock)

- **NewsTool**: Actualités sportives.
- **TransfersTool**: Informations sur le mercato.
- **PerformanceTool**: Statistiques et performances.
