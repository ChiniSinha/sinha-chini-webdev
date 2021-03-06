module.exports = function () {

    var model = null;
    var mongoose = require("mongoose");

    var PostSchema = require('./post.schema.server')();
    var PostModel = mongoose.model('PostModel', PostSchema);

    var api = {
        "createPost" : createPost,
        "findPostById" : findPostById,
        "findPostByUserId" : findPostByUserId,
        "updatePost" : updatePost,
        "deletePost" : deletePost,
        "deletePostForAthlete" : deletePostForAthlete,
        "setModel":setModel
    };

    return api;

    function createPost(userId, post) {
        return PostModel.create(post)
            .then(function (post) {
                return model.UserModel.findUserById(userId)
                    .then(function (user) {
                        user.posts.push(post._id);
                        post._user = user._id;
                        user.save();
                        post.save();
                        return post;
                    }, function (err) {
                        return err;
                    });
            }, function (err) {
                return err;
            });
    }

    function findPostById(postId) {
        return PostModel.findById(postId);
    }

    function findPostByUserId(userId) {
        return PostModel.find({
            '_user' : userId
        });
    }

    function updatePost(postId, post) {
        return PostModel.findByIdAndUpdate(postId, post, {new : true});
    }

    function deletePostForAthlete(athleteId) {
        return PostModel.remove({'_user' : athleteId});
    }
    function deletePost(postId) {
        return PostModel.findById(postId)
            .then(function (post) {
                return model.UserModel.findUserById(post._user)
                    .then(function (user) {
                        user.posts.pull(postId);
                        user.save();
                        return PostModel.findByIdAndRemove(postId);
                    })
            })
    }

    function setModel(_model) {
        model = _model;
    }
}