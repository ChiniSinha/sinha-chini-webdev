(function() {
    angular
        .module("RecruiterWeb")
        .controller("LoginController", LoginController)
        .controller("CoachRegisterController", CoachRegisterController)
        .controller("AthleteRegisterController", AthleteRegisterController)

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(user) {
            UserService
                .login(user)
                .then(function (user) {
                    var user = response.data;
                    if(user.role == "ADMIN"){
                        $location.url("/admin/"+user._id);
                    } else if(user.role == "COACH"){
                        $location.url("/coach/"+user._id);
                    } else {
                        $location.url("/athlete/"+user._id);
                    }
                },function (err) {
                    vm.error = "Username/password does not match";
                });
        }
    }

    function CoachRegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(user) {
            vm.registrationerror = false;
            vm.passwordmismatch = false;

            if(user == null){
                vm.registrationerror = "Please enter your username, email and password";
                return;
            }
            if(user.username == null || user.email == null || user.password == null){
                vm.registrationerror = "Please enter your username, email and password";
                return;
            }
            if (user.password != user.passwordverification){
                vm.registrationerror ="";
                vm.passwordmismatch = "Passwords do not match";
                return;
            }
            if(user.organization){
                user.role = "PUBLISHER";
            }
            UserService
                .findUserByUsername(user.username)
                .success(function(user){
                    // Method succeeded, and user exists
                    vm.registrationerror = "Username taken, please try another username";
                    vm.passwordmismatch = "";
                })
                .error(function (err) {
                    // There was an error, so the user does not exist
                    // UserService
                    //     .createUser(user)
                    //     .success(function (newuser) {
                    //         $location.url("/user/"+newuser._id);
                    //     });

                    UserService
                        .register(user)
                        .then(function(response) {
                            var user = response.data;
                            $rootScope.currentUser = user;
                            $location.url("/user/"+user._id);
                            // $location.url("/project/profile");
                        });
                });
        }
    }

    function AthleteRegisterController($location, UserService, $rootScope) {
        var vm = this;
        vm.register = register;

        function register(user) {
            vm.registrationerror = false;
            vm.passwordmismatch = false;

            if(user == null){
                vm.registrationerror = "Please enter your username, email and password";
                return;
            }
            if(user.username == null || user.email == null || user.password == null){
                vm.registrationerror = "Please enter your username, email and password";
                return;
            }
            if (user.password != user.passwordverification){
                vm.registrationerror ="";
                vm.passwordmismatch = "Passwords do not match";
                return;
            }
            if(user.organization){
                user.role = "PUBLISHER";
            }
            UserService
                .findUserByUsername(user.username)
                .success(function(user){
                    // Method succeeded, and user exists
                    vm.registrationerror = "Username taken, please try another username";
                    vm.passwordmismatch = "";
                })
                .error(function (err) {
                    // There was an error, so the user does not exist
                    // UserService
                    //     .createUser(user)
                    //     .success(function (newuser) {
                    //         $location.url("/user/"+newuser._id);
                    //     });

                    UserService
                        .register(user)
                        .then(function(response) {
                            var user = response.data;
                            $rootScope.currentUser = user;
                            $location.url("/user/"+user._id);
                            // $location.url("/project/profile");
                        });
                });
        }
    }

})();