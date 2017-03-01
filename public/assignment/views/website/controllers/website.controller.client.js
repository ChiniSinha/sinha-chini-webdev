(function () {

    angular
        .module('WebAppMaker')
        .controller('WebsiteListController', WebsiteListController)
        .controller('NewWebsiteController', NewWebsiteController)
        .controller('EditWebsiteController', EditWebsiteController)

    function WebsiteListController(WebsiteService, $routeParams) {
        var vm = this;

        var userId = $routeParams.uid;
        vm.userId = userId;

        function init() {
            var promise = WebsiteService.findWebsitesByUser(userId);
            promise.success(function (websites) {
                vm.websites = websites;
                if (vm.websites.length == 0) {
                    vm.error = "No websites found. Create new websites.";
                }
            })
        }
        init();
    }

    function NewWebsiteController(WebsiteService, $location, $routeParams) {
        var vm = this;

        // Event Handlers
        vm.createNewWebsite = createNewWebsite;

        var userId = $routeParams.uid;
        vm.userId = userId;

        function init() {
            var promise = WebsiteService.findWebsitesByUser(userId);
            promise.success(function (websites) {
                vm.websites = websites;
            })
        }
        init();
        
        function createNewWebsite(website) {
            var promise = WebsiteService.createWebsite(userId, website);
            promise.success(function (website) {
                $location.url('/user/'+userId+'/website');
            })
        }

    }

    function EditWebsiteController(WebsiteService, $location, $routeParams) {
        var vm = this;

        // Event Handlers
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        
        function init() {
            var prom1 = WebsiteService.findWebsitesByUser(vm.userId);
            prom1.success(function (websites) {
                vm.websites = websites;
            })

            var prom2 = WebsiteService.findWebsiteById(vm.websiteId);
            prom2.success(function (website) {
                vm.currentWebsite = website;
                if (vm.currentWebsite == null) {
                    vm.error = "No website found!";
                }
            })
        }
        init();

        function updateWebsite(website) {
            var promise = WebsiteService.updateWebsite(vm.websiteId, website);
            promise.success(function (website) {
                vm.currentWebsite = website;
                $location.url('/user/'+vm.userId+'/website');
            })
        }

        function deleteWebsite() {
            var promise = WebsiteService.deleteWebsite(vm.websiteId);
            promise.success(function (msg) {
                $location.url('/user/'+vm.userId+'/website');
                console.log(msg);
            })
        }
    }

})();