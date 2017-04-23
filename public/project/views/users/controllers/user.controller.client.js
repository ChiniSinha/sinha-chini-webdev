(function() {
    angular
        .module("RecruiterWeb")
        .controller("LoginController", LoginController)
        .controller("CoachRegisterController", CoachRegisterController)
        .controller("AthleteRegisterController", AthleteRegisterController)

    function LoginController($location, UserService) {
        var vm = this;

        vm.athlete = true;
        vm.coach = false;
        vm.admin = false;

        vm.toggleLogin = toggleLogin;
        vm.login = login;

        function login(user) {
            UserService
                .login(user)
                .success(function (user) {
                    if(user.role == "ADMIN"){
                        $location.url("/admin/"+user._id);
                    } else if(user.role == "COACH"){
                        $location.url("/coach/"+user._id);
                    } else {
                        $location.url("/athlete/"+user._id);
                    }
                })
                .error(function (err) {
                    vm.error = "Username/password does not match";
                })
        }

        function toggleLogin(role) {
            if(role == 'ATHLETE') {
                vm.athlete = true;
                vm.coach = false;
                vm.admin = true;
            } else if(role == 'ADMIN') {
                vm.athlete = false;
                vm.coach = false;
                vm.admin = true;
            } else {
                vm.athlete = false;
                vm.admin = false;
                vm.coach = true;
            }
        }
    }

    function CoachRegisterController($location, UserService, SchoolService, $routeParams) {
        var vm = this;

        vm.schoolId = $routeParams.schoolId;
        vm.register = register;

        function init() {
            SchoolService
                .findSchoolById(vm.schoolId)
                .success(function (school) {
                    vm.schoolName = school.name;
                })
        }
        init();

        function register(user) {

            user.role = 'COACH';
            user.school = vm.schoolId;
            if( user == undefined || user.username == null || user.password == null || user.firstName == null ||
                user.lastName == null || user.email == null || user.phone == null) {
                vm.error = "Values are missing!";
            } else if (user.password != user.confirmPassword) {
                vm.error = "Password do not match!"
            } else {
                UserService
                    .findUserByUsername(user.username)
                    .success(function (response) {
                        if(!response._id) {
                            UserService
                                .register(user)
                                .success(function (newUser) {
                                    $location.url("/coach/"+newUser._id);
                                });
                        } else {
                            vm.error = "Username is taken! Try with a different username.";
                        }
                    })
                    .error(function () {

                    });
            }
        }
    }

    function AthleteRegisterController($location, UserService) {
        var vm = this;

        vm.register = register;

        function init() {
        }
        init();

        function register(user) {

            user.role = 'ATHLETE';
            if( user == undefined || user.username == null || user.password == null ||
                user.firstName == null || user.lastName == null || user.email == null || user.phone == null ||
                user.gradYear == null) {
                vm.error = "Values are missing!";
            } else if (user.password != user.confirmPassword) {
                vm.error = "Password do not match!"
            } else {
                UserService
                    .findUserByUsername(user.username)
                    .success(function (response) {
                        if(!response._id) {
                            UserService
                                .register(user)
                                .success(function (newUser) {
                                    console.log("newUser: " + newUser._id);
                                    $location.url("/athlete/"+newUser._id);
                                });
                        } else {
                            vm.error = "Username is taken! Try with a different username.";
                        }
                    })
                    .error(function () {

                    });
            }
        }
    }

})();