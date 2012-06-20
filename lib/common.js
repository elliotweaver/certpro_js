
var isempty = function(o) {
  for (i in o) {
    return false;
  }
  return true;
}
exports.isempty = isempty;

var initFlash = function(req, res, next) {
  if ('undefined' === typeof req.session.show) {
    req.session.show = 1;
  }
  if ('undefined' === typeof req.session.flash) {
    req.session.flash = {};
  }
  if ('undefined' === typeof req.session.flash.error) {
    req.session.flash.error = [];
  }
  if ('undefined' === typeof req.session.flash.info) {
    req.session.flash.info = [];
  }
  if ('undefined' === typeof req.session.flash.warning) {
    req.session.flash.warning = [];
  }
  if ('undefined' === typeof req.session.flash.success) {
    req.session.flash.success = [];
  }
  if ('undefined' === typeof req.session.form) {
    req.session.form = {};
  }
  if ('undefined' === typeof req.session.form.errors) {
    req.session.form.errors = {};
  }
  if ('undefined' === typeof req.session.form.values) {
    req.session.form.values = {};
  }
  next();
}
exports.initFlash = initFlash;

var flushFlash = function(req, res) {
  req.session.flash = {};
  req.session.flash.error = [];
  req.session.flash.info = [];
  req.session.flash.warning = [];
  req.session.flash.success = [];
  req.session.form = {};
  req.session.form.errors = {};
  req.session.form.values = {};
  console.log('2');
}
exports.flushFlash = flushFlash;
