module.exports = function () {

    var userModel = require('./user/user.model.server')();
    var websiteModel = require('./website/website.model.server')();
    var pageModel = require('./page/page.model.server')();
    var widgetModel = require('./widget/widget.model.server')();

    var models = {
        UserModel: userModel,
        WebsiteModel: websiteModel,
        PageModel: pageModel,
        WidgetModel: widgetModel
    };

    userModel.setModel(models);
    websiteModel.setModel(models);
    pageModel.setModel(models);
    widgetModel.setModel(models);

    return models;
}