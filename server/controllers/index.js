var UsersController = require('./UsersController'),
    CoursesController = require('./CoursesController'),
    TestsController = require('./TestsController');

module.exports = {
    users: UsersController,
    courses: CoursesController,
    tests: TestsController
};