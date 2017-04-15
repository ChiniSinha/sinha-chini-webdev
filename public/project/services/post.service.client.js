(function () {
    angular
        .module("RecruiterWeb")
        .factory("PostService", postService);

    function postService($http) {

        var api = {
            "createPost" : createPost,
            "findPostByUserId" : findPostByUserId,
            "findPostById" : findPostById,
            "updatePost" : updatePost,
            "deletePost" : deletePost
        };
        return api;

        function createPost(userId, post) {
            return $http.post("/api/project/user/" + userId + "/post", post);
        }

        function findPostByUserId(userId) {
            return $http.get("/api/project/user/" + userId + "/post");
        }

        function findPostById(postId) {
            return $http.get("/api/project/post/" + postId);
        }

        function updatePost(postId, post) {
            return $http.put("/api/project/post/"+ postId, post);
        }

        function deletePost(postId) {
            return $http.delete("/api/project/post/" + postId);
        }
        
    }

})();