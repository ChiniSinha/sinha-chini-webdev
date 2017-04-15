module.exports = function () {

    var userModel = require('./user/user.model.server')();
    var postModel = require('./post/post.model.server')();
    var schoolModel = require('./school/school.model.server')();
    var teamModel = require('./team/team.model.server')();

    var models = {
        UserModel: userModel,
        PostModel: postModel,
        SchoolModel: schoolModel,
        TeamModel: teamModel
    };

    userModel.setModel(models);
    postModel.setModel(models);
    schoolModel.setModel(models);
    teamModel.setModel(models);

    return models;
}