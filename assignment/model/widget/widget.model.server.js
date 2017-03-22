module.exports = function () {

    var model = null;
    var mongoose = require("mongoose");

    var WidgetSchema = require('./widget.schema.server')();
    var WidgetModel = mongoose.model('WidgetModel', WidgetSchema);

    var api = {
        "createWidget" : createWidget,
        "findAllWidgetsForPage" : findAllWidgetsForPage,
        "findWidgetById" : findWidgetById,
        "updateWidget" : updateWidget,
        "deleteWidget" : deleteWidget,
        "reorderWidget" : reorderWidget,
        "setModel":setModel
    };
    
    return api;
    
    function createWidget(pageId, widget) {
        return WidgetModel
            .create(widget)
            .then(function (widget) {
                return model.PageModel
                    .findPageById(pageId)
                    .then(function (page) {
                        page.widgets.push(widget._id);
                        widget._page = page._id;
                        page.save();
                        widget.save();
                        return widget;
                    }, function (err) {
                        return err;
                    });
            }, function (err) {
                return err;
            })
    }
    
    function findAllWidgetsForPage(pageId) {
        return model.PageModel
            .findPageById(pageId)
            .then(function (page) {
                return WidgetModel.find({'_id' : {$in : page.widgets}})
            });
    }
    
    function findWidgetById(widgetId) {
        return WidgetModel.findById(widgetId);
    }

    function updateWidget(widgetId, widget) {
        return WidgetModel.findByIdAndUpdate(widgetId, widget);
    }
    
    function deleteWidget(widgetId) {
        return WidgetModel.findByIdAndRemove(widgetId);
    }

    function reorderWidget(pageId, start, end) {
        return model.PageModel
            .findPageById(pageId)
            .then(function (page) {
                var widgets = page.widgets;
                widgets.splice(end, 0, widgets.splice(start, 1)[0]);
                page.widgets = widgets;
                return page.save();
            }, function (err) {
                return err;
            })
    }

    function setModel(_model) {
        model = _model;
    }

}