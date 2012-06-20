
/**
 * Module dependencies.
 */

var express = require('express')
  , everyauth = require('everyauth')
  , mongoose = require('mongoose')
  , http = require('http')
  , routes = require('./routes')
  , lib = {
    common : require('./lib/common.js')
  };

var app = express();

mongoose.connect('mongodb://localhost/certpro');

everyauth.debug = true;

everyauth.password
  .getLoginPath('/user/login')
  .postLoginPath('/user/login')
  .loginView('user/login')
  .loginLocals({ title: 'Login'})
  .authenticate( function (login, password) {
    // Either, we return a user or an array of errors if doing sync auth.
    // Or, we return a Promise that can fulfill to promise.fulfill(user) or promise.fulfill(errors)
    // `errors` is an array of error message strings
    //
    // e.g., 
    // Example 1 - Sync Example
    // if (usersByLogin[login] && usersByLogin[login].password === password) {
    //   return usersByLogin[login];
    // } else {
    //   return ['Login failed'];
    // }
    //
    // Example 2 - Async Example
    // var promise = this.Promise()
    // YourUserModel.find({ login: login}, function (err, user) {
    //   if (err) return promise.fulfill([err]);
    //   promise.fulfill(user);
    // }
    // return promise;
  })
  .loginSuccessRedirect('/user')

    // If login fails, we render the errors via the login view template,
    // so just make sure your loginView() template incorporates an `errors` local.
    // See './example/views/login.jade'

  .getRegisterPath('/user/register')
  .postRegisterPath('/user/register')
  .registerView('user/register')
  .registerLocals({ title: 'Signup Today!'})
  .extractExtraRegistrationParams( function (req) {
    return user.fields(req);
  })
  .validateRegistration( function (attr) {
    return user.validate(attr);
  })
  .registerUser( function (attr) {
    var promise = this.Promise();
    user.save(attr, promise);
    return promise;
    
  })
  .registerSuccessRedirect('/user');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('zSaOy~CQ2HQ-UZY)fa|m|ywBZ%vwr7w8jS*A'));
  app.use(express.session());
  app.use(everyauth.middleware());
  app.use(lib.common.initFlash);
  app.use(express.csrf());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.locals.use(function(req, res) {
    res.locals.session = req.session;
    res.locals.token = req.session._csrf;
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  res.render('index', { title: 'Welcome Homeowners!' });
});

/** /root **/
app.get ('/', routes.index, lib.common.flushFlash);

/** /account **/
app.get ('/account', routes.account.index, lib.common.flushFlash);

/** /pros **/
app.get ('/pros', routes.pros.index, lib.common.flushFlash);
app.get ('/pros/login', routes.pros.login, lib.common.flushFlash);
app.get ('/pros/signup', routes.pros.signup, lib.common.flushFlash);
app.get ('/pros/faq', routes.pros.faq, lib.common.flushFlash);

/* /admin */
app.get ('/admin', routes.admin.index, lib.common.flushFlash);
app.get ('/admin/stats', routes.admin.stats, lib.common.flushFlash);

/** /admin/users **/
app.get ('/admin/users', routes.admin.users.index, lib.common.flushFlash);
app.get ('/admin/users/add', routes.admin.users.add, lib.common.flushFlash);
app.post('/admin/users/add', routes.admin.users.create, lib.common.flushFlash);
app.get ('/admin/users/:id', routes.admin.users.show, lib.common.flushFlash);
app.get ('/admin/users/:id/edit', routes.admin.users.edit, lib.common.flushFlash);
app.put ('/admin/users/:id/edit', routes.admin.users.update, lib.common.flushFlash);
app.get ('/admin/users/:id/delete', routes.admin.users.del, lib.common.flushFlash);
app.del ('/admin/users/:id/delete', routes.admin.users.destroy, lib.common.flushFlash);

