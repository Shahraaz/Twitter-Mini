//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const md5 = require('md5');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const fs = require("fs");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'Hellopc12',
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

const mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Twitter'
});

con.connect(function (err) {
    if (err) console.log(err);
    console.log("Connected!");
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});


//-------- use the LocalStrategy
passport.use(new LocalStrategy(
    //username and password are the name
    //of the fields in the login form
    function (username, password, done) {
        //check if data is being passed
        console.log(`
        ----------USERNAME: ${username},
        ----------PASSWORD: ${password}
        `);
        //make sure the user exists on the database
        let $checkUser = "SELECT EMAIL, PASSWORD from REGISTRATION WHERE EMAIL = ?";
        let $username = username;

        let $queryUser = con.query($checkUser, [$username], (err, result) => {
            if (err) {
                console.log(err);
                //passport error manager
                done(err);
            }
            // if theres no data or result returns as 0 cancel auth
            if (result == null || result == undefined || result.length === 0) {
                console.log("USER NOT FOUND");
                //set auth to false
                done(null, false);
            } else {
                // else the user is in the database
                // now we need to check if the passwords match
                // matching the hashed passwords btw
                let $password = md5(password); // this will be hashed automatically by bcrypt compare function
                let $hash = result[0].PASSWORD;
                //if theyre match auth the user 
                console.log("hash and password", $hash, $password, result[0].EMAIL);
                if ($password === $hash) {
                    console.log("USER FOUND");
                    // this property user_id is created for passport to have it
                    // then we can access it using the req.user.user_id
                    // from the user object created by passport
                    return done(null, { user_id: result[0].EMAIL });
                } else {
                    //else cancel auth
                    return done(null, false);
                }
            }
        });
    }
));

passport.serializeUser(function (user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function (user_id, done) {
    done(null, user_id);
});

function authMiddleware() {
    return (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect("/login");
        }
    }
}

app.get('/SignUp', function (req, res) {
    if (req.isAuthenticated())
        res.redirect('/');
    else
        res.render('makeProfile');
});

app.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.user_id) {
            $userId = req.user.user_id
        } else {
            //else look for the id in the req.session.passport.user
            $userId = req.session.passport.user
        }
        console.log("making feed of ", $userId);
        var sql = "SELECT TWEETS.TWEETID, TWEETS.userName as Username2,TWEETCONTENTS.userName, TweetContent FROM TWEETCONTENTS, FOLLOW,TWEETS WHERE follower = ? and following = TWEETS.userName AND TWEETS.TWEETID = TWEETCONTENTS.TWEETID order by TIMESTAMP_R desc";
        var values = [
            [$userId]
        ];
        con.query(sql, [values], function (err, result) {
            if (err) {
                console.log(err);
                res.redirect("/login");
            }
            else {
                console.log(result);
                // console.log("result[0]"+result[0]);
                // if theres no data or result returns as 0 cancel auth4
                var sql = "SELECT USERNAME, NAME, GENDER, BIO FROM USERS WHERE userName = ?";
                var values = [
                    [$userId]
                ];
                // console.log(result);
                con.query(sql, [values], function (err, result2) {
                    if (err) {
                        console.log(err);
                        res.redirect("/login");
                    }
                    else {
                        console.log("result2" + result2);

                        res.render("home2", {
                            userId: result2[0].USERNAME,
                            bio: result2[0].BIO,
                            Gender: result2[0].GENDER,
                            tweets: result
                        });
                    }
                });
                // res.redirect('/');
            }
        });
    }
    else
        res.redirect('/login');
});

app.post('/addUser', function (req, res) {
    if (req.isAuthenticated())
        return res.redirect('login');
    const name = req.body.Name;
    const bio = req.body.designation;
    const email = req.body.email;
    const Gender = req.body.Gender;
    const userName = req.body.userName;
    const password = md5(req.body.password);
    console.log(name, bio, email, Gender, userName, password);
    if (Gender === 'F' || Gender === 'f')
        ;
    else if (Gender === 'M' || Gender === 'm')
        ;
    else
        return res.redirect('/signup');
    var sql = 'SELECT * from REGISTRATION WHERE USERNAME = ? or EMAIL = ?';
    var values = [
        userName,
        email
    ];
    console.log("query=" + sql);
    con.query(sql, values, function (err, result) {
        if (err) {
            console.log(err);
            res.redirect("/signup");
        }
        else {
            if (result === null || result === undefined || result.length == 0) {
                var sql = "INSERT INTO USERS VALUES ?";
                var values = [
                    [userName, name, Gender, bio]
                ];
                con.query(sql, [values], function (err, result) {
                    if (err) {
                        console.log(err);
                        res.redirect("/signup");
                    }
                    else {
                        console.log("Number of records inserted: " + result.affectedRows);
                        var user_id = userName;
                        console.log(user_id);
                        var sql = "INSERT INTO REGISTRATION (EMAIL, USERNAME, PASSWORD) VALUES ?";
                        var values = [
                            [email, userName, password]
                        ];
                        con.query(sql, [values], function (err, result) {
                            if (err) {
                                console.log(err);
                                res.redirect("/signup");
                            }
                            console.log(user_id, "Cookie");
                            req.login(user_id, () => {
                                res.redirect("/");
                            });
                        });
                    }
                });
            }
            else
                res.redirect("/signup");
        }
    });
});

