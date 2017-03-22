module.exports = function () {

    var model = null;
    var mongoose = require("mongoose");

    var WebsiteSchema = require('./website.schema.server')();
    var WebsiteModel = mongoose.model('WebsiteModel', WebsiteSchema);

    var api = {
        "createWebsiteForUser" : createWebsiteForUser,
        "findAllWebsitesForUser" : findAllWebsitesForUser,
        "findWebsiteById" : findWebsiteById,
        "updateWebsite" : updateWebsite,
        "deleteWebsite" : deleteWebsite,
        "setModel":setModel
    }

    return api;
    
    function createWebsiteForUser(userId, website) {
        return WebsiteModel
            .create(website)
            .then(function (website) {
                return model.UserModel
                    .findUserById(userId)
                    .then(function (user) {
                        user.websites.push(website._id);
                        website._user = user._id;
                        website.save();
                        user.save();
                        return website;
                    }, function (err) {
                        return err;
                    });
            }, function (err) {
                return err;
            })
    }

    function findAllWebsitesForUser(userId) {
        return WebsiteModel.find({'_user' : userId});
    }

    function findWebsiteById(websiteId) {
        return WebsiteModel.findById(websiteId);
    }
    
    function updateWebsite(websiteId, website) {
        return WebsiteModel.findByIdAndUpdate(websiteId, website, { new: true });
    }

    function deleteWebsite(websiteId) {
        return WebsiteModel.findById(websiteId).populate('_user')
            .then(function (website) {
                website._user.websites.splice(website._user.websites.indexOf(websiteId), 1);
                website._user.save();
                return WebsiteModel.findByIdAndRemove(websiteId);
            }, function (err) {
                return err;
            });
    }

    function setModel(_model) {
        model = _model;
    }

}