import { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";

export default function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState("All Leagues");

  const { state, signOut } = useAuthContext();

  const API_URL =
    "https://5975f538-e3f2-4cee-ae9f-98a23d0c171a-dev.e1-us-east-azure.choreoapis.dev/choreo-football-proxy/football-proxy/v1.0/matches/today";

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMatches(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const uniqueLeagues = [
    "All Leagues",
    ...new Set(matches.map((m) => m.league).filter(Boolean)),
  ];
  const displayedMatches =
    selectedLeague === "All Leagues"
      ? matches
      : matches.filter((m) => m.league === selectedLeague);

  const liveMatches = displayedMatches.filter(
    (m) => m.status === "IN_PLAY" || m.status === "PAUSED",
  );
  const featuredMatches =
    liveMatches.length > 0 ? liveMatches : displayedMatches.slice(0, 2);
  const standardMatches = displayedMatches.filter(
    (m) => !featuredMatches.includes(m),
  );

  const renderScoreBoard = (match) => {
    if (match.status === "SCHEDULED" || match.status === "TIMED") {
      return (
        <div className="flex flex-col items-center">
          <span className="text-blue-500 text-xs font-black px-2 py-1 bg-blue-500/10 rounded-full mb-1">
            VS
          </span>
          <span className="text-xs text-slate-400">
            {new Date(match.kickoff).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      );
    }

    const homeGoals = match.score?.fullTime?.home ?? 0;
    const awayGoals = match.score?.fullTime?.away ?? 0;

    return (
      <div className="flex flex-col items-center">
        <div className="text-2xl font-black text-white tracking-widest">
          {homeGoals} - {awayGoals}
        </div>
        {match.status === "IN_PLAY" && (
          <span className="animate-pulse text-green-400 text-[10px] font-bold uppercase mt-1 tracking-widest">
            Live
          </span>
        )}
        {match.status === "FINISHED" && (
          <span className="text-slate-500 text-[10px] font-bold uppercase mt-1 tracking-widest">
            FT
          </span>
        )}
      </div>
    );
  };

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
        <div className="flex items-center gap-4">
          <select
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg p-2 outline-none cursor-pointer"
          >
            {uniqueLeagues.map((league, idx) => (
              <option key={idx} value={league}>
                {league}
              </option>
            ))}
          </select>
          <button
            onClick={() => signOut()}
            className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded-lg border border-slate-700"
          >
            Sign Out
          </button>
        </div>
      </header>

      {loading && (
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto bg-red-900/50 border border-red-500 text-red-200 p-6 rounded-xl text-center mt-10">
          <h2 className="text-xl font-bold mb-2">Connection Failed</h2>
          <p className="font-mono text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="max-w-7xl mx-auto space-y-12">
          {featuredMatches.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                {liveMatches.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                )}
                {liveMatches.length > 0 ? "Live Matches" : "Top Matches"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredMatches.map((match, idx) => (
                  <div
                    key={`feat-${idx}`}
                    className="bg-gradient-to-br from-blue-900/40 to-slate-800 border border-blue-500/30 p-8 rounded-3xl"
                  >
                    <div className="text-center text-xs text-blue-400 font-bold uppercase tracking-widest mb-6">
                      {match.league}
                    </div>
                    <div className="flex justify-between items-center text-xl md:text-2xl font-bold">
                      <div className="w-2/5 flex items-center justify-end gap-3">
                        <span className="text-right truncate">
                          {match.home}
                        </span>
                        {match.homeCrest && (
                          <img
                            src={match.homeCrest}
                            alt=""
                            className="w-8 h-8 md:w-10 md:h-10 object-contain"
                          />
                        )}
                      </div>
                      {renderScoreBoard(match)}
                      <div className="w-2/5 flex items-center justify-start gap-3">
                        {match.awayCrest && (
                          <img
                            src={match.awayCrest}
                            alt=""
                            className="w-8 h-8 md:w-10 md:h-10 object-contain"
                          />
                        )}
                        <span className="text-left truncate">{match.away}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-lg font-semibold text-slate-400 mb-4">
              Upcoming & Recent
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {standardMatches.map((match, idx) => (
                <div
                  key={`std-${idx}`}
                  className="bg-slate-800 border border-slate-700 p-5 rounded-2xl hover:border-slate-500 transition-all group"
                >
                  <div className="text-center text-[10px] text-slate-500 font-bold uppercase mb-3">
                    {match.league}
                  </div>
                  <div className="flex justify-between items-center font-semibold text-slate-200">
                    <div className="w-2/5 flex items-center justify-end gap-2">
                      <span className="text-right truncate text-sm">
                        {match.home}
                      </span>
                      {match.homeCrest && (
                        <img
                          src={match.homeCrest}
                          alt=""
                          className="w-5 h-5 object-contain"
                        />
                      )}
                    </div>
                    {renderScoreBoard(match)}
                    <div className="w-2/5 flex items-center justify-start gap-2">
                      {match.awayCrest && (
                        <img
                          src={match.awayCrest}
                          alt=""
                          className="w-5 h-5 object-contain"
                        />
                      )}
                      <span className="text-left truncate text-sm">
                        {match.away}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
