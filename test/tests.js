describe('list', function () {
  var assert = require('assert')
    , list = require('list')
    , view = require('view');

  it('should return a constructor', function () {
    var View = view('<div></div>');
    var List = list(View);
    assert('function' === typeof List);
  });

  it('should emit construct', function (done) {
    var View = view('<div></div>');
    var List = list(View);
    List.on('construct', function (list) {
      done();
    });
    new List();
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

  describe('#remove(id)', function(){
    it('should remove an item', function(){
      var list = new List;

      list.add({ id: 'foo' });
      list.add({ id: 'bar' });
      list.add({ id: 'baz' });

      assert(3 == list.el.childNodes.length);

      list.remove('foo');
      assert(2 == list.el.childNodes.length);

      list.remove('bar');
      assert(1 == list.el.childNodes.length);
    })
  })
});