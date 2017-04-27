module.exports = function () {

    var mongoose = require('mongoose');

    var UserSchema = mongoose.Schema({
        username: {type: String, required: true},
        password: {type: String},
        firstName: String,
        lastName: String,
        about: String,
        gradYear: Number,
        phone: String,
        photo: {type: String, default: 'http://sinha-chini-webdev.herokuapp.com/images/default-image.jpg'},
        email: String,
        google: {
            id: String
        },
        facebook: {
            id: String
        },
        posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'PostModel'}],
        interestedSchool: [{type: mongoose.Schema.Types.ObjectId, ref:'SchoolModel'}],
        school: {type: mongoose.Schema.Types.ObjectId, ref:'SchoolModel'},
        team: {type: mongoose.Schema.Types.ObjectId, ref:'TeamModel'},
        teams: [{type: mongoose.Schema.Types.ObjectId, ref:'TeamModel'}],
        follows: [{type: mongoose.Schema.Types.ObjectId, ref:'UserModel'}],
        followedBy: [{type: mongoose.Schema.Types.ObjectId, ref:'UserModel'}],
        role: {type: String, enum: ['ADMIN', 'ATHLETE', 'COACH'], default: 'ATHLETE'}
    }, {collection: 'project.user'});

    return UserSchema;

}