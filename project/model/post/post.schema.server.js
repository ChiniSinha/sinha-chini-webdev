module.exports = function () {

    var mongoose = require('mongoose');

    var PostSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.Types.ObjectId, ref:'UserModel'},
        title: String,
        description: String,
        url: String,
        width: String
    }, {collection: 'project.post'});

    return PostSchema;

}