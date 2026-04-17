import ballerina/http;

configurable string footballApiKey = ?;
final http:Client externalApiClient = check new ("https://api.football-data.org/v4");

// HELPER FUNCTION 
// Extracts only the data our frontend needs
isolated function cleanMatchData(json[] rawMatches) returns json[]|error {
    return from var m in rawMatches
        select {
            home: check m.homeTeam.name,
            homeCrest: check m.homeTeam.crest, 
            away: check m.awayTeam.name,
            awayCrest: check m.awayTeam.crest,
            kickoff: check m.utcDate,
            league: check m.competition.name,
            status: check m.status,
            score: check m.score
        };
}

service /api on new http:Listener(8080) {

    //Today's Matches
    resource function get matches/today() returns json|error {
        json rawData = check externalApiClient->get("/matches", {
            "X-Auth-Token": footballApiKey
        });
        json[] matchesArray = <json[]> check rawData.matches;
        return cleanMatchData(matchesArray);
    }

    //Specific League Matches
    resource function get league/[string leagueId]/matches() returns json|error {
        string path = string `/competitions/${leagueId}/matches`;
        json rawData = check externalApiClient->get(path, {
            "X-Auth-Token": footballApiKey
        });
        json[] matchesArray = <json[]> check rawData.matches;
        return cleanMatchData(matchesArray);
    }

    //Custom Date Range
    resource function get matches/range(string dateFrom, string dateTo) returns json|error {
        string path = string `/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
        json rawData = check externalApiClient->get(path, {
            "X-Auth-Token": footballApiKey
        });
        json[] matchesArray = <json[]> check rawData.matches;
        return cleanMatchData(matchesArray);
    }
}