module.exports = function (app, models) {

    var teamModel = models.TeamModel;

    app.post("/api/project/user/:userId/team", createTeam);
    app.get("/api/project/team/:teamId", findTeamById);
    app.get("/api/project/user/:userId/team", findTeamByCoachId);
    app.get("/api/project/school/:schoolId/team", findTeamBySchoolId);
    app.put("/api/project/team/:teamId", updateTeam);
    app.delete("/api/project/team/:teamId", deleteTeam);
    app.put("/api/project/addAthlete/:userId/team/:teamId", addPotentialAthlete);
    app.put("/api/project/removeAthlete/:userId/team/:teamId", removePotentialAthlete);

    function createTeam(req, res) {
        var userId = req.params.userId;
        var team = req.body;
        teamModel
            .createTeam(userId, team)
            .then(function (team) {
                res.send(team);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function findTeamById(req, res) {
        var teamId = req.params.teamId;
        teamModel
            .findTeamById(teamId)
            .then(function (team) {
                res.send(team);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function findTeamByCoachId(req, res) {
        var userId = req.params.userId;
        teamModel
            .findTeamByCoachId(userId)
            .then(function (team) {
                res.send(team);
            }, function (err) {
                res.sendStatus(404);
            })
    }

    function findTeamBySchoolId(req, res) {
        var schoolId = req.params.schoolId;
        teamModel
            .findTeamBySchoolId(schoolId)
            .then(function (teams) {
                res.send(teams);
            }, function (err) {
                res.sendStatus(404);
            })
    }

    function updateTeam(req, res) {
        var teamId = req.params.teamId;
        var team = req.body;
        teamModel
            .updateTeam(teamId, team)
            .then(function (team) {
                res.send(team);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function deleteTeam(req, res){
        var teamId = req.params.teamId;
        teamModel
            .deleteTeam(teamId)
            .then(function (team) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function addPotentialAthlete(req, res) {
        var teamId = req.params.teamId;
        var userId = req.params.userId;
        teamModel
            .addPotentialAthlete(teamId, userId)
            .then(function (team) {
                res.send(team);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function removePotentialAthlete(req, res) {
        var teamId = req.params.teamId;
        var userId = req.params.userId;
        teamModel
            .removePotentialAthlete(teamId, userId)
            .then(function (team) {
                res.send(team);
            }, function (err) {
                res.sendStatus(404);
            });
    }

}