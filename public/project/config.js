(function(){
    angular
        .module("RecruiterWeb")
        .config(configuration);

    function configuration($routeProvider, $httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';
        $routeProvider
            // Landing Page
            .when("/home", {
                templateUrl: "views/home/templates/home.view.client.html"
            })
            //Registration
            .when("/coachRegister", {
                templateUrl: "views/school/templates/search-school.view.client.html",
                controller: "SearchSchoolController",
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
            //Login
            .when("/login", {
                templateUrl: "views/users/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            // Coach Views
            .when("/athlete/:userId/coach/:coachId", {
                templateUrl: "views/coach/templates/profile.view.client.html",
                controller: "CoachProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/coach/:userId", {
                templateUrl: "views/coach/templates/profile-edit.view.client.html",
                controller: "CoachEditProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/coach/:userId/team", {
                templateUrl: "views/team/templates/team-add.view.client.html",
                controller: "AddTeamController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/coach/:userId/team/:teamId", {
                templateUrl: "views/team/templates/team-edit.view.client.html",
                controller: "EditTeamController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/coach/:userId/team/:teamId/school/:schoolId", {
                templateUrl: "views/athlete/templates/interested-athlete.view.client.html",
                controller: "ViewInterestedAthleteController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            // Athletes
            .when("/coach/:userId/view/:athleteId", {
                templateUrl: "views/athlete/templates/profile.view.client.html",
                resolve: {
                    currentUser: checkLoggedIn
                }

            })
            .when("/athlete/:userId", {
                templateUrl: "views/athlete/templates/profile-edit.view.client.html",
                controller: "AthleteEditProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/athlete/:userId/school", {
                templateUrl: "views/school/templates/search-school.view.client.html",
                controller: "SearchSchoolController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/athlete/:userId/school/:schoolId", {
                templateUrl: "views/school/templates/school.view.client.html",
                controller: "ViewSchoolController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            // Post
            .when("/athlete/:userId/post",{
                templateUrl: "views/post/templates/post-list.view.client.html",
                controller: "PostListController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/athlete/:userId/post/new",{
                templateUrl: "views/post/templates/post-chooser.view.client.html",
                controller: "PostNewController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/athlete/:userId/post/:postId",{
                templateUrl: "views/post/templates/post-edit.view.client.html",
                controller: "PostEditController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/athlete/:userId/post/:postId/flickrSearch", {
                templateUrl: "views/post/templates/post-flickr-search.view.client.html",
                controller: "FlickrImageSearchController",
                controllerAs: "model"
            })
            .when("/athlete/:userId/post/:postId/youTubeSearch", {
                templateUrl: "views/post/templates/post-youtube-search.view.client.html",
                controller: "YoutubeVideoSearchController",
                controllerAs: "model"
            })
            // Admin
            .when("/admin/:userId", {
                templateUrl: "views/admin/templates/admin-list.view.client.html",
                controller: "AdminViewController",
                controllerAs: "model",
                resolve: {
                    adminUser: checkAdmin
                }
            })
            .when("/admin/:userId/school", {
                templateUrl: "views/school/templates/admin-add-school.view.client.html",
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