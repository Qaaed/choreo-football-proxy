import ballerina/http;

configurable string footballApiKey = ?;

final http:Client externalApiClient = check new ("https://api.football-data.org/v4");

service /api on new http:Listener(8080) {

    resource function get competitions() returns json|error {
        // 1. Fetch the raw data from the external API
        json rawData = check externalApiClient->get("/competitions", {
            "X-Auth-Token": footballApiKey
        });

        // 2. Navigate to the 'competitions' array in the JSON
        json[] competitionsArray = <json[]> check rawData.competitions;

        // 3. Create a clean list of just the names
        string[] competitionNames = from var item in competitionsArray
                                    select check item.name;

        // 4. Return the clean, filtered list
        return {
            total: competitionNames.length(),
            names: competitionNames
        };
    }

    resource function get matches/simple() returns json|error {
        // Fetch the big match list
        json rawData = check externalApiClient->get("/matches", {
            "X-Auth-Token": footballApiKey
        });

        json[] matchesArray = <json[]> check rawData.matches;

        // Construct a brand new list of simplified objects
        var simpleMatches = from var m in matchesArray
            select {
                home: check m.homeTeam.name,
                away: check m.awayTeam.name,
                kickoff: check m.utcDate,
                league: check m.competition.name 
            };

        return simpleMatches;
    }
}