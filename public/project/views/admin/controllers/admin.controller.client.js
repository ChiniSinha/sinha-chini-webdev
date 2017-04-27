(function () {
    angular
        .module("RecruiterWeb")
        .controller("AdminViewController", AdminViewController)
        .controller("SearchUserController", SearchUserController)
        .controller("AdminEditAdminController", AdminEditAdminController)

    function AdminViewController(UserService, SchoolService, $routeParams, $location) {

        var vm = this;
        vm.userId = $routeParams.userId;

        vm.updateUser = updateUser;
        vm.deleteSchool = deleteSchool;
        vm.deleteUser = deleteUser;
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

        function deleteUser(userId) {
            UserService
                .deleteUser(userId)
                .success(function () {
                    $location.url('/home');
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

        vm.role = 'ALL';
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
                                    vm.athletes = users.filter(function (user) {
                                        if(user.role == 'ATHLETE'){
                                            return true;
                                        }
                                        return false;
                                    });
                                    if(vm.athletes.length == 0) {
                                        vm.error = "No Athletes found"
                                    }
                                    vm.coaches = users.filter(function (user) {
                                        if(user.role == 'COACH'){
                                            return true;
                                        }
                                        return false;
                                    });
                                    if(vm.coaches.length == 0) {
                                        vm.error = "No Athletes found"
                                    }
                                    vm.admins = users.filter(function (user) {
                                        if(user.role == 'ADMIN'){
                                            return true;
                                        }
                                        return false;
                                    });
                                    if(vm.admins.length == 0) {
                                        vm.error = "No Athletes found"
                                    }
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
                    } else if(user.role == 'ATHLETE') {
                        $location.url('/admin/' + vm.userId + '/athlete/' + selectedUserId);
                    } else if(user._id == vm.userId){
                        $location.url('/admin/' + vm.userId);
                    } else {
                        $location.url('/admin/' + vm.userId + '/admin/' + selectedUserId);
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

    function AdminEditAdminController(UserService, SchoolService, $routeParams, $location) {

        var vm = this;

        vm.adminId = $routeParams.adminId;
        vm.userId = $routeParams.userId;

        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (admin) {
                    if (admin) {
                        UserService
                            .findUserById(vm.userId)
                            .success(function (user) {
                                SchoolService
                                    .findAllSchoolForAdmin()
                                    .success(function (schools) {
                                        vm.schools = schools;
                                        vm.user = user;
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
                .updateUser(vm.userId, newUser)
                .success(function (user) {
                    if(user != null) {
                        vm.message = "User Successfully Updated!"
                    }
                })
                .error(function (err) {
                    vm.error = "Unable to update user";
                })
        }

        function deleteUser(userId) {
            UserService
                .deleteUser(userId)
                .success(function () {
                    $location.url('/home');
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