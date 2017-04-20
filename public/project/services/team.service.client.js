(function () {
    angular
        .module("RecruiterWeb")
        .factory("TeamService", teamService)

    function teamService($http) {

        var api = {
            "createTeam" : createTeam,
            "findTeamById" : findTeamById,
            "findTeamByCoachId" : findTeamByCoachId,
            "findTeamBySchoolId" : findTeamBySchoolId,
            "findTeamByAthleteId" : findTeamByAthleteId,
            "updateTeam" : updateTeam,
            "deleteTeam" : deleteTeam,
            "addPotentialAthlete" : addPotentialAthlete,
            "removePotentialAthlete" : removePotentialAthlete
        };
        return api;

        function createTeam(userId, team) {
            return $http.post("/api/project/user/" + userId + "/team", team);
        }

        function findTeamById(teamId) {
            return $http.get("/api/project/team/" + teamId);
        }

        function findTeamByCoachId(userId) {
            return $http.get("/api/project/user/" + userId + "/team");
        }

        function findTeamBySchoolId(schoolId) {
            return $http.get("/api/project/school/" + schoolId + "/team");
        }

        function findTeamByAthleteId(athleteId) {
            return $http.get("/api/project/athlete/"+ athleteId + "/team");
        }

        function updateTeam(teamId, team) {
            return $http.put("/api/project/team/" + teamId, team);
        }

        function deleteTeam(teamId) {
            return $http.delete("/api/project/team/" + teamId);
        }

        function addPotentialAthlete(userId, teamId) {
            return $http.put("/api/project/addAthlete/" + userId + "/team/" + teamId);
        }

        function removePotentialAthlete(userId, teamId) {
            return $http.put("/api/project/removeAthlete/" + userId + "/team/" + teamId);
        }
    }

})();