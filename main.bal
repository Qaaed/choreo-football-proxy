import ballerina/http;

configurable string footballApiKey = ?;
final http:Client externalApiClient = check new ("https://api.football-data.org/v4");

// HELPER FUNCTION (DRY Principle)
isolated function cleanMatchData(json[] rawMatches) returns json[]|error {
    return from var m in rawMatches
        select {
            home: check m.homeTeam.name,
            homeCrest: check m.homeTeam.crest, // Added crests for the UI upgrade!
            away: check m.awayTeam.name,
            awayCrest: check m.awayTeam.crest,
            kickoff: check m.utcDate,
            league: check m.competition.name,
            status: check m.status,
            score: check m.score
        };
}

service /api on new http:Listener(8080) {

    // ENDPOINT 1: The Default (Today's Matches)
    // URL: /api/matches/today
    resource function get matches/today() returns json|error {
        json rawData = check externalApiClient->get("/matches", {
            "X-Auth-Token": footballApiKey
        });
        json[] matchesArray = <json[]> check rawData.matches;
        return cleanMatchData(matchesArray);
    }
-
    // ENDPOINT 2: Matches by Specific League
    // URL: /api/league/2021/matches  (2021 is Premier League)
    resource function get league/[string leagueId]/matches() returns json|error {
        string path = string `/competitions/${leagueId}/matches`;
        
        json rawData = check externalApiClient->get(path, {
            "X-Auth-Token": footballApiKey
        });
        json[] matchesArray = <json[]> check rawData.matches;
        return cleanMatchData(matchesArray);
    }

    // ENDPOINT 3: A Custom Time Machine (Fetch Past/Future)
    // URL: /api/matches/range?dateFrom=2026-04-01&dateTo=2026-04-15
    resource function get matches/range(string dateFrom, string dateTo) returns json|error {
        string path = string `/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
        
        json rawData = check externalApiClient->get(path, {
            "X-Auth-Token": footballApiKey
        });
        json[] matchesArray = <json[]> check rawData.matches;
        return cleanMatchData(matchesArray);
    }
}