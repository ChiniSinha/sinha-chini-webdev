module.exports = function (app, widgetModel) {

    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    app.post('/api/page/:pageId/widget', createWidget);
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);
    app.put('/api/widget/:widgetId', updateWidget);
    app.delete('/api/widget/:widgetId', deleteWidget);
    app.post('/api/upload', upload.single('myFile'), uploadImage);
    app.put('/page/:pageId/widget', reorderWidget);

    function createWidget(req, res) {
        var pageId = req.params.pageId;
        var widget = req.body;
        widgetModel
            .createWidget(pageId, widget)
            .then(function (widget) {
                res.send(widget);
            }, function (err) {
                res.sendStatus(404);
            })
    }

    function findAllWidgetsForPage(req, res){
        var pageId = req.params.pageId;
        widgetModel
            .findAllWidgetsForPage(pageId)
            .then(function (widgets) {
                res.send(widgets);
            }, function (err) {
                res.send(404);
            });
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;
        widgetModel
            .findWidgetById(widgetId)
            .then(function (widget) {
                res.send(widget);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function updateWidget(req, res) {
        var widgetId = req.params.widgetId;
        var widget = req.body;
        widgetModel
            .updateWidget(widgetId, widget)
            .then(function (widget) {
                res.send(widget)
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function deleteWidget(req, res){
        var widgetId = req.params.widgetId;
        widgetModel
            .deleteWidget(widgetId)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(404)
            });
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

        var url = "/uploads/" + filename;
        widgetModel
            .updateWidget(widgetId, {'type': 'IMAGE', 'url': url, 'width': width })
            .then(function (widget) {
                res.redirect("/assignment/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/" + widgetId);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function reorderWidget(req, res) {
        var pageId = req.params.pid;
        var startIndex = parseInt(req.query.start);
        var endIndex = parseInt(req.query.end);

        widgetModel
            .reorderWidget(pageId, startIndex, endIndex)
            .then(function (response) {
                res.sendStatus(response);
            }, function (err) {
                console.log(err);
                res.sendStatus(404);
            });
    }
}