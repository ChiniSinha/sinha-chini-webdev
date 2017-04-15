(function () {
    angular
        .module("RecruiterWeb")
        .factory("UserService", userService);

    function userService($http) {

        var api = {
            "createUser" : createUser,
            "findUserById": findUserById,
            "findUserByUsername" : findUserByUsername,
            "findUserByCredentials" : findUserByCredentials,
            "updateUser" : updateUser,
            "deleteUser" : deleteUser,
            "login" : login,
            "loggedIn" : loggedIn,
            "logout" : logout,
            "register" : register,
            "isAdmin" : isAdmin,
            "findAllUsers" : findAllUsers,
            "followAthlete" : followAthlete,
            "unFollowAthlete" : unFollowAthlete
        };
        return api;

        function createUser(user) {
            return $http.post('/api/project/user', user);
        }

        function findUserById(userId) {
            return $http.get("/api/project/user/"+userId);
        }

        function findUserByUsername(username) {
            return $http.get("/api/project/user?username="+username);
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/project/user?username=" + username + "&password=" + password);
        }

        function updateUser(userId, user) {
            return $http.put("/api/project/user/" + userId, user);
        }

        function deleteUser(userId) {
            return $http.delete("/api/project/user/" + userId);
        }

        function login(user) {
            return $http.post("/api/project/login", user);
        }

        function loggedIn() {
            return $http.post("/api/project/loggedin");    
        }
        
        function logout() {
            return $http.post("/api/project/logout");

        }
        
        function register(user) {
            return $http.post("/api/project/register", user);
        }
        
        function isAdmin() {
            return $http.post("/api/project/isAdmin");
        }
        
        function findAllUsers() {
            return $http.get("/api/project/allUser");
        }
        
        function followAthlete(coachId, athleteId) {
            return $http.put("api/project/user/"+ coachId + "/follow/" + athleteId);
        }

        function unFollowAthlete(coachId, athleteId) {
            return $http.put("api/project/user/"+ coachId + "/unfollow/" + athleteId);
        }

    }
})();