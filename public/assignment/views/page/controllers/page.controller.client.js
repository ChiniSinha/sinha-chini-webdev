(function () {
    angular
        .module('WebAppMaker')
        .controller('PageListController', PageListController)
        .controller('NewPageController', NewPageController)
        .controller('EditPageController', EditPageController)

        function PageListController(PageService, $routeParams) {
            var vm = this;

            vm.userId = $routeParams.uid;
            vm.websiteId = $routeParams.wid;
            
            function init() {
                var promise = PageService.findPageByWebsiteId(vm.websiteId);
                promise.success(function (pages) {
                    vm.pages = pages;
                    if (vm.pages.length == 0) {
                        vm.error = "No pages found. Create new Pages.";
                    }
                })
            }
            init();
        }

        function NewPageController(PageService, $location, $routeParams) {
            var vm = this;

            // Event Handlers
            vm.createNewPage = createNewPage;

            vm.userId = $routeParams.uid;
            vm.websiteId = $routeParams.wid;

            function init() {
                var promise = PageService.findPageByWebsiteId(vm.websiteId);
                promise.success(function (pages) {
                    vm.pages = pages;    
                })
            }
            init();

            function createNewPage(page) {
                var promise = PageService.createPage(vm.websiteId, page);
                promise.success(function (page) {
                    $location.url('/user/'+vm.userId+'/website/'+vm.websiteId+'/page');
                })
            }
        }

        function EditPageController(PageService, $location, $routeParams) {
            var vm = this;

            // Event Handler
            vm.updatePage = updatePage;
            vm.deletePage = deletePage;

            vm.userId = $routeParams.uid;
            vm.websiteId = $routeParams.wid;
            vm.pageId = $routeParams.pid;

            function init() {
                var prom1 = PageService.findPageByWebsiteId(vm.websiteId);
                prom1.success(function (pages) {
                    vm.pages = pages;
                })
                var prom2 = PageService.findPageById(vm.pageId);
                prom2.success(function (page) {
                    vm.currentPage = page;
                    if( vm.currentPage == null ) {
                        vm.error = "No Page found!";
                    }
                })
            }
            init();

            function updatePage(page) {
                var promise = PageService.updatePage(vm.pageId, page);
                promise.success(function (page) {
                    vm.currentPage = page;
                    $location.url('/user/'+vm.userId+'/website/'+vm.websiteId+'/page');
                })
            }

            function deletePage() {
                var promise = PageService.deletePage(vm.pageId);
                promise.success(function (msg) {
                    $location.url('/user/'+vm.userId+'/website/'+vm.websiteId+'/page');
                    console.log(msg);
                })
            }
        }

})();