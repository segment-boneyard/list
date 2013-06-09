
# list

  An abstraction for managing a list of views. Basically, List is to Collection as View is to Model.

## Installation

    $ component install segmentio/list

## Example

```js
var List = require('list')
  , ItemView = require('./item-view');

// Later on...
var list = new List(ItemView);
collection.each(list.add.bind(this));
```

## License

  MIT
