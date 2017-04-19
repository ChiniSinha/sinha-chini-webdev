(function () {
    angular
        .module("RecruiterWeb")
        .controller("AddTeamController", AddTeamController)
        .controller("EditTeamController", EditTeamController)
        .controller("ViewTeamController", ViewTeamController)
        .controller("AthleteViewTeamController", AthleteViewTeamController)

    function AddTeamController(TeamService, UserService, SchoolService, $location, $routeParams) {
        var vm = this;

        var userId = $routeParams.userId;
        vm.userId = userId;

        vm.createTeam = createTeam;
        vm.logout = logout;

        function init() {
            UserService
                .findUserById(userId)
                .success(function (user) {
                    SchoolService
                        .findSchoolById(user.school)
                        .success(function (school) {
                            vm.user = user;
                            vm.school = school;
                            if (vm.user == null) {
                                $location.url("/home");
                            }
                        });
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
                .then(function (response) {
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
                .then(function (response) {
                    $location.url('/home');
                });
        }

    }

    function ViewTeamController(UserService, TeamService, $location, $routeParams, $route) {
        var vm = this;

        vm.userId = $routeParams.userId;

        vm.addPotentialAthlete = addPotentialAthlete;
        vm.removePotentialAthlete = removePotentialAthlete;
        vm.logout = logout;

        function init() {
            UserService
                .findUserById(vm.userId)
                .success(function (user) {
                    TeamService
                        .findTeamById(user.team)
                        .success(function (team) {
                            UserService
                                .findAllAthletesByCoachId(user._id)
                                .success(function (athletes) {
                                    UserService.findAthletesByTeamId(team._id)
                                        .success(function (teamAthletes) {
                                            vm.teamAthletes = teamAthletes;
                                            vm.followedAthletes = athletes;
                                            vm.team = team;
                                            vm.user = user;
                                            if(teamAthletes.length == 0) {
                                                vm.error = "No athletes in team yet";
                                            }
                                            if(vm.followedAthletes.length == 0) {
                                                vm.followError = "No athletes in followed by you yet";
                                            }
                                        })
                                })
                        })
                });
        }
        init();

        function addPotentialAthlete(userId, teamId) {
            TeamService
                .addPotentialAthlete(userId, teamId)
                .success(function (team) {
                    vm.inTeam = true;
                    vm.team = team;
                    $route.reload();
                });
        }

        function removePotentialAthlete(userId, teamId) {
            TeamService
                .removePotentialAthlete(userId, teamId)
                .success(function (team) {
                    vm.inTeam = false;
                    vm.team = team;
                    $route.reload();
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
                .findUserById(vm.userId)
                .success(function (user) {
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
                });
        }
        init();

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }
    }

})();