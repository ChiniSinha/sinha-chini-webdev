(function() {
    angular
        .module("RecruiterWeb")
        .controller("LoginController", LoginController)
        .controller("CoachRegisterController", CoachRegisterController)
        .controller("AthleteRegisterController", AthleteRegisterController)
        .controller("SearchSchoolForCoachController",SearchSchoolForCoachController)

    function LoginController($location, UserService) {
        var vm = this;
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
                },function (err) {
                    vm.error = "Username/password does not match";
                });
        }
    }

    function CoachRegisterController($location, UserService, SchoolService, $routeParams) {
        var vm = this;

        var schoolId = $routeParams.schoolId;
        vm.register = register;

        function init() {
            SchoolService
                .findSchoolById(schoolId)
                .success(function (school) {
                    vm.schoolName = school.name;
                })
        }
        init();

        function register(user) {

            user.role = 'COACH';
            user.school = schoolId;
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
                                    console.log("newUser: " + newUser._id);
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

    function SearchSchoolForCoachController(SchoolService){
        var vm = this;

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

})();