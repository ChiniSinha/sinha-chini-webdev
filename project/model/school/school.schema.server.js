module.exports = function () {

    var mongoose = require('mongoose');

    var SchoolSchema = mongoose.Schema({
        name: String,
        description: String,
        state: String,
        city: String,
        teams: [{type: mongoose.Schema.Types.ObjectId, ref:'TeamModel'}],
        interestedStudents: [{type: mongoose.Schema.Types.ObjectId, ref:'UserModel'}],
        coaches: [{type: mongoose.Schema.Types.ObjectId, ref:'UserModel'}]
    }, {collection: 'project.school'});

    return SchoolSchema;

}