module.exports = function (app) {
    app.post('/api/website/:websiteId/page', createPage);
    app.get('/api/website/:websiteId/page', findAllPagesForWebsite);
    app.get('/api/page/:pageId', findPageByPageId);
    app.put('/api/page/:pageId', updatePage);
    app.delete('/api/page/:pageId', deletePage);

    var pages = [
        { _id: "321", name: "Post 1", websiteId: "456", description: "Lorem" },
        { _id: "432", name: "Post 2", websiteId: "456", description: "Lorem" },
        { _id: "543", name: "Post 3", websiteId: "456", description: "Lorem" }
    ];

    function createPage(req, res) {
        var websiteId = req.params.websiteId;
        var page = req.body;
        page.websiteId = websiteId;
        page._id = (new Date()).valueOf();
        pages.push(page);
        res.send(page);
    }

    function findAllPagesForWebsite(req, res){
        var websiteId = req.params.websiteId;
        var websitePages = pages.filter(function (pg) {
            return pg.websiteId == websiteId;
        })
        res.send(websitePages);
    }

    function findPageByPageId(req, res){
        var pageId = req.params.pageId;
        var page = pages.find(function (pg) {
            return pg._id == pageId;
        })
        res.send(page);
    }

    function updatePage(req, res) {
        var pageId = req.params.pageId;
        var page = req.body;
        for(var pg in pages){
            if(pages[pg]._id == pageId){
                pages[pg].name = page.name;
                pages[pg].description = page.description;
                res.send(pages[pg]);
                return;
            }
        }
    }

    function deletePage(req, res){
        var pageId = req.params.pageId;
        for(var pg in pages){
            if(pages[pg]._id == pageId){
                pages.splice(pg, 1);
                res.sendStatus(200);
            }
        }
    }

}