(function () {
    angular
        .module("RecruiterWeb")
        .controller("ViewInterestedAthleteController", ViewInterestedAthleteController)
        .controller("AthleteEditProfileController", AthleteEditProfileController)

    function ViewInterestedAthleteController(UserService, $location, $routeParams) {
        var vm = this;

        var userId = $routeParams.userId;
        var teamId = $routeParams.teamId;
        var schoolId = $routeParams.schoolId;

        vm.userId = userId;
        vm.teamId = teamId;
        vm.schoolId = schoolId;

        vm.logout = logout;

        function init() {
            UserService
                .findAthletesBySchoolId(schoolId)
                .success(function (athletes) {
                    vm.athletes = athletes;
                })
                .error(function (err) {
                    vm.error = 'School has no interested Athletes yet.';
                })
        }
        init();

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }
    }

    function AthleteEditProfileController(UserService, $routeParams , $location) {
        var vm = this;

        var userId = $routeParams.userId;
        vm.userId = userId;

        vm.updateUser = updateUser;
        vm.logout = logout;

        function init() {
            UserService
                .findUserById(userId)
                .success(function (user) {
                    vm.user = user;
                    if (vm.user == null) {
                        $location.url("/home");
                    }
                });
        }
        init();

        function updateUser(newUser) {
            vm.error = null;
            UserService
                .updateUser(userId, newUser)
                .success(function (user) {
                    if(user != null) {
                        vm.message = "User Successfully Updated!"
                    }
                })
                .error(function (err) {
                    vm.error = "Unable to update user";
                })
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }
    }

})();