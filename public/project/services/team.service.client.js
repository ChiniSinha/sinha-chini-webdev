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
            "updateTeam" : updateTeam,
            "deleteTeam" : deleteTeam,
            "addPotentialAthlete" : addPotentialAthlete,
            "removePotentialAthlete" : removePotentialAthlete
        };
        return api;

        function createTeam(userId, team) {
            $http.post("/api/project/user/" + userId + "/team", team);
        }

        function findTeamById(teamId) {
            $http.get("/api/project/team/" + teamId);
        }

        function findTeamByCoachId(userId) {
            $http.get("/api/project/user/" + userId + "team");
        }

        function findTeamBySchoolId(schoolId) {
            $http.get("/api/project/school/" + schoolId + "/team");
        }

        function updateTeam(teamId, team) {
            $http.put("/api/project/team/" + teamId, team);
        }

        function deleteTeam(teamId, team) {
            $http.delete("/api/project/team/" + teamId, team);
        }

        function addPotentialAthlete(userId, teamId) {
            $http.put("/api/project/addAthlete/" + userId + "/team/" + teamId);
        }

        function removePotentialAthlete(userId, teamId) {
            $http.put("/api/project/removeAthlete/" + userId + "/team/" + teamId);
        }
    }

})();