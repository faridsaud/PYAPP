/**
* Route Mappings
* (sails.config.routes)
*
* Your routes map URLs to views and controllers.
*
* If Sails receives a URL that doesn't match any of the routes below,
* it will check for matching files (images, scripts, stylesheets, etc.)
* in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
* might match an image file: `/assets/images/foo.jpg`
*
* Finally, if those don't match either, the default 404 handler is triggered.
* See `api/responses/notFound.js` to adjust your app's 404 logic.
*
* Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
* flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
* CoffeeScript for the front-end.
*
* For more information on configuring custom routes, check out:
* http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
*/

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },
  'post /user/register':'UserController.register',
  'post /login':'UserController.login',
  'post /course/register':'CourseController.register',
  'post /course/createdByUser':'CourseController.getCoursesCreatedByUser',
  'post /test/register':'TestController.register',
  'post /test/update':'TestController.edit',
  'post /test/createdByUser':'TestController.getTestsCreatedByUser',
  'post /course/registerStudent':'CourseController.registerStudent',
  'post /user/studentsByCourse':'UserController.getStudentsByCourse',
  'post /test/byCourseByTeacher':'TestController.getTestsByCourseByTeacher',
  'post /course/byStudent':'CourseController.getCoursesByStudent',
  'post /course/byTeacher':'CourseController.getCoursesByTeacher',
  'post /test/byStudent':'TestController.getTestsByStudent',
  'post /test/byCourseByStudent':'TestController.getTestsByCourseByStudent',
  'post /promise':'PruebaController.testPromises',
  'post /promise2':'PruebaController.testPromises2',
  'post /course/delete':'CourseController.deleteCourse',
  'post /course/getById':'CourseController.getCourseById',
  'post /course/update':'CourseController.editCourse',
  'post /test/delete':'TestController.deleteTest',
  'post /test/getTestById':'TestController.getTestById',
  'post /test/getTestByIdForStudent':'TestController.getTestByIdForStudent',
  'post /test/registerTakenTest':'TestController.registerTakenTest',
  'post /test/question/clone':'TestController.cloneQuestion'






  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
