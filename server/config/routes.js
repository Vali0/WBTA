var auth = require('./auth'),
    controllers = require('../controllers');

module.exports = function(app) {
    app.get('/register', controllers.users.getRegister);
    app.post('/register', controllers.users.postRegister);

    app.get('/login', controllers.users.getLogin);
    app.post('/login', auth.login);
    app.get('/logout', auth.logout);

    app.get('/profile', auth.isAuthenticated, controllers.users.getProfile);
    app.put('/profile', auth.isAuthenticated, controllers.users.updateProfile);

    app.get('/courses', controllers.courses.getCourses);
    app.get('/course/:id', auth.isAuthenticated, controllers.courses.getCourseById);
    app.put('/course/:id', auth.isAuthenticated, controllers.users.assignCourse);

    app.get('/course/:courseId/test/:testId', auth.isAuthenticated, controllers.tests.getTestById);
    app.put('/course/:courseId/test/:testId', auth.isAuthenticated, controllers.users.assignTest);
    app.post('/course/:courseId/test/:testId', auth.isAuthenticated, controllers.tests.submitTest);

    app.get('*', function(req, res) {
        res.render('index', {
            currentUser: req.user
        });
    });

    app.use(function(err, req, res, next) {
        res.status(err.code || 500);
        res.render('error', {
            message: err.message,
            errCode: err.code || 500
        });
    });
};