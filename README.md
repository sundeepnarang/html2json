# html2json & json2html

## Changes

Based on [this](https://github.com/jxck/html2json).

* Fixed htmlparser issue
* Separated style attr and parsed it
* Added option to remove non-rendering spaces in block nodes.


## How to use

### node

```sh
$ npm install html2json
```

```javascript
var html2json = require('html2json_2').html2json;
var json2html = require('html2json_2').json2html;
```


### API

```javascript
json === html2json(document.body.innerHTML);
html === json2html(json);

console.assert(json === html);
```

```javascript
json === html2json(document.body.innerHTML, {removeNonRenderingSpaces: true});
```

### JSON format

every json has `node`

members of `node` are

- `root`
- `element`
- `text`
- `comment`

`root` node is the root of JSON, every JSON must have only one root `root`, could have `child`.

`element` node represents html element, could have `tag`, `attr`, `child`, `style`.

`text` node represents text element, could have `text`.

`comment` node represents commment element, could have `text`.


### Sample

html:

```html
<div id="1" class="foo" style="margin: 0">
<h2>sample text with <code>inline tag</code></h2>
<pre id="demo" class="foo bar">foo</pre>
<pre id="output" class="goo">goo</pre>
<input id="execute" type="button" value="execute"/>
</div>
```

json:

```javascript
{
  node: 'root',
  child: [
    {
      node: 'element',
      tag: 'div',
      attr: { id: '1', class: 'foo' },
      style: {margin: '0'},  
      child: [
        {
          node: 'element',
          tag: 'h2',
          child: [
            { node: 'text', text: 'sample text with ' },
            { node: 'element', tag: 'code', child: [{ node: 'text', text: 'inline tag' }] }
          ]
        },
        {
          node: 'element',
          tag: 'pre',
          attr: { id: 'demo', class: ['foo', 'bar'] },
          child: [{ node: 'text', text: 'foo' }]
        },
        {
          node: 'element',
          tag: 'pre',
          attr: { id: 'output', class: 'goo' },
          child: [{ node: 'text', text: 'goo' }]
        },
        {
          node: 'element',
          tag: 'input',
          attr: { id: 'execute', type: 'button', value: 'execute' }
        }
      ]
    }
  ]
}
```

#### With spaces removed

html:

```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Space Tests</title>
</head>
<body>
    <div>
        <p>
            <font>Test 1</font>
        </p>
        <p>
            test 2
            <font>test 3</font>test 4
            test 5
        </p>
        <p>test6
            <font>   test 7      </font><font>test    8</font>
            test 9
        </p>
        <p>
            <font style="display: inline-block">Test 1</font>
        </p>
        <p>
            test 2
            <font style="display: inline-block">test 3</font>test 4
            test 5
        </p>
        <p>test6
            <font style="display: inline-block">   test 7      </font><font style="display: inline-block">test    8</font>
            test 9
        </p>
    </div>
</body>
</html>
```

json:

```javascript
{
  "node": "root",
  "child": [
    {
      "node": "element",
      "tag": "html",
      "attr": {
        "lang": "en"
      },
      "child": [
        {
          "node": "element",
          "tag": "head",
          "child": [
            {
              "node": "element",
              "tag": "meta",
              "attr": {
                "charset": "UTF-8"
              }
            },
            {
              "node": "text",
              "text": " "
            },
            {
              "node": "element",
              "tag": "title",
              "child": [
                {
                  "node": "text",
                  "text": "Space Tests"
                }
              ]
            }
          ]
        },
        {
          "node": "element",
          "tag": "body",
          "child": [
            {
              "node": "element",
              "tag": "div",
              "child": [
                {
                  "node": "element",
                  "tag": "p",
                  "child": [
                    {
                      "node": "element",
                      "tag": "font",
                      "child": [
                        {
                          "node": "text",
                          "text": "Test 1"
                        }
                      ]
                    }
                  ]
                },
                {
                  "node": "element",
                  "tag": "p",
                  "child": [
                    {
                      "node": "text",
                      "text": "test 2\n            "
                    },
                    {
                      "node": "element",
                      "tag": "font",
                      "child": [
                        {
                          "node": "text",
                          "text": "test 3"
                        }
                      ]
                    },
                    {
                      "node": "text",
                      "text": "test 4\n            test 5"
                    }
                  ]
                },
                {
                  "node": "element",
                  "tag": "p",
                  "child": [
                    {
                      "node": "text",
                      "text": "test6\n            "
                    },
                    {
                      "node": "element",
                      "tag": "font",
                      "child": [
                        {
                          "node": "text",
                          "text": "   test 7      "
                        }
                      ]
                    },
                    {
                      "node": "element",
                      "tag": "font",
                      "child": [
                        {
                          "node": "text",
                          "text": "test    8"
                        }
                      ]
                    },
                    {
                      "node": "text",
                      "text": "\n            test 9"
                    }
                  ]
                },
                {
                  "node": "element",
                  "tag": "p",
                  "child": [
                    {
                      "node": "element",
                      "tag": "font",
                      "style": {
                        "display": "inline-block"
                      },
                      "attr": {},
                      "child": [
                        {
                          "node": "text",
                          "text": "Test 1"
                        }
                      ]
                    }
                  ]
                },
                {
                  "node": "element",
                  "tag": "p",
                  "child": [
                    {
                      "node": "text",
                      "text": "test 2\n            "
                    },
                    {
                      "node": "element",
                      "tag": "font",
                      "style": {
                        "display": "inline-block"
                      },
                      "attr": {},
                      "child": [
                        {
                          "node": "text",
                          "text": "test 3"
                        }
                      ]
                    },
                    {
                      "node": "text",
                      "text": "test 4\n            test 5"
                    }
                  ]
                },
                {
                  "node": "element",
                  "tag": "p",
                  "child": [
                    {
                      "node": "text",
                      "text": "test6\n            "
                    },
                    {
                      "node": "element",
                      "tag": "font",
                      "style": {
                        "display": "inline-block"
                      },
                      "attr": {},
                      "child": [
                        {
                          "node": "text",
                          "text": "   test 7      "
                        }
                      ]
                    },
                    {
                      "node": "element",
                      "tag": "font",
                      "style": {
                        "display": "inline-block"
                      },
                      "attr": {},
                      "child": [
                        {
                          "node": "text",
                          "text": "test    8"
                        }
                      ]
                    },
                    {
                      "node": "text",
                      "text": "\n            test 9"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Dependencies

[htmlparser.js](https://github.com/sundeepnarang/Pure-JavaScript-HTML5-Parser)

Originally [here](https://github.cosm/blowsie/Pure-JavaScript-HTML5-Parser)

## CHANGELOG

- 1.0.10
  - Added option `noSelfClosing` to not self close tags in `json2html`.
- 1.0.2
  - fix [#16](https://github.com/Jxck/html2json/issues/16) with merge [#17](https://github.com/Jxck/html2json/issues/17)
- 1.0.1
  - fix [#14](https://github.com/Jxck/html2json/issues/14)

before 1.0.0

- Basically inline tag is melted into text
- `Input`, `textarea`, `image` tags are act like block tag


## License

MIT
