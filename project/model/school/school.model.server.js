module.exports = function () {

    var model = null;
    var mongoose = require("mongoose");

    var SchoolSchema = require('./school.schema.server')();
    var SchoolModel = mongoose.model('SchoolModel', SchoolSchema);

    var api = {
        "createSchool" : createSchool,
        "findSchoolById" : findSchoolById,
        "searchSchoolByName" : searchSchoolByName,
        "updateSchool" : updateSchool,
        "deleteSchool" : deleteSchool,
        "addInterestedAthlete" : addInterestedAthlete,
        "removeInterestedAthlete" : removeInterestedAthlete,
        "addCoach" : addCoach,
        "removeCoach" : removeCoach,
        "findSchoolByAthleteId" : findSchoolByAthleteId,
        "findAllSchoolByAthleteId" : findAllSchoolByAthleteId,
        "findAllSchoolForAdmin" : findAllSchoolForAdmin,
        "setModel":setModel
    };

    return api;

    function createSchool(school) {
        return SchoolModel.create(school);
    }

    function findSchoolById(schoolId) {
        return SchoolModel.findById(schoolId);
    }

    function searchSchoolByName(name) {
        if(name != 'undefined') {
            return SchoolModel.find({
                'name': {'$regex': new RegExp(name), '$options': 'i'}
            });
        } else {
            return SchoolModel.find();
        }
    }

    function updateSchool(schoolId, school) {
        return SchoolModel.findByIdAndUpdate(schoolId, school, {new : true});
    }

    function deleteSchool(schoolId) {
        return SchoolModel.findById(schoolId)
            .then(function (school) {
                return model.UserModel.findAthletesBySchoolId(school._id)
                    .then(function (athletes) {
                        return deleteSchoolForAthletes(athletes, school._id);
                    })
            })
    }

    function deleteSchoolForAthletes(athletes, schoolId) {
        if(athletes.length == 0) {
            return SchoolModel.findById(schoolId)
                .then(function (school) {
                    return model.UserModel.findAllCoachBySchoolId(school._id)
                        .then(function (coaches) {
                            return deleteCoachesForSchool(coaches, school._id);
                        })
                })
        }
        return removeSchoolForAthlete(athletes.shift(), schoolId)
            .then(function (response) {
                return deleteSchoolForAthletes(athletes, schoolId);
            }, function (err) {
                return err;
            });
    }

    function deleteCoachesForSchool(coaches, schoolId) {
        if(coaches.length == 0) {
            return SchoolModel.findByIdAndRemove(schoolId)
                .then(function (response) {
                    return response;
                }, function (err) {
                    return err;
                });
        }
        return model.UserModel.deleteUser(coaches.shift())
            .then(function (response) {
                return deleteCoachesForSchool(coaches, schoolId);
            }, function (err) {
                return err;
            });
    }

    function removeSchoolForAthlete(athleteId, schoolId) {
        return model.UserModel.findUserById(athleteId)
            .then(function (athlete) {
                athlete.interestedSchool.pull(schoolId);
                athlete.save();
                return athlete;
            })
    }

    function addInterestedAthlete(schoolId, userId) {
        return SchoolModel
            .findById(schoolId)
            .then(function (school) {
                return model.UserModel
                    .findUserById(userId)
                    .then(function (user) {
                        school.interestedStudents.push(user._id);
                        user.interestedSchool.push(school._id);
                        user.save();
                        school.save();
                        return school;
                    },function (err) {
                        return err;
                    });
            });
    }

    function removeInterestedAthlete(userId, schoolId) {
        return SchoolModel
            .findById(schoolId)
            .then(function (school) {
                return model.UserModel
                    .findUserById(userId)
                    .then(function (user) {
                        school.interestedStudents.pull(user._id);
                        user.interestedSchool.pull(school._id);
                        user.save();
                        school.save();
                        return school;
                    });
            })
    }

    function addCoach(schoolId, userId) {
        return SchoolModel.findById(schoolId)
            .then(function (school) {
                model.UserModel.findById(userId)
                    .then(function (user) {
                        school.coaches.push(user._id);
                        return school.save();
                    });
            });
    }

    function removeCoach(schoolId, userId) {
        return SchoolModel.findById(schoolId)
            .then(function (school) {
                model.UserModel.findById(userId)
                    .then(function (user) {
                        school.coaches.pull(user._id);
                        return school.save();
                    });
            });
    }

    function findSchoolByAthleteId(schoolId, userId) {
        return SchoolModel.find({'_id': schoolId, 'interestedStudents': userId});
    }

    function findAllSchoolByAthleteId(userId) {
        return SchoolModel.find({'interestedStudents': userId});
    }

    function findAllSchoolForAdmin() {
        return SchoolModel.find();
    }

    function setModel(_model) {
        model = _model;
    }

}