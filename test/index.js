
var assert = require('assert');
var List = require('list');
var type = require('type');
var view = require('view');
var View = view('<div id="{id}"></div>');

describe('List', function () {

  it('should add views on construct', function () {
    var view = new View({ id: 1 });
    var list = new List([view]);
    assert.equal(1, list.views.length);
  });

  it('should emit construct', function (done) {
    var View = view('<div></div>');
    List.once('construct', function (list) {
      done();
    });
    new List();
  });

  describe('#el', function () {
    it('should have an .el property', function () {
      var list = new List();
      assert.equal('element', type(list.el));
    });
  });

  describe('#length()', function(){
    it('should return the list\'s length', function(){
      var one = new View({ id: 1 });
      var two = new View({ id: 2 });
      var list = new List([one, two]);
      assert.equal(2, list.length());
    });
  });

  describe('#add(view)', function () {
    it('should add an item to the list', function () {
      var list = new List();
      var view = new View();
      list.add(view);
      assert.equal(1, list.length());
      assert.equal(view.el, list.el.childNodes[0]);
    });

    it('should prepend items', function () {
      var list = new List({ prepend: true });
      list.add(new View({ id: 1 }));
      list.add(new View({ id: 2 }));
      assert.equal('2', list.el.childNodes[0].id);
    });
  });

  describe('#remove(view)', function(){
    it('should remove an item', function(){
      var one = new View({ id: 1 });
      var two = new View({ id: 2 });
      var list = new List([one, two]);
      assert.equal(2, list.length());
      list.remove(one);
      assert.equal(1, list.length());
    });
  });

});