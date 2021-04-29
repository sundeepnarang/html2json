const {HTMLParser} = require('./htmlparser.js');

const DEBUG = false;
const debug = DEBUG ? console.log.bind(console) : function(){};

function q(v) {
  return '"' + v + '"';
}

function removeDOCTYPE(html) {
  return html
    .replace(/<\?xml.*\?>\n/, '')
    .replace(/<!doctype.*\>\n/, '')
    .replace(/<!DOCTYPE.*\>\n/, '');
}

function processStyle(styleValue="", style={}){
  const styles = styleValue.split(";").filter(d=>d).map(d=>d.trim());
  styles.forEach(d=>{
    const stylePair = d.split(":").map(d=>d.trim());
    if(stylePair.length >=2){
      if(style[stylePair[0]]) style[stylePair[0]] = [style[stylePair[0]], stylePair[1]]
      else style[stylePair[0]] = stylePair[1]
    }
  });
  return style;
}

function html2json(html) {
  html = removeDOCTYPE(html);
  const bufArray = [];
  const results = {
    node: 'root',
    child: [],
  };
  HTMLParser(html, {
    start: function(tag, attrs, unary) {
      debug(tag, attrs, unary);
      // node for this element
      const node = {
        node: 'element',
        tag: tag
      };
      if (attrs.length !== 0) {
        node.attr = attrs.reduce(function(pre, attr) {
          const name = attr.name.toLowerCase();
          let value = attr.value;

          // has multi attibutes
          // make it array of attribute
          if (value.match(/ /) && name !== "style") {
            value = value.split(' ');
          }

          if(name==="style"){
            if(!node.style) node.style = {};
            node.style = processStyle(value, node.style);
          }
          else if (pre[name]) {
            if (Array.isArray(pre[name])) {
              // already array, push to last
              pre[name].push(value);
            } else {
              // single value, make it array
              pre[name] = [pre[name], value];
            }
          } else {
            // not exist, put it
            pre[name] = value;
          }

          return pre;
        }, {});

      }
      if (unary) {
        // if this tag dosen't have end tag
        // like <img src="hoge.png"/>
        // add to parents
        const parent = bufArray[0] || results;
        if (parent.child === undefined) {
          parent.child = [];
        }
        parent.child.push(node);
      } else {
        bufArray.unshift(node);
      }
    },
    end: function(tag) {
      debug(tag);
      // merge into parent tag
      const node = bufArray.shift();
      if (node.tag !== tag) console.error('invalid state: mismatch end tag');

      if (bufArray.length === 0) {
        results.child.push(node);
      } else {
        const parent = bufArray[0];
        if (parent.child === undefined) {
          parent.child = [];
        }
        parent.child.push(node);
      }
    },
    chars: function(text) {
      debug(text);
      const node = {
        node: 'text',
        text: text,
      };
      if (bufArray.length === 0) {
        results.child.push(node);
      } else {
        const parent = bufArray[0];
        if (parent.child === undefined) {
          parent.child = [];
        }
        parent.child.push(node);
      }
    },
    comment: function(text) {
      debug(text);
      const node = {
        node: 'comment',
        text: text,
      };
      const parent = bufArray[0];
      if (parent.child === undefined) {
        parent.child = [];
      }
      parent.child.push(node);
    },
  });
  return results;
}

function json2html(json) {
  // Empty Elements - HTML 4.01
  const empty = ['area', 'base', 'basefont', 'br', 'col', 'frame', 'hr', 'img', 'input', 'isindex', 'link', 'meta', 'param', 'embed'];

  let child = '';
  if (json.child) {
    child = json.child.map(function(c) {
      return json2html(c);
    }).join('');
  }

  let attr = '';
  if (json.attr) {
    attr = Object.keys(json.attr).map(function(key) {
      let value = json.attr[key];
      if (Array.isArray(value)) value = value.join(' ');
      return key + '=' + q(value);
    }).join(' ');
    if (attr !== '') attr = ' ' + attr;
  }
  if (json.style) {
    let styleAttrs = Object.keys(json.style).map(function(key) {
      let styleAttr = key+ ": ";
      let value = json.style[key];
      if (Array.isArray(value)) value = value.join('; ' + key + ": ");
      return styleAttr + value;
    }).join(' ');
    if (attr !== '') attr = attr + ' ' + 'style=' + q(styleAttrs);
    else attr = attr + 'style=' + q(styleAttrs);
  }

  if (json.node === 'element') {
    const tag = json.tag;
    if (empty.indexOf(tag) > -1) {
      // empty element
      return '<' + json.tag + attr + '/>';
    }

    // non empty element
    const open = '<' + json.tag + attr + '>';
    const close = '</' + json.tag + '>';
    return open + child + close;
  }

  if (json.node === 'text') {
    return json.text;
  }

  if (json.node === 'comment') {
    return '<!--' + json.text + '-->';
  }

  if (json.node === 'root') {
    return child;
  }
}

module.exports = {html2json, json2html}