import { useEffect, useMemo, useState } from "react";

const API_URL =
  "https://5975f538-e3f2-4cee-ae9f-98a23d0c171a-dev.e1-us-east-azure.choreoapis.dev/choreo-football-proxy/football-proxy/v1.0/matches/today";

const HEADLINE_LEAGUES = [
  "Premier League",
  "Primera Division",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "UEFA Champions League",
  "Champions League",
  "UEFA Europa League",
  "Europa League",
  "FIFA World Cup",
  "European Championship",
  "FA Cup",
  "Copa del Rey",
  "DFB-Pokal",
  "Coppa Italia",
];

const HEADLINE_TEAMS = [
  "Arsenal",
  "Aston Villa",
  "Atletico Madrid",
  "Barcelona",
  "Bayern Munich",
  "Benfica",
  "Borussia Dortmund",
  "Chelsea",
  "Inter Milan",
  "Juventus",
  "Liverpool",
  "Manchester City",
  "Manchester United",
  "Milan",
  "Napoli",
  "Paris Saint-Germain",
  "PSG",
  "Porto",
  "Real Madrid",
  "Roma",
  "Tottenham Hotspur",
];

const LIVE_STATUSES = new Set(["IN_PLAY", "PAUSED"]);
const UPCOMING_STATUSES = new Set(["SCHEDULED", "TIMED"]);
const ACCENT_TEXT = "text-[#F4D35E]";
const ACCENT_MUTED_TEXT = "text-[#F4D35E]/80";
const ACCENT_DIM_TEXT = "text-[#F4D35E]/65";
const ACCENT_BG = "bg-[#F4D35E]";
const ACCENT_BORDER = "border-[#F4D35E]";

function includesAny(value, terms) {
  const normalized = value?.toLowerCase() ?? "";
  return terms.some((term) => normalized.includes(term.toLowerCase()));
}

function isHeadlineMatch(match) {
  const isMajorLeague = includesAny(match.league, HEADLINE_LEAGUES);
  const hasHeadlineTeam =
    includesAny(match.home, HEADLINE_TEAMS) ||
    includesAny(match.away, HEADLINE_TEAMS);

  return isMajorLeague || hasHeadlineTeam;
}

function sortByKickoff(a, b) {
  return new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime();
}

