(function () {
    angular
        .module("RecruiterWeb")
        .controller("PostListController", PostListController)
        .controller("PostNewController", PostNewController)
        .controller('PostEditController', PostEditController)

    function PostListController(PostService, UserService, $routeParams, $sce, $location) {
        var vm = this;

        // Event Handlers
        vm.doYouTrustUrl = doYouTrustUrl;
        vm.doYouTrustHtml = doYouTrustHtml;
        vm.logout = logout;

        vm.userId = $routeParams.userId;

        function init() {
            PostService
                .findPostByUserId(vm.userId)
                .success(function (posts) {
                    vm.posts = posts;
                    if (vm.posts.length == 0) {
                        vm.error = "No Posts found!";
                    }
                })
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

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }
    }
    
    function PostNewController(PostService, UserService, $location, $routeParams) {
        var vm = this;

        // Event Handlers
        vm.createImage = createImage;
        vm.createYoutube = createYoutube;
        vm.logout = logout;

        vm.userId = $routeParams.userId;

        function init() {
        }
        init();

        function createImage(post) {
            post.type = 'IMAGE';
            PostService
                .createPost(vm.userId, post)
                .success(function (post) {
                    vm.post = post;
                    $location.url('/athlete/'+vm.userId+'/post/'+vm.post._id);
            });
        }

        function createYoutube(post) {
            post.type = 'YOUTUBE';
            PostService
                .createPost(vm.userId, post)
                .success(function (post) {
                    vm.post = post;
                    $location.url('/athlete/'+vm.userId+'/post/'+vm.post._id);
            })
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }
    }

    function PostEditController(PostService, $location, $routeParams) {
        var vm = this;

        // Event Handlers
        vm.logout = logout;
        vm.updatePost = updatePost;
        vm.deletePost = deletePost;

        vm.userId = $routeParams.userId;
        vm.postId = $routeParams.postId;

        function init() {
            PostService
                .findPostById(vm.postId)
                .success(function (post) {
                    vm.post = post;
                });
        }

        init();

        function updatePost(post) {
            PostService
                .updatePost(vm.postId, post)
                .success(function (post) {
                    vm.post = post;
                    $location.url('/athlete/' + vm.userId + '/post');
                })
                .error(function (err) {
                    vm.error = "Error updating post!";
                })
        }

        function deletePost(postId) {
            PostService
                .deletePost(postId)
                .success(function () {
                    $location.url('/athlete/' + vm.userId + '/post');
                })
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/home');
                });
        }

    }


})();