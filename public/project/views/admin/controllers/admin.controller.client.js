(function () {
    angular
        .module("RecruiterWeb")
        .controller("AdminViewController", AdminViewController)
        .controller("SearchUserController", SearchUserController)

    function AdminViewController(UserService, SchoolService, $routeParams, $location, $route) {

        var vm = this;
        vm.userId = $routeParams.userId;

        vm.updateUser = updateUser;
        vm.deleteSchool = deleteSchool;
        vm.logout = logout;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (admin) {
                    if (admin) {
                        UserService.isAdmin()
                            .success(function (admin) {
                                SchoolService
                                    .findAllSchoolForAdmin()
                                    .success(function (schools) {
                                        vm.schools = schools;
                                        vm.user = admin;
                                    })
                            })
                    } else {
                        $location.url('/home');
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

        function deleteSchool(schoolId) {
            SchoolService
                .deleteSchool(schoolId)
                .success(function () {
                })
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }

    }

    function SearchUserController(UserService, $routeParams, $location, $route) {
        var vm = this;

        vm.userId = $routeParams.userId;

        vm.logout = logout;
        vm.redirectToUser = redirectToUser;
        vm.deleteUser = deleteUser;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (user) {
                    if(user) {
                        UserService
                            .findAllUsers()
                            .success(function (users) {
                                if(users.length > 0) {
                                    vm.users = users;
                                } else {
                                    vm.error="No users found!";
                                }
                            })
                    } else {
                        $location.url('/home');
                    }
                })
        }
        init();

        function searchUserByFirstName(name) {
            UserService
                .searchUserByFirstName(name)
                .success(function (users) {
                    if(users) {
                        vm.users = users;
                    } else {
                        vm.error="No Users!"
                    }
                })
                .error(function () {
                    vm.error = "Error!";
                })
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }

        function redirectToUser(selectedUserId) {
            UserService
                .findUserById(selectedUserId)
                .success(function (user) {
                    if(user.role == 'COACH') {
                        $location.url('/admin/' + vm.userId + '/coach/' + selectedUserId);
                    } else {
                        $location.url('/admin/' + vm.userId + '/athlete/' + selectedUserId);
                    }
                })
        }

        function deleteUser(userId) {
            UserService
                .deleteUser(userId)
                .success(function () {
                    $route.reload();
                })
        }
    }

})();