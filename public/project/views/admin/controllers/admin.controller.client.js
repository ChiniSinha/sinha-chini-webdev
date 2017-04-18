(function () {
    angular
        .module("RecruiterWeb")
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

})();