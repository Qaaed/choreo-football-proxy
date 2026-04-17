import { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //State to track which league the user selected
  const [selectedLeague, setSelectedLeague] = useState("All Leagues");

  const { state, signIn, signOut, getAccessToken } = useAuthContext();

  // If you kept it ON with an enterprise subscription, keep the getAccessToken logic.
  const API_URL =
    "https://5975f538-e3f2-4cee-ae9f-98a23d0c171a-dev.e1-us-east-azure.choreoapis.dev/choreo-football-proxy/football-proxy/v1.0/matches/simple";

  useEffect(() => {
    if (state.isAuthenticated) {
      const fetchMatches = async () => {
        try {
          // If your Choreo endpoint is open, you can just do: fetch(API_URL)
          const response = await fetch(API_URL);

          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

          const data = await response.json();
          setMatches(data);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchMatches();
    }
  }, [state.isAuthenticated]);

  //Extract unique leagues and filter
  // Look through all matches and create a list of unique leagues
  const uniqueLeagues = [
    "All Leagues",
    ...new Set(matches.map((match) => match.league).filter(Boolean)),
  ];

  // 2. Filter the matches array based on the dropdown selection
  const displayedMatches =
    selectedLeague === "All Leagues"
      ? matches
      : matches.filter((match) => match.league === selectedLeague);

  // UI 1: LOGIN SCREEN
  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 font-sans">
        {/* ... (Keep your existing login UI here) ... */}
        <button
          onClick={() => signIn()}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl"
        >
          Log In
        </button>
      </div>
    );
  }

  // UI 2: SECURE DASHBOARD WITH LEAGUE FILTER
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      <header className="mb-8 flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-blue-500">
            MATCH<span className="text-white">HUB</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Welcome back, {state.username}
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded-lg border border-slate-700"
        >
          Sign Out
        </button>
      </header>

      {/*The Filter Bar */}
      {!loading && !error && matches.length > 0 && (
        <div className="max-w-7xl mx-auto mb-8 flex justify-end">
          <select
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none cursor-pointer"
          >
            {uniqueLeagues.map((league, idx) => (
              <option key={idx} value={league}>
                {league}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading && <div className="text-center mt-20">Loading...</div>}

      {/* Data Grid using displayedMatches instead of matches */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {displayedMatches.map((match, idx) => (
            <div
              key={idx}
              className="bg-slate-800 border border-slate-700 p-6 rounded-2xl hover:border-blue-500 transition-all duration-300 group"
            >
              {/* Display the league name at the top of the card */}
              <div className="text-center text-xs text-blue-400 font-bold uppercase tracking-widest mb-4">
                {match.league}
              </div>

              <div className="flex justify-between items-center text-lg font-bold mb-4">
                <span className="w-2/5 text-right text-slate-200 group-hover:text-white">
                  {match.home}
                </span>
                <span className="text-blue-500 text-xs font-black mx-4 px-2 py-1 bg-blue-500/10 rounded-full">
                  VS
                </span>
                <span className="w-2/5 text-left text-slate-200 group-hover:text-white">
                  {match.away}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-700/50 text-center text-xs text-slate-400 uppercase tracking-wider font-semibold">
                {new Date(match.kickoff).toLocaleString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}

          {/* Empty state if filtering removes all items */}
          {displayedMatches.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No matches found for this league.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
