describe('List', function () {
  var assert = require('assert')
    , List = require('list')
    , type = require('type');

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