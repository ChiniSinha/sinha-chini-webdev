module.exports = function () {

    var mongoose = require('mongoose');

    var UserSchema = mongoose.Schema({
        username: {type: String, required: true},
        password: {type: String},
        firstName: String,
        lastName: String,
        about: String,
        gender: {type: String, enum: ['MALE', 'FEMALE', 'UNDEFINED'], default: 'UNDEFINED'},
        phone: String,
        photo: String,
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
        follows: [{type: mongoose.Schema.Types.ObjectId, ref:'UserModel'}],
        role: {type: String, enum: ['ADMIN', 'ATHLETE', 'COACH'], default: 'ATHLETE'}
    }, {collection: 'project.user'});

    return UserSchema;

}