(function () {

    angular
        .module('RecruiterWeb')
        .controller('FlickrImageSearchController',FlickrImageSearchController);

    function FlickrImageSearchController(FlickrService, PostService, $routeParams, $location) {

        var vm = this;

        vm.searchPhotos = searchPhoto;
        vm.selectPhoto = selectPhoto;

        vm.userId = $routeParams.userId;
        vm.postId = $routeParams.postId;

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
            var post ={};
            post._id = vm.postId;
            post.type = "IMAGE";
            post.width = "100%";
            post.url = url;
            post._user = vm.userId;
            PostService
                .updatePost(vm.postId, post)
                .then(function (){
                    $location.url("/athlete/"+vm.userId+"/post/"+vm.postId);
                });
        }
    }
})();