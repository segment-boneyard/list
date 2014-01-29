
var classes = require('classes');
var Emitter = require('emitter');
var Enumerable = require('enumerable');
var proxy = require('proxy-events');

/**
 * Mixin emitter.
 */

Emitter(exports);

/**
 * Mixin enumerable.
 */

Enumerable(exports);

/**
 * Enumerable iterator.
 *
 * @api private
 */

exports.__iterate__ = function(){
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

exports.length = function(){
  return this.views.length;
};

/**
 * Add a `view` or model to the list.
 *
 * @param {Object} view
 * @return {List}
 */

exports.add = function(view){
  if (this.Item && !(view instanceof this.Item)) view = new this.Item(view);
  if (!view.el) throw new Error('view must have an ".el" property');
  proxy(view, this, 'view ');
  this.options.prepend ? this.views.unshift(view) : this.views.push(view);
  this.el.insertBefore(view.el, this.options.prepend ? this.el.firstChild : null);
  this.emit('add', view);
  this.List.emit('add', this, view);
  return this;
};

/**
 * Remove a `view` from the list.
 *
 * @param {Object} view
 * @return {List or Boolean}
 */

exports.remove = function(view){
  var i = this.indexOf(view);
  if (-1 == i) return false;
  this.views.splice(i, 1);
  this.el.removeChild(view.el);
  this.emit('remove', view);
  this.List.emit('remove', this, view);
  return this;
};

/**
 * Empty the list.
 *
 * @return {List}
 */

exports.empty = function(){
  var self = this;
  this.views = [];
  this.el.innerHTML = '';
  this.each(function (view) {
    self.emit('remove', view);
    self.List.emit('remove', self, view);
  });
  return this;
};

/**
 * Filter the list's views by hiding those that don't pass `fn(view)`.
 *
 * @param {Function} fn
 * @return {List}
 */

exports.filter = function(fn){
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

exports.sort = function(fn){
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

exports.addClass = function(name){
  classes(this.el).add(name);
  return this;
};

/**
 * Remove a class from the list.
 *
 * @param {String} name
 * @return {List}
 */

exports.removeClass = function(name){
  classes(this.el).remove(name);
  return this;
};