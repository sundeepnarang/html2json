const assert = require('assert');
const {html2json, json2html} = require('../src/html2json');

describe('html2json', function() {
  it('test of test', function() {
    assert.strictEqual(typeof html2json, 'function');
  });

  it('should parse div', function() {
    const json = {
      node: 'root',
      child: [
        { node: 'element', tag : 'div' }
      ]
    };
    const html = '<div></div>';

    assert.deepStrictEqual(json, html2json(html));
    assert.deepStrictEqual(html, json2html(json));
  });

  it('should parse hr', function() {
    const json = {
      node: 'root',
      child: [
        { node: 'element', tag : 'hr' }
      ]
    };
    const html = '<hr/>';

    assert.deepStrictEqual(json, html2json(html));
    assert.deepStrictEqual(html, json2html(json));
  });


  it('should parse multi div', function() {
    const json = {
      node: 'root',
      child: [
        { node: 'element', tag : 'div' },
        { node: 'element', tag : 'div' },
      ]
    };
    const html = '<div></div><div></div>';

    assert.deepStrictEqual(json, html2json(html));
    assert.deepStrictEqual(html, json2html(json));
  });


  it('should parse div with text', function() {
    const json = {
      node: 'root',
      child: [
        {
          node: 'element',
          tag: 'div',
          child: [
            {
              node: 'text',
              text: 'this is div'
            }
          ]
        }
      ]
    };
    const html = '<div>this is div</div>';

    assert.deepStrictEqual(json, html2json(html));
    assert.deepStrictEqual(html, json2html(json));
  });

  it('should parse div with comment', function() {
    const json = {
      node: 'root',
      child: [
        {
          node: 'element',
          tag : 'div',
          child: [
            { node: 'comment', text: ' foo ' }
          ]
        }
      ]
    };
    const html = '<div><!-- foo --></div>';

    assert.deepStrictEqual(json, html2json(html));
    assert.deepStrictEqual(html, json2html(json));
  });

  it('should parse div with id', function() {
    const json = {
      node: 'root',
      child: [
        {
          node: 'element',
          tag: 'div',
          attr: {
            id: 'foo'
          }
        }
      ]
    };
    const html = '<div id="foo"></div>';

    assert.deepStrictEqual(json, html2json(html));
    assert.deepStrictEqual(html, json2html(json));
  });

  it('should parse div with id and class', function() {
    const json = {
      node: 'root',
      child: [
        {
          node: 'element',
          tag: 'div',
          attr: {
            id: 'foo',
            class: ['bar', 'goo']
          },
          child: [
            {
              node: 'text',
              text: 'this is div',
            }
          ]
        }
      ]
    };
    const html = '<div id="foo" class="bar goo">this is div</div>';

    assert.deepStrictEqual(json, html2json(html));
    assert.deepStrictEqual(html, json2html(json));
  });

  it('should parse div with id, class and style', function() {
    const json = {
      node: 'root',
      child: [
        {
          node: 'element',
          tag: 'div',
          attr: {
            id: 'foo',
            class: ['bar', 'goo']
          },
          style: {
            margin: '0'
          },
          child: [
            {
              node: 'text',
              text: 'this is div',
            }
          ]
        }
      ]
    };
    const html = '<div id="foo" class="bar goo" style="margin: 0">this is div</div>';

    assert.deepStrictEqual(json, html2json(html));
    assert.deepStrictEqual(html, json2html(json));
  });

  it('should parse div with child', function() {
    const json = {
      node: 'root',
      child: [
        {
          node: 'element',
          tag: 'div',
          child: [
            {
              node: 'element',
              tag: 'p',
              child: [
                {
                  node: 'text',
                  text: 'child'
                }
              ]
            }
          ]
        }
      ]
    };
    const html = '<div><p>child</p></div>';

    assert.deepStrictEqual(json, html2json(html));
    assert.deepStrictEqual(html, json2html(json));
  });

  it('should parse div with 2 child', function() {
    const json = {
      node: 'root',
      child: [
        {
          node: 'element',
          tag: 'div',
          child: [
            {
              node: 'element',
              tag: 'p',
              child: [{ node: 'text', text: 'child1' }]
            },
            {
              node: 'element',
              tag: 'p',
              child: [{ node: 'text', text: 'child2' }]
            }
          ]
        }
      ]
    };
    const html = '<div><p>child1</p><p>child2</p></div>';

    assert.deepStrictEqual(json, html2json(html));
    assert.deepStrictEqual(html, json2html(json));
  });

  it('should parse div with nested child', function() {
    const json = {
      node: 'root',
      child: [
        {
          node: 'element',
          tag: 'div',
          child: [
            {
              node: 'element',
              tag: 'p',
              child: [
                {
                  node: 'element',
                  tag: 'textarea',
                  child: [
                    { node: 'text', text: 'alert(1);' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
    const html = '<div><p><textarea>alert(1);</textarea></p></div>';

    assert.deepStrictEqual(json, html2json(html));
    assert.deepStrictEqual(html, json2html(json));
  });

  it('should parse div with 2 nested child', function() {
    const json = {
      node: 'root',
      child: [
        {
          node: 'element',
          tag: 'div',
          child: [
            {
              node: 'element',
              tag: 'p',
              child: [
                {
                  node: 'element',
                  tag: 'textarea',
                  child: [
                    { node: 'text', text: 'alert(1);' }
                  ]
                }
              ]
            },
            {
              node: 'element',
              tag: 'p',
              child: [
                { node: 'text', text: 'child of div' }
              ]
            }
          ]
        }
      ]
    };
    const html = '<div><p><textarea>alert(1);</textarea></p><p>child of div</p></div>';

    assert.deepStrictEqual(json, html2json(html));
    assert.deepStrictEqual(html, json2html(json));
  });

  it('should parse div with unary & ingored inline tag', function() {
    const json = {
      node: 'root',
      child: [
        {
          node: 'element',
          tag: 'div',
          attr: { id: '1', class: ['foo', 'bar'] },
          child: [
            {
              node: 'element',
              tag: 'h2',
              child: [ { node: 'text', text: 'sample text' } ]
            },
            {
              node: 'element',
              tag: 'input',
              attr: { id: 'execute', type: 'button', value: 'execute' }
            },
            {
              node: 'element',
              tag: 'img',
              attr: { src: 'photo.jpg', alt: 'photo' }
            }
          ]
        }
      ]
    };

    const html = ''
      + '<div id="1" class="foo bar">'
      + '<h2>sample text</h2>'
      + '<input id="execute" type="button" value="execute"/>'
      + '<img src="photo.jpg" alt="photo"/>'
      + '</div>';

    assert.deepStrictEqual(json, html2json(html));
    assert.deepStrictEqual(html, json2html(json));
  });

  it('should parse div with inline tag', function() {
    const json = {
      node: 'root',
      child: [
        {
          node: 'element',
          tag: 'div',
          attr: { id: '1', class: ['foo', 'bar'] },
          child: [
            {
              node: 'element',
              tag: 'p',
              child: [
                {
                  node: 'text',
                  text: 'text with ',
                },
                {
                  node: 'element',
                  tag: 'strong',
                  child: [
                    { node: 'text', text: 'strong' }
                  ]
                },
                {
                  node: 'text',
                  text: ' tag'
                },
              ]
            },
            {
              node: 'element',
              tag: 'p',
              child: [
                {
                  node: 'element',
                  tag: 'strong',
                  child: [
                    { node: 'text', text: 'start' }
                  ]
                },
                {
                  node: 'text',
                  text: ' with inline tag',
                },
              ]
            }
          ]
        }
      ]
    };

    const html = ''
      + '<div id="1" class="foo bar">'
      + '<p>text with <strong>strong</strong> tag</p>'
      + '<p><strong>start</strong> with inline tag</p>'
      + '</div>';

    assert.deepStrictEqual(json, html2json(html));
    assert.deepStrictEqual(html, json2html(json));
  });

  it('should parse I want to :)', function() {
    const json = {
      node: 'root',
      child: [
        {
          node: 'element',
          tag: 'div',
          attr: { id: '1', class: 'foo' },
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
        },
        {
          node: 'element',
          tag: 'hr',
        }
      ]
    };
    const html = ''
      + '<div id="1" class="foo">'
      + '<h2>sample text with <code>inline tag</code></h2>'
      + '<pre id="demo" class="foo bar">foo</pre>'
      + '<pre id="output" class="goo">goo</pre>'
      + '<input id="execute" type="button" value="execute"/>'
      + '</div>'
      + '<hr/>';

    assert.deepStrictEqual(json, html2json(html));
    assert.deepStrictEqual(html, json2html(json));
  });
});
