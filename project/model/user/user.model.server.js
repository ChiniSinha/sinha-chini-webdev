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
        "unFollowAthlete": unFollowAthlete,
        "findAllUsers" : findAllUsers,
        "findAthletesByTeamId" : findAthletesByTeamId,
        "findAthletesBySchoolId" : findAthletesBySchoolId,
        "findAllCoachBySchoolId" : findAllCoachBySchoolId,
        "findAllCoachesByAthleteId" : findAllCoachesByAthleteId,
        "findAllAthletesByCoachId" : findAllAthletesByCoachId,
        "findCoachByAthleteId" : findCoachByAthleteId,
        "findAthleteByCoachId" : findAthleteByCoachId
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
        return UserModel
            .findById(athleteId)
            .then(function (athlete) {
                return UserModel.findById(coachId)
                    .then(function (coach) {
                        athlete.followedBy.push(coach._id);
                        coach.follows.push(athlete._id);
                        athlete.save();
                        coach.save();
                        return athlete;
                    }, function (err) {
                        return err;
                    });
            }, function (err) {
                return err;
            });
    }

    function unFollowAthlete(coachId, athleteId) {
        return UserModel
            .findById(athleteId)
            .then(function (athlete) {
                return UserModel.findById(coachId)
                    .then(function (coach) {
                        athlete.followedBy.pull(coach._id);
                        coach.follows.pull(athlete._id);
                        athlete.save();
                        coach.save();
                        return athlete;
                    }, function (err) {
                        return err;
                    });
            }, function (err) {
                return err;
            });
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

    function findAllCoachesByAthleteId(athleteId) {
        return UserModel.find({'follows' : athleteId});
    }

    function findAllAthletesByCoachId(coachId) {
        return UserModel.find({'followedBy' : coachId});
    }

    function findCoachByAthleteId(coachId, athleteId) {
        return UserModel.find({'_id': coachId, 'follows': athleteId});
    }
    function findAthleteByCoachId(athleteId, coachId) {
        return UserModel.find({'_id': athleteId, 'followedBy': coachId});
    }

}