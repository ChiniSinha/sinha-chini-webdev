(function () {

    angular
        .module('WebAppMaker')
        .controller('FlickrImageSearchController',FlickrImageSearchController);

    function FlickrImageSearchController(FlickrService, WidgetService, $routeParams, $location) {

        var vm = this;

        vm.searchPhotos = searchPhoto;
        vm.selectPhoto = selectPhoto;

        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.widgetId = $routeParams.wgid;

        function init() {

        }
        init();

        function searchPhoto(searchTerm) {
            FlickrService
                .searchPhotos(searchTerm)
                .then(function(response) {
                    data = response.data.replace("jsonFlickrApi(","");
                    data = data.substring(0,data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                });
        }

        function selectPhoto(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            var widget ={};
            widget._id = vm.widgetId;
            widget.type = "IMAGE";
            widget.width = "100%";
            widget.url = url;
            widget.pageId = vm.pageId;
            WidgetService
                .updateWidget(vm.widgetId, widget)
                .then(function (){
                    console.log(widget);
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+vm.widgetId);
                });
        }
    }
})();