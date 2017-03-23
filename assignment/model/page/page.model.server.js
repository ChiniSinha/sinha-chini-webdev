module.exports = function () {

    var q = require('q');
    var model = null;
    var mongoose = require("mongoose");

    var PageSchema = require('./page.schema.server')();
    var PageModel = mongoose.model('PageModel', PageSchema);

    var api = {
        "createPage" : createPage,
        "findAllPagesForWebsite" : findAllPagesForWebsite,
        "findPageById" : findPageById,
        "updatePage" : updatePage,
        "deletePage" : deletePage,
        "setModel":setModel,
        "reorderWidget" : reorderWidget,
        "findAllWidgetsForPage" : findAllWidgetsForPage
    }
    
    return api;

    function findAllWidgetsForPage(pageId) {
        return PageModel.findById(pageId)
            .populate("widgets")
            .exec();
    }

    function reorderWidget(pageId, start, end) {
        var d = q.defer();
        return PageModel.findById(pageId)
            .then(function (page) {
                var final = page.widgets.splice(start-1, 1)[0];
                page.widgets.splice(end-1, 0, final);
                page.markModified('widgets');
                page.save(function (err, page) {
                    d.resolve(page);
                });

            }, function (err) {
                return err;
            });
        return d.promise;
    }

    function createPage(websiteId, page) {
        return PageModel.create(page)
            .then(function (page) {
                return model.WebsiteModel
                    .findWebsiteById(websiteId)
                    .then(function (website) {
                        website.pages.push(page._id);
                        page._website = website._id;
                        website.save();
                        page.save();
                        return page;
                    }, function (err) {
                        return err;
                    });
            }, function (err) {
                return err;
            });
    }

    function findAllPagesForWebsite(websiteId) {
        return PageModel.find({'_website' : websiteId});
    }
    
    function findPageById(pageId) {
        return PageModel.findById(pageId);
    }
    
    function updatePage(pageId, page) {
        return PageModel.findByIdAndUpdate(pageId, page, { new: true });
    }

    function deletePage(pageId) {
        return PageModel.findById(pageId).populate('_website')
            .then(function (page) {
                page._website.pages.splice(page._website.pages.indexOf(pageId), 1);
                page._website.save();
                return PageModel.findByIdAndRemove(pageId);
            }, function (err) {
                return err;
            });
    }



    function setModel(_model) {
        model = _model;
    }
}