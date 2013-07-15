describe('list', function () {
  var assert = require('assert')
    , list = require('list')
    , view = require('view');

  it('should return a constructor', function () {
    var View = view('<div></div>');
    var List = list(View);
    assert('function' === typeof List);
  });
});

describe('List', function () {
  var assert = require('assert')
    , list = require('list')
    , type = require('type')
    , view = require('view');

  var View = view('<div></div>');
  var List = list(View);

  describe('#el', function () {
    it('should have an .el property', function () {
      var list = new List();
      assert('element' === type(list.el));
    });
  });

  describe('#add(model)', function () {
    it('should add an item to the list', function () {
      var list = new List();
      assert(0 === list.el.childNodes.length);
      list.add('item');
      assert(1 === list.el.childNodes.length);
    });
  });
});