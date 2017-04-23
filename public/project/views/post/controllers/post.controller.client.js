(function () {
    angular
        .module("RecruiterWeb")
        .controller("PostListController", PostListController)
        .controller("PostNewController", PostNewController)
        .controller("PostEditController", PostEditController)
        .controller("AdminPostEditController", AdminPostEditController)

    function PostListController(PostService, UserService, $routeParams, $sce, $location) {
        var vm = this;

        // Event Handlers
        vm.doYouTrustUrl = doYouTrustUrl;
        vm.logout = logout;

        vm.userId = $routeParams.userId;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (user) {
                    if (user) {
                        PostService
                            .findPostByUserId(vm.userId)
                            .success(function (posts) {
                                vm.posts = posts;
                                if (vm.posts.length == 0) {
                                    vm.error = "No Posts found!";
                                }
                            });
                    } else {
                        $location.url('/home');
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
            UserService
                .getCurrentUser()
                .success(function (user) {
                    if(!user) {
                        $location.url('/home');
                    }
                })
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

    function PostEditController(PostService, UserService, $location, $routeParams) {
        var vm = this;

        // Event Handlers
        vm.logout = logout;
        vm.updatePost = updatePost;
        vm.deletePost = deletePost;

        vm.userId = $routeParams.userId;
        vm.postId = $routeParams.postId;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (user) {
                    if(user) {
                        PostService
                            .findPostById(vm.postId)
                            .success(function (post) {
                                vm.post = post;
                            });
                    } else {
                        $location.url('/home');
                    }
                })
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

    function AdminPostEditController(PostService, UserService, $routeParams, $sce, $location, $route) {
        var vm = this;

        // Event Handlers
        vm.doYouTrustUrl = doYouTrustUrl;
        vm.deletePost = deletePost;
        vm.logout = logout;

        vm.adminId = $routeParams.adminId;
        vm.athleteId = $routeParams.athleteId;

        function init() {
            UserService
                .getCurrentUser()
                .success(function (admin) {
                    if (admin) {
                        PostService
                            .findPostByUserId(vm.athleteId)
                            .success(function (posts) {
                                vm.posts = posts;
                                if (vm.posts.length == 0) {
                                    vm.error = "No Posts By User found!";
                                }
                            });
                    } else {
                        $location.url('/home');
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

        function deletePost(postId) {
            PostService
                .deletePost(postId)
                .success(function () {
                    $route.reload();
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