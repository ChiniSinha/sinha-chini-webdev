(function () {
    angular
        .module("RecruiterWeb")
        .controller("AddSchoolController", AddSchoolController)
        .controller("EditSchoolController", EditSchoolController)
        .controller("ViewSchoolController", ViewSchoolController)
        .controller("SearchSchoolController", SearchSchoolController)
        .controller("SearchSchoolForAthleteController", SearchSchoolForAthleteController)

    function AddSchoolController(SchoolService, UserService, $location, $routeParams) {
        var vm = this;

        vm.userId = $routeParams.userId;

        // Event Handlers
        vm.createSchool = createSchool;
        vm.logout = logout;

        function init() {

        }

        init();

        function createSchool(school) {
            school._admin = vm.userId;
            SchoolService
                .createSchool(school)
                .success(function (school) {
                    $location.url('/admin/' + vm.userId);
                })
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }
    }

    function EditSchoolController(SchoolService, UserService, $location, $routeParams) {
        var vm = this;

        vm.userId = $routeParams.userId;
        vm.schoolId = $routeParams.schoolId;

        // Event Handlers
        vm.updateSchool = updateSchool;
        vm.logout = logout;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (admin) {
                    if(admin) {
                        SchoolService
                            .findSchoolById(vm.schoolId)
                            .success(function (school) {
                                vm.school = school;
                            })
                    } else {
                        $location.url('/home');
                    }
                })
        }

        init();

        function updateSchool(school) {
            SchoolService
                .updateSchool(vm.schoolId, school)
                .success(function (school) {
                    vm.message = "User Successfully updated!";
                })
                .error(function (err) {
                    vm.error = "Error!";
                })
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }
    }

    function SearchSchoolForAthleteController(SchoolService, UserService, $routeParams, $location){
        var vm = this;

        vm.userId = $routeParams.userId;

        vm.searchSchoolByName = searchSchoolByName;
        vm.logout = logout;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (user) {
                    if(!user) {
                        $location.url('/home');
                    }
                })
        }
        init();

        function searchSchoolByName(searchText) {
            SchoolService
                .searchSchoolByName(searchText)
                .success(function (schools) {
                    if(schools) {
                        vm.schools=schools;
                    } else {
                        vm.error="No Schools!"
                    }
                })
                .error(function () {
                    vm.error = "Error!";
                })
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }

    }

    function SearchSchoolController(SchoolService, UserService, $routeParams, $location){
        var vm = this;

        vm.searchSchoolByName = searchSchoolByName;

        function init() {

        }
        init();

        function searchSchoolByName(searchText) {
            SchoolService
                .searchSchoolByName(searchText)
                .success(function (schools) {
                    if(schools) {
                        vm.schools=schools;
                    } else {
                        vm.error="No Schools!"
                    }
                })
                .error(function () {
                    vm.error = "Error!";
                })
        }

    }

    function ViewSchoolController(SchoolService, UserService, TeamService, $routeParams, $location) {
        var vm = this;

        vm.userId = $routeParams.userId;
        vm.schoolId = $routeParams.schoolId;

        vm.interested = false;
        vm.addInterestedAthlete = addInterestedAthlete;
        vm.removeInterestedAthlete = removeInterestedAthlete;
        vm.logout = logout;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (user) {
                    if(user) {
                        SchoolService
                            .findSchoolById(vm.schoolId)
                            .success(function (school) {
                                UserService
                                    .findAllCoachBySchoolId(school._id)
                                    .success(function (coaches) {
                                        TeamService
                                            .findTeamBySchoolId(school._id)
                                            .success(function (teams) {
                                                SchoolService
                                                    .findSchoolByAthleteId(school._id, user._id)
                                                    .success(function (athSchool) {
                                                        vm.teams = teams;
                                                        vm.school = school;
                                                        vm.coaches = coaches;
                                                        if(athSchool.length > 0) {
                                                            vm.interested = true;
                                                        }
                                                    });
                                            });
                                    });
                            })
                            .error(function () {
                                vm.error = "Error!";
                            })
                    } else {
                        $location.url('/home');
                    }
                })
        }
        init();

        function addInterestedAthlete() {
            SchoolService
                .addInterestedAthlete(vm.schoolId, vm.userId)
                .success(function (school) {
                        vm.school = school;
                        vm.interested = true;
                    }
                );
        }

        function removeInterestedAthlete() {
            SchoolService
                .removeInterestedAthlete(vm.userId, vm.schoolId)
                .success(function (school) {
                    vm.school = school;
                    vm.interested=false;
                });
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }

    }

})();