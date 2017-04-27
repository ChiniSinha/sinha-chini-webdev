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
        "findAthleteByCoachId" : findAthleteByCoachId,
        "filterAthletesInTeam" : filterAthletesInTeam,
        "searchUserByFirstName" : searchUserByFirstName,
        "findUserByPostId" : findUserByPostId,
        "removeTeamForAthlete" : removeTeamForAthlete
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
        return UserModel.findById(userId)
            .then(function (user) {
                if(user.role == 'ATHLETE') {
                    return deleteAthlete(userId);
                } else if(user.role == 'COACH'){
                    return deleteCoach(userId);
                } else {
                    return deleteAdmin(userId);
                }
            })
    }

    function deleteCoach(userId) {
        return UserModel.findById(userId)
            .then(function(coach) {
                return model.SchoolModel.findSchoolById(coach.school)
                    .then(function (school) {
                        school.coaches.pull(coach._id);
                        school.save();
                        return findAllAthletesByCoachId(coach._id)
                            .then(function (althletes) {
                                return deleteCoachForAthletes(althletes, coach._id);
                            });
                        })
            })
    }

    // Helper method for delete
    function deleteCoachForAthletes(athletes, coachId) {
        if(athletes.length == 0){
            return UserModel.findById(coachId)
                .then(function (coach) {
                    if(coach.team) {
                        return removeTeamForCoach(coachId)
                            .then(function (coach) {
                                return UserModel.findByIdAndRemove(coach._id)
                                    .then(function (response) {
                                        return response;
                                    }, function (err) {
                                        return err;
                                    });
                            })
                    } else {
                        return UserModel.findByIdAndRemove(coach._id)
                            .then(function (response) {
                                return response;
                            }, function (err) {
                                return err;
                            });
                    }
                })
        }

        return removeFollowedCoachForAthlete(athletes.shift(), coachId)
            .then(function (response) {
                if(response.result.n == 1 && response.result.ok == 1){
                    return deleteCoachForAthletes(athletes, coachId);
                }
            }, function (err) {
                return err;
            });
    }

    // Helper method for delete
    function removeFollowedCoachForAthlete(athleteId, coachId) {
        return UserModel.findById(athleteId)
            .then(function (athlete) {
                athlete.followedBy.pull(coachId);
                athlete.save();
                return athlete;
            })
    }

    function deleteAthlete(userId) {
        return UserModel.findById(userId)
            .then(function(athlete) {
                return model.PostModel.deletePostForAthlete(athlete._id)
                    .then(function () {
                        return findAllCoachesByAthleteId(athlete._id)
                            .then(function (coaches) {
                                return deleteAthleteForCoaches(coaches, athlete._id);
                            });
                    })
            })
    }

    function deleteAthleteForCoaches(coaches, athleteId) {
        if(coaches.length == 0) {
            return UserModel.findById(athleteId)
                .then(function (athlete) {
                    return model.SchoolModel.findAllSchoolByAthleteId(athlete._id)
                        .then(function (schools) {
                            return deleteAthleteFromSchool(schools, athlete._id)
                        })
                })
        }
        return removeFollowedAthleteForCoach(coaches.shift(), athleteId)
            .then(function (response) {
                return deleteAthleteForCoaches(coaches, athleteId);
            }, function (err) {
                return err;
            });
    }

    function removeFollowedAthleteForCoach(coachId, athleteId) {
        return UserModel.findById(coachId)
            .then(function (coach) {
                coach.follows.pull(athleteId);
                coach.save();
                return coach;
            })
    }

    function deleteAthleteFromSchool(schools, athleteId) {
        if(schools.length == 0) {
            return UserModel.findByIdAndRemove(athleteId)
                .then(function (response) {
                    return response;
                }, function (err) {
                    return err;
                });
        }
        return removeInterestedAthleteFromSchool(schools.shift(), athleteId)
            .then(function (response) {
                return deleteAthleteForCoaches(coaches, athleteId);
            }, function (err) {
                return err;
            });
    }

    function removeInterestedAthleteFromSchool(schoolId, athleteId) {
        return model.SchoolModel.findSchoolById(schoolId)
            .then(function (school) {
                school.interestedStudents.pull(athleteId);
                school.save();
                return school;
            })
    }

    function deleteAdmin(userId) {
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
    
    function filterAthletesInTeam(coachId, teamId) {
        return UserModel.findById(coachId)
            .then(function (user) {
                return model.TeamModel.findTeamById(teamId)
                    .then(function (team) {
                        var users = user.follows.filter(function(obj) {
                            return team.potentialAthletes.indexOf(obj) == -1; });
                        return UserModel.find({'_id' : {'$in' : users}});
                    });
            });
    }

    function searchUserByFirstName(name) {
        if(name != 'undefined') {
            return UserModel.find({
                'firstName': {'$regex': new RegExp(name), '$options': 'i'}
            });
        } else {
            return UserModel.find();
        }
    }

    function findUserByPostId(postId) {
        UserModel.findOne({'posts' : postId});
    }

    function removeTeamForAthlete(athleteId, teamId) {
        UserModel.findById(athleteId)
            .then(function (athlete) {
                athlete.teams.pull(teamId);
                athlete.save();
                return athlete;
            })
    }

    function removeTeamForCoach(coachId) {
        return UserModel.findById(coachId)
            .then(function (coach) {
                return model.TeamModel.deleteTeam(coach.team)
                    .then(function () {
                        return coach;
                    })
            })
    }

}