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
                var user = UserService.findUserByCredentials(user.username, user.password);
                if (user) {
                    $location.url("/user/" + user._id);
                } else {
                    vm.error = "User not found";
                }
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
                    var userId = UserService.createUser(user);
                    $location.url('/user/'+userId);
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
                vm.user = UserService.findUserById(userId);
            }
            init();

            function updateUsr(newUser) {
                var user = UserService.updateUser(userId, newUser);
                if(user != null) {
                    vm.message = "User Successfully Updated!"
                } else {
                    vm.error = "Unable to update user";
                }
            }
            
            function deleteUsr(userId) {
                UserService.deleteUser(userId);
                $location.url("/login");
            }
            
        }

        
        
        
})();