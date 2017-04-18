(function () {
    angular
        .module("RecruiterWeb")
        .controller("AddTeamController", AddTeamController)
        .controller("EditTeamController", EditTeamController)

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

        function updateTeam(newTeam) {
            vm.error = null;
            TeamService
                .updateTeam(teamId, newTeam)
                .success(function (team) {
                    if(team != null) {
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