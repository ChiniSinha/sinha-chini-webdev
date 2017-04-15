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
            .when("/coachLogin", {
                templateUrl: "views/users/templates/coach/login.view.client.html"
            })
            .when("/athleteRegister", {
                templateUrl: "views/users/templates/athlete/registration.view.client.html"
            })
            .when("/athleteLogin", {
                templateUrl: "views/users/templates/athlete/login.view.client.html"
            })
    }
})();