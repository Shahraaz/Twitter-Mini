const express = require("express");
const bodyParser = require("body-parser");
const app  = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/about', function(req, res) {
    res.render('about');
});

app.get('/login',function(req,res){
    res.render('login');
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});