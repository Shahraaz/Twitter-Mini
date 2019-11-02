const express = require("express");
const bodyParser = require("body-parser");
const app  = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post('/login', function(req, res) {
    console.log("Here");
    console.log(req);
    res.send("index.html");
});


app.post('/compose', function(req, res) {
    const post = {
        title: req.body.postTitle,
        content: req.body.postBody
    };
    posts.push(post);
    // console.log(posts.length);
    res.redirect("/");
});

app.get('/login',function(req,res){
    res.render('login');
    console.log("Hey");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});