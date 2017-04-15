module.exports = function (app, models) {

    var schoolModel = models.SchoolModel;

    app.post("/api/project/school", createSchool);
    app.get("/api/project/school/:schoolId", findSchoolById);
    app.get("/api/project/school", searchSchoolByName);
    app.put("/api/project/school/:schoolId", updateSchool);
    app.delete("/api/project/school/:schoolId", deleteSchool);
    app.put("/api/project/addAthlete/:userId/school/:schoolId", addInterestedAthlete);
    app.put("/api/project/removeAthlete/:userId/school/:schoolId", removeInterestedAthlete);
    app.put("/api/project/addCoach/:userId/school/:schoolId", addCoach);
    app.put("/api/project/removeCoach/:userId/school/:schoolId", removeCoach);


    function createSchool(req, res) {
        var school = req.body;
        schoolModel
            .createSchool(school)
            .then(function (school) {
                res.send(school);
            }, function (err) {
                res.sendStatus('500').send(err);
            });
    }

    function findSchoolById(req, res) {
        var schoolId = req.params.schoolId;
        schoolModel
            .findSchoolById(schoolId)
            .then(function (school) {
                res.send(posts);
            }, function (err) {
                res.sendStatus(404);
            })
    }

    function searchSchoolByName(req, res) {
        var userId = req.params.userId;
        var name = req.query.name;
        schoolModel
            .searchSchoolByName(name)
            .then(function (schools) {
                res.send(schools);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function updateSchool(req, res) {
        var schoolId = req.params.schoolId;
        var school = req.body;
        schoolModel
            .updateSchool(schoolId, school)
            .then(function (school) {
                res.send(school);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function deleteSchool(req, res){
        var schoolId = req.params.schoolId;
        schoolModel
            .deleteSchool(schoolId)
            .then(function (school) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function addInterestedAthlete(req, res) {
        var schoolId = req.params.schoolId;
        var userId = req.params.userId;
        schoolModel
            .addInterestedAthlete(schoolId, userId)
            .then(function (school) {
                res.send(school);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function removeInterestedAthlete(req, res) {
        var schoolId = req.params.schoolId;
        var userId = req.params.userId;
        schoolModel
            .removeInterestedAthlete(schoolId, userId)
            .then(function (school) {
                res.send(school);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function addCoach(req, res) {
        var schoolId = req.params.schoolId;
        var userId = req.params.userId;
        schoolModel
            .addCoach(schoolId, userId)
            .then(function (school) {
                res.send(school);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function removeCoach(req, res) {
        var schoolId = req.params.schoolId;
        var userId = req.params.userId;
        schoolModel
            .removeCoach(schoolId, userId)
            .then(function (school) {
                res.send(school);
            }, function (err) {
                res.sendStatus(404);
            });
    }

}