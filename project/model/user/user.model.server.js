module.exports = function () {

    var model = null;
    var q = require('q');
    var mongoose = require("mongoose");

    var UserSchema = require('./user.schema.server')();
    var UserModel = mongoose.model('UsersModel', UserSchema);

    var api = {
        "createUser" : createUser,
        "findUserById" : findUserById,
        "findUserByUsername" : findUserByUsername,
        "findUserByCredentials" : findUserByCredentials,
        "updateUser" : updateUser,
        "deleteUser" : deleteUser,
        "setModel":setModel,
        "findUserByGoogleId": findUserByGoogleId,
        "findUserByFacebookId" : findUserByFacebookId,
        "followAthlete": followAthlete,
        'addFollowedByCoach': addFollowedByCoach,
        "unFollowAthlete": unFollowAthlete,
        'removeFollowedByCoach': removeFollowedByCoach,
        "findAllUsers" : findAllUsers,
        "findAthletesByTeamId" : findAthletesByTeamId,
        "findAthletesBySchoolId" : findAthletesBySchoolId,
        "findAllCoachBySchoolId" : findAllCoachBySchoolId
    };

    return api;

    function createUser(user) {
        return UserModel.create(user);
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function findUserByUsername(username) {
        return UserModel.findOne({
            'username' : username
        });
    }

    function findUserByCredentials(username, password) {
        return UserModel.findOne({
            'username' : username,
            'password' : password
        });
    }

    function updateUser(userId, user) {
        return UserModel.findByIdAndUpdate(userId, user, {new : true});
    }

    function deleteUser(userId) {
        return UserModel.findByIdAndRemove(userId);
    }

    function setModel(_model) {
        model = _model;
    }

    function findUserByGoogleId(googleId) {
        return UserModel.findOne({
            'google.id': googleId
        });
    }

    function findUserByFacebookId(faceBookId) {
        return UserModel.findOne({
            'facebook.id': faceBookId
        });
    }
    
    function followAthlete(coachId, athleteId) {
        return UserModel.findById(coachId)
            .then(function (coach) {
                return UserModel.findById(athleteId)
                    .then(function (athlete) {
                        coach.follows.push(athlete._id);
                        return coach.save();
                    })
            })
    }

    function addFollowedByCoach(coachId, athleteId) {
        return UserModel.findOne({'_id':athleteId})
            .then(function (athlete) {
                athlete.followedBy.push(coachId);
                return athlete.save();
            })
    }

    function unFollowAthlete(coachId, athleteId) {
        return UserModel.findById(coachId)
            .then(function (coach) {
                return UserModel.findById(athleteId)
                    .then(function (athlete) {
                        coach.follows.pull(athlete._id);
                        return coach.save();
                    })
            })
    }

    function removeFollowedByCoach(coachId, athlete) {
        return UserModel.findOne({'_id':athlete._id})
            .then(function (athlete) {
                athlete.followedBy.pull(coachId);
                return athlete.save();
            })
    }

    function findAllUsers() {
        return UserModel.find();
    }

    function findAthletesByTeamId(teamId) {
        return UserModel.find({'teams' : teamId});
    }

    function findAthletesBySchoolId(schoolId) {
        return UserModel.find({'interestedSchool' : schoolId});
    }

    function findAllCoachBySchoolId(schoolId) {
        return UserModel.find({'school' : schoolId});
    }

}