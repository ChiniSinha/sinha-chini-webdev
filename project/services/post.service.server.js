module.exports = function (app, models) {

    var postModel = models.PostModel;

    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    app.post("/api/project/user/:userId/post", createPost);
    app.get("/api/project/user/:userId/post", findPostByUserId);
    app.get("/api/project/post/:postId", findPostById);
    app.put("/api/project/post/:postId", updatePost);
    app.delete("/api/project/post/:postId", deletePost);
    app.post('/api/project/post/upload', upload.single('myFile'), uploadImage);

    function createPost(req, res) {
        var post = req.body;
        var userId = req.params.userId;

        postModel
            .createPost(userId, post)
            .then(function (post) {
                res.send(post);
            }, function (err) {
                res.sendStatus('500');
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

    function uploadImage(req, res){

        var postId = req.body.postId;
        var userId = req.body.userId;
        var width = req.body.width;

        if(req.file) {
            var myFile = req.file;
            var originalname = myFile.originalname; // File name on user's computer
            var filename = myFile.filename; // new file name in upload folder
            var path = myFile.path;         // full path of uploaded file
            var destination = myFile.destination;  // folder where file is saved to
            var size = myFile.size;
            var mimetype = myFile.mimetype;
        }

        var url = "/uploads/" + filename;
        postModel
            .updatePost(postId, {'type': 'IMAGE', 'url': url, 'width': width })
            .then(function (post) {
                res.redirect("/project/#/athlete/"+userId+"/post/" + postId);
            }, function (err) {
                res.sendStatus(404);
            });
    }

}