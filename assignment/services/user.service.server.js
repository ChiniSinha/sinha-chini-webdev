module.exports = function (app) {
    app.post("/api/user", createUser);
    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    var users = [
        {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder", email: "alice@wonderland.com"  },
        {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley", email: "bob@marley.com"},
        {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia", email: "charly@garcia.com" },
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi", email: "jose@jannuzi.com" }
    ];


    function createUser(req, res) {
        var user = req.body;
        user._id = (new Date()).valueOf();
        users.push(user);
        res.send(user);
    }

    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        if(username && password) {
            findUserByCredentials(req, res);
        } else if(username) {
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res) {
        var uname = req.query.username;
        var user = users.find(function (u) {
            return u.username == uname;
        });
        if(user) {
            res.send(user);
        } else {
            res.sendStatus(404);
        }
    }

    function findUserByCredentials(req, res){
        var username = req.query.username;
        var password = req.query.password;
        var user = users.find(function(user){
            return user.password == password && user.username == username;
        });
        if(user) {
            res.send(user);
        } else {
            res.sendStatus(404);
        }
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        var user = users.find(function (user) {
            return user._id == userId;
        })
        res.send(user);
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var user = req.body;
        for(var u in users){
            if(users[u]._id==userId){
                users[u].firstName = user.firstName;
                users[u].lastName = user.lastName;
                users[u].email = user.email;
                res.send(users[u]);
                return;
            }
        }
    }

    function deleteUser(req, res){
        var userId = req.params.userId;
        for(var u in users){
            if(users[u]._id == userId){
                users.splice(u, 1);
                res.sendStatus(200);
                return;
            }
        }
    }

}