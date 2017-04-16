(function(){
    angular
        .module("RecruiterWeb")
        .config(configuration);

    function configuration($routeProvider, $httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';
        $routeProvider
            .when("/home", {
                templateUrl: "views/home/templates/home.view.client.html"
            })
            .when("/coachRegister", {
                templateUrl: "views/users/templates/coach/searchSchool.view.client.html",
                controller: "SearchSchoolForCoachController",
                controllerAs: "model"
            })
            .when("/coachRegister/:schoolId", {
                templateUrl: "views/users/templates/coach/registration.view.client.html",
                controller: "CoachRegisterController",
                controllerAs: "model"
            })
            .when("/athleteRegister", {
                templateUrl: "views/users/templates/athlete/registration.view.client.html",
                controller: "AthleteRegisterController",
                controllerAs: "model"
            })
            .when("/login", {
                templateUrl: "views/users/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/coach/:userId", {
                templateUrl: "views/coach/templates/profile-edit.view.client.html",
                controller: "CoachEditProfileControlller",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/coach/:userId/team", {
                templateUrl: "views/team/templates/team-add.view.client.html",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/athlete/:userId", {
                templateUrl: "views/athlete/templates/profile.view.client.html",
                resolve: {
                    currentUser: checkLoggedIn
                }

            })
            .when("/admin/:userId", {
                templateUrl: "views/admin/templates/admin-list.view.client.html",
                controller: "AdminViewController",
                controllerAs: "model",
                resolve: {
                    adminUser: checkAdmin
                }
            })
            .when("/admin/:userId/school", {
                templateUrl: "views/admin/templates/admin-add-school.view.client.html",
                controller: "AddSchoolController",
                controllerAs: "model",
                resolve: {
                    adminUser: checkAdmin
                }
            })
            .otherwise({
            redirectTo: '/home'
        })

    }

    function checkLoggedIn($q, UserService, $location) {
        var defer = $q.defer();
        UserService
            .loggedIn()
            .then(function (user) {
                if(user != '0') {
                    defer.resolve(user);
                } else {
                    defer.reject();
                    $location.url('/home');
                }
            });
        return defer.promise;
    }

    function checkAdmin($q, UserService, $location) {
        var defer = $q.defer();
        UserService
            .isAdmin()
            .then(function (user) {
                if(user != '0') {
                    defer.resolve(user);
                } else {
                    defer.reject();
                    $location.url('/home');
                }
            });
        return defer.promise;
    }
})();