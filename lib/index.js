
var dom = require('dom')
  , Emitter = require('emitter')
  , protos = require('./protos')
  , statics = require('./statics');


/**
 * Expose `createList`.
 */

module.exports = createList;


/**
 * Create a `List` with the given `Item` constructor.
 *
 * @param {Function} Item
 */

function createList (Item) {

  /**
   * Initialize a new `List`.
   */

  function List () {
    this.Item = Item;
    this.el = document.createElement('ul');
    this.items = {};
    this.list = dom([]);
  }

  // statics & protos
  for (var key in statics) List[key] = statics[key];
  for (var key in protos) List.prototype[key] = protos[key];

  return List;
}