/** /admin/categories **/
app.get ('/admin/categories', routes.admin.categories.index, lib.common.flushFlash);
app.get ('/admin/categories/add', routes.admin.categories.add, lib.common.flushFlash);
app.post('/admin/categories/add', routes.admin.categories.create, lib.common.flushFlash);
app.get ('/admin/categories/:id', routes.admin.categories.show, lib.common.flushFlash);
app.get ('/admin/categories/:id/edit', routes.admin.categories.edit, lib.common.flushFlash);
app.put ('/admin/categories/:id/edit', routes.admin.categories.update, lib.common.flushFlash);
app.get ('/admin/categories/:id/delete', routes.admin.categories.del, lib.common.flushFlash);
app.del ('/admin/categories/:id/delete', routes.admin.categories.destroy, lib.common.flushFlash);

/** /admin/jobs **/
app.get ('/admin/jobs', routes.admin.jobs.index, lib.common.flushFlash);
app.get ('/admin/jobs/add', routes.admin.jobs.add, lib.common.flushFlash);
app.post('/admin/jobs/add', routes.admin.jobs.create, lib.common.flushFlash);
app.get ('/admin/jobs/:id', routes.admin.jobs.show, lib.common.flushFlash);
app.get ('/admin/jobs/:id/edit', routes.admin.jobs.edit, lib.common.flushFlash);
app.put ('/admin/jobs/:id/edit', routes.admin.jobs.update, lib.common.flushFlash);
app.get ('/admin/jobs/:id/delete', routes.admin.jobs.del, lib.common.flushFlash);
app.del ('/admin/jobs/:id/delete', routes.admin.jobs.destroy, lib.common.flushFlash);

/** /admin/requests **/
app.get ('/admin/requests', routes.admin.requests.index, lib.common.flushFlash);
app.get ('/admin/requests/add', routes.admin.requests.add, lib.common.flushFlash);
app.post('/admin/requests/add', routes.admin.requests.create, lib.common.flushFlash);
app.get ('/admin/requests/:id', routes.admin.requests.show, lib.common.flushFlash);
app.get ('/admin/requests/:id/edit', routes.admin.requests.edit, lib.common.flushFlash);
app.put ('/admin/requests/:id/edit', routes.admin.requests.update, lib.common.flushFlash);
app.get ('/admin/requests/:id/delete', routes.admin.requests.del, lib.common.flushFlash);
app.del ('/admin/requests/:id/delete', routes.admin.requests.destroy, lib.common.flushFlash);

/** /admin/leads **/
app.get ('/admin/leads', routes.admin.leads.index, lib.common.flushFlash);
app.get ('/admin/leads/add', routes.admin.leads.add, lib.common.flushFlash);
app.post('/admin/leads/add', routes.admin.leads.create, lib.common.flushFlash);
app.get ('/admin/leads/:id', routes.admin.leads.show, lib.common.flushFlash);
app.get ('/admin/leads/:id/edit', routes.admin.leads.edit, lib.common.flushFlash);
app.put ('/admin/leads/:id/edit', routes.admin.leads.update, lib.common.flushFlash);
app.get ('/admin/leads/:id/delete', routes.admin.leads.del, lib.common.flushFlash);
app.del ('/admin/leads/:id/delete', routes.admin.leads.destroy, lib.common.flushFlash);

/** /admin/transactions **/
app.get ('/admin/transactions', routes.admin.transactions.index, lib.common.flushFlash);
app.get ('/admin/transactions/add', routes.admin.transactions.add, lib.common.flushFlash);
app.post('/admin/transactions/add', routes.admin.transactions.create, lib.common.flushFlash);
app.get ('/admin/transactions/:id', routes.admin.transactions.show, lib.common.flushFlash);
app.get ('/admin/transactions/:id/edit', routes.admin.transactions.edit, lib.common.flushFlash);
app.put ('/admin/transactions/:id/edit', routes.admin.transactions.update, lib.common.flushFlash);
app.get ('/admin/transactions/:id/delete', routes.admin.transactions.del, lib.common.flushFlash);
app.del ('/admin/transactions/:id/delete', routes.admin.transactions.destroy, lib.common.flushFlash);

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
