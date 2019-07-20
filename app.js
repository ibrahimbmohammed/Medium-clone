const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database')


//Database connections and configuration
mongoose.connect(config.database, {
    useNewUrlParser: true
});
let db = mongoose.connection;

db.once("open", () => {
    console.log("Connected to MongoDB");
});

db.on("error", err => {
    console.log(err);
});
// End of Database //////////

const app = express();
let Article = require("./models/article");

// Middlewares
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// Static Files
app.use(express.static(path.join(__dirname, "public")));
// More Middlewares ,express session, exp messages,exp validator
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: {
    //     secure: true
    // }
}));
app.use(expressValidator({
    errorFormatter: function (params, msg, value) {
        var namespace = params.split('.'),
            root = namespace.shift(),
            formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            params: formParam,
            msg: msg,
            value: value
        };
    }

}))

// Passport Config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
})


app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
})



// Templating Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Home Route
app.get("/", (req, res) => {
    Article.find({}, (error, articles) => {
        if (error) {
            console.log(error);
        } else {
            res.render("index", {
                title: "Articles",
                articles: articles
            });
        }
    });
});

// Route Files

let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles)
app.use('/users', users)


// port
app.listen(8080, () => {
    console.log("server started at port 8080");
});