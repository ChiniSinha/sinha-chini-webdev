(function () {
    angular
        .module("RecruiterWeb")
        .controller("AddSchoolController", AddSchoolController)
        .controller("AdminViewController", AdminViewController)

    function AdminViewController(UserService, $routeParams, $location) {

        var vm = this;
        vm.userId = $routeParams.userId;

        vm.logout = logout;

        function init() {

        }
        init();

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }

    }

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
})();