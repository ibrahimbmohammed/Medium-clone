const express = require('express');
const router = express.Router();


//Bring in article Model
let Article = require('../models/article');
let User = require("../models/users");

// Posting new Article route
router.post("/add", (req, res) => {
    req.checkBody('title', 'Title is required').notEmpty();
    // req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    //Get errors
    let errors = req.validationErrors();
    if (errors) {
        res.render('add_articles', {
            title: 'Add article',
            errors: errors
        })
    } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;

        article.save(err => {
            if (err) {
                console.log(err);
            } else {
                req.flash('success', 'Article Added');
                res.redirect("/");
            }
        });
    }


});
// Adding Article Route
router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("add_articles", {
        title: "Articles"
    });
});

// Single Article Route
router.get("/:id", (req, res) => {

    Article.findById(req.params.id, (err, article) => {
        User.findById(article.author, (err, user) => {
            // console.log(user.name);
            res.render('article', {
                article: article,
                author: user.name
            })
        })


    })

});

// Edit Article Route
router.get("/edit/:id", ensureAuthenticated, (req, res) => {

    Article.findById(req.params.id, (err, article) => {
        if (article.author != req.user._id) {
            req.flash('danger', 'Not Authorized')
            return res.redirect('/');
        } else {
            res.render("edit_article", {
                title: " Edit Article",
                article: article
            });

        }

    });

})


// Posting edited Articles route
router.post("/edit/:id", (req, res) => {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    let query = {
        _id: req.params.id
    }


    Article.updateOne(query, article, (err) => {
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Article Updated')
            res.redirect("/");
        }
    });
});

// Delete Request
router.delete('/:id', (req, res) => {
    if (!req.user._id) {
        res.status(500).send();
    }
    let query = {
        _id: req.params.id
    }
    Article.findById(req.params.id, (err, article) => {
        if (article.author != req.user._id) {
            res.status(500).send();
        } else {

            Article.deleteOne(query, (err) => {
                if (err) {
                    console.log(err);
                }
                res.send('success');

            })
        }
    })
});



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', "please login");
        res.redirect("/users/login");
    }
}
module.exports = router;