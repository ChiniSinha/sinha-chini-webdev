(function () {
    angular
        .module("RecruiterWeb")
        .factory("SchoolService", schoolService);

    function schoolService($http) {

        var api = {
            "createSchool" : createSchool,
            "findSchoolById" : findSchoolById,
            "searchSchoolByName" : searchSchoolByName,
            "updateSchool" : updateSchool,
            "deleteSchool" : deleteSchool,
            "addInterestedAthlete" : addInterestedAthlete,
            "removeInterestedAthlete" : removeInterestedAthlete,
            "addCoach" : addCoach,
            "removeCoach" : removeCoach
        };
        return api;

        function createSchool(school) {
            return $http.post("/api/project/school", school);
        }

        function findSchoolById(schoolId) {
            return $http.get("/api/project/school/" + schoolId);
        }

        function searchSchoolByName(name) {
            return $http.get("/api/project/school?name=" + name);
        }

        function updateSchool(schoolId, school) {
            return $http.put("/api/project/school/"+ schoolId, school);
        }

        function deleteSchool(schoolId) {
            return $http.delete("/api/project/school/"+ schoolId);
        }

        function addInterestedAthlete(userId, schoolId) {
            return $http.put("/api/project/addAthlete/" + userId + "/school/" + schoolId);
        }

        function removeInterestedAthlete(userId, schoolId) {
            return $http.put("/api/project/removeAthlete/" + userId + "/school/" + schoolId);
        }

        function addCoach(userId, schoolId) {
            return $http.put("/api/project/addCoach/" + userId + "/school/" + schoolId);
        }

        function removeCoach(userId, schoolId) {
            return $http.put("/api/project/removeCoach/" + userId + "/school/" + schoolId);
        }

    }

})();