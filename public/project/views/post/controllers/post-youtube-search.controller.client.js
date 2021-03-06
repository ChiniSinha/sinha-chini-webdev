(function () {

    angular
        .module('RecruiterWeb')
        .controller('YoutubeVideoSearchController',YoutubeVideoSearchController);

    function YoutubeVideoSearchController(YoutubeService, PostService, UserService, $routeParams, $location, $sce) {

        var vm = this;

        vm.searchVideos = searchVideos;
        vm.selectVideo = selectVideo;
        vm.getIframeSrc = getIframeSrc;
        vm.logout = logout;

        vm.userId = $routeParams.userId;
        vm.postId = $routeParams.postId;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (user) {
                    if(!user) {
                        $location.url('/home');
                    }
                })
        }
        init();

        function searchVideos(searchTerm) {
            YoutubeService
                .searchVideos(searchTerm)
                .then(function(response) {
                    var data = response.data;
                    vm.videos = data.items;
                });
        }

        function selectVideo(videoId) {
            var url = "https://www.youtube.com/embed/" + videoId ;
            var post ={};
            post._id = vm.postId;
            post.type = "YOUTUBE";
            post.width = "100%";
            post.url = url;
            post._user = vm.userId;
            PostService
                .updatePost(vm.postId, post)
                .then(function (){
                    $location.url("/athlete/"+vm.userId+"/post/"+vm.postId);
                });
        }

        function getIframeSrc(videoId) {
            var url = 'https://www.youtube.com/embed/' + videoId
            return $sce.trustAsResourceUrl(url);
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }
    }
})();