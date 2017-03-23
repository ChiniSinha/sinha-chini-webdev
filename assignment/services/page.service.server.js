module.exports = function (app, pageModel) {
    app.post('/api/website/:websiteId/page', createPage);
    app.get('/api/website/:websiteId/page', findAllPagesForWebsite);
    app.get('/api/page/:pageId', findPageByPageId);
    app.put('/api/page/:pageId', updatePage);
    app.delete('/api/page/:pageId', deletePage);
    app.put('/page/:pageId/widget', reorderWidget);

    function reorderWidget(req, res) {
        var pageId = req.params.pageId;
        var start = req.query.start;
        var end = req.query.end;

        pageModel
            .reorderWidget(pageId, start, end)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(404);
            });
    }


    function createPage(req, res) {
        var websiteId = req.params.websiteId;
        var page = req.body;
        pageModel
            .createPage(websiteId, page)
            .then(function (page) {
                res.send(page);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function findAllPagesForWebsite(req, res){
        var websiteId = req.params.websiteId;
        pageModel
            .findAllPagesForWebsite(websiteId)
            .then(function (pages) {
                res.send(pages);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function findPageByPageId(req, res){
        var pageId = req.params.pageId;
        pageModel
            .findPageById(pageId)
            .then(function (page) {
                res.send(page);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function updatePage(req, res) {
        var pageId = req.params.pageId;
        var page = req.body;
        pageModel
            .updatePage(pageId, page)
            .then(function (page) {
                res.send(page);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function deletePage(req, res){
        var pageId = req.params.pageId;
        pageModel
            .deletePage(pageId)
            .then(function () {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(404);
            })
    }

}