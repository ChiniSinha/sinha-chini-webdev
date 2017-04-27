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
            .when("/home/:userId", {
                templateUrl: "views/home/templates/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
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
            .when("/athlete/:userId/school/:schoolId/coach/:coachId", {
                templateUrl: "views/coach/templates/profile.view.client.html",
                controller: "CoachProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/coach/:userId", {
                templateUrl: "views/coach/templates/profile-edit.view.client.html",
                resolve: {
                    currentUser: checkLoggedIn
                },
                controller: "CoachEditProfileController",
                controllerAs: "model",
            })
            // Teams
            .when("/athlete/:userId/team/:teamId", {
                templateUrl: "views/team/templates/team-athlete.view.client.html",
                controller: "AthleteViewTeamController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/coach/:userId/team", {
                templateUrl: "views/team/templates/team.view.client.html",
                controller: "ViewTeamController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/coach/:userId/team/:error/error", {
                templateUrl: "views/team/templates/team.view.client.html",
                controller: "ViewTeamController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/coach/:userId/team/new", {
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
            // Athletes
            .when("/coach/:userId/school/:schoolId", {
                templateUrl: "views/athlete/templates/interested-athlete.view.client.html",
                controller: "ViewInterestedAthleteController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/coach/:userId/followedAthletes", {
                templateUrl: "views/athlete/templates/interested-athlete.view.client.html",
                controller: "ViewFollowedAthleteController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/coach/:userId/athlete/:athleteId", {
                templateUrl: "views/athlete/templates/profile.view.client.html",
                controller: "ViewAthleteController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/athlete/:userId/team/:teamId/athlete/:athleteId", {
                templateUrl: "views/athlete/templates/profile-athlete.view.client.html",
                controller: "AthleteViewAthleteController",
                controllerAs: "model",
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
                controller: "SearchSchoolForAthleteController",
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
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
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
            .when("/admin/:userId/searchUser", {
                templateUrl : "views/admin/templates/admin-search-user.view.client.html",
                controller: "SearchUserController",
                controllerAs: "model",
                resolve: {
                    adminUser: checkAdmin
                }
            })
            .when("/admin/:adminId/athlete/:athleteId", {
                templateUrl : "views/athlete/templates/profile-admin.view.client.html",
                controller : "AdminViewAthleteController",
                controllerAs: "model",
                resolve: {
                    adminUser: checkAdmin
                }
            })
            .when("/admin/:adminId/athlete/:athleteId/post", {
                templateUrl : "views/post/templates/post-admin.view.client.html",
                controller : "AdminPostEditController",
                controllerAs: "model",
                resolve: {
                    adminUser: checkAdmin
                }
            })
            .when("/admin/:adminId/coach/:coachId", {
                templateUrl : "views/coach/templates/profile-admin.view.client.html",
                controller : "CoachAdminProfileController",
                controllerAs: "model",
                resolve: {
                    adminUser: checkAdmin
                }
            })
            .when("/admin/:adminId/coach/:coachId/team/:teamId", {
                templateUrl: "views/team/templates/team-admin.view.client.html",
                controller : "AdminTeamViewController",
                controllerAs: "model",
                resolve: {
                    adminUser: checkAdmin
                }
            })
            .when("/admin/:userId/school/:schoolId", {
                templateUrl: "views/school/templates/admin-edit-school.view.html",
                controller: "EditSchoolController",
                controllerAs: "model",
                resolve: {
                    adminUser: checkAdmin
                }
            })
            .when("/admin/:adminId/newUser", {
                templateUrl: "views/users/templates/admin-add-user.view.client.html",
                controller: "AdminRegisterController",
                controllerAs: "model",
                resolve: {
                    adminUser: checkAdmin
                }
            })
            .when("/admin/:adminId/admin/:userId", {
                templateUrl: "views/admin/templates/admin-edit.view.client.html",
                controller: "AdminEditAdminController",
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