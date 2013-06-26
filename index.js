// TODO: i dont think we really need all of `dom`

var dom = require('dom')
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
 */

List.prototype.reset = function () {
  this.models = {};
  this.els = {};
  this.list = dom([]);
  return this;
};


/**
 * Add an item to the list.
 *
 * @param {Model} model
 */

List.prototype.add = function (model) {
  var id = model.primary();
  var el = new this.View(model, this).el;
  this.models[id] = model;
  this.els[id] = el;
  this.list.els.push(el);
  this.el.appendChild(el);
  this.emit('add', model, el);
  return this;
};


/**
 * Remove an item from the list.
 *
 * @param {String} id
 */

List.prototype.remove = function (id) {
  var model = this.models[id];
  var el = this.els[id];
  delete this.models[id];
  delete this.els[id];
  if (!model || !el) return;
  this.list = this.list.reject(function (item) { el === item.get(0); });
  this.el.removeChild(el);
  this.emit('remove', model, el);
  return this;
};


/**
 * Filter the list's elements by hiding ones that don't match.
 *
 * @param {Function} fn  Filtering function.
 */

List.prototype.filter = function (fn) {
  this.list.removeClass('hidden');
  this.list.reject(fn).addClass('hidden');
  return this;
};


/**
 * Sort the list's elements by an iterator `fn`.
 */

List.prototype.sort = function (fn) {
  sort(this.el, fn);
  return this;
};


/**
 * Empty the list.
 */

List.prototype.empty = function () {
  var self = this;
  var models = this.models;
  var els = this.els;
  this.reset();
  each(models, function (id, model) {
    var el = els[id];
    dom(el).remove();
    self.emit('remove', model, els[id]);
  });
  return this;
};


/**
 * Add a class to the list.
 *
 * @param {String} name
 */

List.prototype.addClass = function (name) {
  dom(this.el).addClass(name);
  return this;
};


/**
 * Remove a class from the list.
 *
 * @param {String} name
 */

List.prototype.removeClass = function (name) {
  dom(this.el).removeClass(name);
  return this;
};