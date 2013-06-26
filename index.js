
// TODO: i dont think we really need all of `dom`

var dom = require('dom')
  , each = require('each')
  , Emitter = require('emitter');


module.exports = List;


/**
 * Initialize a new `List`.
 *
 * @param {Function} View  Constructor for the list's items.
 */

function List (View) {
  this.View = View;
  this.items = {};
  this.list = dom([]);
  this.el = document.createElement('ul');
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
 * Add an item to the list.
 *
 * @param {Model} model
 */

List.prototype.add = function (model) {
  var id = model.primary();
  var el = new this.View(model).el;
  this.items[id] = el;
  this.list.els.push(el);
  this.el.appendChild(el);
  this.emit('add', el);
  return this;
};


/**
 * Remove an item from the list.
 *
 * @param {String} id
 */

List.prototype.remove = function (id) {
  var el = this.items[id];
  delete this.items[id];
  if (!el) return;
  this.list = this.list.reject(function (item) { el === item.get(0); });
  this.el.removeChild(el);
  this.emit('remove', el);
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
};


/**
 * Empty the list.
 */

List.prototype.empty = function () {
  each(this.items, this.remove.bind(this));
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