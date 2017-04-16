(function () {

    angular
        .module('RecruiterWeb')
        .controller('YoutubeVideoSearchController',YoutubeVideoSearchController);

    function YoutubeVideoSearchController(YoutubeService, PostService, $routeParams, $location) {

        var vm = this;

        vm.searchVideos = searchVideos;
        vm.selectVideo = selectVideo;

        vm.userId = $routeParams.userId;
        vm.postId = $routeParams.postId;

        function init() {

        }
        init();

        function searchVideos(searchTerm) {
            YoutubeService
                .searchVideos(searchTerm)
                .then(function(response) {
                    var data = JSON.stringify(response.result);
                    vm.videos = data;
                });
        }

        function selectVideo(video) {
            var url = "https://www.youtube.com/embed/" ;
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