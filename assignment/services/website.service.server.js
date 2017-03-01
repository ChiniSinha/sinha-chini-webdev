module.exports = function (app) {
    app.post('/api/user/:userId/website', createWebsite);
    app.get('/api/user/:userId/website', findAllWebsitesForUser);
    app.get('/api/website/:websiteId', findWebsiteById);
    app.put('/api/website/:websiteId', updateWebsite);
    app.delete('/api/website/:websiteId', deleteWebsite);

    var websites = [
        { _id: "123", name: "Facebook",    developerId: "456", description: "Facebook Website" },
        { _id: "234", name: "Tweeter",     developerId: "456", description: "Tweeter Website" },
        { _id: "456", name: "Gizmodo",     developerId: "456", description: "Gizmodo Website " },
        { _id: "567", name: "Tic Tac Toe", developerId: "123", description: "Tic Tac Toe Website" },
        { _id: "678", name: "Checkers",    developerId: "123", description: "Checkers Website" },
        { _id: "789", name: "Chess",       developerId: "234", description: "Chess Website" }
    ];

    function createWebsite(req, res){
        var userId = req.params.userId;
        var website = req.body;
        website.developerId = userId;
        website._id = (new Date()).valueOf();
        websites.push(website);
        res.send(website);
    }

    function findAllWebsitesForUser(req, res){
        var userId = req.params.userId;
        var userWebsiteList = websites.filter(function(web){
            return web.developerId == userId;
        })
        res.send(userWebsiteList);
    }

    function findWebsiteById(req, res){
        var websiteId = req.params.websiteId;
        var website = websites.find(function (web){
            return web._id == websiteId;
        })
        res.send(website);
    }

    function updateWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var website = req.body;
        for (var web in websites) {
            if (websites[web]._id == websiteId) {
                websites[web].name = website.name;
                websites[web].description = website.description;
                res.send(websites[web]);
                return;
            }
        }
    }

    function deleteWebsite(req, res){
        var websiteId = req.params.websiteId;
        for(var web in websites){
            if(websites[web]._id == websiteId){
                websites.splice(web, 1);
                res.sendStatus(200);
            }
        }
    }

}