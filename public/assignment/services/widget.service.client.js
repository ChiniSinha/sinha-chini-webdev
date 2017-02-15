(function () {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", widgetService);

    function widgetService() {
        var widgets = [
                { _id: "123", widgetType: "HEADING", pageId: "321", size: 2, text: "GIZMODO"},
                { _id: "234", widgetType: "HEADING", pageId: "321", size: 4, text: "Lorem ipsum"},
                { _id: "345", widgetType: "IMAGE", pageId: "321", width: "100%",
                    url: "http://lorempixel.com/400/200/"},
                { _id: "456", widgetType: "HTML", pageId: "321", text: "<p>Lorem ipsum</p>"},
                { _id: "567", widgetType: "HEADING", pageId: "321", size: 4, text: "Lorem ipsum"},
                { _id: "678", widgetType: "YOUTUBE", pageId: "321", width: "100%",
                    "url": "https://youtu.be/AM2Ivdi9c4E" },
                { _id: "789", widgetType: "HTML", pageId: "321", text: "<p>Lorem ipsum</p>"}
        ];

        var api = {
            "createWidget": createWidget,
            "findWidgetsByPageId": findWidgetsByPageId,
            "findWidgetById": findWidgetById,
            "updateWidget": updateWidget,
            "deleteWidget": deleteWidget
        };
        return api;

        function createWidget(pageId, widget) {
            widget._id = (new Date()).valueOf();
            widget.pageId = pageId;
            widgets.push(widget);
            return widget;
        }

        function findWidgetsByPageId(pageId) {
            var pageWidgets = [];
            for(var wid in widgets) {
                if( widgets[wid].pageId == pageId ) {
                    pageWidgets.push(widgets[wid]);
                }
            }
            return angular.copy(pageWidgets);
        }

        function findWidgetById(widgetId) {
            for (var wid in widgets) {
                if(widgets[wid]._id == widgetId) {
                    return widgets[wid];
                }
            }
            return null;
        }

        function updateWidget(widgetId, widget) {
            for(var wid in widgets) {
                if(widgets[wid]._id == widgetId) {
                    if (widget.widgetType == 'HEADER') {
                        widgets[wid].text = widget.text;
                        widgets[wid].size = widget.size;
                        return angular.copy(widget[wid]);
                    } else if (widget.widgetType == 'IMAGE') {
                        widgets[wid].url = widget.url;
                        widgets[wid].width = widget.width;
                        return angular.copy(widget[wid]);
                    } else if (widget.widgetType == 'YOUTUBE') {
                        widgets[wid].url = widget.url;
                        widgets[wid].width = widget.width;
                        return angular.copy(widget[wid]);
                    } else if (widget.widgetType == 'HTML') {
                        widgets[wid].text = widget.text;
                        widgets[wid].size = widget.size;
                        return angular.copy(widget[wid]);
                    }
                }
            }
            return null;
        }

        function deleteWidget(widgetId) {
            for (var wid in widgets) {
                if (widgets[wid]._id == widgetId) {
                    websites.splice(w);
                }
            }
            return null;
        }
    }
})();