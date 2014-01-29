
var bind = require('bind');
var classes = require('classes');
var each = require('each');
var Emitter = require('emitter');
var Enumerable = require('enumerable');
var proxy = require('proxy-events');
var type = require('type');

/**
 * Expose `List`.
 */

module.exports = List;

/**
 * Initialize a new `List` with the optional `views` and `options`.
 *
 * @param {Array} views (optional)
 * @param {Object} options (optional)
 *   @property {Boolean} prepend
 */

function List(views, options){
  if ('object' == type(views)) options = views, views = null;
  options = options || {};
  this.el = document.createElement('ul');
  this.views = [];
  this.prepend = options.prepend;
  bind.all(this);
  if (views) each(views, this.add);
  List.emit('construct', this, views, options);
}

/**
 * Mixin emitter.
 */

Emitter(List);

/**
 * Use a given `plugin`.
 *
 * @param {Function} plugin
 */

List.use = function(plugin){
  plugin(this);
  return this;
};

/**
 * Mixin emitter.
 */

Emitter(List.prototype);

/**
 * Mixin enumerable.
 */

Enumerable(List.prototype);

/**
 * Enumerable iterator.
 *
 * @api private
 */

List.prototype.__iterate__ = function(){
  var views = this.views;
  return {
    length: function(){ return views.length; },
    get: function(i){ return views[i]; }
  };
};

/**
 * Return the lists's length.
 *
 * @return {Number}
 */

List.prototype.length = function(){
  return this.views.length;
};

/**
 * Add a `view` to the list.
 *
 * @param {Object} view
 * @return {List}
 */

List.prototype.add = function(view){
  if (!view.el) throw new Error('view must have an ".el" property');
  proxy(view, this, 'view ');
  this.views.push(view);
  this.el.insertBefore(view.el, this.prepend ? this.el.firstChild : null);
  List.emit('add', this, view);
  this.emit('add', view);
  return this;
};

/**
 * Remove a `view` from the list.
 *
 * @param {Object} view
 * @return {List or Boolean}
 */

List.prototype.remove = function(view){
  var i = this.indexOf(view);
  if (-1 == i) return false;
  this.views.splice(i, 1);
  this.el.removeChild(view.el);
  List.emit('remove', this, view);
  this.emit('remove', view);
  return this;
};

/**
 * Empty the list.
 *
 * @return {List}
 */

List.prototype.empty = function(){
  var self = this;
  this.views = [];
  this.el.innerHTML = '';
  this.each(function (view) {
    List.emit('remove', self, view);
    self.emit('remove', view);
  });
  return this;
};

/**
 * Filter the list's views by hiding those that don't pass `fn(view)`.
 *
 * @param {Function} fn
 * @return {List}
 */

List.prototype.filter = function(fn){
  this.each(function (view) {
    fn(view)
      ? classes(view.el).remove('hidden')
      : classes(view.el).add('hidden');
  });
  return this;
};

/**
 * Sort the list's views by an iterator `fn`.
 *
 * @param {Function} fn
 * @return {List}
 */

List.prototype.sort = function(fn){
  var fragment = document.createDocumentFragment();
  this.views.sort(fn);
  this.each(function (view) {
    fragment.appendChild(view.el);
  });
  this.el.appendChild(fragment);
  return this;
};

/**
 * Add a class to the list.
 *
 * @param {String} name
 * @return {List}
 */

List.prototype.addClass = function(name){
  classes(this.el).add(name);
  return this;
};

/**
 * Remove a class from the list.
 *
 * @param {String} name
 * @return {List}
 */

List.prototype.removeClass = function(name){
  classes(this.el).remove(name);
  return this;
};