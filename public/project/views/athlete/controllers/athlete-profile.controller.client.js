(function () {
    angular
        .module("RecruiterWeb")
        .controller("ViewInterestedAthleteController", ViewInterestedAthleteController)
        .controller("AthleteEditProfileController", AthleteEditProfileController)
        .controller("ViewAthleteController", ViewAthleteController)
        .controller("AthleteViewAthleteController", AthleteViewAthleteController)

    function ViewInterestedAthleteController(UserService, $location, $routeParams) {
        var vm = this;

        var userId = $routeParams.userId;
        var schoolId = $routeParams.schoolId;

        vm.userId = userId;
        vm.schoolId = schoolId;

        vm.logout = logout;

        function init() {
            UserService
                .findAthletesBySchoolId(schoolId)
                .success(function (athletes) {
                    UserService
                        .findUserById(userId)
                        .success(function (coach) {
                            vm.user = coach;
                            vm.athletes = athletes;
                            if(vm.athletes.length == 0) {
                                vm.error = 'School has no interested Athletes yet.';
                            }
                        })
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

    function AthleteEditProfileController(UserService, SchoolService, TeamService, $routeParams , $location) {
        var vm = this;

        var userId = $routeParams.userId;
        vm.userId = userId;

        vm.updateUser = updateUser;
        vm.logout = logout;
        vm.deleteUser = deleteUser;

        function init() {
            UserService
                .findUserById(userId)
                .success(function (user) {
                    SchoolService
                        .findAllSchoolByAthleteId(userId)
                        .success(function (schools) {
                            UserService
                                .findAllCoachesByAthleteId(userId)
                                .success(function (coaches) {
                                    TeamService
                                        .findTeamByAthleteId(userId)
                                        .success(function (teams) {
                                            vm.athleteTeams = teams;
                                        });
                                    vm.coaches = coaches;
                                    vm.interestedSchools = schools;
                                    vm.user = user;
                                    if (vm.user == null) {
                                        $location.url("/home");
                                    }
                                });
                        })
                        .error(function () {
                            vm.error = true;
                        })
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

        function deleteUser(userId) {

        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }
    }

    function ViewAthleteController(UserService, PostService, $routeParams, $location, $sce) {
        var vm = this;

        vm.coachId = $routeParams.userId;
        vm.athleteId = $routeParams.athleteId;
        vm.follows = false;

        vm.followAthlete = followAthlete;
        vm.unFollowAthlete = unFollowAthlete;
        vm.doYouTrustUrl = doYouTrustUrl;
        vm.logout = logout;

        function init() {
            UserService
                .findUserById(vm.athleteId)
                .success(function (user) {
                    UserService
                        .findUserById(vm.coachId)
                        .success(function (currentCoach) {
                            PostService
                                .findPostByUserId(user._id)
                                .success(function (posts) {
                                    UserService
                                        .findCoachByAthleteId(vm.coachId, vm.athleteId)
                                        .success(function (coach) {
                                            vm.posts = posts;
                                            vm.athlete = user;
                                            vm.coach = currentCoach;
                                            if (posts.length == 0) {
                                                vm.error = "Athlete has not posted anything yet!"
                                            }
                                            if (coach.length > 0) {
                                                vm.follows = true;
                                            }
                                        })
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

        function followAthlete() {
            UserService
                .followAthlete(vm.coachId, vm.athleteId)
                .success(function (athlete) {
                    vm.athlete = athlete;
                    vm.follows = true;
                });
        }

        function unFollowAthlete() {
            UserService
                .unFollowAthlete(vm.coachId, vm.athleteId)
                .success(function (athlete) {
                    vm.athlete = athlete;
                    vm.follows = false;
                });
        }

        function doYouTrustUrl(url) {
            var baseUrl = "https://www.youtube.com/embed/";
            var urlParts = url.split('/');
            if(urlParts[urlParts.length - 1].includes('=')){
                var subPart = urlParts[urlParts.length - 1];
                var urlSplit = subPart.split('=');
                var id = urlSplit[urlSplit.length - 1];
                return $sce.trustAsResourceUrl(baseUrl+id);
            }else {
                id = urlParts[urlParts.length - 1];
                return $sce.trustAsResourceUrl(baseUrl+id);
            }
        }
    }


    function AthleteViewAthleteController(UserService, PostService, TeamService, $routeParams, $location, $sce) {
        var vm = this;

        vm.userId = $routeParams.userId;
        vm.athleteId = $routeParams.athleteId;
        vm.teamId = $routeParams.teamId;

        vm.doYouTrustUrl = doYouTrustUrl;
        vm.logout = logout;

        function init() {
            UserService
                .findUserById(vm.athleteId)
                .success(function (athlete) {
                    PostService
                        .findPostByUserId(athlete._id)
                        .success(function (posts) {
                            TeamService
                                .findTeamById(vm.teamId)
                                .success(function (team) {
                                    vm.posts = posts;
                                    vm.athlete = athlete;
                                    vm.team = team;
                                    if (posts.length == 0) {
                                        vm.error = "Athlete has not posted anything yet!"
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

        function doYouTrustUrl(url) {
            var baseUrl = "https://www.youtube.com/embed/";
            var urlParts = url.split('/');
            if(urlParts[urlParts.length - 1].includes('=')){
                var subPart = urlParts[urlParts.length - 1];
                var urlSplit = subPart.split('=');
                var id = urlSplit[urlSplit.length - 1];
                return $sce.trustAsResourceUrl(baseUrl+id);
            }else {
                id = urlParts[urlParts.length - 1];
                return $sce.trustAsResourceUrl(baseUrl+id);
            }
        }

    }

})();