# choreo-football-proxy

An API gateway serving live football data, deployed on **WSO2 Choreo**. It exposes a clean, frontend-friendly REST API built in **Ballerina**, paired with a **React + Vite** dashboard that renders today's matches in real time.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                       │
│                  (Vite + Tailwind CSS)                  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP requests
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Ballerina Proxy (Choreo)                   │
│           /api/matches/today                            │
│           /api/league/{id}/matches                      │
│           /api/matches/range                            │
└────────────────────────┬────────────────────────────────┘
                         │ Proxied + filtered
                         ▼
┌─────────────────────────────────────────────────────────┐
│            football-data.org API (v4)                   │
│                 (X-Auth-Token)                          │
└─────────────────────────────────────────────────────────┘
```

---

## Features

- **Live match data** — today's fixtures, scores, and statuses fetched from football-data.org
- **League filtering** — filter matches by competition directly in the UI
- **Clean proxy layer** — Ballerina service strips and reshapes the upstream API response, exposing only the fields the frontend needs
- **Choreo deployment** — the backend is deployed as a Choreo API component with built-in observability
- **Responsive dashboard** — dark-mode UI with live match highlighting, team crests, and scoreboard display

---

## Project Structure

```
choreo-football-proxy/
├── main.bal                  # Ballerina proxy service
├── Ballerina.toml            # Package metadata
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # App entry point
│   │   ├── components/
│   │   │   └── Dashboard.jsx # Match display + league filter
│   │   └── main.jsx          # App bootstrap
│   ├── package.json
│   └── vite.config.js
└── LICENSE                   # Apache 2.0
```

---

## API Endpoints

All endpoints are served under the `/api` base path on port `8080`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/matches/today` | Today's matches across all competitions |
| `GET` | `/api/league/{leagueId}/matches` | Matches for a specific league (e.g. `PL`, `CL`) |
| `GET` | `/api/matches/range?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD` | Matches within a custom date range |

### Sample Response

```json
[
  {
    "home": "Arsenal",
    "homeCrest": "https://crests.football-data.org/57.png",
    "away": "Chelsea",
    "awayCrest": "https://crests.football-data.org/61.png",
    "kickoff": "2025-04-17T19:45:00Z",
    "league": "Premier League",
    "status": "SCHEDULED",
    "score": { "fullTime": { "home": null, "away": null } }
  }
]
```

---

## Getting Started

### Prerequisites

- [Ballerina](https://ballerina.io/downloads/) `2201.13.2` (Swan Lake)
- [Node.js](https://nodejs.org/) `>=20`
- A [football-data.org](https://www.football-data.org/) API key (free tier available)

---

### Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/Qaaed/choreo-football-proxy.git
   cd choreo-football-proxy
   ```

2. Create a `Config.toml` in the root with your API key:
   ```toml
   footballApiKey = "your_football_data_org_key"
   ```

3. Run the Ballerina service locally:
   ```bash
   bal run
   ```

   The service will start on `http://localhost:8080`.

---

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

---

## Deploying to Choreo

1. Push this repository to GitHub.
2. In the [Choreo Console](https://console.choreo.dev/), create a new **Service** component and point it to this repo.
3. Set the `footballApiKey` as a **Configurable** in Choreo's environment variables.
4. Deploy and promote to production.
5. Update the `API_URL` in `frontend/src/components/Dashboard.jsx` with your Choreo-issued endpoint.

For detailed steps, see the [Choreo documentation](https://wso2.com/choreo/docs/).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | [Ballerina](https://ballerina.io/) |
| Deployment | [WSO2 Choreo](https://wso2.com/choreo/) |
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Data Source | [football-data.org](https://www.football-data.org/) |

---

## License

Licensed under the [Apache License 2.0](LICENSE).
