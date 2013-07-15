
# list

  An abstraction for managing a list of views. Basically, List is to Collection as View is to Model.

## Installation

    $ component install segmentio/list

## Example

```js
var list = require('list')
  , ItemView = require('./item-view');

// Later on...
var List = list(ItemView);

var view = new List()
collection.each(view.add.bind(view));
```

## License

  MIT