app.get('/login', function (req, res) {
    if (req.isAuthenticated())
        res.redirect('/');
    else res.render("login");
});

app.post('/login', function (req, res) {
    const email = req.body.email;
    const password = md5(req.body.password);
    console.log(email, password);
    var sql = "SELECT *  FROM REGISTRATION WHERE EMAIL = ?";
    var values = [
        [email]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) {
            console.log(err);
            res.redirect("/login");
        }
        else {
            // if theres no data or result returns as 0 cancel auth
            if (result == null || result == undefined || result.length === 0) {
                console.log("USER NOT FOUND");
                //set auth to false
                res.redirect("/login");
            } else {
                let $password = password; // this will be hashed automatically by bcrypt compare function
                let $hash = result[0].PASSWORD;
                if ($password === $hash) {
                    console.log("USER FOUND");
                    var user_id = result[0].USERNAME;
                    console.log(user_id, "Cookie");
                    req.login(user_id, () => {
                        res.redirect("/");
                    })

                } else
                    //else cancel auth
                    res.redirect("/login");
            }
        }
    });
});

app.get('/people/', function name(req, res) {
    if (req.isAuthenticated()) {
        if (req.user.user_id) {
            $userId = req.user.user_id
        } else {
            //else look for the id in the req.session.passport.user
            $userId = req.session.passport.user
        }
        var sql = "select * from USERS where USERNAME <> ? and USERNAME  not in (select FOLLOWING from FOLLOW where FOLLOWER = ?);";
        var values = [
            [$userId],
            [$userId]
        ];
        con.query(sql, values, function (err, result) {
            if (err) {
                console.log(err);
                res.redirect("/login");
            }
            else {
                // if theres no data or result returns as 0 cancel auth
                // console.log(result);
                res.render("people2", {
                    people: result
                });
            }
        });
    }
    else
        res.redirect('/login');
});


