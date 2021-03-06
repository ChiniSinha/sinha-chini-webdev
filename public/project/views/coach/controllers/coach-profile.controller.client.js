(function () {
    angular
        .module("RecruiterWeb")
        .controller("CoachProfileController", CoachProfileController)
        .controller("CoachEditProfileController", CoachEditProfileController)
        .controller("CoachAdminProfileController", CoachAdminProfileController)

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
                        UserService
                            .findUserById(vm.coachId)
                            .success(function (coach) {
                                if(coach.team){
                                    TeamService
                                        .findTeamById(coach.team)
                                        .success(function (team) {
                                            vm.team = team;
                                            if (vm.team == null) {
                                                vm.error = "Coach has no teams yet!";
                                            }
                                        });
                                }
                                SchoolService
                                    .findSchoolById(vm.schoolId)
                                    .success(function (school) {
                                        vm.school = school;
                                        vm.coach = coach;
                                        if (vm.coach == null) {
                                            $location.url("/home");
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
        vm.deleteUser = deleteUser;
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

        function deleteUser(userId) {
            UserService
                .deleteUser(userId)
                .success(function (msg) {
                    $location.url('/home');
                })
        }
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

    function CoachAdminProfileController(UserService, SchoolService, $routeParams , $location) {
        var vm = this;

        vm.adminId = $routeParams.adminId;
        vm.coachId = $routeParams.coachId;

        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (admin) {
                    if(admin) {
                        UserService
                            .findUserById(vm.coachId)
                            .success(function (coach) {
                                SchoolService
                                    .findSchoolById(coach.school)
                                    .success(function (school) {
                                        SchoolService
                                            .findAllSchoolForAdmin()
                                            .success(function (schools) {
                                                vm.user = coach;
                                                vm.school = school;
                                                vm.schools = schools;
                                                if (vm.user == null) {
                                                    $location.url("/home");
                                                }
                                            })

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
                .updateUser(vm.coachId, newUser)
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

        function deleteUser(userId) {
            UserService
                .deleteUser(userId)
                .success(function () {
                    $location.url('/admin/' + vm.adminId + '/searchUser');
                })
        }

    }

})();