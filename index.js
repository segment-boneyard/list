
var bind = require('bind')
  , dom = require('dom')
  , each = require('each')
  , Emitter = require('emitter')
  , sort = require('sort');


module.exports = List;


/**
 * Initialize a new `List`.
 *
 * @param {Function} View  Constructor for the list's items.
 */

function List (View) {
  this.View = View;
  this.el = document.createElement('ul');
  this.reset();
}


/**
 * Use a given `plugin`.
 *
 * @param {Function} plugin
 */

List.use = function (plugin) {
  plugin(this);
  return this;
};


/**
 * Mixin emitter.
 */

Emitter(List.prototype);


/**
 * Reset the list to it's default state.
 *
 * @return {List}
 */

List.prototype.reset = function () {
  this.items = {};
  this.list = dom([]);
  return this;
};


/**
 * Add an item to the list.
 *
 * @param {Object} model
 * @return {List}
 */

List.prototype.add = function (model) {
  var self = this;

  var view = new this.View(model);
  if (view.on) {
    view.on('*', function () {
      var args = Array.prototype.slice.call(arguments);
      args[0] = 'item ' + args[0];
      self.emit.apply(self, args);
    });
  }

  var el = view.el;
  var id = model.id || model.primary();
  this.items[model.primary()] = {
    el    : el,
    model : model,
    view  : view
  };

  this.list.els.push(el);
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

List.prototype.remove = function (id) {
  var item = this.items[id];
  var el = item.el;
  delete this.items[id];
  if (!el) return;

  this.list = this.list.reject(function (_) { el === _.get(0); });
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

List.prototype.filter = function (fn) {
  this.list.removeClass('hidden');
  this.list.reject(fn).addClass('hidden');
  return this;
};


/**
 * Sort the list's elements by an iterator `fn`.
 *
 * @param {Function} fn
 * @return {List}
 */

List.prototype.sort = function (fn) {
  sort(this.el, fn);
  return this;
};


/**
 * Empty the list.
 *
 * @return {List}
 */

List.prototype.empty = function () {
  var self = this;
  var items = this.items;
  this.reset();
  each(items, function (id, item) {
    dom(item.el).remove();
    item.view.off('*');
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

List.prototype.addClass = function (name) {
  dom(this.el).addClass(name);
  return this;
};


/**
 * Remove a class from the list.
 *
 * @param {String} name
 * @return {List}
 */

List.prototype.removeClass = function (name) {
  dom(this.el).removeClass(name);
  return this;
};