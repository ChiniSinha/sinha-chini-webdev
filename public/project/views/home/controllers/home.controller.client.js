(function () {
    angular
        .module("RecruiterWeb")
        .controller("HomeController", HomeController)

    function HomeController(UserService, $routeParams , $location) {

        var vm = this;
        vm.userId = $routeParams.userId;

        vm.logout = logout;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (user) {
                    if(user.role == 'COACH') {
                        vm.coach=user;
                    } else if(user.role == 'ATHLETE') {
                        vm.athlete = user;
                    } else if(user.role == 'ADMIN') {
                        vm.admin = user;
                    }
                })
                .error(function (err) {
                    $location.url('/home')
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