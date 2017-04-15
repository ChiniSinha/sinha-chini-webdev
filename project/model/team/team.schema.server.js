module.exports = function () {

    var mongoose = require('mongoose');

    var TeamSchema = mongoose.Schema({
        _coach: {type: mongoose.Schema.Types.ObjectId, ref:'UserModel'},
        school: {type: mongoose.Schema.Types.ObjectId, ref:'SchoolModel'},
        name: String,
        description: String,
        potentialAthletes: [{type: mongoose.Schema.Types.ObjectId, ref:'UserModel'}]
    }, {collection: 'project.team'});

    return TeamSchema;

}