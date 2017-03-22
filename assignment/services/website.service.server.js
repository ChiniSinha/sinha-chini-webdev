module.exports = function (app, websiteModel) {
    app.post('/api/user/:userId/website', createWebsite);
    app.get('/api/user/:userId/website', findAllWebsitesForUser);
    app.get('/api/website/:websiteId', findWebsiteById);
    app.put('/api/website/:websiteId', updateWebsite);
    app.delete('/api/website/:websiteId', deleteWebsite);

    function createWebsite(req, res){
        var userId = req.params.userId;
        var website = req.body;

        websiteModel
            .createWebsiteForUser(userId, website)
            .then(function (website) {
                res.send(website);
            }, function (err) {
                res.sendStatus(404);
            })
    }

    function findAllWebsitesForUser(req, res){
        var userId = req.params.userId;
        websiteModel
            .findAllWebsitesForUser(userId)
            .then(function (websites) {
                res.send(websites);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function findWebsiteById(req, res){
        var websiteId = req.params.websiteId;
        websiteModel
            .findPageByWebsiteId(websiteId)
            .then(function (website) {
                res.send(website);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function updateWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var website = req.body;
        websiteModel
            .updateWebsite(websiteId, website)
            .then(function (website) {
                res.send(website);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function deleteWebsite(req, res){
        var websiteId = req.params.websiteId;
        websiteModel
            .deleteWebsite(websiteId)
            .then(function (response) {
                if(response.result.n == 1 && response.result.ok == 1){
                    res.sendStatus(200);
                }
                else{
                    res.sendStatus(404);
                }
            }, function (err) {
                res.sendStatus(404);
            });
    }
}