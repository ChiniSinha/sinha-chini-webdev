(function() {
    angular
        .module("RecruiterWeb")
        .controller("LoginController", LoginController)
        .controller("CoachRegisterController", CoachRegisterController)
        .controller("AthleteRegisterController", AthleteRegisterController)
        .controller("AdminRegisterController", AdminRegisterController)

    function LoginController($location, UserService) {
        var vm = this;

        vm.role = 'ATHLETE';

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

    function AdminRegisterController($location, UserService, SchoolService, $routeParams) {
        var vm = this;

        vm.adminId = $routeParams.adminId;
        vm.register = register;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (admin) {
                    if(admin) {
                        SchoolService
                            .findAllSchoolForAdmin()
                            .success(function (schools) {
                                vm.schools = schools;
                            })
                    } else {
                        $location.url('/home');
                    }
                })
        }
        init();

        function register(user) {
            if(user.username == null || user.password == null || user.firstName == null ||
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
                                .adminCreateUser(user)
                                .success(function (newUser) {
                                    if(newUser.role == 'ATHLETE') {
                                        $location.url('/admin/' + vm.adminId + '/athlete/' + newUser._id);
                                    } else if(newUser.role == 'COACH') {
                                        $location.url('/admin/' + vm.adminId + '/coach/' + newUser._id);
                                    } else {
                                        $location.url('/admin/' + vm.adminId + '/admin' + newUser._id);
                                    }
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