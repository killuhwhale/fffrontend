import typeOf from 'kind-of';
import clone from 'shallow-clone';
import {isPlainObject} from 'is-plain-object';

interface Matches {
  items: number[];
  marks: string[];
}

// https://gist.github.com/vpalos/4334557
export const filter = (query: string, items: string[], options) => {
  // option producer
  function option(name, value) {
    options = options || {};
    return typeof options[name] !== 'undefined' ? options[name] : value;
  }

  // prepare options
  var o_case = option('case', false);
  var o_mark = option('mark', true);
  var o_prefix = option('prefix', '<strong>');
  var o_suffix = option('suffix', '</strong>');
  var o_word = option('word', true);
  var o_limit = option('limit', 0);

  // prepare query
  query = o_case ? query : query.toLowerCase();
  query = query.replace(/\s+/g, o_word ? ' ' : '');
  query = query.replace(/(^\s+|\s+$)/g, '');
  const queryList = query.split(o_word ? ' ' : '');

  var ql = queryList.length;

  // prepare results
  const matches: Matches = {
    items: [],
    marks: [],
  };

  // search
  for (var ii = 0, il = items.length; ii < il; ii++) {
    // prepare text
    var text = o_case ? items[ii] : items[ii].toLowerCase();

    var mark = '';

    // traverse
    var ti = 0;
    var wi = 0;
    var wl = 0;
    for (var qi = 0; qi < ql; qi++) {
      wl = queryList[qi].length;
      wi = text.indexOf(queryList[qi], ti);
      if (wi === -1) {
        break;
      }
      if (o_mark) {
        if (wi > 0) {
          mark += items[ii].slice(ti, wi);
        }
        mark += o_prefix + items[ii].slice(wi, wi + wl) + o_suffix;
      }
      ti = wi + wl;
    }

    // capture
    if (qi == ql) {
      if (o_mark) {
        mark += items[ii].slice(ti);
        matches.marks.push(mark);
      }
      if (matches.items.push(ii) === o_limit && o_limit) {
        break;
      }
    }
  }

  // ready
  return matches;
};

// https://www.freecodecamp.org/news/javascript-debounce-example/
export const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log('Settimeout apply funcz');
      func.apply(this, args);
    }, timeout);
  };
};

export const validEmailRegex = new RegExp(
  "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])",
);

export function cloneDeep(val, instanceClone = null) {
  console.log('cloneDeep: ', val);
  switch (typeOf(val)) {
    case 'object':
      return cloneObjectDeep(val, instanceClone);
    case 'array':
      return cloneArrayDeep(val, instanceClone);
    default: {
      return clone(val);
    }
  }
}

function cloneObjectDeep(val, instanceClone) {
  if (typeof instanceClone === 'function') {
    return instanceClone(val);
  }
  if (instanceClone || isPlainObject(val)) {
    const res = new val.constructor();
    for (let key in val) {
      console.log('Clone object', key, val[key]);
      res[key] = cloneDeep(val[key], instanceClone);
    }
    return res;
  }
  return val;
}

function cloneArrayDeep(val, instanceClone) {
  const res = new val.constructor(val.length);
  for (let i = 0; i < val.length; i++) {
    console.log('Clone array', val, val[i]);
    res[i] = cloneDeep(val[i], instanceClone);
  }
  return res;
}

/**
 * Expose `cloneDeep`
 */
