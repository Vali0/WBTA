var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    busboy = require('connect-busboy'),
    passport = require('passport');

module.exports = function(app, config) {
    app.set('view engine', 'pug');
    app.set('views', config.rootPath + '/server/views');
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(busboy({
        immediate: false
    }));
    app.use(session({
        secret: 'magic unicorns',
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(config.rootPath + '/public'));
    app.use(function(req, res, next) {
        if (req.user) {
            app.locals.currentUser = req.user;
        } else {
            app.locals.currentUser = undefined;
        }

        next();
    });

};