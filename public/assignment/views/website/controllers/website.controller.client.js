(function () {

    angular
        .module('WebAppMaker')
        .controller('WebsiteListController', WebsiteListController)
        .controller('NewWebsiteController', NewWebsiteController)
        .controller('EditWebsiteController', EditWebsiteController)

    function WebsiteListController(WebsiteService, $routeParams) {
        var vm = this;

        var userId = $routeParams['uid'];
        vm.userId = userId;

        function init() {
            vm.websites = WebsiteService.findWebsitesByUser(userId);
            if (vm.websites.length == 0) {
                vm.error = "No websites found. Create new websites.";
            }
        }
        init();
    }

    function NewWebsiteController(WebsiteService, $location, $routeParams) {
        var vm = this;

        // Event Handlers
        vm.createNewWebsite = createNewWebsite;

        var userId = $routeParams['uid'];
        vm.userId = userId;

        function init() {
            vm.websites = WebsiteService.findWebsitesByUser(userId);
        }
        init();
        
        function createNewWebsite(website) {
            WebsiteService.createWebsite(userId, website);
            $location.url('/user/'+userId+'/website');
        }

    }

    function EditWebsiteController(WebsiteService, $location, $routeParams) {
        var vm = this;

        // Event Handlers
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        
        function init() {
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
            vm.currentWebsite = WebsiteService.findWebsiteById(vm.websiteId);
            if (vm.currentWebsite == null) {
                vm.error = "No website found!";
            }
        }
        init();

        function updateWebsite(website) {
            vm.currentWebsite = WebsiteService.updateWebsite(vm.websiteId, website);
            $location.url('/user/'+vm.userId+'/website');
        }

        function deleteWebsite() {
            WebsiteService.deleteWebsite(vm.websiteId);
            $location.url('/user/'+vm.userId+'/website');
        }
    }

})();