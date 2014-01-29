
var each = require('each');
var Emitter = require('emitter');
var extend = require('extend');
var protos = require('./protos');
var statics = require('./statics');
var type = require('type');

/**
 * Expose a default `List` without an item view.
 */

module.exports = createList();

/**
 * Create a `List` with an optional `Item` view and `options`.
 *
 * @param {Function} Item (optional)
 * @param {Object} options (optional)
 */

function createList (Item, options) {
  if ('object' == type(Item)) options = Item, Item = null;

  /**
   * Initialize a new `List` with the optional `views` and `opts`.
   *
   * @param {Array} views (optional)
   * @param {Object} opts (optional)
   *   @property {Boolean} prepend
   */

  function List(views, opts){
    if (!(this instanceof List)) return createList.apply(this, arguments);
    if ('object' == type(views)) opts = views, views = null;
    this.el = document.createElement('ul');
    this.views = [];
    this.options = opts || {};
    List.emit('construct', this, views, this.options);
    if (views) each(views, this.add.bind(this));
  }

  /**
   * Mixin statics and protos.
   */

  List.prototype.List = List;
  List.prototype.Item = Item;
  for (var key in statics) List[key] = statics[key];
  for (var key in protos) List.prototype[key] = protos[key];
  return List;
}