(function () {
    angular
        .module("RecruiterWeb")
        .controller("AddTeamController", AddTeamController)
        .controller("EditTeamController", EditTeamController)
        .controller("ViewTeamController", ViewTeamController)
        .controller("AthleteViewTeamController", AthleteViewTeamController)
        .controller("AdminTeamViewController", AdminTeamViewController)

    function AddTeamController(TeamService, UserService, SchoolService, $location, $routeParams) {
        var vm = this;

        var userId = $routeParams.userId;
        vm.userId = userId;

        vm.createTeam = createTeam;
        vm.logout = logout;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (user) {
                    if(user) {
                        SchoolService
                            .findSchoolById(user.school)
                            .success(function (school) {
                                vm.user = user;
                                vm.school = school;
                                if (vm.user == null) {
                                    $location.url("/home");
                                }
                            });
                    } else {
                        $location.url('/home');
                    }
                });
        }
        init();

        function createTeam(team) {
            TeamService
                .createTeam(userId, team)
                .success(function (team) {
                    $location.url('/coach/'+ userId);
                })
        }

        function logout() {
            UserService.logout()
                .success(function (response) {
                    $location.url('/home');
                });
        }

    }

    function EditTeamController(TeamService, UserService, SchoolService, $location, $routeParams) {
        var vm = this;

        var userId = $routeParams.userId;
        vm.userId = userId;
        var teamId = $routeParams.teamId;
        vm.teamId = teamId;

        vm.updateTeam = updateTeam;
        vm.logout = logout;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (user) {
                    if(user) {
                        TeamService
                            .findTeamById(teamId)
                            .success(function (team) {
                                UserService
                                    .findAthletesByTeamId(teamId)
                                    .success(function (users) {
                                        SchoolService
                                            .findSchoolById(team.school)
                                            .success(function (school) {
                                                vm.team = team;
                                                vm.athletes = users;
                                                vm.school = school;
                                                if (users == null) {
                                                    vm.errorAthlete = "No Athletes in your team!";
                                                }
                                            });
                                    });
                            });
                    } else {
                        $location.url('/home');
                    }
                })
        }
        init();

        function updateTeam(team) {
            vm.error = null;
            TeamService
                .updateTeam(teamId, team)
                .success(function (newteam) {
                    if(newteam != null) {
                        vm.message = "User Successfully Updated!"
                    }
                })
                .error(function (err) {
                    vm.error = "Unable to update user";
                })
        }


        function logout() {
            UserService.logout()
                .success(function (response) {
                    $location.url('/home');
                });
        }

    }

    function ViewTeamController(UserService, TeamService, $location, $routeParams, $route) {
        var vm = this;

        vm.userId = $routeParams.userId;
        vm.errorDup = $routeParams.error;

        vm.removePotentialAthlete = removePotentialAthlete;
        vm.deleteTeam = deleteTeam;
        vm.logout = logout;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (user) {
                    if(user) {
                        TeamService
                            .findTeamById(user.team)
                            .success(function (team) {
                                UserService.findAthletesByTeamId(team._id)
                                    .success(function (teamAthletes) {
                                        vm.teamAthletes = teamAthletes;
                                        vm.team = team;
                                        vm.user = user;
                                        if(teamAthletes.length == 0) {
                                            vm.error = "No athletes in team yet";
                                        }
                                    });

                            })
                    } else {
                        $location.url('/home');
                    }
                });
        }
        init();

        function removePotentialAthlete(userId, teamId) {
            TeamService
                .removePotentialAthlete(userId, teamId)
                .success(function (team) {
                    vm.team = team;
                    $route.reload();
                })
        }

        function deleteTeam(teamId) {
            TeamService
                .deleteTeam(teamId)
                .success(function () {
                    $location.url('/coach/' + vm.userId);
                })
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }
    }

    function AthleteViewTeamController(UserService, TeamService, $location, $routeParams) {
        var vm = this;

        vm.userId = $routeParams.userId;
        vm.teamId = $routeParams.teamId;

        vm.logout = logout;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (user) {
                    if (user){
                        TeamService
                            .findTeamById(vm.teamId)
                            .success(function (team) {
                                UserService
                                    .findAthletesByTeamId(team._id)
                                    .success(function (athletes) {
                                        vm.teamAthletes = athletes;
                                        vm.team = team;
                                        vm.user = user;
                                        if(vm.teamAthletes.length == 0) {
                                            vm.error = "No athletes in team yet";
                                        }
                                    })
                            })
                    } else {
                        $location.url('/home');
                    }
                });
        }
        init();

        function logout() {
            UserService.logout()
                .success(function (response) {
                    $location.url('/home');
                });
        }
    }

    function AdminTeamViewController(TeamService, UserService, SchoolService, $location, $routeParams) {
        var vm = this;

        vm.adminId = $routeParams.adminId;
        vm.coachId = $routeParams.coachId;
        vm.teamId = $routeParams.teamId;

        vm.updateTeam = updateTeam;
        vm.deleteTeam = deleteTeam;
        vm.logout = logout;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (admin) {
                    if(admin) {
                        TeamService
                            .findTeamById(vm.teamId)
                            .success(function (team) {
                                if(team) {
                                    SchoolService
                                        .findSchoolById(team.school)
                                        .success(function (school) {
                                            vm.team = team;
                                            vm.school = school;
                                        });
                                } else {
                                    $location.url('/admin/' + vm.adminId + '/coach/' + vm.coachId);
                                }

                            });
                    } else {
                        $location.url('/home');
                    }
                })
        }
        init();

        function updateTeam(team) {
            vm.error = null;
            TeamService
                .updateTeam(vm.teamId, team)
                .success(function (newteam) {
                    if(newteam != null) {
                        vm.message = "User Successfully Updated!"
                    }
                })
                .error(function (err) {
                    vm.error = "Unable to update user";
                })
        }

        function deleteTeam(teamId) {
            TeamService
                .deleteTeam(teamId)
                .success(function () {
                    $location.url('/admin/' + vm.adminId + '/coach/' + vm.coachId);
                })
        }

        function logout() {
            UserService.logout()
                .success(function (response) {
                    $location.url('/home');
                });
        }

    }

})();