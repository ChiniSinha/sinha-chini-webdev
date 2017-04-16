(function () {
    angular
        .module("RecruiterWeb")
        .controller("CoachProfileController", CoachProfileController)
        .controller("CoachEditProfileControlller", CoachEditProfileControlller)

    function CoachProfileController(UserService, $routeParams , $location) {
        var vm = this;

        vm.userId = $routeParams.userId;

        vm.logout = logout;

        function init() {
            UserService
                .findUserById(userId)
                .success(function (user) {
                    vm.user = user;
                    if (vm.user == null) {
                        $location.url("/home");
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

    function CoachEditProfileControlller(UserService, $routeParams , $location) {
        var vm = this;

        var userId = $routeParams.userId;
        vm.userId = userId;
        vm.updateUser = updateUser;
        vm.logout = logout;

        function init() {
            UserService
                .findUserById(userId)
                .success(function (user) {
                    vm.user = user;
                    if (vm.user == null) {
                        $location.url("/home");
                    }
                })
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

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }

    }
})();