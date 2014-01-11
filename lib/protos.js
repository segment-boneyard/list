
var bind = require('bind')
  , dom = require('dom')
  , each = require('each')
  , Emitter = require('emitter')
  , get = require('get')
  , map = require('map');


/**
 * Mixin emitter.
 */

Emitter(exports);


/**
 * Add an item to the list.
 *
 * @param {Object} model
 * @return {List}
 */

exports.add = function (model) {
  var self = this;

  var view = new this.Item(model);
  if (view.on) {
    view.on('*', function () {
      var args = Array.prototype.slice.call(arguments);
      args[0] = 'item ' + args[0];
      self.emit.apply(self, args);
    });
  }

  var el = view.el;
  var id = get(model, 'primary') || get(model, 'id');
  this.items[id] = {
    el    : el,
    model : model,
    view  : view
  };

  // TODO: change when dom is fixed,
  // currently .push() and other array
  // methods are applied to the cloned
  // array, thus doing nothing
  [].push.call(this.list, el);
  this.el.appendChild(el);
  this.emit('add', el, model, view);
  return this;
};


/**
 * Remove an item from the list.
 *
 * @param {String} id
 * @return {List}
 */

exports.remove = function (id) {
  var item = this.items[id];
  var el = item.el;
  delete this.items[id];
  if (!el) return;

  this.list = this.list.reject(function (_) { return el === _[0] });
  this.el.removeChild(el);
  this.emit('remove', el, item.model, item.view);
  return this;
};


/**
 * Filter the list's elements by hiding ones that don't match.
 *
 * @param {Function} fn
 * @return {List}
 */

exports.filter = function (fn) {
  this.list.removeClass('hidden');
  for (var id in this.items) {
    var item = this.items[id];
    if (!fn(item.el, item.model, item.view)) dom(item.el).addClass('hidden');
  }
  return this;
};


/**
 * Sort the list's elements by an iterator `fn(el, model, view)`.
 *
 * @param {Function} fn
 * @return {List}
 */

exports.sort = function (fn) {
  var i = 0;
  var items = map(this.items, function (id, item) {
    return {
      index : i++,
      value : item,
      criterion : fn.call(null, item.el, item.model, item.view)
    };
  }).sort(function (a, b) {
    a = a.criterion;
    b = b.criterion;
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });

  var fragment = document.createDocumentFragment();
  each(items, function (item) {
    fragment.appendChild(item.value.el);
  });

  this.el.appendChild(fragment);
  return this;
};


/**
 * Empty the list.
 *
 * @return {List}
 */

exports.empty = function () {
  var self = this;
  var items = this.items;
  this.items = {};
  this.list = dom([]);
  each(items, function (id, item) {
    dom(item.el).remove();
    if (item.off) item.view.off('*');
    self.emit('remove', item.el, item.model, item.view);
  });
  return this;
};


/**
 * Add a class to the list.
 *
 * @param {String} name
 * @return {List}
 */

exports.addClass = function (name) {
  dom(this.el).addClass(name);
  return this;
};


/**
 * Remove a class from the list.
 *
 * @param {String} name
 * @return {List}
 */

exports.removeClass = function (name) {
  dom(this.el).removeClass(name);
  return this;
};