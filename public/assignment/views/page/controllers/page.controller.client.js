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
                vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
                if (vm.pages.length == 0) {
                    vm.error = "No pages found. Create new Pages.";
                }
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
                vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
            }
            init();

            function createNewPage(page) {
                PageService.createPage(vm.websiteId, page);
                $location.url('/user/'+vm.userId+'/website/'+vm.websiteId+'/page');
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
                vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
                vm.currentPage = PageService.findPageById(vm.pageId);
                if( vm.currentPage == null ) {
                    vm.error = "No Page found!";
                }
            }
            init();

            function updatePage(page) {
                vm.currentPage = PageService.updatePage(vm.pageId, page);
                $location.url('/user/'+vm.userId+'/website/'+vm.websiteId+'/page');
            }

            function deletePage() {
                PageService.deletePage(vm.pageId);
                $location.url('/user/'+vm.userId+'/website/'+vm.websiteId+'/page');
            }
        }

})();