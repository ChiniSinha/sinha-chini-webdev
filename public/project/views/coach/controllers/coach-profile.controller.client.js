(function () {
    angular
        .module("RecruiterWeb")
        .controller("CoachProfileController", CoachProfileController)
        .controller("CoachEditProfileController", CoachEditProfileController)

    function CoachProfileController(UserService, TeamService, SchoolService, $routeParams , $location) {
        var vm = this;

        vm.userId = $routeParams.userId;
        vm.schoolId = $routeParams.schoolId;
        vm.coachId = $routeParams.coachId;

        vm.logout = logout;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (user) {
                    if(user) {
                        TeamService
                            .findTeamById(user.team)
                            .success(function (team) {
                                SchoolService
                                    .findSchoolById(vm.schoolId)
                                    .success(function (school) {
                                        vm.school = school;
                                        vm.team = team;
                                        vm.coach = user;
                                        if (vm.coach == null) {
                                            $location.url("/home");
                                        }
                                        if (vm.team == null) {
                                            vm.error = "Coach has no teams yet!";
                                        }
                                    })
                            })
                    } else {
                        $location.url('/home');
                    }
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

    function CoachEditProfileController(UserService, SchoolService, $routeParams , $location) {
        var vm = this;

        vm.userId = $routeParams.userId;
        vm.inTeam = false;

        vm.updateUser = updateUser;
        vm.logout = logout;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (user) {
                    if(user) {
                        SchoolService
                            .findSchoolById(user.school)
                            .success(function (school) {
                                UserService
                                    .findAllAthletesByCoachId(vm.userId)
                                    .success(function (athletes) {
                                        vm.user = user;
                                        vm.school = school;
                                        vm.athletes = athletes;
                                        if (vm.user == null) {
                                            $location.url("/home");
                                        }
                                    })
                            })
                    } else {
                        $location.url('/home');
                    }
                })
                .error(function (err) {
                    $location.url('/home');
                })
        }
        init();
        
        function updateUser(newUser) {
            UserService
                .updateUser(vm.userId, newUser)
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