export default function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState("All Headliners");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMatches(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const headlineMatches = useMemo(
    () => matches.filter(isHeadlineMatch).sort(sortByKickoff),
    [matches],
  );

  const leagueOptions = useMemo(
    () => [
      "All Headliners",
      ...new Set(headlineMatches.map((match) => match.league).filter(Boolean)),
    ],
    [headlineMatches],
  );

  const displayedMatches = useMemo(() => {
    if (selectedLeague === "All Headliners") {
      return headlineMatches;
    }

    return headlineMatches.filter((match) => match.league === selectedLeague);
  }, [headlineMatches, selectedLeague]);

  const liveMatches = displayedMatches.filter((match) =>
    LIVE_STATUSES.has(match.status),
  );
  const upcomingMatches = displayedMatches.filter((match) =>
    UPCOMING_STATUSES.has(match.status),
  );
  const recentMatches = displayedMatches.filter(
    (match) =>
      !LIVE_STATUSES.has(match.status) && !UPCOMING_STATUSES.has(match.status),
  );

  const primaryMatches = liveMatches.length > 0 ? liveMatches : upcomingMatches;
  const secondaryMatches = liveMatches.length > 0 ? upcomingMatches : [];

  const renderScoreBoard = (match, large = false) => {
    if (UPCOMING_STATUSES.has(match.status)) {
      return (
        <div className="flex flex-col items-center gap-1">
          <span className={`text-[10px] uppercase ${ACCENT_DIM_TEXT} font-mono`}>
            vs
          </span>
          <span className={`text-[11px] ${ACCENT_MUTED_TEXT} font-mono`}>
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
          className={`font-black text-white font-mono ${
            large ? "text-3xl" : "text-xl"
          }`}
        >
          {homeGoals} - {awayGoals}
        </div>
        {match.status === "IN_PLAY" && (
          <span
            className={`animate-pulse ${ACCENT_TEXT} text-[11px] font-mono font-black uppercase`}
          >
            Live
          </span>
        )}
        {match.status === "FINISHED" && (
          <span
            className={`${ACCENT_DIM_TEXT} text-[9px] font-mono font-bold uppercase`}
          >
            FT
          </span>
        )}
        {match.status === "PAUSED" && (
          <span
            className={`${ACCENT_MUTED_TEXT} text-[9px] font-mono font-bold uppercase`}
          >
            HT
          </span>
        )}
      </div>
    );
  };

  const renderMatchCard = (match, idx, variant = "standard") => {
    const isLarge = variant === "featured";
    const crestSize = isLarge ? "w-10 h-10" : "w-6 h-6";
    const cardPadding = isLarge ? "p-8" : "p-5";
    const teamText = isLarge ? "text-sm" : "text-xs";

    return (
      <article
        key={`${variant}-${match.home}-${match.away}-${idx}`}
        className={`bg-[#080808] ${cardPadding} hover:bg-white/[0.025] transition-colors`}
      >
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className={`text-[9px] uppercase ${ACCENT_DIM_TEXT} truncate`}>
            {match.league}
          </p>
          <p className={`text-[9px] uppercase ${ACCENT_DIM_TEXT}`}>
            {new Date(match.kickoff).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })}
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="min-w-0 flex items-center justify-end gap-3">
            <span
              className={`${teamText} text-right font-black uppercase text-white/80 truncate`}
            >
              {match.home}
            </span>
            {match.homeCrest && (
              <img
                src={match.homeCrest}
                alt=""
                className={`${crestSize} object-contain flex-shrink-0`}
              />
            )}
          </div>

          <div className="min-w-16 flex justify-center">
            {renderScoreBoard(match, isLarge)}
          </div>

          <div className="min-w-0 flex items-center justify-start gap-3">
            {match.awayCrest && (
              <img
                src={match.awayCrest}
                alt=""
                className={`${crestSize} object-contain flex-shrink-0`}
              />
            )}
            <span
              className={`${teamText} text-left font-black uppercase text-white/80 truncate`}
            >
              {match.away}
            </span>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white font-mono">
      <header className="border-b border-white/[0.06] px-5 md:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${ACCENT_BG}`} />
            <div>
              <span className="text-white text-lg font-black">MATCH</span>
              <span className={`${ACCENT_TEXT} text-lg font-black`}>HUB</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedLeague}
              onChange={(event) => setSelectedLeague(event.target.value)}
              className={`max-w-full bg-transparent border border-white/10 ${ACCENT_MUTED_TEXT} text-[11px] uppercase py-2 px-3 outline-none cursor-pointer hover:border-white/20 transition-colors`}
            >
              {leagueOptions.map((league) => (
                <option
                  key={league}
                  value={league}
                  className="bg-[#111] text-white normal-case"
                >
                  {league}
                </option>
              ))}
            </select>

            <span
              className={`text-xs ${ACCENT_TEXT} font-black uppercase whitespace-nowrap`}
            >
              Headline Matches
            </span>
          </div>
        </div>
      </header>

      <div className="border-b border-white/[0.04] px-5 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <span className={`text-[10px] uppercase ${ACCENT_MUTED_TEXT}`}>
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className={`text-[10px] uppercase ${ACCENT_DIM_TEXT}`}>
            {displayedMatches.length} selected
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-10 space-y-12">
        {loading && (
          <div className="flex flex-col items-center justify-center mt-24 gap-4">
            <div
              className={`w-6 h-6 border border-white/20 ${ACCENT_BORDER} border-t-transparent rounded-full animate-spin`}
            />
            <span className={`text-[10px] uppercase ${ACCENT_MUTED_TEXT}`}>
              Fetching fixtures
            </span>
          </div>
        )}

        {error && (
          <div className="border border-red-500/20 bg-red-500/5 p-6 max-w-lg mx-auto mt-10">
            <p className="text-[10px] uppercase text-red-400/70 mb-2">
              Connection failed
            </p>
            <p className="text-sm text-red-300/60 font-mono">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {primaryMatches.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  {liveMatches.length > 0 && (
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${ACCENT_BG} animate-pulse`}
                    />
                  )}
                  <span className={`text-[10px] uppercase ${ACCENT_MUTED_TEXT}`}>
                    {liveMatches.length > 0 ? "Live headliners" : "Next big fixtures"}
                  </span>
                  <div className="flex-1 h-px bg-white/[0.05]" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.05]">
                  {primaryMatches
                    .slice(0, 4)
                    .map((match, idx) => renderMatchCard(match, idx, "featured"))}
                </div>
              </section>
            )}

            {secondaryMatches.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <span className={`text-[10px] uppercase ${ACCENT_MUTED_TEXT}`}>
                    Coming up
                  </span>
                  <div className="flex-1 h-px bg-white/[0.05]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
                  {secondaryMatches.map((match, idx) =>
                    renderMatchCard(match, idx, "standard"),
                  )}
                </div>
              </section>
            )}

            {recentMatches.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <span className={`text-[10px] uppercase ${ACCENT_MUTED_TEXT}`}>
                    Recent results
                  </span>
                  <div className="flex-1 h-px bg-white/[0.05]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
                  {recentMatches.map((match, idx) =>
                    renderMatchCard(match, idx, "standard"),
                  )}
                </div>
              </section>
            )}

            {displayedMatches.length === 0 && (
              <div className="text-center py-24">
                <p className={`text-[10px] uppercase ${ACCENT_DIM_TEXT}`}>
                  No headline fixtures found
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-white/[0.04] px-5 md:px-8 py-4 mt-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className={`text-[9px] uppercase ${ACCENT_DIM_TEXT}`}>
            MatchHub - 2025/26
          </span>
          <span className={`text-[9px] uppercase ${ACCENT_DIM_TEXT}`}>
            Curated football data
          </span>
        </div>
      </footer>
    </div>
  );
}
