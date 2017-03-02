module.exports = function (app) {

    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    app.post('/api/page/:pageId/widget', createWidget);
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);
    app.put('/api/widget/:widgetId', updateWidget);
    app.delete('/api/widget/:widgetId', deleteWidget);
    app.post('/api/upload', upload.single('myFile'), uploadImage);

    var widgets = [
        { _id: "123", widgetType: "HEADING", pageId: "321", size: 2, text: "GIZMODO"},
        { _id: "234", widgetType: "HEADING", pageId: "321", size: 4, text: "Lorem ipsum"},
        { _id: "345", widgetType: "IMAGE", pageId: "321", width: "100%",
            url: "http://lorempixel.com/400/200/"},
        { _id: "456", widgetType: "HTML", pageId: "321", text: "<p>Lorem ipsum</p>"},
        { _id: "567", widgetType: "HEADING", pageId: "321", size: 4, text: "Lorem ipsum"},
        { _id: "678", widgetType: "YOUTUBE", pageId: "321", width: "100%",
            url: "https://youtu.be/AM2Ivdi9c4E" },
        { _id: "789", widgetType: "HTML", pageId: "321", text: "<p>Lorem ipsum</p>"}
    ];

    function createWidget(req, res) {
        var pageId = req.params.pageId;
        var widget = req.body;
        widget._id = (new Date()).valueOf();
        widget.pageId = pageId;
        widgets.push(widget);
        res.send(widget);
    }

    function findAllWidgetsForPage(req, res){
        var pageId = req.params.pageId;
        var pageWidgets = widgets.filter(function (widget) {
            return widget.pageId == pageId;
        });
        res.send(pageWidgets);
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;
        var widget= widgets.find(function (widget) {
            return widget._id == widgetId;
        })
        res.send(widget);
    }

    function updateWidget(req, res) {
        var widgetId = req.params.widgetId;
        var widget = req.body;
        for (var wid in widgets) {
            if (widgets[wid]._id == widgetId) {
                if (widget.widgetType == 'HEADING') {
                    widgets[wid].text = widget.text;
                    widgets[wid].size = widget.size;
                    res.send(widgets[wid]);
                    return;
                } else if (widget.widgetType == 'IMAGE') {
                    widgets[wid].url = widget.url;
                    widgets[wid].width = widget.width;
                    res.send(widgets[wid]);
                    return;
                } else if (widget.widgetType == 'YOUTUBE') {
                    widgets[wid].url = widget.url;
                    widgets[wid].width = widget.width;
                    res.send(widgets[wid]);
                    return;
                } else if (widget.widgetType == 'HTML') {
                    widgets[wid].text = widget.text;
                    widgets[wid].size = widget.size;
                    res.send(widgets[wid]);
                    return;
                }
            }
        }
    }

    function deleteWidget(req, res){
        var widgetId = req.params.widgetId;
        for(var wid in widgets){
            if(widgets[wid]._id == widgetId){
                widgets.splice(wid, 1);
                res.sendStatus(200);
            }
        }
    }


    function uploadImage(req, res){

        var widgetId = req.body.widgetId;
        var userId = req.body.userId;
        var pageId = req.body.pageId;
        var websiteId = req.body.websiteId;
        var width = req.body.width;

        if(req.file) {
            var myFile = req.file;
            var originalname = myFile.originalname; // File name on user's computer
            var filename = myFile.filename; // new file name in upload folder
            var path = myFile.path;         // full path of uploaded file
            var destination = myFile.destination;  // folder where file is saved to
            var size = myFile.size;
            var mimetype = myFile.mimetype;
        }

        for(var wid in widgets) {
            if(widgets[wid]._id == widgetId) {
                widgets[wid].url = "/uploads/" + filename;
                widgets[wid].width = width;
            }
        }
        res.redirect("/assignment/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/" + widgetId);
    }
}