app.get('/people/:personId', function name(req, res) {
    if (!req.isAuthenticated())
        return res.redirect('/login');
    console.log("Debug Startr");
    $userId = req.params.personId;
    console.log("making feed of ", $userId);
    var sql = "SELECT TWEETS.TWEETID ,TWEETS.USERNAME as Username2, TWEETCONTENTS.USERNAME as username, TweetContent FROM TWEETCONTENTS,TWEETS WHERE TWEETS.TWEETID = TWEETCONTENTS.TWEETID AND TWEETS.USERNAME = ? order by TIMESTAMP_R desc";
    var values = [
        [$userId]
    ];
    con.query(sql, values, function (err, result) {
        if (err) {
            console.log(err);
            res.redirect("/");
        }
        else {
            console.log(result);

            // if theres no data or result returns as 0 cancel auth
            if (result === "" || result === null)
                res.redirect("/");
            else {
                // console.log(result);
                var sql = "SELECT * FROM USERS WHERE userName = ?";
                var values = [
                    [$userId]
                ];
                con.query(sql, [values], function (err, result2) {
                    if (err) {
                        console.log(err);
                        console.log("+++++++++++++++++++++++++");
                        res.redirect("/");
                    }
                    else {
                        // if theres no data or result returns as 0 cancel auth
                        console.log("REs2" + result2);
                        if (result2 === "" || result2 === null || result2.length === 0)
                            res.redirect("/");
                        else {
                            if (req.user.user_id) {
                                $userId1 = req.user.user_id
                            } else {
                                //else look for the id in the req.session.passport.user
                                $userId1 = req.session.passport.user
                            }
                            if ($userId == $userId1) {
                                console.log(result2[0].NAME, result2[0].BIO);
                                res.render("person3", {
                                    USERID: $userId,
                                    FNAME: result2[0].NAME,
                                    BIO: result2[0].BIO,
                                    GENDER: result2[0].GENDER,
                                    UNAME: $userId,
                                    tweets: result,
                                    choice: 0
                                });
                            }
                            else {
                                var sql = "SELECT * FROM FOLLOW WHERE FOLLOWER = ? and FOLLOWING = ?";
                                var value = [
                                    [$userId1],
                                    [$userId]
                                ];
                                console.log($userId1, $userId);
                                con.query(sql, value, function (err, result3) {
                                    if (err) {
                                        console.log("||||||||||||||||||||||||");
                                        console.log(err);
                                        res.redirect('/');
                                    }
                                    else {
                                        console.log("THIS MUST BE PRINTED");
                                        console.log(result3);
                                        if (result3.length === 0) {
                                            res.render("person3", {
                                                USERID: $userId,
                                                FNAME: result2[0].NAME,
                                                BIO: result2[0].BIO,
                                                GENDER: result2[0].GENDER,
                                                UNAME: $userId,
                                                tweets: result,
                                                choice: 1
                                            });

                                        }
                                        else {
                                            res.render("person3", {
                                                USERID: $userId,
                                                FNAME: result2[0].NAME,
                                                BIO: result2[0].BIO,
                                                GENDER: result2[0].GENDER,
                                                UNAME: $userId,
                                                tweets: result,
                                                choice: 2
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            }
        }
    });
    console.log("Here");
});

app.post('/searchPerson', function (req, res) {
    res.redirect('/people/' + req.body.userName);
});

app.get('/follow/:personId', function (req, res) {
    if (!req.isAuthenticated())
        return res.redirect('login');
    if (req.user.user_id) {
        $userId = req.user.user_id
    } else {
        //else look for the id in the req.session.passport.user
        $userId = req.session.passport.user
    }
    var follwingid = req.params.personId;
    if (follwingid === $userId)
        return res.redirect('/');
    console.log("making feed of ", $userId);
    var sql = "INSERT INTO FOLLOW (follower, following) VALUES ?";
    var values = [
        [$userId, follwingid]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) {
            console.log(err);
            res.redirect("/");
        }
        else {
            // if theres no data or result returns as 0 cancel auth
            console.log(result);
            res.redirect("/");
        }
    });
});

app.get('/unfollow/:personId', function (req, res) {
    if (!req.isAuthenticated())
        return res.redirect('login');
    if (req.user.user_id) {
        $userId = req.user.user_id
    } else {
        //else look for the id in the req.session.passport.user
        $userId = req.session.passport.user
    }
    var follwingid = req.params.personId;
    if (follwingid === $userId)
        return res.redirect('/');
    console.log("making feed of ", $userId);
    var sql = "DELETE FROM FOLLOW  where follower = ? and following = ?";
    var values = [
        [$userId],
        [follwingid]
    ];
    con.query(sql, values, function (err, result) {
        if (err) {
            console.log(err);
            res.redirect("/");
        }
        else {
            // if theres no data or result returns as 0 cancel auth
            console.log(result);
            res.redirect("/");
        }
    });
});

app.post('/followPerson', function (req, res) {
    if (!req.isAuthenticated())
        return res.redirect('login');
    if (req.user.user_id) {
        $userId = req.user.user_id
    } else {
        //else look for the id in the req.session.passport.user
        $userId = req.session.passport.user
    }
    var follwingid = req.body.userName;
    if (follwingid === $userId)
        return res.redirect('/');
    console.log("making feed of ", $userId);
    var sql = "INSERT INTO FOLLOW (follower, following) VALUES ?";
    var values = [
        [$userId, follwingid]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) {
            console.log(err);
            res.redirect("/");
        }
        else {
            // if theres no data or result returns as 0 cancel auth
            console.log(result);
            res.redirect("/");
        }
    });
});

app.get('/makeTweet', function (req, res) {
    if (req.isAuthenticated())
        res.render("makeTweet");
    else res.redirect("/login");
});

app.post('/addTweet', function (req, res) {
    if (req.isAuthenticated()) {
        const tweet = req.body.tweet;
        console.log("tweet", tweet);
        if (req.user.user_id) {
            $userId = req.user.user_id
        } else {
            //else look for the id in the req.session.passport.user
            $userId = req.session.passport.user
        }
        console.log($userId, "userId");
        var sql = "INSERT INTO TWEETCONTENTS (tweetContent, userName) VALUES ?";
        var values = [
            [tweet, $userId]
        ];

        console.log(values);
        con.query(sql, [values], function (err, result) {
            if (err) {
                console.log(err);
                res.redirect("/");
            }
            else {
                console.log("Number of records inserted: " + result.affectedRows);
                console.log(result);

                var sql = "INSERT INTO TWEETS (TWEETID, USERNAME) VALUES ?";
                var values = [
                    [result.insertId, $userId]
                ];

                console.log(values);
                con.query(sql, [values], function (err, result) {
                    if (err) {
                        console.log(err);
                        res.redirect("/");
                    }
                    else {
                        console.log("Number of records inserted: " + result.affectedRows);
                        res.redirect("/");
                    }
                });




            }
        });

    }
    else res.redirect("/login");
});

app.get('/followers/:personId', function name(req, res) {
    if (req.isAuthenticated()) {
        console.log("Debug");
        if (req.user.user_id) {
            $userId = req.user.user_id
        } else {
            //else look for the id in the req.session.passport.user
            $userId = req.session.passport.user
        }
        console.log($userId, req.params.personId);
        if ($userId != req.params.personId)
            return res.redirect('/');
        var sql = "select * from USERS where USERNAME <> ? and USERNAME in (select FOLLOWER from FOLLOW where FOLLOWING = ?);";
        var values = [
            [$userId],
            [$userId]
        ];
        con.query(sql, values, function (err, result) {
            if (err) {
                console.log(err);
                res.redirect("/login");
            }
            else {
                // if theres no data or result returns as 0 cancel auth
                // console.log(result);
                console.log(result);
                res.render("people2", {
                    people: result
                });
            }
        });
    }
    else
        res.redirect('/login');
});


app.get('/following/:personId', function name(req, res) {
    if (req.isAuthenticated()) {
        console.log("Debug");
        if (req.user.user_id) {
            $userId = req.user.user_id
        } else {
            //else look for the id in the req.session.passport.user
            $userId = req.session.passport.user
        }
        console.log($userId, req.params.personId);
        if ($userId != req.params.personId)
            return res.redirect('/');
        var sql = "select * from USERS where USERNAME <> ? and USERNAME in (select FOLLOWING from FOLLOW where FOLLOWER = ?);";
        var values = [
            [$userId],
            [$userId]
        ];
        con.query(sql, values, function (err, result) {
            if (err) {
                console.log(err);
                res.redirect("/login");
            }
            else {
                // if theres no data or result returns as 0 cancel auth
                // console.log(result);
                console.log(result);
                res.render("people2", {
                    people: result
                });
            }
        });
    }
    else {
        console.log("Here");
        res.redirect('/login');
    }
});

app.get('/retweet/:tweetid', function name(req, res) {
    if (req.isAuthenticated()) {
        console.log("Debug");
        if (req.user.user_id) {
            $userId = req.user.user_id
        } else {
            //else look for the id in the req.session.passport.user
            $userId = req.session.passport.user
        }
        console.log($userId, req.params.tweetid);
        var sql = "INSERT INTO TWEETS (TWEETID, USERNAME) VALUES ?";
        var values = [
            [req.params.tweetid, $userId]
        ];
        console.log(values);
        con.query(sql, [values], function (err, result) {
            if (err) {
                console.log(err);
                res.redirect("/");
            }
            else {
                // if theres no data or result returns as 0 cancel auth
                console.log(result);
                res.redirect("/");
            }
        });
    }
    else {
        console.log("Here");
        res.redirect('/login');
    }
});


app.get("/logout", (req, res, next) => {
    if (req.isAuthenticated())
        req.logout();
    res.redirect("/login");
});

app.get('/deleteProfile', function (req, res) {
    if (!req.isAuthenticated())
        return res.redirect('login');
    if (req.user.user_id) {
        $userId = req.user.user_id
    } else {
        //else look for the id in the req.session.passport.user
        $userId = req.session.passport.user
    }
    if ($userId == undefined)
        return res.redirect('/');
    var sql = "DELETE from USERS where USERNAME  = ?";
    var values = [
        [$userId]
    ];
    con.query(sql, values, function (err, result) {
        if (err) {
            console.log(err);
            res.redirect("/logout");
        }
        else {
            // if theres no data or result returns as 0 cancel auth
            // console.log(result);
            res.redirect("/logout");
        }
    });
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
