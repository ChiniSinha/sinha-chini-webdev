module.exports = function (app, models) {

    var postModel = models.PostModel;

    var multer = require('multer');
    var multerS3 = require('multer-s3');

    var AWS = require('aws-sdk');
    var s3Bucket = new AWS.S3( { params: {Bucket: 'cs-web-dev'} } );

    var upload = multer({
        storage: multerS3({
            s3: s3Bucket,
            bucket: 'cs-web-dev',
            acl: 'public-read',
        })
    });

    var awsConfig = {
        secretAccessKey: process.env.AWS_ACCESS_KEY_ID,
        accessKeyId: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'us-east-1'
    };
    AWS.config.update(awsConfig);

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
            var location = myFile.location;
        }

        postModel
            .updatePost(postId, {'type': 'IMAGE', 'url': location, 'width': width })
            .then(function (post) {
                res.redirect("/project/#/athlete/"+userId+"/post/" + postId);
            }, function (err) {
                res.sendStatus(404);
            });
    }

}