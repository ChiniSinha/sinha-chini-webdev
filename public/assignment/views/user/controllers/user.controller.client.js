(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController)
    
        function LoginController($location, UserService) {
            var vm = this;

            // Event Handlers
            vm.login = login;

            function init() {
            }
            init();

            function login(user) {
                UserService
                    .findUserByCredentials(user.username, user.password)
                    .success(function(user) {
                    if (user) {
                        $location.url("/user/" + user._id);
                    }
                    })
                    .error(function (err) {
                        vm.error = "User not present";
                    });
            }
        }
        
        function RegisterController(UserService, $location) {
            var vm = this;

            // Event Handler
            vm.register = register;

            function init() {
            }
            init();
            
            function register(user) {
                if( user == undefined || user.username == null || user.password == null || user.firstName == null || user.lastName == null) {
                    vm.error = "Values are missing!";
                } else if (user.password != user.confirmPassword) {
                    vm.error = "Password do not match!"
                } else {
                    var promise = UserService.createUser(user);
                    console.log(promise);
                    promise.success(function (user) {
                        $location.url('/user/'+user._id);
                    })
                }
            }


        }
        
        function ProfileController(UserService, $routeParams , $location) {
            var vm = this;
            
            // Event Handers
            vm.updateUsr = updateUsr;
            vm.deleteUsr = deleteUsr;
            
            var userId = $routeParams.uid;

            function init() {
                var promise = UserService.findUserById(userId);
                promise.success(function (user) {
                    vm.user = user;
                    if (vm.user == null) {
                        $location.url("/login");
                    }
                })
            }
            init();

            function updateUsr(newUser) {
                vm.error = null;
                UserService.updateUser(userId, newUser)
                    .success(function (user) {
                        if(user != null) {
                            vm.message = "User Successfully Updated!"
                        }
                    })
                    .error(function (err) {
                        vm.error = "Unable to update user";
                    })

            }
            
            function deleteUsr(userId) {
                var promise = UserService.deleteUser(userId);
                promise.success(function (msg) {
                    console.log(msg);
                    $location.url("/login");
                })

            }
            
        }
        
})();