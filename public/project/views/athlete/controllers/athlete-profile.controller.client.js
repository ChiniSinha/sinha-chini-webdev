(function () {
    angular
        .module("RecruiterWeb")
        .controller("ViewInterestedAthleteController", ViewInterestedAthleteController)
        .controller("AthleteEditProfileController", AthleteEditProfileController)
        .controller("ViewAthleteController", ViewAthleteController)
        .controller("AthleteViewAthleteController", AthleteViewAthleteController)
        .controller("ViewFollowedAthleteController", ViewFollowedAthleteController)
        .controller("AdminViewAthleteController", AdminViewAthleteController)

    function ViewInterestedAthleteController(UserService, $location, $routeParams) {
        var vm = this;

        var userId = $routeParams.userId;
        var schoolId = $routeParams.schoolId;

        vm.userId = userId;
        vm.schoolId = schoolId;

        vm.logout = logout;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (coach) {
                    if(coach) {
                        UserService
                            .findAthletesBySchoolId(schoolId)
                            .success(function (athletes) {
                                vm.user = coach;
                                vm.athletes = athletes;
                                if(vm.athletes.length == 0) {
                                    vm.error = 'School has no interested Athletes yet.';
                                }
                            })
                            .error(function (err) {
                                vm.error = 'School has no interested Athletes yet.';
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

    function AthleteEditProfileController(UserService, SchoolService, TeamService, $routeParams , $location) {
        var vm = this;

        var userId = $routeParams.userId;
        vm.userId = userId;

        vm.updateUser = updateUser;
        vm.logout = logout;
        vm.deleteUser = deleteUser;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (user) {
                    if(user) {
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
                    } else {
                        $location.url('/home');
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

        function deleteUser(userId) {
            UserService
                .deleteUser(userId)
                .success(function () {
                    $location.url('/home');
                })
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
                .getCurrentUser()
                .success(function (currentCoach) {
                    if (currentCoach) {
                        UserService
                            .findUserById(vm.athleteId)
                            .success(function (user) {
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
                            });
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


    function AdminViewAthleteController(UserService, PostService, TeamService, $routeParams, $location, $sce) {
        var vm = this;

        vm.adminId = $routeParams.adminId;
        vm.athleteId = $routeParams.athleteId;

        vm.updateUser = updateUser;
        vm.logout = logout;
        vm.deleteUser = deleteUser;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (admin) {
                    if(admin) {
                        UserService
                            .findUserById(vm.athleteId)
                            .success(function (user) {
                                vm.user = user;
                            })
                            .error(function () {
                                vm.error = true;
                            });
                    } else {
                        $location.url('/home');
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

        function deleteUser(userId) {

        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }
    }

    function ViewFollowedAthleteController(UserService, TeamService, $location, $routeParams) {
        var vm = this;

        vm.userId = $routeParams.userId;
        vm.inFollowed = true;

        vm.addPotentialAthlete = addPotentialAthlete;
        vm.logout = logout;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (coach) {
                    if(coach) {
                        UserService
                            .filterAthletesInTeam(coach._id, coach.team)
                            .success(function (athletes) {
                                vm.user = coach;
                                vm.schoolId = coach.school;
                                vm.teamId = coach.team;
                                vm.athletes = athletes;
                                if(vm.athletes.length == 0) {
                                    vm.error = 'No Athletes .';
                                }
                            })
                            .error(function (err) {
                                vm.error = 'No Athletes followed yet.';
                            });
                    } else {
                        $location.url('/home');
                    }
                });
        }
        init();

        function addPotentialAthlete(userId, teamId) {
            TeamService
                .addPotentialAthlete(userId, teamId)
                .success(function (team) {
                    if (team._id) {
                        $location.url('/coach/' + vm.userId + '/team');
                    } else {
                        var error = "User already present in the team";
                        $location.url('/coach/' + vm.userId + '/team/' + error + '/error');
                    }
                })
                .error(function (response) {
                    var error = "User already present in the team";
                    $location.url('/coach/' + vm.userId + '/team/' + error + '/error');
                });
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
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
                .getCurrentUser()
                .success(function (coach) {
                    if(coach) {
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
                    } else {
                        $location.url('/home');
                    }
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