(function () {
    angular
        .module("RecruiterWeb")
        .controller("AddSchoolController", AddSchoolController)
        .controller("ViewSchoolController", ViewSchoolController)
        .controller("SearchSchoolController", SearchSchoolController)

    function AddSchoolController(SchoolService, UserService, $location, $routeParams) {
        var vm = this;

        var userId = $routeParams.userId;
        vm.userId = userId;

        // Event Handlers
        vm.createSchool = createSchool;
        vm.logout = logout;

        function init() {

        }

        init();

        function createSchool(school) {
            SchoolService
                .createSchool(school)
                .success(function (school) {
                    $location.url('/admin/' + userId);
                })
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }
    }


    function SearchSchoolController(SchoolService, $routeParams){
        var vm = this;

        vm.userId = $routeParams.userId;

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

        vm.logout = logout;

        function init() {
            SchoolService
                .findSchoolById(vm.schoolId)
                .success(function (school) {
                    UserService
                        .findAllCoachBySchoolId(school._id)
                        .success(function (coaches) {
                            TeamService
                                .findTeamBySchoolId(school._id)
                                .success(function (teams) {
                                    vm.teams = teams;
                                    vm.school = school;
                                    vm.coaches = coaches;
                                })
                        })
                })
                .error(function () {
                    vm.error = "Error!";
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

    function SearchSchoolForAthleteController(SchoolService, $routeParams) {
        var vm = this;

        var teamId = $routeParams.teamId;
        vm.teamId = teamId;
    }

})();