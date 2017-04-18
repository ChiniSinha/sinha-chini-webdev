module.exports = function () {

    var mongoose = require("mongoose");
    var model = null;


    var TeamSchema = require('./team.schema.server')();
    var TeamModel = mongoose.model('TeamModel', TeamSchema);

    var api = {
        "createTeam" : createTeam,
        "findTeamById" : findTeamById,
        "findTeamByCoachId" : findTeamByCoachId,
        "findTeamBySchoolId" : findTeamBySchoolId,
        "updateTeam" : updateTeam,
        "deleteTeam" : deleteTeam,
        "addPotentialAthlete" : addPotentialAthlete,
        "removePotentialAthlete" : removePotentialAthlete,
        "setModel":setModel
    };

    return api;

    function createTeam(userId, team) {
        return TeamModel
            .create(team)
            .then(function (team) {
                return model.UserModel
                    .findUserById(userId)
                    .then(function (user) {
                        return model.SchoolModel
                            .findSchoolById(user.school)
                            .then(function (school) {
                                team._coach = user._id;
                                team.school = user.school;
                                user.team = team._id;
                                school.teams.push(team._id);
                                user.save();
                                school.save();
                                return team.save();
                            });
                    }, function (err) {
                        return err;
                    });
            }, function (err) {
                return err;
            });
    }

    function findTeamById(teamId) {
        return TeamModel.findById(teamId);
    }

    function findTeamByCoachId(userId) {
        return TeamModel.find({
            'coach' : userId
        });
    }

    function findTeamBySchoolId(schoolId) {
        return TeamModel.find({'school' : schoolId});
    }

    function updateTeam(teamId, team) {
        return TeamModel.findByIdAndUpdate(teamId, team, {new : true});
    }

    function deleteTeam(teamId) {
        return TeamModel.findByIdAndRemove(teamId);
    }

    function addPotentialAthlete(teamId, userId) {
        return TeamModel.findById(teamId)
            .then(function (team) {
                return model.UserModel.findById(userId)
                    .then(function (user) {
                        team.potentialAthletes.push(user._id);
                        return team.save();
                    });
            });
    }

    function removePotentialAthlete(teamId, userId) {
        return TeamModel.findById(teamId)
            .then(function (team) {
                return model.UserModel.findById(userId)
                    .then(function (user) {
                        team.potentialAthletes.pull(user._id);
                        return team.save();
                    });
            });
    }

    function setModel(_model) {
        model = _model;
    }
    
}