module.exports = function () {

    var model = null;
    var mongoose = require("mongoose");

    var UserSchema = require('./user.schema.server')();
    var UserModel = mongoose.model('UserModel', UserSchema);

    var api = {
        "createUser" : createUser,
        "findUserById" : findUserById,
        "findUserByUsername" : findUserByUsername,
        "findUserByCreadentials" : findUserByCreadentials,
        "updateUser" : updateUser,
        "deleteUser" : deleteUser,
        "setModel":setModel
    };

    return api;
    
    function createUser(user) {
        return UserModel.create(user);
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }
    
    function findUserByUsername(username) {
        return UserModel.findOne({'username' : username});
    }

    function findUserByCreadentials(username, password) {
        return UserModel.findOne({'username' : username, 'password' : password});
    }
    
    function updateUser(userId, user) {
        return UserModel.findByIdAndUpdate(userId, user, {new : true});
    }

    function deleteUser(userId) {
        return UserModel.findByIdAndRemove(userId);
    }

    function setModel(_model) {
        model = _model;
    }
}