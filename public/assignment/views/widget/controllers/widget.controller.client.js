(function() {

    angular
        .module('WebAppMaker')
        .controller('WidgetListController', WidgetListController)
        .controller('NewWidgetController', NewWidgetController)
        .controller('EditWidgetController', EditWidgetController)

    function WidgetListController(WidgetService, $routeParams, $sce) {
        var vm = this;

        // Event Handlers
        vm.doYouTrustUrl = doYouTrustUrl;
        vm.doYouTrustHtml = doYouTrustHtml;

        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;

        function init() {
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);
            if (vm.widgets.length == 0) {
                vm.error = "No widgets found!";
            }
        }
        init();

        function doYouTrustUrl(url) {
            var baseUrl = "https://www.youtube.com/embed/";
            var urlParts = url.split('/');
            if(urlParts[urlParts.length - 1].includes('=')){
                var subPart = urlParts[urlParts.length - 1];
                var urlSplit = subPart.split('=');
                var id = urlSplit[urlSplit.length - 1];
                return $sce.trustAsResourceUrl(baseUrl+id);
            }else {
                id = urlParts[urlParts.length - 1];
                return $sce.trustAsResourceUrl(baseUrl+id);
            }
        }

        function doYouTrustHtml(text){
            return $sce.trustAsHtml(text);
        }

    }

    function NewWidgetController(WidgetService, $location, $routeParams) {
        var vm = this;

        // Event Handlers
        vm.createHeading = createHeading;
        vm.createHtml = createHtml;
        vm.createImage = createImage;
        vm.createYoutube = createYoutube;

        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;

        function init() {
        }
        init();

        function createHeading(wig) {
            wig.widgetType = 'HEADING';
            vm.widget = WidgetService.createWidget(vm.pageId, wig);
            $location.url('/user/'+vm.userId+'/website/'+vm.websiteId+'/page/'+vm.pageId+'/widget/'+vm.widget._id);
        }

        function createHtml(wig) {
            wig.widgetType = 'HTML';
            vm.widget = WidgetService.createWidget(vm.pageId, wig);
            $location.url('/user/'+vm.userId+'/website/'+vm.websiteId+'/page/'+vm.pageId+'/widget/'+vm.widget._id);
        }

        function createImage(wig) {
            wig.widgetType = 'IMAGE';
            vm.widget = WidgetService.createWidget(vm.pageId, wig);
            $location.url('/user/'+vm.userId+'/website/'+vm.websiteId+'/page/'+vm.pageId+'/widget/'+vm.widget._id);
        }

        function createYoutube(wig) {
            wig.widgetType = 'YOUTUBE';
            vm.widget = WidgetService.createWidget(vm.pageId, wig);
            $location.url('/user/'+vm.userId+'/website/'+vm.websiteId+'/page/'+vm.pageId+'/widget/'+vm.widget._id);
        }
    }

    function EditWidgetController(WidgetService, $location, $routeParams) {
        var vm = this;

        // Event Handlers
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;

        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.widgetId = $routeParams.wgid;

        function init() {
            vm.widget = WidgetService.findWidgetById(vm.widgetId);
        }
        init();
        
        function updateWidget(widget) {
            vm.widget = WidgetService.updateWidget(vm.widgetId, widget);
            $location.url('/user/'+vm.userId+'/website/'+vm.websiteId+'/page/'+vm.pageId+'/widget');
        }

        function deleteWidget() {
            WidgetService.deleteWidget(vm.widgetId);
            $location.url('/user/'+vm.userId+'/website/'+vm.websiteId+'/page/'+vm.pageId+'/widget');
        }
    }

})();