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
        "findTeamByAthleteId" : findTeamByAthleteId,
        "deleteTeamForCoach" : deleteTeamForCoach,
        "deleteTeamsForSchool" : deleteTeamsForSchool,
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
        return TeamModel.findOne({'_coach' : userId});
    }

    function findTeamBySchoolId(schoolId) {
        return TeamModel.find({'school' : schoolId});
    }

    function updateTeam(teamId, team) {
        return TeamModel.findByIdAndUpdate(teamId, team, {new : true});
    }

    function deleteTeam(teamId) {
        return TeamModel.findById(teamId)
            .then(function(team) {
                return model.UserModel.findUserById(team._coach)
                    .then(function (coach) {
                        return model.SchoolModel.findSchoolById(coach.school)
                            .then(function (school) {
                                school.teams.pull(coach.team);
                                school.save();
                                coach.team = undefined;
                                coach.save();
                                return model.UserModel.findAthletesByTeamId(team._id)
                                    .then(function (athletes) {
                                        return deleteTeamForAthletes(athletes, team._id);
                                    })
                            })
                    })
            }, function (err) {
                return err;
            })
    }

    function deleteTeamForAthletes(athletes, teamId) {
        if(athletes.length == 0){
            return TeamModel.remove({_id: teamId})
                .then(function (response) {
                    if(response.result.n == 1 && response.result.ok == 1){
                        return response;
                    }
                }, function (err) {
                    return err;
                });
        }

        return model.UserModel.removeTeamForAthlete(athletes.shift(), teamId)
            .then(function (response) {
                if(response.result.n == 1 && response.result.ok == 1){
                    return deleteTeamForAthletes(athletes, teamId);
                }
            }, function (err) {
                return err;
            });
    }

    function deleteTeamForCoach(coachId) {
        return TeamModel.remove({'_coach' : coachId});
    }

    function addPotentialAthlete(userId, teamId) {
        return TeamModel.findById(teamId)
            .then(function (team) {
                return model.UserModel.findUserById(userId)
                    .then(function (user) {
                        team.potentialAthletes.addToSet(user._id);
                        user.teams.push(team._id);
                        user.save();
                        team.save();
                        return team;
                    });
            });
    }

    function removePotentialAthlete(userId, teamId) {
        return TeamModel.findById(teamId)
            .then(function (team) {
                return model.UserModel
                    .findUserById(userId)
                    .then(function (user) {
                        team.potentialAthletes.pull(user._id);
                        user.teams.pull(team._id);
                        user.save();
                        team.save();
                        return team;
                    });
            });
    }

    function findTeamByAthleteId(athleteId) {
        return TeamModel.find({'potentialAthletes' : athleteId});
    }

    function deleteTeamsForSchool(schoolId) {
        return TeamModel.findById()
    }
    
    function setModel(_model) {
        model = _model;
    }
    
}