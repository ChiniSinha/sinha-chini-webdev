module.exports = function (app, models) {

    var postModel = models.PostModel;

    app.post("/api/project/user/:userId/post", createPost);
    app.get("/api/project/user/:userId/post", findPostByUserId);
    app.get("/api/project/post/:postId", findPostById);
    app.put("/api/project/post/:postId", updatePost);
    app.delete("/api/project/post/:postId", deletePost);

    function createPost(req, res) {
        var post = req.body;
        var userId = req.params.userId;

        postModel
            .createPost(userId, post)
            .then(function (post) {
                res.send(post);
            }, function (err) {
                res.sendStatus('500').send(err);
            });
    }

    function findPostByUserId(req, res) {
        var userId = req.params.userId;
        postModel
            .findPostByUserId(userId)
            .then(function (posts) {
                res.send(posts);
            }, function (err) {
                res.sendStatus(404);
            })
    }

    function findPostById(req, res) {
        var postId = req.params.postId;
        postModel
            .findPostById(postId)
            .then(function (post) {
                res.send(post);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function updatePost(req, res) {
        var postId = req.params.postId;
        var post = req.body;

        postModel
            .updatePost(postId, post)
            .then(function (post) {
                res.send(post);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function deletePost(req, res){
        var postId = req.params.postId;

        postModel
            .deletePost(postId)
            .then(function (post) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(404);
            });
    }

}