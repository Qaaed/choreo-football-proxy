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

  const renderScoreBoard = (match, large = false) => {
    if (match.status === "SCHEDULED" || match.status === "TIMED") {
      return (
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] tracking-[0.15em] uppercase text-white/20 font-mono">
            vs
          </span>
          <span className="text-[11px] text-white/30 font-mono tracking-widest">
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
      <div className="flex flex-col items-center gap-1">
        <div
          className={`font-black text-white tracking-widest font-mono ${
            large ? "text-3xl" : "text-xl"
          }`}
        >
          {homeGoals} — {awayGoals}
        </div>
        {match.status === "IN_PLAY" && (
          <span className="animate-pulse text-[#C9F53E] text-[9px] font-mono font-bold uppercase tracking-[0.2em]">
            Live
          </span>
        )}
        {match.status === "FINISHED" && (
          <span className="text-white/20 text-[9px] font-mono font-bold uppercase tracking-[0.2em]">
            FT
          </span>
        )}
        {match.status === "PAUSED" && (
          <span className="text-white/40 text-[9px] font-mono font-bold uppercase tracking-[0.2em]">
            HT
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white font-mono">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#C9F53E]" />
            <div>
              <span className="text-white text-lg font-black tracking-[-0.03em]">
                MATCH
              </span>
              <span className="text-[#C9F53E] text-lg font-black tracking-[-0.03em]">
                HUB
              </span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="bg-transparent border border-white/10 text-white/50 text-[11px] tracking-[0.12em] uppercase py-2 px-3 outline-none cursor-pointer hover:border-white/20 transition-colors"
            >
              {uniqueLeagues.map((league, idx) => (
                <option
                  key={idx}
                  value={league}
                  className="bg-[#111] text-white normal-case tracking-normal"
                >
                  {league}
                </option>
              ))}
            </select>

            <div className="h-4 w-px bg-white/10" />

            <span className="text-[11px] tracking-[0.12em] text-white/25 uppercase">
              {state.username}
            </span>

            <button
              onClick={() => signOut()}
              className="text-[11px] tracking-[0.12em] uppercase text-white/30 hover:text-white/60 transition-colors py-2 px-3 border border-white/10 hover:border-white/20"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Date strip */}
      <div className="border-b border-white/[0.04] px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/20">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          {liveMatches.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9F53E] animate-pulse" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#C9F53E]/70">
                {liveMatches.length} Live
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-8 py-10 space-y-12">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center mt-24 gap-4">
            <div className="w-6 h-6 border border-[#C9F53E]/40 border-t-[#C9F53E] rounded-full animate-spin" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/20">
              Fetching Fixtures
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="border border-red-500/20 bg-red-500/5 p-6 max-w-lg mx-auto mt-10">
            <p className="text-[10px] tracking-[0.2em] uppercase text-red-400/60 mb-2">
              Connection Failed
            </p>
            <p className="text-sm text-red-300/50 font-mono">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Featured / Live */}
            {featuredMatches.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  {liveMatches.length > 0 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9F53E] animate-pulse" />
                  )}
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">
                    {liveMatches.length > 0 ? "Live Matches" : "Top Matches"}
                  </span>
                  <div className="flex-1 h-px bg-white/[0.05]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.05]">
                  {featuredMatches.map((match, idx) => (
                    <div
                      key={`feat-${idx}`}
                      className="bg-[#080808] p-8 hover:bg-white/[0.02] transition-colors"
                    >
                      <p className="text-[9px] tracking-[0.25em] uppercase text-white/20 text-center mb-8">
                        {match.league}
                      </p>
                      <div className="flex justify-between items-center">
                        {/* Home */}
                        <div className="w-2/5 flex items-center justify-end gap-3">
                          <span className="text-right text-sm font-black uppercase tracking-tight text-white/80 truncate">
                            {match.home}
                          </span>
                          {match.homeCrest && (
                            <img
                              src={match.homeCrest}
                              alt=""
                              className="w-9 h-9 object-contain flex-shrink-0"
                            />
                          )}
                        </div>

                        {/* Score */}
                        <div className="px-4">
                          {renderScoreBoard(match, true)}
                        </div>

                        {/* Away */}
                        <div className="w-2/5 flex items-center justify-start gap-3">
                          {match.awayCrest && (
                            <img
                              src={match.awayCrest}
                              alt=""
                              className="w-9 h-9 object-contain flex-shrink-0"
                            />
                          )}
                          <span className="text-left text-sm font-black uppercase tracking-tight text-white/80 truncate">
                            {match.away}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Standard matches */}
            {standardMatches.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">
                    Upcoming & Recent
                  </span>
                  <div className="flex-1 h-px bg-white/[0.05]" />
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white/15">
                    {standardMatches.length} fixtures
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
                  {standardMatches.map((match, idx) => (
                    <div
                      key={`std-${idx}`}
                      className="bg-[#080808] p-5 hover:bg-white/[0.02] transition-colors group"
                    >
                      <p className="text-[9px] tracking-[0.2em] uppercase text-white/15 text-center mb-4">
                        {match.league}
                      </p>
                      <div className="flex justify-between items-center">
                        {/* Home */}
                        <div className="w-2/5 flex items-center justify-end gap-2">
                          <span className="text-right text-xs font-bold uppercase tracking-tight text-white/60 truncate group-hover:text-white/80 transition-colors">
                            {match.home}
                          </span>
                          {match.homeCrest && (
                            <img
                              src={match.homeCrest}
                              alt=""
                              className="w-5 h-5 object-contain flex-shrink-0"
                            />
                          )}
                        </div>

                        {/* Score */}
                        <div className="px-3">
                          {renderScoreBoard(match, false)}
                        </div>

                        {/* Away */}
                        <div className="w-2/5 flex items-center justify-start gap-2">
                          {match.awayCrest && (
                            <img
                              src={match.awayCrest}
                              alt=""
                              className="w-5 h-5 object-contain flex-shrink-0"
                            />
                          )}
                          <span className="text-left text-xs font-bold uppercase tracking-tight text-white/60 truncate group-hover:text-white/80 transition-colors">
                            {match.away}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty state */}
            {displayedMatches.length === 0 && (
              <div className="text-center py-24">
                <p className="text-[10px] tracking-[0.25em] uppercase text-white/15">
                  No fixtures found
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] px-8 py-4 mt-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-[9px] tracking-[0.2em] uppercase text-white/15">
            MatchHub · 2024/25
          </span>
          <span className="text-[9px] tracking-[0.2em] uppercase text-white/10">
            Secured by Asgardeo
          </span>
        </div>
      </footer>
    </div>
  );
}
