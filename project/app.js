module.exports = function (app) {

    var models = require('./model/models.server')();

    require('./services/user.service.server.js')(app, models);
    require('./services/post.service.server.js')(app, models);
    require('./services/school.service.server.js')(app, models);
    require('./services/team.service.server.js')(app, models);

};