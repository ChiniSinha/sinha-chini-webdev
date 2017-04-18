module.exports = function (app, models) {

    var bcrypt = require("bcrypt-nodejs");

    var passport = require('passport');
    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    var userModel = models.UserModel;

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.post("/api/project/user", createUser);
    app.get("/api/project/user", findUser);
    app.get("/api/project/user/:userId", findUserById);
    app.put("/api/project/user/:userId", updateUser);
    app.delete("/api/project/user/:userId", deleteUser);
    app.post('/api/project/login', passport.authenticate('local'), login);
    app.post('/api/project/loggedin', loggedIn);
    app.post('/api/project/logout', logout);
    app.post('/api/project/register', register);
    app.post('/api/project/isAdmin', isAdmin);
    app.get('/api/project/allUser', findAllUsers);
    app.put('/api/project/user/:coachId/follow/:athleteId', followAthlete);
    app.put('/api/project/user/:coachId/unfollow/:athleteId', unFollowAthlete);
    app.post('/api/project/user/upload', upload.single('myFile'), uploadImage);
    app.get('/api/project/user/team/:teamId', findAthletesByTeamId);
    app.get('/api/project/user/school/:schoolId', findAthletesBySchoolId);
    app.get('/api/project/coach/school/:schoolId', findAllCoachBySchoolId);

    app.get('/auth/facebook',passport.authenticate('facebook',{ scope : 'email'}));
    app.get('/auth/facebook/callback',passport.authenticate('facebook', {
        failureRedirect: '/project/#/login'
    }), function(req, res){
        var url = '/project/#/athlete/' + req.user._id.toString();
        res.redirect(url);
    });
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/project/#/login'
        }), function(req, res){
            var url = '/project/#/athlete/' + req.user._id.toString();
            res.redirect(url);
        });

    var facebookConfig = {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id','displayName', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'photos', 'verified']
    };

    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

    function facebookStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByFacebookId(profile.id)
            .then(function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var names = profile.displayName.split(" ");
                        var newFacebookUser = {
                            firstName:  names[0],
                            lastName:  names[1],
                            facebook: {
                                id:    profile.id,
                                token: token
                            },
                            email: profile.emails[0].value,
                            username: profile.emails[0].value,
                            photo: profile.photos[0].value
                        };
                        userModel
                            .createUser(newFacebookUser)
                            .then(function (user) {
                                return done(null, user);
                            });
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                });
    }

    var googleConfig = {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    };

    passport.use(new GoogleStrategy(googleConfig, googleStrategy));



    function googleStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(function (user) {
                if(user) {
                    done(null, user);
                } else {
                    var user = {
                        username: profile.emails[0].value,
                        photo: profile.photos[0].value,
                        firstName: profile.name.givenName,
                        lastName:  profile.name.familyName,
                        email:     profile.emails[0].value,
                        google: {
                            id:    profile.id
                        }
                    };
                    return userModel.createUser(user);
                }
            }, function (err) {
                console.log(err);
                done(err, null);
            })
            .then(function (user) {
                done(null, user);
            }, function (err) {
                console.log(err);
                done(err, null);
            });
    }

    passport.use(new LocalStrategy(localStrategy));

    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user != null && user.username === username && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function createUser(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        userModel
            .createUser(user)
            .then(function (user) {
                res.send(user);
            }, function (err) {
                res.sendStatus(404);
            });
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
        userModel
            .findUserByUsername(uname)
            .then(function (user) {
                res.send(user)
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function findUserByCredentials(req, res){
        var username = req.query.username;
        var password = req.query.password;
        userModel
            .findUserByCreadentials(username, password)
            .then(function (user) {
                res.send(user);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        userModel
            .findUserById(userId)
            .then(function (user) {
                res.send(user);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var user = req.body;

        userModel
            .updateUser(userId, user)
            .then(function (user) {
                res.send(user);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function deleteUser(req, res){
        var userId = req.params.userId;

        userModel
            .deleteUser(userId)
            .then(function (user) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function login(req, res) {
        var user = req.user;
        res.send(user);
    }

    function loggedIn(req, res) {
        if(req.isAuthenticated()) {
            res.send(req.user);
        } else {
            res.send('0');
        }
    }

    function isAdmin(req, res) {
        if(req.isAuthenticated() && req.user.role == 'ADMIN') {
            res.send(req.user);
        } else {
            res.send('0');
        }
    }

    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        userModel
            .createUser(user)
            .then(function (user) {
                if(user) {
                    req.login(user, function (err) {
                        console.log("server user_id: " + user._id);
                        res.send(user);
                    });
                }
            });
    }

    function findAllUsers(req, res) {
        if(req.user && req.user.role=='ADMIN') {
            userModel
                .findAllUsers()
                .then(function (users) {
                    res.send(users);
                });
        } else {
            res.send({});
        }
    }

    function unFollowAthlete(req, res) {
        var userId = req.params['uid'];
        var user = req.body;

        model.UserModel.unFollowAthlete(userId, user)
            .then(function (newUser) {
                if(newUser){
                    model.UserModel.removeFollowedByCoach(userId, user)
                        .then(function (user) {

                        });
                }
                res.send(newUser);
            }, function (err) {
                res.sendStatus(500).send('Could not unfollow user');
            })
    }

    function followAthlete(req, res) {
        var coachId = req.params.userId;
        var athlete = req.body;

        model.UserModel.followAthlete(coachId, athlete)
            .then(function (newUser) {
                if(newUser){
                    model.UserModel.addFollowedByCoach(userId, user)
                        .then(function (user) {
                        });
                }
                res.send(newUser);
            }, function (err) {
                res.sendStatus(500).send('Could not follow user');
            });

    }

    function uploadImage(req, res){

        var userId = req.body.userId;

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
        userModel
            .updateUser(userId, {'photo': url})
            .then(function (user) {
                if(user.role == 'COACH') {
                    res.redirect("/project/#/coach/"+userId);
                } else {
                    res.redirect("/project/#/athlete/" + userId);
                }
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function findAthletesByTeamId(req, res) {
        var teamId = req.params.teamId;
        userModel
            .findAthletesByTeamId(teamId)
            .then(function (users) {
                res.send(users);
            }, function (err) {
                res.sendStatus(404);
            })
    }

    function findAthletesBySchoolId(req, res) {
        var schoolId = req.params.schoolId;
        userModel
            .findAthletesBySchoolId(schoolId)
            .then(function (users) {
                res.send(users);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function findAllCoachBySchoolId(req, res) {
        var schoolId = req.params.schoolId;
        userModel
            .findAllCoachBySchoolId(schoolId)
            .then(function (users) {
                res.send(users);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    console.log(err);
                    done(err, null);
                }
            );
    }
}