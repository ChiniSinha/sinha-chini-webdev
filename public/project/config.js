(function(){
    angular
        .module("RecruiterWeb")
        .config(configuration);

    function configuration($routeProvider, $httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';
        $routeProvider
        // User
            .when("/home", {
                templateUrl: "views/home/templates/home.view.client.html"
                //controller: "LoginController",
                //controllerAs: "model"
            })
            .when("/coachRegister", {
                templateUrl: "views/users/templates/coach/registration.view.client.html"
            })
            .when("/athleteRegister", {
                templateUrl: "views/users/templates/athlete/registration.view.client.html"
            })
            .when("/login", {
                templateUrl: "views/users/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/coach/:userId", {
                templateUrl: "views/coach/templates/profile.view.client.html"
            })
            .when("/athlete/:userId", {
                templateUrl: "views/athlete/templates/profile.view.client.html"
            })
            .when("/admin/:userId", {
                templateUrl: "views/admin/templates/admin-list.view.client.html"
            })
    }
})();