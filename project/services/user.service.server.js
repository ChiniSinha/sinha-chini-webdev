module.exports = function (app, models) {

    var bcrypt = require("bcrypt-nodejs");

    var passport = require('passport');
    var cookieParser = require('cookie-parser');
    var session = require('express-session');

    var multer = require('multer');
    var multerS3 = require('multer-s3');

    var AWS = require('aws-sdk');
    var s3Bucket = new AWS.S3( { params: {Bucket: 'cs-web-dev'} } );

    var upload = multer({
        storage: multerS3({
            s3: s3Bucket,
            bucket: 'cs-web-dev',
            acl: 'public-read',
        })
    });

    var awsConfig = {
        secretAccessKey: process.env.AWS_ACCESS_KEY_ID,
        accessKeyId: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'us-east-1'
    };
    AWS.config.update(awsConfig);

    app.use(cookieParser());
    app.use(session({
        secret: 'this is project secret',
        resave: true,
        saveUninitialized: true,
        cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    var userModel = models.UserModel;

    app.post("/api/project/user", createUser);
    app.get("/api/project/user", findUser);
    app.get("/api/project/user/:userId", findUserById);
    app.put("/api/project/user/:userId", updateUser);
    app.delete("/api/project/user/:userId", deleteUser);
    app.post('/api/project/login', passport.authenticate('local'), login);
    app.post('/api/project/loggedin', loggedIn);
    app.post('/api/project/logout', logout);
    app.post('/api/project/register', register);
    app.post('/api/project/adminAddUser', adminCreateUser);
    app.post('/api/project/isAdmin', isAdmin);
    app.get('/api/project/allUser', findAllUsers);
    app.put('/api/project/user/:coachId/follow/:athleteId', followAthlete);
    app.put('/api/project/user/:coachId/unfollow/:athleteId', unFollowAthlete);
    app.post('/api/project/user/upload', upload.single('myFile'), uploadImage);
    app.get('/api/project/user/team/:teamId', findAthletesByTeamId);
    app.get('/api/project/user/school/:schoolId', findAthletesBySchoolId);
    app.get('/api/project/coach/school/:schoolId', findAllCoachBySchoolId);
    app.get('/api/project/coach/athlete/:athleteId', findAllCoachesByAthleteId);
    app.get('/api/project/athlete/coach/:coachId', findAllAthletesByCoachId);
    app.get('/api/project/coach/:coachId/athlete/:athleteId', findCoachByAthleteId);
    app.get('/api/project/athlete/:athleteId/coach/:coachId', findAthleteByCoachId);
    app.get('/api/project/coach/:coachId/team/:teamId/filter', filterAthletesInTeam);
    app.get('/api/project/currentUser', getCurrentUser);
    app.get('/api/project/searchUser/:name', searchUserByFirstName);

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

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

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

    function getCurrentUser(req, res) {
        res.send(req.user);
    }

    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        userModel
            .createUser(user)
            .then(function (user) {
                if(user) {
                    req.login(user, function (err) {
                        res.send(user);
                    });
                }
            });
    }

    function adminCreateUser(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        userModel
            .createUser(user)
            .then(function (user) {
                if(user) {
                    res.send(user);
                } else {
                    res.sendStatus(402);
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
        var coachId = req.params.coachId;
        var athleteId = req.params.athleteId;
        userModel
            .unFollowAthlete(coachId, athleteId)
            .then(function (coach) {
                res.send(coach);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function followAthlete(req, res) {
        var coachId = req.params.coachId;
        var athleteId = req.params.athleteId;
        userModel
            .followAthlete(coachId, athleteId)
            .then(function (coach) {
                res.send(coach);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function uploadImage(req, res){

        var userId = req.body.userId;
        var adminId = req.body.adminId;

        if(req.file) {
            var myFile = req.file;
            var type = myFile;
            var originalname = myFile.originalname; // File name on user's computer
            var filename = myFile.filename; // new file name in upload folder
            var path = myFile.path;         // full path of uploaded file
            var destination = myFile.destination;  // folder where file is saved to
            var size = myFile.size;
            var mimetype = myFile.mimetype;
            var location = myFile.location;
        }

        userModel
            .updateUser(userId, {'photo': location})
            .then(function (user) {
                if(adminId){
                    if(user.role == 'COACH') {
                        res.redirect("/project/#/admin/"+adminId+"/coach/"+user._id);
                    } else {
                        res.redirect("/project/#/admin/"+adminId+"/athlete/"+user._id);
                    }
                } else {
                    if (user.role == 'COACH') {
                        res.redirect("/project/#/coach/" + userId);
                    } else if (user.role == 'ATHLETE') {
                        res.redirect("/project/#/athlete/" + userId);
                    }
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

    function findAllAthletesByCoachId(req, res) {
        var coachId = req.params.coachId;
        userModel
            .findAllAthletesByCoachId(coachId)
            .then(function (athletes) {
                res.send(athletes);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function findAllCoachesByAthleteId(req, res) {
        var athleteId = req.params.athleteId;
        userModel
            .findAllCoachesByAthleteId(athleteId)
            .then(function (coaches) {
                res.send(coaches);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function findCoachByAthleteId(req, res) {
        var coachId = req.params.coachId;
        var athleteId = req.params.athleteId;
        userModel
            .findCoachByAthleteId(coachId, athleteId)
            .then(function (coach) {
                res.send(coach);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function findAthleteByCoachId(req, res) {
        var athleteId = req.params.athleteId;
        var coachId = req.params.coachId;
        userModel
            .findAthleteByCoachId(athleteId, coachId)
            .then(function (athlete) {
                res.send(athlete);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function filterAthletesInTeam(req, res) {
        var coachId = req.params.coachId;
        var teamId = req.params.teamId;
        userModel
            .filterAthletesInTeam(coachId, teamId)
            .then(function (athletes) {
                res.send(athletes);
            }, function (err) {
                res.sendStatus(404);
            })
    }

    function searchUserByFirstName(req, res) {
        var name = req.params.name;
        userModel
            .searchUserByFirstName(name)
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