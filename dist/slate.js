(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('immutable')) :
	typeof define === 'function' && define.amd ? define(['exports', 'immutable'], factory) :
	(factory((global.Slate = {}),global.Immutable));
}(this, (function (exports,immutable) { 'use strict';

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isobject = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

function isObjectObject(o) {
  return isobject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

var isPlainObject = function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
};

var global$1 = typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {}

var global$1$1 = typeof global$1 !== "undefined" ? global$1 :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {};

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}
function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

/* eslint-disable no-console */

/**
 * Is in development?
 *
 * @type {Boolean}
 */

var IS_DEV = typeof process !== 'undefined' && process.env && "development" !== 'production';

/**
 * Has console?
 *
 * @type {Boolean}
 */

var HAS_CONSOLE = typeof console != 'undefined' && typeof console.log == 'function' && typeof console.warn == 'function' && typeof console.error == 'function';

/**
 * Log a `message` at `level`.
 *
 * @param {String} level
 * @param {String} message
 * @param {Any} ...args
 */

function log(level, message) {
  if (!IS_DEV) {
    return;
  }

  if (HAS_CONSOLE) {
    var _console;

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    (_console = console)[level].apply(_console, [message].concat(args));
  }
}

/**
 * Log an error `message`.
 *
 * @param {String} message
 * @param {Any} ...args
 */

function error(message) {
  if (HAS_CONSOLE) {
    var _console2;

    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    (_console2 = console).error.apply(_console2, [message].concat(args));
  }
}

/**
 * Log a warning `message` in development only.
 *
 * @param {String} message
 * @param {Any} ...args
 */

function warn(message) {
  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  log.apply(undefined, ['warn', 'Warning: ' + message].concat(args));
}

/**
 * Log a deprecation warning `message`, with helpful `version` number in
 * development only.
 *
 * @param {String} version
 * @param {String} message
 * @param {Any} ...args
 */

function deprecate(version$$1, message) {
  for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    args[_key4 - 2] = arguments[_key4];
  }

  log.apply(undefined, ['warn', 'Deprecation (' + version$$1 + '): ' + message].concat(args));
}

/**
 * Export.
 *
 * @type {Function}
 */

var index = {
  deprecate: deprecate,
  error: error,
  warn: warn
};

/**
 * Slate-specific model types.
 *
 * @type {Object}
 */

var MODEL_TYPES = {
  BLOCK: '@@__SLATE_BLOCK__@@',
  CHANGE: '@@__SLATE_CHANGE__@@',
  CHARACTER: '@@__SLATE_CHARACTER__@@',
  DOCUMENT: '@@__SLATE_DOCUMENT__@@',
  HISTORY: '@@__SLATE_HISTORY__@@',
  INLINE: '@@__SLATE_INLINE__@@',
  LEAF: '@@__SLATE_LEAF__@@',
  MARK: '@@__SLATE_MARK__@@',
  OPERATION: '@@__SLATE_OPERATION__@@',
  RANGE: '@@__SLATE_RANGE__@@',
  SCHEMA: '@@__SLATE_SCHEMA__@@',
  STACK: '@@__SLATE_STACK__@@',
  TEXT: '@@__SLATE_TEXT__@@',
  VALUE: '@@__SLATE_VALUE__@@'

  /**
   * Export type identification function
   *
   * @param {string} type
   * @param {any} any
   * @return {boolean}
   */

};function isType(type, any) {
  return !!(any && any[MODEL_TYPES[type]]);
}

/**
 * An auto-incrementing index for generating keys.
 *
 * @type {Number}
 */

var n = void 0;

/**
 * The global key generating function.
 *
 * @type {Function}
 */

var generate = void 0;

/**
 * Generate a key.
 *
 * @return {String}
 */

function generateKey() {
  return generate();
}

/**
 * Set a different unique ID generating `function`.
 *
 * @param {Function} func
 */

function setKeyGenerator(func) {
  generate = func;
}

/**
 * Reset the key generating function to its initial state.
 */

function resetKeyGenerator() {
  n = 0;
  generate = function generate() {
    return "" + n++;
  };
}

/**
 * Set the initial state.
 */

resetKeyGenerator();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/**
 * Dependencies.
 */

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS = {
  data: new immutable.Map(),
  isVoid: false,
  key: undefined,
  nodes: new immutable.List(),
  type: undefined

  /**
   * Block.
   *
   * @type {Block}
   */

};
var Block = function (_Record) {
  inherits(Block, _Record);

  function Block() {
    classCallCheck(this, Block);
    return possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).apply(this, arguments));
  }

  createClass(Block, [{
    key: 'toJSON',


    /**
     * Return a JSON representation of the block.
     *
     * @param {Object} options
     * @return {Object}
     */

    value: function toJSON() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var object = {
        object: this.object,
        type: this.type,
        isVoid: this.isVoid,
        data: this.data.toJSON(),
        nodes: this.nodes.toArray().map(function (n) {
          return n.toJSON(options);
        })
      };

      if (options.preserveKeys) {
        object.key = this.key;
      }

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS(options) {
      return this.toJSON(options);
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'block';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      index.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }

    /**
     * Check if the block is empty.
     * Returns true if block is not void and all it's children nodes are empty.
     * Void node is never empty, regardless of it's content.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isEmpty',
    get: function get$$1() {
      return !this.isVoid && !this.nodes.some(function (child) {
        return !child.isEmpty;
      });
    }

    /**
     * Get the concatenated text of all the block's children.
     *
     * @return {String}
     */

  }, {
    key: 'text',
    get: function get$$1() {
      return this.getText();
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Block` from `attrs`.
     *
     * @param {Object|String|Block} attrs
     * @return {Block}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Block.isBlock(attrs)) {
        return attrs;
      }

      if (typeof attrs == 'string') {
        attrs = { type: attrs };
      }

      if (isPlainObject(attrs)) {
        return Block.fromJSON(attrs);
      }

      throw new Error('`Block.create` only accepts objects, strings or blocks, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Blocks` from `attrs`.
     *
     * @param {Array<Block|Object>|List<Block|Object>} attrs
     * @return {List<Block>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (immutable.List.isList(attrs) || Array.isArray(attrs)) {
        var list = new immutable.List(attrs.map(Block.create));
        return list;
      }

      throw new Error('`Block.createList` only accepts arrays or lists, but you passed it: ' + attrs);
    }

    /**
     * Create a `Block` from a JSON `object`.
     *
     * @param {Object|Block} object
     * @return {Block}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      if (Block.isBlock(object)) {
        return object;
      }

      var _object$data = object.data,
          data = _object$data === undefined ? {} : _object$data,
          _object$isVoid = object.isVoid,
          isVoid = _object$isVoid === undefined ? false : _object$isVoid,
          _object$key = object.key,
          key = _object$key === undefined ? generateKey() : _object$key,
          _object$nodes = object.nodes,
          nodes = _object$nodes === undefined ? [] : _object$nodes,
          type = object.type;


      if (typeof type != 'string') {
        throw new Error('`Block.fromJSON` requires a `type` string.');
      }

      var block = new Block({
        key: key,
        type: type,
        isVoid: !!isVoid,
        data: immutable.Map(data),
        nodes: Block.createChildren(nodes)
      });

      return block;
    }

    /**
     * Alias `fromJS`.
     */

    /**
     * Check if `any` is a `Block`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isBlockList',


    /**
     * Check if `any` is a block list.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isBlockList(any) {
      return immutable.List.isList(any) && any.every(function (item) {
        return Block.isBlock(item);
      });
    }
  }]);
  return Block;
}(immutable.Record(DEFAULTS));

/**
 * Attach a pseudo-symbol for type checking.
 */

Block.fromJS = Block.fromJSON;
Block.isBlock = isType.bind(null, 'BLOCK');
Block.prototype[MODEL_TYPES.BLOCK] = true;

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout$1() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout$1 () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout$1 = defaultSetTimout$1;
var cachedClearTimeout$1 = defaultClearTimeout$1;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout$1 = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout$1 = clearTimeout;
}

function runTimeout$1(fun) {
    if (cachedSetTimeout$1 === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout$1 === defaultSetTimout$1 || !cachedSetTimeout$1) && setTimeout) {
        cachedSetTimeout$1 = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout$1(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout$1.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout$1.call(this, fun, 0);
        }
    }


}
function runClearTimeout$1(marker) {
    if (cachedClearTimeout$1 === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout$1 === defaultClearTimeout$1 || !cachedClearTimeout$1) && clearTimeout) {
        cachedClearTimeout$1 = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout$1(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout$1.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout$1.call(this, marker);
        }
    }



}
var queue$1 = [];
var draining$1 = false;
var currentQueue$1;
var queueIndex$1 = -1;

function cleanUpNextTick$1() {
    if (!draining$1 || !currentQueue$1) {
        return;
    }
    draining$1 = false;
    if (currentQueue$1.length) {
        queue$1 = currentQueue$1.concat(queue$1);
    } else {
        queueIndex$1 = -1;
    }
    if (queue$1.length) {
        drainQueue$1();
    }
}

function drainQueue$1() {
    if (draining$1) {
        return;
    }
    var timeout = runTimeout$1(cleanUpNextTick$1);
    draining$1 = true;

    var len = queue$1.length;
    while(len) {
        currentQueue$1 = queue$1;
        queue$1 = [];
        while (++queueIndex$1 < len) {
            if (currentQueue$1) {
                currentQueue$1[queueIndex$1].run();
            }
        }
        queueIndex$1 = -1;
        len = queue$1.length;
    }
    currentQueue$1 = null;
    draining$1 = false;
    runClearTimeout$1(timeout);
}
function nextTick$1(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue$1.push(new Item$1(fun, args));
    if (queue$1.length === 1 && !draining$1) {
        runTimeout$1(drainQueue$1);
    }
}
// v8 likes predictible objects
function Item$1(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item$1.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title$1 = 'browser';
var platform$1 = 'browser';
var browser$1 = true;
var env$1 = {};
var argv$1 = [];
var version$1 = ''; // empty string to avoid regexp issues
var versions$1 = {};
var release$1 = {};
var config$1 = {};

function noop$1() {}

var on$1 = noop$1;
var addListener$1 = noop$1;
var once$1 = noop$1;
var off$1 = noop$1;
var removeListener$1 = noop$1;
var removeAllListeners$1 = noop$1;
var emit$1 = noop$1;

function binding$1(name) {
    throw new Error('process.binding is not supported');
}

function cwd$1 () { return '/' }
function chdir$1 (dir) {
    throw new Error('process.chdir is not supported');
}
function umask$1() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance$1 = global$1.performance || {};
var performanceNow$1 =
  performance$1.now        ||
  performance$1.mozNow     ||
  performance$1.msNow      ||
  performance$1.oNow       ||
  performance$1.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime$1(previousTimestamp){
  var clocktime = performanceNow$1.call(performance$1)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime$1 = new Date();
function uptime$1() {
  var currentTime = new Date();
  var dif = currentTime - startTime$1;
  return dif / 1000;
}

var process$1 = {
  nextTick: nextTick$1,
  title: title$1,
  browser: browser$1,
  env: env$1,
  argv: argv$1,
  version: version$1,
  versions: versions$1,
  on: on$1,
  addListener: addListener$1,
  once: once$1,
  off: off$1,
  removeListener: removeListener$1,
  removeAllListeners: removeAllListeners$1,
  emit: emit$1,
  binding: binding$1,
  cwd: cwd$1,
  chdir: chdir$1,
  umask: umask$1,
  hrtime: hrtime$1,
  platform: platform$1,
  release: release$1,
  config: config$1,
  uptime: uptime$1
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

var debug = createCommonjsModule(function (module, exports) {
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = ms;

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms$$1 = curr - (prevTime || curr);
    self.diff = ms$$1;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}
});

var debug_1 = debug.coerce;
var debug_2 = debug.disable;
var debug_3 = debug.enable;
var debug_4 = debug.enabled;
var debug_5 = debug.humanize;
var debug_6 = debug.instances;
var debug_7 = debug.names;
var debug_8 = debug.skips;
var debug_9 = debug.formatters;

var browser$2 = createCommonjsModule(function (module, exports) {
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process$1 !== 'undefined' && 'env' in process$1) {
    r = process$1.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
});

var browser_1 = browser$2.log;
var browser_2 = browser$2.formatArgs;
var browser_3 = browser$2.save;
var browser_4 = browser$2.load;
var browser_5 = browser$2.useColors;
var browser_6 = browser$2.storage;
var browser_7 = browser$2.colors;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol_1(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject$1;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]';
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;
var objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/* Built-in method references that are verified to be native. */
var Map$1 = _getNative(_root, 'Map');

var _Map = Map$1;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || _MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = _MapCache;

var memoize_1 = memoize;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize_1(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped;

/** Used to match property names within property paths. */
var reLeadingDot = /^\./;
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = _memoizeCapped(function(string) {
  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined;
var symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }
  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}

var _castPath = castPath;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

var _toKey = toKey;

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = _castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[_toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

var _baseGet = baseGet;

var defineProperty$1 = (function() {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty = defineProperty$1;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty) {
    _defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$4.call(object, key) && eq_1(objValue, value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignValue = assignValue;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject_1(object)) {
    return object;
  }
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = _toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject_1(objValue)
          ? objValue
          : (_isIndex(path[index + 1]) ? [] : {});
      }
    }
    _assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

var _baseSet = baseSet;

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, paths, predicate) {
  var index = -1,
      length = paths.length,
      result = {};

  while (++index < length) {
    var path = paths[index],
        value = _baseGet(object, path);

    if (predicate(value, path)) {
      _baseSet(result, _castPath(path, object), value);
    }
  }
  return result;
}

var _basePickBy = basePickBy;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$5.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

var isLength_1 = isLength;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = _toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_1(length) && _isIndex(key, length) &&
    (isArray_1(object) || isArguments_1(object));
}

var _hasPath = hasPath;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && _hasPath(object, path, _baseHasIn);
}

var hasIn_1 = hasIn;

/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, paths) {
  return _basePickBy(object, paths, function(value, path) {
    return hasIn_1(object, path);
  });
}

var _basePick = basePick;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

/** Built-in value references. */
var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray_1(value) || isArguments_1(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

var _isFlattenable = isFlattenable;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = _isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        _arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

var _baseFlatten = baseFlatten;

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? _baseFlatten(array, 1) : [];
}

var flatten_1 = flatten;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var _apply = apply;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return _apply(func, this, otherArgs);
  };
}

var _overRest = overRest;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

var constant_1 = constant;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !_defineProperty ? identity_1 : function(func, string) {
  return _defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant_1(string),
    'writable': true
  });
};

var _baseSetToString = baseSetToString;

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800;
var HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var _shortOut = shortOut;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = _shortOut(_baseSetToString);

var _setToString = setToString;

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return _setToString(_overRest(func, undefined, flatten_1), func + '');
}

var _flatRest = flatRest;

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = _flatRest(function(object, paths) {
  return object == null ? {} : _basePick(object, paths);
});

var pick_1 = pick;

/**
 * Dependencies.
 */

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$1 = {
  data: new immutable.Map(),
  isVoid: false,
  key: undefined,
  nodes: new immutable.List(),
  type: undefined

  /**
   * Inline.
   *
   * @type {Inline}
   */

};
var Inline = function (_Record) {
  inherits(Inline, _Record);

  function Inline() {
    classCallCheck(this, Inline);
    return possibleConstructorReturn(this, (Inline.__proto__ || Object.getPrototypeOf(Inline)).apply(this, arguments));
  }

  createClass(Inline, [{
    key: 'toJSON',


    /**
     * Return a JSON representation of the inline.
     *
     * @param {Object} options
     * @return {Object}
     */

    value: function toJSON() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var object = {
        object: this.object,
        type: this.type,
        isVoid: this.isVoid,
        data: this.data.toJSON(),
        nodes: this.nodes.toArray().map(function (n) {
          return n.toJSON(options);
        })
      };

      if (options.preserveKeys) {
        object.key = this.key;
      }

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS(options) {
      return this.toJSON(options);
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'inline';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      index.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }

    /**
     * Check if the inline is empty.
     * Returns true if inline is not void and all it's children nodes are empty.
     * Void node is never empty, regardless of it's content.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isEmpty',
    get: function get$$1() {
      return !this.isVoid && !this.nodes.some(function (child) {
        return !child.isEmpty;
      });
    }

    /**
     * Get the concatenated text of all the inline's children.
     *
     * @return {String}
     */

  }, {
    key: 'text',
    get: function get$$1() {
      return this.getText();
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Inline` with `attrs`.
     *
     * @param {Object|String|Inline} attrs
     * @return {Inline}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Inline.isInline(attrs)) {
        return attrs;
      }

      if (typeof attrs == 'string') {
        attrs = { type: attrs };
      }

      if (isPlainObject(attrs)) {
        return Inline.fromJSON(attrs);
      }

      throw new Error('`Inline.create` only accepts objects, strings or inlines, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Inlines` from an array.
     *
     * @param {Array<Inline|Object>|List<Inline|Object>} elements
     * @return {List<Inline>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (immutable.List.isList(elements) || Array.isArray(elements)) {
        var list = new immutable.List(elements.map(Inline.create));
        return list;
      }

      throw new Error('`Inline.createList` only accepts arrays or lists, but you passed it: ' + elements);
    }

    /**
     * Create a `Inline` from a JSON `object`.
     *
     * @param {Object|Inline} object
     * @return {Inline}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      if (Inline.isInline(object)) {
        return object;
      }

      var _object$data = object.data,
          data = _object$data === undefined ? {} : _object$data,
          _object$isVoid = object.isVoid,
          isVoid = _object$isVoid === undefined ? false : _object$isVoid,
          _object$key = object.key,
          key = _object$key === undefined ? generateKey() : _object$key,
          _object$nodes = object.nodes,
          nodes = _object$nodes === undefined ? [] : _object$nodes,
          type = object.type;


      if (typeof type != 'string') {
        throw new Error('`Inline.fromJS` requires a `type` string.');
      }

      var inline = new Inline({
        key: key,
        type: type,
        isVoid: !!isVoid,
        data: new immutable.Map(data),
        nodes: Inline.createChildren(nodes)
      });

      return inline;
    }

    /**
     * Alias `fromJS`.
     */

    /**
     * Check if `any` is a `Inline`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isInlineList',


    /**
     * Check if `any` is a list of inlines.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isInlineList(any) {
      return immutable.List.isList(any) && any.every(function (item) {
        return Inline.isInline(item);
      });
    }
  }]);
  return Inline;
}(immutable.Record(DEFAULTS$1));

/**
 * Attach a pseudo-symbol for type checking.
 */

Inline.fromJS = Inline.fromJSON;
Inline.isInline = isType.bind(null, 'INLINE');
Inline.prototype[MODEL_TYPES.INLINE] = true;

/**
 * Data.
 *
 * This isn't an immutable record, it's just a thin wrapper around `Map` so that
 * we can allow for more convenient creation.
 *
 * @type {Object}
 */

var Data = function () {
  function Data() {
    classCallCheck(this, Data);
  }

  createClass(Data, null, [{
    key: 'create',

    /**
     * Create a new `Data` with `attrs`.
     *
     * @param {Object|Data|Map} attrs
     * @return {Data} data
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (immutable.Map.isMap(attrs)) {
        return attrs;
      }

      if (isPlainObject(attrs)) {
        return Data.fromJSON(attrs);
      }

      throw new Error('`Data.create` only accepts objects or maps, but you passed it: ' + attrs);
    }

    /**
     * Create a `Data` from a JSON `object`.
     *
     * @param {Object} object
     * @return {Data}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      return new immutable.Map(object);
    }

    /**
     * Alias `fromJS`.
     */

  }]);
  return Data;
}();

/**
 * Export.
 *
 * @type {Object}
 */

Data.fromJS = Data.fromJSON;

/**
 * GLOBAL: True if memoization should is enabled.
 *
 * @type {Boolean}
 */

var ENABLED = true;

/**
 * GLOBAL: Changing this cache key will clear all previous cached results.
 *
 * @type {Number}
 */

var CACHE_KEY = 0;

/**
 * The leaf node of a cache tree. Used to support variable argument length. A
 * unique object, so that native Maps will key it by reference.
 *
 * @type {Object}
 */

var LEAF = {};

/**
 * A value to represent a memoized undefined value. Allows efficient value
 * retrieval using Map.get only.
 *
 * @type {Object}
 */

var UNDEFINED = {};

/**
 * Default value for unset keys in native Maps
 *
 * @type {Undefined}
 */

var UNSET = undefined;

/**
 * Memoize all of the `properties` on a `object`.
 *
 * @param {Object} object
 * @param {Array} properties
 * @return {Record}
 */

function memoize$2(object, properties) {
  var _loop = function _loop(property) {
    var original = object[property];

    if (!original) {
      throw new Error("Object does not have a property named \"" + property + "\".");
    }

    object[property] = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // If memoization is disabled, call into the original method.
      if (!ENABLED) return original.apply(this, args);

      // If the cache key is different, previous caches must be cleared.
      if (CACHE_KEY !== this.__cache_key) {
        this.__cache_key = CACHE_KEY;
        this.__cache = new Map(); // eslint-disable-line no-undef,no-restricted-globals
        this.__cache_no_args = {};
      }

      if (!this.__cache) {
        this.__cache = new Map(); // eslint-disable-line no-undef,no-restricted-globals
      }

      if (!this.__cache_no_args) {
        this.__cache_no_args = {};
      }

      var takesArguments = args.length !== 0;

      var cachedValue = void 0;
      var keys = void 0;

      if (takesArguments) {
        keys = [property].concat(args);
        cachedValue = getIn(this.__cache, keys);
      } else {
        cachedValue = this.__cache_no_args[property];
      }

      // If we've got a result already, return it.
      if (cachedValue !== UNSET) {
        return cachedValue === UNDEFINED ? undefined : cachedValue;
      }

      // Otherwise calculate what it should be once and cache it.
      var value = original.apply(this, args);
      var v = value === undefined ? UNDEFINED : value;

      if (takesArguments) {
        this.__cache = setIn(this.__cache, keys, v);
      } else {
        this.__cache_no_args[property] = v;
      }

      return value;
    };
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var property = _step.value;

      _loop(property);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

/**
 * Get a value at a key path in a tree of Map.
 *
 * If not set, returns UNSET.
 * If the set value is undefined, returns UNDEFINED.
 *
 * @param {Map} map
 * @param {Array} keys
 * @return {Any|UNSET|UNDEFINED}
 */

function getIn(map, keys) {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var key = _step2.value;

      map = map.get(key);
      if (map === UNSET) return UNSET;
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return map.get(LEAF);
}

/**
 * Set a value at a key path in a tree of Map, creating Maps on the go.
 *
 * @param {Map} map
 * @param {Array} keys
 * @param {Any} value
 * @return {Map}
 */

function setIn(map, keys, value) {
  var parent = map;
  var child = void 0;

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var key = _step3.value;

      child = parent.get(key);

      // If the path was not created yet...
      if (child === UNSET) {
        child = new Map(); // eslint-disable-line no-undef,no-restricted-globals
        parent.set(key, child);
      }

      parent = child;
    }

    // The whole path has been created, so set the value to the bottom most map.
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  child.set(LEAF, value);
  return map;
}

/**
 * In DEV mode, clears the previously memoized values, globally.
 *
 * @return {Void}
 */

function resetMemoization() {
  CACHE_KEY++;

  if (CACHE_KEY >= Number.MAX_SAFE_INTEGER) {
    CACHE_KEY = 0;
  }
}

/**
 * In DEV mode, enable or disable the use of memoize values, globally.
 *
 * @param {Boolean} enabled
 * @return {Void}
 */

function useMemoization(enabled) {
  ENABLED = enabled;
}

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$2 = {
  data: new immutable.Map(),
  type: undefined

  /**
   * Mark.
   *
   * @type {Mark}
   */

};
var Mark = function (_Record) {
  inherits(Mark, _Record);

  function Mark() {
    classCallCheck(this, Mark);
    return possibleConstructorReturn(this, (Mark.__proto__ || Object.getPrototypeOf(Mark)).apply(this, arguments));
  }

  createClass(Mark, [{
    key: 'getComponent',


    /**
     * Get the component for the node from a `schema`.
     *
     * @param {Schema} schema
     * @return {Component|Void}
     */

    value: function getComponent(schema) {
      return schema.__getComponent(this);
    }

    /**
     * Return a JSON representation of the mark.
     *
     * @return {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var object = {
        object: this.object,
        type: this.type,
        data: this.data.toJSON()
      };

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS() {
      return this.toJSON();
    }
  }, {
    key: 'object',


    /**
     * Object.
     */

    get: function get$$1() {
      return 'mark';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      index.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Mark` with `attrs`.
     *
     * @param {Object|Mark} attrs
     * @return {Mark}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Mark.isMark(attrs)) {
        return attrs;
      }

      if (typeof attrs == 'string') {
        attrs = { type: attrs };
      }

      if (isPlainObject(attrs)) {
        return Mark.fromJSON(attrs);
      }

      throw new Error('`Mark.create` only accepts objects, strings or marks, but you passed it: ' + attrs);
    }

    /**
     * Create a set of marks.
     *
     * @param {Array<Object|Mark>} elements
     * @return {Set<Mark>}
     */

  }, {
    key: 'createSet',
    value: function createSet(elements) {
      if (immutable.Set.isSet(elements) || Array.isArray(elements)) {
        var marks = new immutable.Set(elements.map(Mark.create));
        return marks;
      }

      if (elements == null) {
        return immutable.Set();
      }

      throw new Error('`Mark.createSet` only accepts sets, arrays or null, but you passed it: ' + elements);
    }

    /**
     * Create a dictionary of settable mark properties from `attrs`.
     *
     * @param {Object|String|Mark} attrs
     * @return {Object}
     */

  }, {
    key: 'createProperties',
    value: function createProperties() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Mark.isMark(attrs)) {
        return {
          data: attrs.data,
          type: attrs.type
        };
      }

      if (typeof attrs == 'string') {
        return { type: attrs };
      }

      if (isPlainObject(attrs)) {
        var props = {};
        if ('type' in attrs) props.type = attrs.type;
        if ('data' in attrs) props.data = Data.create(attrs.data);
        return props;
      }

      throw new Error('`Mark.createProperties` only accepts objects, strings or marks, but you passed it: ' + attrs);
    }

    /**
     * Create a `Mark` from a JSON `object`.
     *
     * @param {Object} object
     * @return {Mark}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      var _object$data = object.data,
          data = _object$data === undefined ? {} : _object$data,
          type = object.type;


      if (typeof type != 'string') {
        throw new Error('`Mark.fromJS` requires a `type` string.');
      }

      var mark = new Mark({
        type: type,
        data: new immutable.Map(data)
      });

      return mark;
    }

    /**
     * Alias `fromJS`.
     */

    /**
     * Check if `any` is a `Mark`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isMarkSet',


    /**
     * Check if `any` is a set of marks.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isMarkSet(any) {
      return immutable.Set.isSet(any) && any.every(function (item) {
        return Mark.isMark(item);
      });
    }
  }]);
  return Mark;
}(immutable.Record(DEFAULTS$2));

/**
 * Attach a pseudo-symbol for type checking.
 */

Mark.fromJS = Mark.fromJSON;
Mark.isMark = isType.bind(null, 'MARK');
Mark.prototype[MODEL_TYPES.MARK] = true;

/**
 * Memoize read methods.
 */

memoize$2(Mark.prototype, ['getComponent']);

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes = {};

/**
 * Mix in the changes that pass through to their at-range equivalents because
 * they don't have any effect on the selection.
 */

var PROXY_TRANSFORMS = ['deleteBackward', 'deleteCharBackward', 'deleteLineBackward', 'deleteWordBackward', 'deleteForward', 'deleteCharForward', 'deleteWordForward', 'deleteLineForward', 'setBlocks', 'setInlines', 'splitInline', 'unwrapBlock', 'unwrapInline', 'wrapBlock', 'wrapInline'];

PROXY_TRANSFORMS.forEach(function (method) {
  Changes[method] = function (change) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var value = change.value;
    var selection = value.selection;

    var methodAtRange = method + 'AtRange';
    change[methodAtRange].apply(change, [selection].concat(args));

    if (method.match(/Backward$/)) {
      change.collapseToStart();
    } else if (method.match(/Forward$/)) {
      change.collapseToEnd();
    }
  };
});

Changes.setBlock = function () {
  index.deprecate('slate@0.33.0', 'The `setBlock` method of Slate changes has been renamed to `setBlocks`.');

  Changes.setBlocks.apply(Changes, arguments);
};

Changes.setInline = function () {
  index.deprecate('slate@0.33.0', 'The `setInline` method of Slate changes has been renamed to `setInlines`.');

  Changes.setInlines.apply(Changes, arguments);
};

/**
 * Add a `mark` to the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.addMark = function (change, mark) {
  mark = Mark.create(mark);
  var value = change.value;
  var document = value.document,
      selection = value.selection;


  if (selection.isExpanded) {
    change.addMarkAtRange(selection, mark);
  } else if (selection.marks) {
    var marks = selection.marks.add(mark);
    var sel = selection.set('marks', marks);
    change.select(sel);
  } else {
    var _marks = document.getActiveMarksAtRange(selection).add(mark);
    var _sel = selection.set('marks', _marks);
    change.select(_sel);
  }
};

/**
 * Add a list of `marks` to the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.addMarks = function (change, marks) {
  marks.forEach(function (mark) {
    return change.addMark(mark);
  });
};

/**
 * Delete at the current selection.
 *
 * @param {Change} change
 */

Changes.delete = function (change) {
  var value = change.value;
  var selection = value.selection;

  change.deleteAtRange(selection);

  // Ensure that the selection is collapsed to the start, because in certain
  // cases when deleting across inline nodes, when splitting the inline node the
  // end point of the selection will end up after the split point.
  change.collapseToStart();
};

/**
 * Insert a `block` at the current selection.
 *
 * @param {Change} change
 * @param {String|Object|Block} block
 */

Changes.insertBlock = function (change, block) {
  block = Block.create(block);
  var value = change.value;
  var selection = value.selection;

  change.insertBlockAtRange(selection, block);

  // If the node was successfully inserted, update the selection.
  var node = change.value.document.getNode(block.key);
  if (node) change.collapseToEndOf(node);
};

/**
 * Insert a `fragment` at the current selection.
 *
 * @param {Change} change
 * @param {Document} fragment
 */

Changes.insertFragment = function (change, fragment) {
  if (!fragment.nodes.size) return;

  var value = change.value;
  var _value = value,
      document = _value.document,
      selection = _value.selection;
  var _value2 = value,
      startText = _value2.startText,
      endText = _value2.endText,
      startInline = _value2.startInline;

  var lastText = fragment.getLastText();
  var lastInline = fragment.getClosestInline(lastText.key);
  var firstChild = fragment.nodes.first();
  var lastChild = fragment.nodes.last();
  var keys = document.getTexts().map(function (text) {
    return text.key;
  });
  var isAppending = !startInline || selection.hasEdgeAtStartOf(startText) || selection.hasEdgeAtEndOf(endText);

  var isInserting = fragment.hasBlocks(firstChild.key) || fragment.hasBlocks(lastChild.key);

  change.insertFragmentAtRange(selection, fragment);
  value = change.value;
  document = value.document;

  var newTexts = document.getTexts().filter(function (n) {
    return !keys.includes(n.key);
  });
  var newText = isAppending ? newTexts.last() : newTexts.takeLast(2).first();

  if (newText && (lastInline || isInserting)) {
    change.select(selection.collapseToEndOf(newText));
  } else if (newText) {
    change.select(selection.collapseToStartOf(newText).move(lastText.text.length));
  } else {
    change.select(selection.collapseToStart().move(lastText.text.length));
  }
};

/**
 * Insert an `inline` at the current selection.
 *
 * @param {Change} change
 * @param {String|Object|Inline} inline
 */

Changes.insertInline = function (change, inline) {
  inline = Inline.create(inline);
  var value = change.value;
  var selection = value.selection;

  change.insertInlineAtRange(selection, inline);

  // If the node was successfully inserted, update the selection.
  var node = change.value.document.getNode(inline.key);
  if (node) change.collapseToEndOf(node);
};

/**
 * Insert a string of `text` with optional `marks` at the current selection.
 *
 * @param {Change} change
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 */

Changes.insertText = function (change, text, marks) {
  var value = change.value;
  var document = value.document,
      selection = value.selection;

  marks = marks || selection.marks || document.getInsertMarksAtRange(selection);
  change.insertTextAtRange(selection, text, marks);

  // If the text was successfully inserted, and the selection had marks on it,
  // unset the selection's marks.
  if (selection.marks && document != change.value.document) {
    change.select({ marks: null });
  }
};

/**
 * Split the block node at the current selection, to optional `depth`.
 *
 * @param {Change} change
 * @param {Number} depth (optional)
 */

Changes.splitBlock = function (change) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var value = change.value;
  var selection = value.selection,
      document = value.document;

  var marks = selection.marks || document.getInsertMarksAtRange(selection);
  change.splitBlockAtRange(selection, depth).collapseToEnd();

  if (marks && marks.size !== 0) {
    change.select({ marks: marks });
  }
};

/**
 * Remove a `mark` from the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.removeMark = function (change, mark) {
  mark = Mark.create(mark);
  var value = change.value;
  var document = value.document,
      selection = value.selection;


  if (selection.isExpanded) {
    change.removeMarkAtRange(selection, mark);
  } else if (selection.marks) {
    var marks = selection.marks.remove(mark);
    var sel = selection.set('marks', marks);
    change.select(sel);
  } else {
    var _marks2 = document.getActiveMarksAtRange(selection).remove(mark);
    var _sel2 = selection.set('marks', _marks2);
    change.select(_sel2);
  }
};

/**
 * Replace an `oldMark` with a `newMark` in the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} oldMark
 * @param {Mark} newMark
 */

Changes.replaceMark = function (change, oldMark, newMark) {
  change.removeMark(oldMark);
  change.addMark(newMark);
};

/**
 * Add or remove a `mark` from the characters in the current selection,
 * depending on whether it's already there.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.toggleMark = function (change, mark) {
  mark = Mark.create(mark);
  var value = change.value;

  var exists = value.activeMarks.has(mark);

  if (exists) {
    change.removeMark(mark);
  } else {
    change.addMark(mark);
  }
};

/**
 * Wrap the current selection with prefix/suffix.
 *
 * @param {Change} change
 * @param {String} prefix
 * @param {String} suffix
 */

Changes.wrapText = function (change, prefix) {
  var suffix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : prefix;
  var value = change.value;
  var selection = value.selection;

  change.wrapTextAtRange(selection, prefix, suffix);

  // If the selection was collapsed, it will have moved the start offset too.
  if (selection.isCollapsed) {
    change.moveStart(0 - prefix.length);
  }

  // Adding the suffix will have pushed the end of the selection further on, so
  // we need to move it back to account for this.
  change.moveEnd(0 - suffix.length);

  // There's a chance that the selection points moved "through" each other,
  // resulting in a now-incorrect selection direction.
  if (selection.isForward != change.value.selection.isForward) {
    change.flip();
  }
};

var GROUP_LEFT_TO_RIGHT;
var GROUP_RIGHT_TO_LEFT;
var EXPRESSION_LEFT_TO_RIGHT;
var EXPRESSION_RIGHT_TO_LEFT;

/*
 * Character ranges of left-to-right characters.
 */

GROUP_LEFT_TO_RIGHT = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6' +
    '\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF\u200E\u2C00-\uFB1C' +
    '\uFE00-\uFE6F\uFEFD-\uFFFF';

/*
 * Character ranges of right-to-left characters.
 */

GROUP_RIGHT_TO_LEFT = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC';

/*
 * Expression to match a left-to-right string.
 *
 * Matches the start of a string, followed by zero or
 * more non-right-to-left characters, followed by a
 * left-to-right character.
 */

EXPRESSION_LEFT_TO_RIGHT = new RegExp(
    '^[^' + GROUP_RIGHT_TO_LEFT + ']*[' + GROUP_LEFT_TO_RIGHT + ']'
);

/*
 * Expression to match a right-to-left string.
 *
 * Matches the start of a string, followed by zero or
 * more non-left-to-right characters, followed by a
 * right-to-left character.
 */

EXPRESSION_RIGHT_TO_LEFT = new RegExp(
    '^[^' + GROUP_LEFT_TO_RIGHT + ']*[' + GROUP_RIGHT_TO_LEFT + ']'
);

/**
 * Detect the direction of text.
 *
 * @param {string} value - value to stringify and check.
 * @return {string} - One of `"rtl"`, `"ltr"`, or
 *   `"neutral"`.
 */
function direction(value) {
    value = value.toString();

    if (EXPRESSION_RIGHT_TO_LEFT.test(value)) {
        return 'rtl';
    }

    if (EXPRESSION_LEFT_TO_RIGHT.test(value)) {
        return 'ltr';
    }

    return 'neutral';
}

/*
 * Expose `direction`.
 */

var direction_1 = direction;

/**
 * Dependencies.
 */

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$3 = {
  data: new immutable.Map(),
  key: undefined,
  nodes: new immutable.List()

  /**
   * Document.
   *
   * @type {Document}
   */

};
var Document = function (_Record) {
  inherits(Document, _Record);

  function Document() {
    classCallCheck(this, Document);
    return possibleConstructorReturn(this, (Document.__proto__ || Object.getPrototypeOf(Document)).apply(this, arguments));
  }

  createClass(Document, [{
    key: 'toJSON',


    /**
     * Return a JSON representation of the document.
     *
     * @param {Object} options
     * @return {Object}
     */

    value: function toJSON() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var object = {
        object: this.object,
        data: this.data.toJSON(),
        nodes: this.nodes.toArray().map(function (n) {
          return n.toJSON(options);
        })
      };

      if (options.preserveKeys) {
        object.key = this.key;
      }

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS(options) {
      return this.toJSON(options);
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'document';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      index.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }

    /**
     * Check if the document is empty.
     * Returns true if all it's children nodes are empty.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isEmpty',
    get: function get$$1() {
      return !this.nodes.some(function (child) {
        return !child.isEmpty;
      });
    }

    /**
     * Get the concatenated text of all the document's children.
     *
     * @return {String}
     */

  }, {
    key: 'text',
    get: function get$$1() {
      return this.getText();
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Document` with `attrs`.
     *
     * @param {Object|Array|List|Text} attrs
     * @return {Document}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Document.isDocument(attrs)) {
        return attrs;
      }

      if (immutable.List.isList(attrs) || Array.isArray(attrs)) {
        attrs = { nodes: attrs };
      }

      if (isPlainObject(attrs)) {
        return Document.fromJSON(attrs);
      }

      throw new Error('`Document.create` only accepts objects, arrays, lists or documents, but you passed it: ' + attrs);
    }

    /**
     * Create a `Document` from a JSON `object`.
     *
     * @param {Object|Document} object
     * @return {Document}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      if (Document.isDocument(object)) {
        return object;
      }

      var _object$data = object.data,
          data = _object$data === undefined ? {} : _object$data,
          _object$key = object.key,
          key = _object$key === undefined ? generateKey() : _object$key,
          _object$nodes = object.nodes,
          nodes = _object$nodes === undefined ? [] : _object$nodes;


      var document = new Document({
        key: key,
        data: new immutable.Map(data),
        nodes: Document.createChildren(nodes)
      });

      return document;
    }

    /**
     * Alias `fromJS`.
     */

    /**
     * Check if `any` is a `Document`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }]);
  return Document;
}(immutable.Record(DEFAULTS$3));

/**
 * Attach a pseudo-symbol for type checking.
 */

Document.fromJS = Document.fromJSON;
Document.isDocument = isType.bind(null, 'DOCUMENT');
Document.prototype[MODEL_TYPES.DOCUMENT] = true;

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$4 = {
  anchorKey: null,
  anchorOffset: 0,
  focusKey: null,
  focusOffset: 0,
  isBackward: null,
  isFocused: false,
  marks: null,
  isAtomic: false

  /**
   * Range.
   *
   * @type {Range}
   */

};
var Range = function (_Record) {
  inherits(Range, _Record);

  function Range() {
    classCallCheck(this, Range);
    return possibleConstructorReturn(this, (Range.__proto__ || Object.getPrototypeOf(Range)).apply(this, arguments));
  }

  createClass(Range, [{
    key: 'hasAnchorAtStartOf',


    /**
     * Check whether anchor point of the range is at the start of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

    value: function hasAnchorAtStartOf(node) {
      // PERF: Do a check for a `0` offset first since it's quickest.
      if (this.anchorOffset != 0) return false;
      var first = getFirst(node);
      return this.anchorKey == first.key;
    }

    /**
     * Check whether anchor point of the range is at the end of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasAnchorAtEndOf',
    value: function hasAnchorAtEndOf(node) {
      var last = getLast(node);
      return this.anchorKey == last.key && this.anchorOffset == last.text.length;
    }

    /**
     * Check whether the anchor edge of a range is in a `node` and at an
     * offset between `start` and `end`.
     *
     * @param {Node} node
     * @param {Number} start
     * @param {Number} end
     * @return {Boolean}
     */

  }, {
    key: 'hasAnchorBetween',
    value: function hasAnchorBetween(node, start, end) {
      return this.anchorOffset <= end && start <= this.anchorOffset && this.hasAnchorIn(node);
    }

    /**
     * Check whether the anchor edge of a range is in a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasAnchorIn',
    value: function hasAnchorIn(node) {
      return node.object == 'text' ? node.key == this.anchorKey : this.anchorKey != null && node.hasDescendant(this.anchorKey);
    }

    /**
     * Check whether focus point of the range is at the end of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusAtEndOf',
    value: function hasFocusAtEndOf(node) {
      var last = getLast(node);
      return this.focusKey == last.key && this.focusOffset == last.text.length;
    }

    /**
     * Check whether focus point of the range is at the start of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusAtStartOf',
    value: function hasFocusAtStartOf(node) {
      if (this.focusOffset != 0) return false;
      var first = getFirst(node);
      return this.focusKey == first.key;
    }

    /**
     * Check whether the focus edge of a range is in a `node` and at an
     * offset between `start` and `end`.
     *
     * @param {Node} node
     * @param {Number} start
     * @param {Number} end
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusBetween',
    value: function hasFocusBetween(node, start, end) {
      return start <= this.focusOffset && this.focusOffset <= end && this.hasFocusIn(node);
    }

    /**
     * Check whether the focus edge of a range is in a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusIn',
    value: function hasFocusIn(node) {
      return node.object == 'text' ? node.key == this.focusKey : this.focusKey != null && node.hasDescendant(this.focusKey);
    }

    /**
     * Check whether the range is at the start of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'isAtStartOf',
    value: function isAtStartOf(node) {
      return this.isCollapsed && this.hasAnchorAtStartOf(node);
    }

    /**
     * Check whether the range is at the end of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'isAtEndOf',
    value: function isAtEndOf(node) {
      return this.isCollapsed && this.hasAnchorAtEndOf(node);
    }

    /**
     * Focus the range.
     *
     * @return {Range}
     */

  }, {
    key: 'focus',
    value: function focus() {
      return this.merge({
        isFocused: true
      });
    }

    /**
     * Blur the range.
     *
     * @return {Range}
     */

  }, {
    key: 'blur',
    value: function blur() {
      return this.merge({
        isFocused: false
      });
    }

    /**
     * Unset the range.
     *
     * @return {Range}
     */

  }, {
    key: 'deselect',
    value: function deselect() {
      return this.merge({
        anchorKey: null,
        anchorOffset: 0,
        focusKey: null,
        focusOffset: 0,
        isFocused: false,
        isBackward: false
      });
    }

    /**
     * Flip the range.
     *
     * @return {Range}
     */

  }, {
    key: 'flip',
    value: function flip() {
      return this.merge({
        anchorKey: this.focusKey,
        anchorOffset: this.focusOffset,
        focusKey: this.anchorKey,
        focusOffset: this.anchorOffset,
        isBackward: this.isBackward == null ? null : !this.isBackward
      });
    }

    /**
     * Move the anchor offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Range}
     */

  }, {
    key: 'moveAnchor',
    value: function moveAnchor() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var anchorKey = this.anchorKey,
          focusKey = this.focusKey,
          focusOffset = this.focusOffset,
          isBackward = this.isBackward;

      var anchorOffset = this.anchorOffset + n;
      return this.merge({
        anchorOffset: anchorOffset,
        isBackward: anchorKey == focusKey ? anchorOffset > focusOffset : isBackward
      });
    }

    /**
     * Move the anchor offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Range}
     */

  }, {
    key: 'moveFocus',
    value: function moveFocus() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var anchorKey = this.anchorKey,
          anchorOffset = this.anchorOffset,
          focusKey = this.focusKey,
          isBackward = this.isBackward;

      var focusOffset = this.focusOffset + n;
      return this.merge({
        focusOffset: focusOffset,
        isBackward: focusKey == anchorKey ? anchorOffset > focusOffset : isBackward
      });
    }

    /**
     * Move the range's anchor point to a `key` and `offset`.
     *
     * @param {String} key
     * @param {Number} offset
     * @return {Range}
     */

  }, {
    key: 'moveAnchorTo',
    value: function moveAnchorTo(key, offset) {
      var anchorKey = this.anchorKey,
          focusKey = this.focusKey,
          focusOffset = this.focusOffset,
          isBackward = this.isBackward;

      return this.merge({
        anchorKey: key,
        anchorOffset: offset,
        isBackward: key == focusKey ? offset > focusOffset : key == anchorKey ? isBackward : null
      });
    }

    /**
     * Move the range's focus point to a `key` and `offset`.
     *
     * @param {String} key
     * @param {Number} offset
     * @return {Range}
     */

  }, {
    key: 'moveFocusTo',
    value: function moveFocusTo(key, offset) {
      var focusKey = this.focusKey,
          anchorKey = this.anchorKey,
          anchorOffset = this.anchorOffset,
          isBackward = this.isBackward;

      return this.merge({
        focusKey: key,
        focusOffset: offset,
        isBackward: key == anchorKey ? anchorOffset > offset : key == focusKey ? isBackward : null
      });
    }

    /**
     * Move the range to `anchorOffset`.
     *
     * @param {Number} anchorOffset
     * @return {Range}
     */

  }, {
    key: 'moveAnchorOffsetTo',
    value: function moveAnchorOffsetTo(anchorOffset) {
      return this.merge({
        anchorOffset: anchorOffset,
        isBackward: this.anchorKey == this.focusKey ? anchorOffset > this.focusOffset : this.isBackward
      });
    }

    /**
     * Move the range to `focusOffset`.
     *
     * @param {Number} focusOffset
     * @return {Range}
     */

  }, {
    key: 'moveFocusOffsetTo',
    value: function moveFocusOffsetTo(focusOffset) {
      return this.merge({
        focusOffset: focusOffset,
        isBackward: this.anchorKey == this.focusKey ? this.anchorOffset > focusOffset : this.isBackward
      });
    }

    /**
     * Move the range to `anchorOffset` and `focusOffset`.
     *
     * @param {Number} anchorOffset
     * @param {Number} focusOffset (optional)
     * @return {Range}
     */

  }, {
    key: 'moveOffsetsTo',
    value: function moveOffsetsTo(anchorOffset) {
      var focusOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : anchorOffset;

      return this.moveAnchorOffsetTo(anchorOffset).moveFocusOffsetTo(focusOffset);
    }

    /**
     * Move the focus point to the anchor point.
     *
     * @return {Range}
     */

  }, {
    key: 'moveToAnchor',
    value: function moveToAnchor() {
      return this.moveFocusTo(this.anchorKey, this.anchorOffset);
    }

    /**
     * Move the anchor point to the focus point.
     *
     * @return {Range}
     */

  }, {
    key: 'moveToFocus',
    value: function moveToFocus() {
      return this.moveAnchorTo(this.focusKey, this.focusOffset);
    }

    /**
     * Move the range's anchor point to the start of a `node`.
     *
     * @param {Node} node
     * @return {Range}
     */

  }, {
    key: 'moveAnchorToStartOf',
    value: function moveAnchorToStartOf(node) {
      node = getFirst(node);
      return this.moveAnchorTo(node.key, 0);
    }

    /**
     * Move the range's anchor point to the end of a `node`.
     *
     * @param {Node} node
     * @return {Range}
     */

  }, {
    key: 'moveAnchorToEndOf',
    value: function moveAnchorToEndOf(node) {
      node = getLast(node);
      return this.moveAnchorTo(node.key, node.text.length);
    }

    /**
     * Move the range's focus point to the start of a `node`.
     *
     * @param {Node} node
     * @return {Range}
     */

  }, {
    key: 'moveFocusToStartOf',
    value: function moveFocusToStartOf(node) {
      node = getFirst(node);
      return this.moveFocusTo(node.key, 0);
    }

    /**
     * Move the range's focus point to the end of a `node`.
     *
     * @param {Node} node
     * @return {Range}
     */

  }, {
    key: 'moveFocusToEndOf',
    value: function moveFocusToEndOf(node) {
      node = getLast(node);
      return this.moveFocusTo(node.key, node.text.length);
    }

    /**
     * Move to the entire range of `start` and `end` nodes.
     *
     * @param {Node} start
     * @param {Node} end (optional)
     * @return {Range}
     */

  }, {
    key: 'moveToRangeOf',
    value: function moveToRangeOf(start) {
      var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : start;

      var range = this.isBackward ? this.flip() : this;
      return range.moveAnchorToStartOf(start).moveFocusToEndOf(end);
    }

    /**
     * Normalize the range, relative to a `node`, ensuring that the anchor
     * and focus nodes of the range always refer to leaf text nodes.
     *
     * @param {Node} node
     * @return {Range}
     */

  }, {
    key: 'normalize',
    value: function normalize(node) {
      var range = this;
      var anchorKey = range.anchorKey,
          anchorOffset = range.anchorOffset,
          focusKey = range.focusKey,
          focusOffset = range.focusOffset,
          isBackward = range.isBackward;


      var anchorOffsetType = typeof anchorOffset === 'undefined' ? 'undefined' : _typeof(anchorOffset);
      var focusOffsetType = typeof focusOffset === 'undefined' ? 'undefined' : _typeof(focusOffset);

      if (anchorOffsetType != 'number' || focusOffsetType != 'number') {
        index.warn('The range offsets should be numbers, but they were of type "' + anchorOffsetType + '" and "' + focusOffsetType + '".');
      }

      // If the range is unset, make sure it is properly zeroed out.
      if (anchorKey == null || focusKey == null) {
        return range.merge({
          anchorKey: null,
          anchorOffset: 0,
          focusKey: null,
          focusOffset: 0,
          isBackward: false
        });
      }

      // Get the anchor and focus nodes.
      var anchorNode = node.getDescendant(anchorKey);
      var focusNode = node.getDescendant(focusKey);

      // If the range is malformed, warn and zero it out.
      if (!anchorNode || !focusNode) {
        index.warn('The range was invalid and was reset. The range in question was:', range);

        var first = node.getFirstText();
        return range.merge({
          anchorKey: first ? first.key : null,
          anchorOffset: 0,
          focusKey: first ? first.key : null,
          focusOffset: 0,
          isBackward: false
        });
      }

      // If the anchor node isn't a text node, match it to one.
      if (anchorNode.object != 'text') {
        index.warn('The range anchor was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:', anchorNode);

        var anchorText = anchorNode.getTextAtOffset(anchorOffset);
        var offset = anchorNode.getOffset(anchorText.key);
        anchorOffset = anchorOffset - offset;
        anchorNode = anchorText;
      }

      // If the focus node isn't a text node, match it to one.
      if (focusNode.object != 'text') {
        index.warn('The range focus was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:', focusNode);

        var focusText = focusNode.getTextAtOffset(focusOffset);
        var _offset = focusNode.getOffset(focusText.key);
        focusOffset = focusOffset - _offset;
        focusNode = focusText;
      }

      // If `isBackward` is not set, derive it.
      if (isBackward == null) {
        if (anchorNode.key === focusNode.key) {
          isBackward = anchorOffset > focusOffset;
        } else {
          isBackward = !node.areDescendantsSorted(anchorNode.key, focusNode.key);
        }
      }

      // Merge in any updated properties.
      return range.merge({
        anchorKey: anchorNode.key,
        anchorOffset: anchorOffset,
        focusKey: focusNode.key,
        focusOffset: focusOffset,
        isBackward: isBackward
      });
    }

    /**
     * Return a JSON representation of the range.
     *
     * @return {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var object = {
        object: this.object,
        anchorKey: this.anchorKey,
        anchorOffset: this.anchorOffset,
        focusKey: this.focusKey,
        focusOffset: this.focusOffset,
        isBackward: this.isBackward,
        isFocused: this.isFocused,
        marks: this.marks == null ? null : this.marks.toArray().map(function (m) {
          return m.toJSON();
        }),
        isAtomic: this.isAtomic
      };

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS() {
      return this.toJSON();
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'range';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      index.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }

    /**
     * Check whether the range is blurred.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isBlurred',
    get: function get$$1() {
      return !this.isFocused;
    }

    /**
     * Check whether the range is collapsed.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isCollapsed',
    get: function get$$1() {
      return this.anchorKey == this.focusKey && this.anchorOffset == this.focusOffset;
    }

    /**
     * Check whether the range is expanded.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isExpanded',
    get: function get$$1() {
      return !this.isCollapsed;
    }

    /**
     * Check whether the range is forward.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isForward',
    get: function get$$1() {
      return this.isBackward == null ? null : !this.isBackward;
    }

    /**
     * Check whether the range's keys are set.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isSet',
    get: function get$$1() {
      return this.anchorKey != null && this.focusKey != null;
    }

    /**
     * Check whether the range's keys are not set.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isUnset',
    get: function get$$1() {
      return !this.isSet;
    }

    /**
     * Get the start key.
     *
     * @return {String}
     */

  }, {
    key: 'startKey',
    get: function get$$1() {
      return this.isBackward ? this.focusKey : this.anchorKey;
    }

    /**
     * Get the start offset.
     *
     * @return {String}
     */

  }, {
    key: 'startOffset',
    get: function get$$1() {
      return this.isBackward ? this.focusOffset : this.anchorOffset;
    }

    /**
     * Get the end key.
     *
     * @return {String}
     */

  }, {
    key: 'endKey',
    get: function get$$1() {
      return this.isBackward ? this.anchorKey : this.focusKey;
    }

    /**
     * Get the end offset.
     *
     * @return {String}
     */

  }, {
    key: 'endOffset',
    get: function get$$1() {
      return this.isBackward ? this.anchorOffset : this.focusOffset;
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Range` with `attrs`.
     *
     * @param {Object|Range} attrs
     * @return {Range}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Range.isRange(attrs)) {
        return attrs;
      }

      if (isPlainObject(attrs)) {
        return Range.fromJSON(attrs);
      }

      throw new Error('`Range.create` only accepts objects or ranges, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Ranges` from `elements`.
     *
     * @param {Array<Range|Object>|List<Range|Object>} elements
     * @return {List<Range>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (immutable.List.isList(elements) || Array.isArray(elements)) {
        var list = new immutable.List(elements.map(Range.create));
        return list;
      }

      throw new Error('`Range.createList` only accepts arrays or lists, but you passed it: ' + elements);
    }

    /**
     * Create a dictionary of settable range properties from `attrs`.
     *
     * @param {Object|String|Range} attrs
     * @return {Object}
     */

  }, {
    key: 'createProperties',
    value: function createProperties() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Range.isRange(attrs)) {
        return {
          anchorKey: attrs.anchorKey,
          anchorOffset: attrs.anchorOffset,
          focusKey: attrs.focusKey,
          focusOffset: attrs.focusOffset,
          isBackward: attrs.isBackward,
          isFocused: attrs.isFocused,
          marks: attrs.marks,
          isAtomic: attrs.isAtomic
        };
      }

      if (isPlainObject(attrs)) {
        var props = {};
        if ('anchorKey' in attrs) props.anchorKey = attrs.anchorKey;
        if ('anchorOffset' in attrs) props.anchorOffset = attrs.anchorOffset;
        if ('anchorPath' in attrs) props.anchorPath = attrs.anchorPath;
        if ('focusKey' in attrs) props.focusKey = attrs.focusKey;
        if ('focusOffset' in attrs) props.focusOffset = attrs.focusOffset;
        if ('focusPath' in attrs) props.focusPath = attrs.focusPath;
        if ('isBackward' in attrs) props.isBackward = attrs.isBackward;
        if ('isFocused' in attrs) props.isFocused = attrs.isFocused;
        if ('marks' in attrs) props.marks = attrs.marks == null ? null : Mark.createSet(attrs.marks);
        if ('isAtomic' in attrs) props.isAtomic = attrs.isAtomic;
        return props;
      }

      throw new Error('`Range.createProperties` only accepts objects or ranges, but you passed it: ' + attrs);
    }

    /**
     * Create a `Range` from a JSON `object`.
     *
     * @param {Object} object
     * @return {Range}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      var _object$anchorKey = object.anchorKey,
          anchorKey = _object$anchorKey === undefined ? null : _object$anchorKey,
          _object$anchorOffset = object.anchorOffset,
          anchorOffset = _object$anchorOffset === undefined ? 0 : _object$anchorOffset,
          _object$focusKey = object.focusKey,
          focusKey = _object$focusKey === undefined ? null : _object$focusKey,
          _object$focusOffset = object.focusOffset,
          focusOffset = _object$focusOffset === undefined ? 0 : _object$focusOffset,
          _object$isBackward = object.isBackward,
          isBackward = _object$isBackward === undefined ? null : _object$isBackward,
          _object$isFocused = object.isFocused,
          isFocused = _object$isFocused === undefined ? false : _object$isFocused,
          _object$marks = object.marks,
          marks = _object$marks === undefined ? null : _object$marks,
          _object$isAtomic = object.isAtomic,
          isAtomic = _object$isAtomic === undefined ? false : _object$isAtomic;


      var range = new Range({
        anchorKey: anchorKey,
        anchorOffset: anchorOffset,
        focusKey: focusKey,
        focusOffset: focusOffset,
        isBackward: isBackward,
        isFocused: isFocused,
        marks: marks == null ? null : new immutable.Set(marks.map(Mark.fromJSON)),
        isAtomic: isAtomic
      });

      return range;
    }

    /**
     * Alias `fromJS`.
     */

  }, {
    key: 'isRange',


    /**
     * Check if an `obj` is a `Range`.
     *
     * @param {Any} obj
     * @return {Boolean}
     */

    value: function isRange(obj) {
      return !!(obj && obj[MODEL_TYPES.RANGE]);
    }
  }]);
  return Range;
}(immutable.Record(DEFAULTS$4));

/**
 * Attach a pseudo-symbol for type checking.
 */

Range.fromJS = Range.fromJSON;
Range.prototype[MODEL_TYPES.RANGE] = true;

/**
 * Mix in some "move" convenience methods.
 */

var MOVE_METHODS = [['move', ''], ['move', 'To'], ['move', 'ToStartOf'], ['move', 'ToEndOf']];

MOVE_METHODS.forEach(function (_ref) {
  var _ref2 = slicedToArray(_ref, 2),
      p = _ref2[0],
      s = _ref2[1];

  Range.prototype['' + p + s] = function () {
    var _ref3;

    return (_ref3 = this[p + 'Anchor' + s].apply(this, arguments))[p + 'Focus' + s].apply(_ref3, arguments);
  };
});

/**
 * Mix in the "start", "end" and "edge" convenience methods.
 */

var EDGE_METHODS = [['has', 'AtStartOf', true], ['has', 'AtEndOf', true], ['has', 'Between', true], ['has', 'In', true], ['collapseTo', ''], ['move', ''], ['moveTo', ''], ['move', 'To'], ['move', 'OffsetTo']];

EDGE_METHODS.forEach(function (_ref4) {
  var _ref5 = slicedToArray(_ref4, 3),
      p = _ref5[0],
      s = _ref5[1],
      hasEdge = _ref5[2];

  var anchor = p + 'Anchor' + s;
  var focus = p + 'Focus' + s;

  Range.prototype[p + 'Start' + s] = function () {
    return this.isBackward ? this[focus].apply(this, arguments) : this[anchor].apply(this, arguments);
  };

  Range.prototype[p + 'End' + s] = function () {
    return this.isBackward ? this[anchor].apply(this, arguments) : this[focus].apply(this, arguments);
  };

  if (hasEdge) {
    Range.prototype[p + 'Edge' + s] = function () {
      return this[anchor].apply(this, arguments) || this[focus].apply(this, arguments);
    };
  }
});

/**
 * Mix in some aliases for convenience / parallelism with the browser APIs.
 */

var ALIAS_METHODS = [['collapseTo', 'moveTo'], ['collapseToAnchor', 'moveToAnchor'], ['collapseToFocus', 'moveToFocus'], ['collapseToStart', 'moveToStart'], ['collapseToEnd', 'moveToEnd'], ['collapseToStartOf', 'moveToStartOf'], ['collapseToEndOf', 'moveToEndOf'], ['extend', 'moveFocus'], ['extendTo', 'moveFocusTo'], ['extendToStartOf', 'moveFocusToStartOf'], ['extendToEndOf', 'moveFocusToEndOf']];

ALIAS_METHODS.forEach(function (_ref6) {
  var _ref7 = slicedToArray(_ref6, 2),
      alias = _ref7[0],
      method = _ref7[1];

  Range.prototype[alias] = function () {
    return this[method].apply(this, arguments);
  };
});

/**
 * Get the first text of a `node`.
 *
 * @param {Node} node
 * @return {Text}
 */

function getFirst(node) {
  return node.object == 'text' ? node : node.getFirstText();
}

/**
 * Get the last text of a `node`.
 *
 * @param {Node} node
 * @return {Text}
 */

function getLast(node) {
  return node.object == 'text' ? node : node.getLastText();
}

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$5 = {
  marks: new immutable.Set(),
  text: ''

  /**
   * Character.
   *
   * @type {Character}
   */

};
var Character = function (_Record) {
  inherits(Character, _Record);

  function Character() {
    classCallCheck(this, Character);
    return possibleConstructorReturn(this, (Character.__proto__ || Object.getPrototypeOf(Character)).apply(this, arguments));
  }

  createClass(Character, [{
    key: 'toJSON',


    /**
     * Return a JSON representation of the character.
     *
     * @return {Object}
     */

    value: function toJSON() {
      var object = {
        object: this.object,
        text: this.text,
        marks: this.marks.toArray().map(function (m) {
          return m.toJSON();
        })
      };

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS() {
      return this.toJSON();
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'character';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      index.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }
  }], [{
    key: 'create',

    /**
     * Create a `Character` with `attrs`.
     *
     * @param {Object|String|Character} attrs
     * @return {Character}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Character.isCharacter(attrs)) {
        return attrs;
      }

      if (typeof attrs == 'string') {
        attrs = { text: attrs };
      }

      if (isPlainObject(attrs)) {
        return Character.fromJSON(attrs);
      }

      throw new Error('`Character.create` only accepts objects, strings or characters, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Characters` from `elements`.
     *
     * @param {String|Array<Object|Character|String>|List<Object|Character|String>} elements
     * @return {List<Character>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (typeof elements == 'string') {
        elements = elements.split('');
      }

      if (immutable.List.isList(elements) || Array.isArray(elements)) {
        var list = new immutable.List(elements.map(Character.create));
        return list;
      }

      throw new Error('`Block.createList` only accepts strings, arrays or lists, but you passed it: ' + elements);
    }

    /**
     * Create a `Character` from a JSON `object`.
     *
     * @param {Object} object
     * @return {Character}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      var text = object.text,
          _object$marks = object.marks,
          marks = _object$marks === undefined ? [] : _object$marks;


      if (typeof text != 'string') {
        throw new Error('`Character.fromJSON` requires a block `text` string.');
      }

      var character = new Character({
        text: text,
        marks: new immutable.Set(marks)
      });

      return character;
    }

    /**
     * Alias `fromJS`.
     */

    /**
     * Check if `any` is a `Character`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isCharacterList',


    /**
     * Check if `any` is a character list.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isCharacterList(any) {
      return immutable.List.isList(any) && any.every(function (item) {
        return Character.isCharacter(item);
      });
    }
  }]);
  return Character;
}(immutable.Record(DEFAULTS$5));

/**
 * Attach a pseudo-symbol for type checking.
 */

Character.fromJS = Character.fromJSON;
Character.isCharacter = isType.bind(null, 'CHARACTER');
Character.prototype[MODEL_TYPES.CHARACTER] = true;

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$6 = {
  marks: immutable.Set(),
  text: ''

  /**
   * Leaf.
   *
   * @type {Leaf}
   */

};
var Leaf = function (_Record) {
  inherits(Leaf, _Record);

  function Leaf() {
    classCallCheck(this, Leaf);
    return possibleConstructorReturn(this, (Leaf.__proto__ || Object.getPrototypeOf(Leaf)).apply(this, arguments));
  }

  createClass(Leaf, [{
    key: 'getCharacters',


    /**
     * Return leaf as a list of characters
     *
     * @return {List<Character>}
     */

    value: function getCharacters() {
      index.deprecate('slate@0.34.0', 'The `characters` property of Slate objects is deprecated');

      var marks = this.marks;

      var characters = Character.createList(this.text.split('').map(function (char) {
        return Character.create({
          text: char,
          marks: marks
        });
      }));

      return characters;
    }

    /**
     * Update a `mark` at leaf, replace with newMark
     *
     * @param {Mark} mark
     * @param {Mark} newMark
     * @returns {Leaf}
     */

  }, {
    key: 'updateMark',
    value: function updateMark(mark, newMark) {
      var marks = this.marks;

      if (newMark.equals(mark)) return this;
      if (!marks.has(mark)) return this;
      var newMarks = marks.withMutations(function (collection) {
        collection.remove(mark).add(newMark);
      });
      return this.set('marks', newMarks);
    }

    /**
     * Add a `set` of marks at `index` and `length`.
     *
     * @param {Set<Mark>} set
     * @returns {Text}
     */

  }, {
    key: 'addMarks',
    value: function addMarks(set$$1) {
      var marks = this.marks;

      return this.set('marks', marks.union(set$$1));
    }

    /**
     * Remove a `mark` at `index` and `length`.
     *
     * @param {Mark} mark
     * @returns {Text}
     */

  }, {
    key: 'removeMark',
    value: function removeMark(mark) {
      var marks = this.marks;

      return this.set('marks', marks.remove(mark));
    }

    /**
     * Return a JSON representation of the leaf.
     *
     * @return {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var object = {
        object: this.object,
        text: this.text,
        marks: this.marks.toArray().map(function (m) {
          return m.toJSON();
        })
      };

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS() {
      return this.toJSON();
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'leaf';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      index.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Leaf` with `attrs`.
     *
     * @param {Object|Leaf} attrs
     * @return {Leaf}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Leaf.isLeaf(attrs)) {
        return attrs;
      }

      if (typeof attrs == 'string') {
        attrs = { text: attrs };
      }

      if (isPlainObject(attrs)) {
        return Leaf.fromJSON(attrs);
      }

      throw new Error('`Leaf.create` only accepts objects, strings or leaves, but you passed it: ' + attrs);
    }

    /**
     * Create a valid List of `Leaf` from `leaves`
     *
     * @param {List<Leaf>} leaves
     * @return {List<Leaf>}
     */

  }, {
    key: 'createLeaves',
    value: function createLeaves(leaves) {
      if (leaves.size <= 1) return leaves;

      var invalid = false;

      // TODO: we can make this faster with [List] and then flatten
      var result = immutable.List().withMutations(function (cache) {
        // Search from the leaves left end to find invalid node;
        leaves.findLast(function (leaf, index$$1) {
          var firstLeaf = cache.first();

          // If the first leaf of cache exist, check whether the first leaf is connectable with the current leaf
          if (firstLeaf) {
            // If marks equals, then the two leaves can be connected
            if (firstLeaf.marks.equals(leaf.marks)) {
              invalid = true;
              cache.set(0, firstLeaf.set('text', '' + leaf.text + firstLeaf.text));
              return;
            }

            // If the cached leaf is empty, drop the empty leaf with the upcoming leaf
            if (firstLeaf.text === '') {
              invalid = true;
              cache.set(0, leaf);
              return;
            }

            // If the current leaf is empty, drop the leaf
            if (leaf.text === '') {
              invalid = true;
              return;
            }
          }

          cache.unshift(leaf);
        });
      });

      if (!invalid) return leaves;
      return result;
    }

    /**
     * Split a list of leaves to two lists; if the leaves are valid leaves, the returned leaves are also valid
     * Corner Cases:
     *   1. if offset is smaller than 0, then return [List(), leaves]
     *   2. if offset is bigger than the text length, then return [leaves, List()]
     *
     * @param {List<Leaf> leaves
     * @return {Array<List<Leaf>>}
     */

  }, {
    key: 'splitLeaves',
    value: function splitLeaves(leaves, offset) {
      if (offset < 0) return [immutable.List(), leaves];

      if (leaves.size === 0) {
        return [immutable.List(), immutable.List()];
      }

      var endOffset = 0;
      var index$$1 = -1;
      var left = void 0,
          right = void 0;

      leaves.find(function (leaf) {
        index$$1++;
        var startOffset = endOffset;
        var text = leaf.text;

        endOffset += text.length;

        if (endOffset < offset) return false;
        if (startOffset > offset) return false;

        var length = offset - startOffset;
        left = leaf.set('text', text.slice(0, length));
        right = leaf.set('text', text.slice(length));
        return true;
      });

      if (!left) return [leaves, immutable.List()];

      if (left.text === '') {
        if (index$$1 === 0) {
          return [immutable.List.of(left), leaves];
        }

        return [leaves.take(index$$1), leaves.skip(index$$1)];
      }

      if (right.text === '') {
        if (index$$1 === leaves.size - 1) {
          return [leaves, immutable.List.of(right)];
        }

        return [leaves.take(index$$1 + 1), leaves.skip(index$$1 + 1)];
      }

      return [leaves.take(index$$1).push(left), leaves.skip(index$$1 + 1).unshift(right)];
    }

    /**
     * Create a `Leaf` list from `attrs`.
     *
     * @param {Array<Leaf|Object>|List<Leaf|Object>} attrs
     * @return {List<Leaf>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (immutable.List.isList(attrs) || Array.isArray(attrs)) {
        var list = new immutable.List(attrs.map(Leaf.create));
        return list;
      }

      throw new Error('`Leaf.createList` only accepts arrays or lists, but you passed it: ' + attrs);
    }

    /**
     * Create a `Leaf` from a JSON `object`.
     *
     * @param {Object} object
     * @return {Leaf}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      var _object$text = object.text,
          text = _object$text === undefined ? '' : _object$text,
          _object$marks = object.marks,
          marks = _object$marks === undefined ? [] : _object$marks;


      var leaf = new Leaf({
        text: text,
        marks: immutable.Set(marks.map(Mark.fromJSON))
      });

      return leaf;
    }

    /**
     * Alias `fromJS`.
     */

    /**
     * Check if `any` is a `Leaf`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isLeafList',


    /**
     * Check if `any` is a list of leaves.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isLeafList(any) {
      return immutable.List.isList(any) && any.every(function (item) {
        return Leaf.isLeaf(item);
      });
    }
  }]);
  return Leaf;
}(immutable.Record(DEFAULTS$6));

/**
 * Attach a pseudo-symbol for type checking.
 */

Leaf.fromJS = Leaf.fromJSON;
Leaf.isLeaf = isType.bind(null, 'LEAF');
Leaf.prototype[MODEL_TYPES.LEAF] = true;

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$7 = {
  leaves: immutable.List(),
  key: undefined

  /**
   * Text.
   *
   * @type {Text}
   */

};
var Text = function (_Record) {
  inherits(Text, _Record);

  function Text() {
    classCallCheck(this, Text);
    return possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).apply(this, arguments));
  }

  createClass(Text, [{
    key: 'getString',


    /**
     * Get the concatenated text of the node, cached for text getter
     *
     * @returns {String}
     */

    value: function getString() {
      return this.leaves.reduce(function (string, leaf) {
        return string + leaf.text;
      }, '');
    }

    /**
     * Get the concatenated characters of the node;
     *
     * @returns {String}
     */

  }, {
    key: 'searchLeafAtOffset',


    /**
     * Find the 'first' leaf at offset; By 'first' the alorighthm prefers `endOffset === offset` than `startOffset === offset`
     * Corner Cases:
     *   1. if offset is negative, return the first leaf;
     *   2. if offset is larger than text length, the leaf is null, startOffset, endOffset and index is of the last leaf
     *
     * @param {number}
     * @returns {Object}
     *   @property {number} startOffset
     *   @property {number} endOffset
     *   @property {number} index
     *   @property {Leaf} leaf
     */

    value: function searchLeafAtOffset(offset) {
      var endOffset = 0;
      var startOffset = 0;
      var index$$1 = -1;

      var leaf = this.leaves.find(function (l) {
        index$$1++;
        startOffset = endOffset;
        endOffset = startOffset + l.text.length;
        return endOffset >= offset;
      });

      return {
        leaf: leaf,
        endOffset: endOffset,
        index: index$$1,
        startOffset: startOffset
      };
    }

    /**
     * Add a `mark` at `index` and `length`.
     *
     * @param {Number} index
     * @param {Number} length
     * @param {Mark} mark
     * @return {Text}
     */

  }, {
    key: 'addMark',
    value: function addMark(index$$1, length, mark) {
      var marks = immutable.Set.of(mark);
      return this.addMarks(index$$1, length, marks);
    }

    /**
     * Add a `set` of marks at `index` and `length`.
     * Corner Cases:
     *   1. If empty text, and if length === 0 and index === 0, will make sure the text contain an empty leaf with the given mark.
     *
     * @param {Number} index
     * @param {Number} length
     * @param {Set<Mark>} set
     * @return {Text}
     */

  }, {
    key: 'addMarks',
    value: function addMarks(index$$1, length, set$$1) {
      if (this.text === '' && length === 0 && index$$1 === 0) {
        var _leaves = this.leaves;

        var first = _leaves.first();

        if (!first) {
          return this.set('leaves', immutable.List.of(Leaf.fromJSON({ text: '', marks: set$$1 })));
        }

        var newFirst = first.addMarks(set$$1);
        if (newFirst === first) return this;
        return this.set('leaves', immutable.List.of(newFirst));
      }

      if (this.text === '') return this;
      if (length === 0) return this;
      if (index$$1 >= this.text.length) return this;

      var _Leaf$splitLeaves = Leaf.splitLeaves(this.leaves, index$$1),
          _Leaf$splitLeaves2 = slicedToArray(_Leaf$splitLeaves, 2),
          before = _Leaf$splitLeaves2[0],
          bundle = _Leaf$splitLeaves2[1];

      var _Leaf$splitLeaves3 = Leaf.splitLeaves(bundle, length),
          _Leaf$splitLeaves4 = slicedToArray(_Leaf$splitLeaves3, 2),
          middle = _Leaf$splitLeaves4[0],
          after = _Leaf$splitLeaves4[1];

      var leaves = before.concat(middle.map(function (x) {
        return x.addMarks(set$$1);
      }), after);
      return this.setLeaves(leaves);
    }

    /**
     * Get the decorations for the node from a `schema`.
     *
     * @param {Schema} schema
     * @return {Array}
     */

  }, {
    key: 'getDecorations',
    value: function getDecorations(schema) {
      return schema.__getDecorations(this);
    }

    /**
     * Derive the leaves for a list of `decorations`.
     *
     * @param {Array|Void} decorations (optional)
     * @return {List<Leaf>}
     */

  }, {
    key: 'getLeaves',
    value: function getLeaves() {
      var _this2 = this;

      var decorations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var leaves = this.leaves;

      if (leaves.size === 0) return immutable.List.of(Leaf.create({}));
      if (!decorations || decorations.length === 0) return leaves;
      if (this.text.length === 0) return leaves;
      var key = this.key;


      decorations.forEach(function (range) {
        var startKey = range.startKey,
            endKey = range.endKey,
            startOffset = range.startOffset,
            endOffset = range.endOffset,
            marks = range.marks;

        var hasStart = startKey == key;
        var hasEnd = endKey == key;

        if (hasStart && hasEnd) {
          var index$$1 = hasStart ? startOffset : 0;
          var length = hasEnd ? endOffset - index$$1 : _this2.text.length - index$$1;

          if (length < 1) return;
          if (index$$1 >= _this2.text.length) return;

          if (index$$1 !== 0 || length < _this2.text.length) {
            var _Leaf$splitLeaves5 = Leaf.splitLeaves(leaves, index$$1),
                _Leaf$splitLeaves6 = slicedToArray(_Leaf$splitLeaves5, 2),
                before = _Leaf$splitLeaves6[0],
                bundle = _Leaf$splitLeaves6[1];

            var _Leaf$splitLeaves7 = Leaf.splitLeaves(bundle, length),
                _Leaf$splitLeaves8 = slicedToArray(_Leaf$splitLeaves7, 2),
                middle = _Leaf$splitLeaves8[0],
                after = _Leaf$splitLeaves8[1];

            leaves = before.concat(middle.map(function (x) {
              return x.addMarks(marks);
            }), after);
            return;
          }
        }

        leaves = leaves.map(function (x) {
          return x.addMarks(marks);
        });
      });

      if (leaves === this.leaves) return leaves;
      return Leaf.createLeaves(leaves);
    }

    /**
     * Get all of the active marks on between two offsets
     * Corner Cases:
     *   1. if startOffset is equal or bigger than endOffset, then return Set();
     *   2. If no text is selected between start and end, then return Set()
     *
     * @return {Set<Mark>}
     */

  }, {
    key: 'getActiveMarksBetweenOffsets',
    value: function getActiveMarksBetweenOffsets(startOffset, endOffset) {
      if (startOffset <= 0 && endOffset >= this.text.length) {
        return this.getActiveMarks();
      }

      if (startOffset >= endOffset) return immutable.Set();
      // For empty text in a paragraph, use getActiveMarks;
      if (this.text === '') return this.getActiveMarks();

      var result = null;
      var leafEnd = 0;

      this.leaves.forEach(function (leaf) {
        var leafStart = leafEnd;
        leafEnd = leafStart + leaf.text.length;

        if (leafEnd <= startOffset) return;
        if (leafStart >= endOffset) return false;

        if (!result) {
          result = leaf.marks;
          return;
        }

        result = result.intersect(leaf.marks);
        if (result && result.size === 0) return false;
        return false;
      });

      return result || immutable.Set();
    }

    /**
     * Get all of the active marks on the text
     *
     * @return {Set<Mark>}
     */

  }, {
    key: 'getActiveMarks',
    value: function getActiveMarks() {
      var _this3 = this;

      if (this.leaves.size === 0) return immutable.Set();

      var result = this.leaves.first().marks;
      if (result.size === 0) return result;

      return result.withMutations(function (x) {
        _this3.leaves.forEach(function (c) {
          x.intersect(c.marks);
          if (x.size === 0) return false;
        });
      });
    }

    /**
     * Get all of the marks on between two offsets
     * Corner Cases:
     *   1. if startOffset is equal or bigger than endOffset, then return Set();
     *   2. If no text is selected between start and end, then return Set()
     *
     * @return {OrderedSet<Mark>}
     */

  }, {
    key: 'getMarksBetweenOffsets',
    value: function getMarksBetweenOffsets(startOffset, endOffset) {
      if (startOffset <= 0 && endOffset >= this.text.length) {
        return this.getMarks();
      }

      if (startOffset >= endOffset) return immutable.Set();
      // For empty text in a paragraph, use getActiveMarks;
      if (this.text === '') return this.getActiveMarks();

      var result = null;
      var leafEnd = 0;

      this.leaves.forEach(function (leaf) {
        var leafStart = leafEnd;
        leafEnd = leafStart + leaf.text.length;

        if (leafEnd <= startOffset) return;
        if (leafStart >= endOffset) return false;

        if (!result) {
          result = leaf.marks;
          return;
        }

        result = result.union(leaf.marks);
      });

      return result || immutable.Set();
    }

    /**
     * Get all of the marks on the text.
     *
     * @return {OrderedSet<Mark>}
     */

  }, {
    key: 'getMarks',
    value: function getMarks() {
      var array = this.getMarksAsArray();
      return new immutable.OrderedSet(array);
    }

    /**
     * Get all of the marks on the text as an array
     *
     * @return {Array}
     */

  }, {
    key: 'getMarksAsArray',
    value: function getMarksAsArray() {
      if (this.leaves.size === 0) return [];
      var first = this.leaves.first().marks;
      if (this.leaves.size === 1) return first.toArray();

      var result = [];

      this.leaves.forEach(function (leaf) {
        result.push(leaf.marks.toArray());
      });

      return Array.prototype.concat.apply(first.toArray(), result);
    }

    /**
     * Get the marks on the text at `index`.
     * Corner Cases:
     *   1. if no text is before the index, and index !== 0, then return Set()
     *   2. (for insert after split node or mark at range) if index === 0, and text === '', then return the leaf.marks
     *   3. if index === 0, text !== '', return Set()
     *
     *
     * @param {Number} index
     * @return {Set<Mark>}
     */

  }, {
    key: 'getMarksAtIndex',
    value: function getMarksAtIndex(index$$1) {
      var _searchLeafAtOffset = this.searchLeafAtOffset(index$$1),
          leaf = _searchLeafAtOffset.leaf;

      if (!leaf) return immutable.Set();
      return leaf.marks;
    }

    /**
     * Get a node by `key`, to parallel other nodes.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getNode',
    value: function getNode(key) {
      return this.key == key ? this : null;
    }

    /**
     * Check if the node has a node by `key`, to parallel other nodes.
     *
     * @param {String} key
     * @return {Boolean}
     */

  }, {
    key: 'hasNode',
    value: function hasNode(key) {
      return !!this.getNode(key);
    }

    /**
     * Insert `text` at `index`.
     *
     * @param {Numbder} offset
     * @param {String} text
     * @param {Set} marks (optional)
     * @return {Text}
     */

  }, {
    key: 'insertText',
    value: function insertText(offset, text, marks) {
      if (this.text === '') {
        return this.set('leaves', immutable.List.of(Leaf.create({ text: text, marks: marks })));
      }

      if (text.length === 0) return this;
      if (!marks) marks = immutable.Set();

      var _searchLeafAtOffset2 = this.searchLeafAtOffset(offset),
          startOffset = _searchLeafAtOffset2.startOffset,
          leaf = _searchLeafAtOffset2.leaf,
          index$$1 = _searchLeafAtOffset2.index;

      var delta = offset - startOffset;
      var beforeText = leaf.text.slice(0, delta);
      var afterText = leaf.text.slice(delta);
      var leaves = this.leaves;


      if (leaf.marks.equals(marks)) {
        return this.set('leaves', leaves.set(index$$1, leaf.set('text', beforeText + text + afterText)));
      }

      var nextLeaves = leaves.splice(index$$1, 1, leaf.set('text', beforeText), Leaf.create({ text: text, marks: marks }), leaf.set('text', afterText));

      return this.setLeaves(nextLeaves);
    }

    /**
     * Regenerate the node's key.
     *
     * @return {Text}
     */

  }, {
    key: 'regenerateKey',
    value: function regenerateKey() {
      var key = generateKey();
      return this.set('key', key);
    }

    /**
     * Remove a `mark` at `index` and `length`.
     *
     * @param {Number} index
     * @param {Number} length
     * @param {Mark} mark
     * @return {Text}
     */

  }, {
    key: 'removeMark',
    value: function removeMark(index$$1, length, mark) {
      if (this.text === '' && index$$1 === 0 && length === 0) {
        var first = this.leaves.first();
        if (!first) return this;
        var newFirst = first.removeMark(mark);
        if (newFirst === first) return this;
        return this.set('leaves', immutable.List.of(newFirst));
      }

      if (length <= 0) return this;
      if (index$$1 >= this.text.length) return this;

      var _Leaf$splitLeaves9 = Leaf.splitLeaves(this.leaves, index$$1),
          _Leaf$splitLeaves10 = slicedToArray(_Leaf$splitLeaves9, 2),
          before = _Leaf$splitLeaves10[0],
          bundle = _Leaf$splitLeaves10[1];

      var _Leaf$splitLeaves11 = Leaf.splitLeaves(bundle, length),
          _Leaf$splitLeaves12 = slicedToArray(_Leaf$splitLeaves11, 2),
          middle = _Leaf$splitLeaves12[0],
          after = _Leaf$splitLeaves12[1];

      var leaves = before.concat(middle.map(function (x) {
        return x.removeMark(mark);
      }), after);
      return this.setLeaves(leaves);
    }

    /**
     * Remove text from the text node at `start` for `length`.
     *
     * @param {Number} start
     * @param {Number} length
     * @return {Text}
     */

  }, {
    key: 'removeText',
    value: function removeText(start, length) {
      if (length <= 0) return this;
      if (start >= this.text.length) return this;

      // PERF: For simple backspace, we can operate directly on the leaf
      if (length === 1) {
        var _searchLeafAtOffset3 = this.searchLeafAtOffset(start + 1),
            leaf = _searchLeafAtOffset3.leaf,
            index$$1 = _searchLeafAtOffset3.index,
            startOffset = _searchLeafAtOffset3.startOffset;

        var offset = start - startOffset;

        if (leaf) {
          if (leaf.text.length === 1) {
            var _leaves2 = this.leaves.remove(index$$1);
            return this.setLeaves(_leaves2);
          }

          var beforeText = leaf.text.slice(0, offset);
          var afterText = leaf.text.slice(offset + length);
          var text = beforeText + afterText;

          if (text.length > 0) {
            return this.set('leaves', this.leaves.set(index$$1, leaf.set('text', text)));
          }
        }
      }

      var _Leaf$splitLeaves13 = Leaf.splitLeaves(this.leaves, start),
          _Leaf$splitLeaves14 = slicedToArray(_Leaf$splitLeaves13, 2),
          before = _Leaf$splitLeaves14[0],
          bundle = _Leaf$splitLeaves14[1];

      var after = Leaf.splitLeaves(bundle, length)[1];
      var leaves = Leaf.createLeaves(before.concat(after));

      if (leaves.size === 1) {
        var first = leaves.first();

        if (first.text === '') {
          return this.set('leaves', immutable.List.of(first.set('marks', this.getActiveMarks())));
        }
      }

      return this.set('leaves', leaves);
    }

    /**
     * Return a JSON representation of the text.
     *
     * @param {Object} options
     * @return {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var object = {
        object: this.object,
        leaves: this.getLeaves().toArray().map(function (r) {
          return r.toJSON();
        })
      };

      if (options.preserveKeys) {
        object.key = this.key;
      }

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS(options) {
      return this.toJSON(options);
    }

    /**
     * Update a `mark` at `index` and `length` with `properties`.
     *
     * @param {Number} index
     * @param {Number} length
     * @param {Mark} mark
     * @param {Object} properties
     * @return {Text}
     */

  }, {
    key: 'updateMark',
    value: function updateMark(index$$1, length, mark, properties) {
      var newMark = mark.merge(properties);

      if (this.text === '' && length === 0 && index$$1 === 0) {
        var _leaves3 = this.leaves;

        var first = _leaves3.first();
        if (!first) return this;
        var newFirst = first.updateMark(mark, newMark);
        if (newFirst === first) return this;
        return this.set('leaves', immutable.List.of(newFirst));
      }

      if (length <= 0) return this;
      if (index$$1 >= this.text.length) return this;

      var _Leaf$splitLeaves15 = Leaf.splitLeaves(this.leaves, index$$1),
          _Leaf$splitLeaves16 = slicedToArray(_Leaf$splitLeaves15, 2),
          before = _Leaf$splitLeaves16[0],
          bundle = _Leaf$splitLeaves16[1];

      var _Leaf$splitLeaves17 = Leaf.splitLeaves(bundle, length),
          _Leaf$splitLeaves18 = slicedToArray(_Leaf$splitLeaves17, 2),
          middle = _Leaf$splitLeaves18[0],
          after = _Leaf$splitLeaves18[1];

      var leaves = before.concat(middle.map(function (x) {
        return x.updateMark(mark, newMark);
      }), after);

      return this.setLeaves(leaves);
    }

    /**
     * Split this text and return two different texts
     * @param {Number} position
     * @returns {Array<Text>}
     */

  }, {
    key: 'splitText',
    value: function splitText(offset) {
      var splitted = Leaf.splitLeaves(this.leaves, offset);
      var one = this.set('leaves', splitted[0]);
      var two = this.set('leaves', splitted[1]).regenerateKey();
      return [one, two];
    }

    /**
     * merge this text and another text at the end
     * @param {Text} text
     * @returns {Text}
     */

  }, {
    key: 'mergeText',
    value: function mergeText(text) {
      var leaves = this.leaves.concat(text.leaves);
      return this.setLeaves(leaves);
    }

    /**
     * Validate the text node against a `schema`.
     *
     * @param {Schema} schema
     * @return {Object|Void}
     */

  }, {
    key: 'validate',
    value: function validate(schema) {
      return schema.validateNode(this);
    }

    /**
     * Get the first invalid descendant
     * PERF: Do not cache this method; because it can cause cycle reference
     *
     * @param {Schema} schema
     * @returns {Text|Null}
     */

  }, {
    key: 'getFirstInvalidDescendant',
    value: function getFirstInvalidDescendant(schema) {
      return this.validate(schema) ? this : null;
    }

    /**
     * Set leaves with normalized `leaves`
     *
     * @param {Schema} schema
     * @returns {Text|Null}
     */

  }, {
    key: 'setLeaves',
    value: function setLeaves(leaves) {
      var result = Leaf.createLeaves(leaves);

      if (result.size === 1) {
        var first = result.first();

        if (!first.marks || first.marks.size === 0) {
          if (first.text === '') {
            return this.set('leaves', immutable.List());
          }
        }
      }

      return this.set('leaves', Leaf.createLeaves(leaves));
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'text';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      index.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }

    /**
     * Is the node empty?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isEmpty',
    get: function get$$1() {
      return this.text == '';
    }

    /**
     * Get the concatenated text of the node.
     *
     * @return {String}
     */

  }, {
    key: 'text',
    get: function get$$1() {
      return this.getString();
    }
  }, {
    key: 'characters',
    get: function get$$1() {
      return this.leaves.flatMap(function (x) {
        return x.getCharacters();
      });
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Text` with `attrs`.
     *
     * @param {Object|Array|List|String|Text} attrs
     * @return {Text}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (Text.isText(attrs)) {
        return attrs;
      }

      if (typeof attrs == 'string') {
        attrs = { leaves: [{ text: attrs }] };
      }

      if (isPlainObject(attrs)) {
        if (attrs.text) {
          var _attrs = attrs,
              text = _attrs.text,
              marks = _attrs.marks,
              key = _attrs.key;

          attrs = { key: key, leaves: [{ text: text, marks: marks }] };
        }

        return Text.fromJSON(attrs);
      }

      throw new Error('`Text.create` only accepts objects, arrays, strings or texts, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Texts` from `elements`.
     *
     * @param {Array<Text|Object>|List<Text|Object>} elements
     * @return {List<Text>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (immutable.List.isList(elements) || Array.isArray(elements)) {
        var list = new immutable.List(elements.map(Text.create));
        return list;
      }

      throw new Error('`Text.createList` only accepts arrays or lists, but you passed it: ' + elements);
    }

    /**
     * Create a `Text` from a JSON `object`.
     *
     * @param {Object|Text} object
     * @return {Text}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      if (Text.isText(object)) {
        return object;
      }

      var _object$key = object.key,
          key = _object$key === undefined ? generateKey() : _object$key;
      var _object$leaves = object.leaves,
          leaves = _object$leaves === undefined ? immutable.List() : _object$leaves;


      if (Array.isArray(leaves)) {
        leaves = immutable.List(leaves.map(function (x) {
          return Leaf.create(x);
        }));
      } else if (immutable.List.isList(leaves)) {
        leaves = leaves.map(function (x) {
          return Leaf.create(x);
        });
      } else {
        throw new Error('leaves must be either Array or Immutable.List');
      }

      var node = new Text({
        leaves: Leaf.createLeaves(leaves),
        key: key
      });

      return node;
    }

    /**
     * Alias `fromJS`.
     */

    /**
     * Check if `any` is a `Text`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isTextList',


    /**
     * Check if `any` is a list of texts.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isTextList(any) {
      return immutable.List.isList(any) && any.every(function (item) {
        return Text.isText(item);
      });
    }
  }]);
  return Text;
}(immutable.Record(DEFAULTS$7));

/**
 * Attach a pseudo-symbol for type checking.
 */

Text.fromJS = Text.fromJSON;
Text.isText = isType.bind(null, 'TEXT');
Text.prototype[MODEL_TYPES.TEXT] = true;

/**
 * Memoize read methods.
 */

memoize$2(Text.prototype, ['getDecorations', 'getActiveMarks', 'getMarks', 'getMarksAsArray', 'validate', 'getString']);

/**
 * Node.
 *
 * And interface that `Document`, `Block` and `Inline` all implement, to make
 * working with the recursive node tree easier.
 *
 * @type {Node}
 */

var Node = function () {
  function Node() {
    classCallCheck(this, Node);
  }

  createClass(Node, [{
    key: 'areDescendantsSorted',


    /**
     * True if the node has both descendants in that order, false otherwise. The
     * order is depth-first, post-order.
     *
     * @param {String} first
     * @param {String} second
     * @return {Boolean}
     */

    value: function areDescendantsSorted(first, second) {
      first = assertKey(first);
      second = assertKey(second);

      var keys = this.getKeysAsArray();
      var firstIndex = keys.indexOf(first);
      var secondIndex = keys.indexOf(second);
      if (firstIndex == -1 || secondIndex == -1) return null;

      return firstIndex < secondIndex;
    }

    /**
     * Assert that a node has a child by `key` and return it.
     *
     * @param {String} key
     * @return {Node}
     */

  }, {
    key: 'assertChild',
    value: function assertChild(key) {
      var child = this.getChild(key);

      if (!child) {
        key = assertKey(key);
        throw new Error('Could not find a child node with key "' + key + '".');
      }

      return child;
    }

    /**
     * Assert that a node has a descendant by `key` and return it.
     *
     * @param {String} key
     * @return {Node}
     */

  }, {
    key: 'assertDescendant',
    value: function assertDescendant(key) {
      var descendant = this.getDescendant(key);

      if (!descendant) {
        key = assertKey(key);
        throw new Error('Could not find a descendant node with key "' + key + '".');
      }

      return descendant;
    }

    /**
     * Assert that a node's tree has a node by `key` and return it.
     *
     * @param {String} key
     * @return {Node}
     */

  }, {
    key: 'assertNode',
    value: function assertNode(key) {
      var node = this.getNode(key);

      if (!node) {
        key = assertKey(key);
        throw new Error('Could not find a node with key "' + key + '".');
      }

      return node;
    }

    /**
     * Assert that a node exists at `path` and return it.
     *
     * @param {Array} path
     * @return {Node}
     */

  }, {
    key: 'assertPath',
    value: function assertPath(path) {
      var descendant = this.getDescendantAtPath(path);

      if (!descendant) {
        throw new Error('Could not find a descendant at path "' + path + '".');
      }

      return descendant;
    }

    /**
     * Recursively filter all descendant nodes with `iterator`.
     *
     * @param {Function} iterator
     * @return {List<Node>}
     */

  }, {
    key: 'filterDescendants',
    value: function filterDescendants(iterator) {
      var matches = [];

      this.forEachDescendant(function (node, i, nodes) {
        if (iterator(node, i, nodes)) matches.push(node);
      });

      return immutable.List(matches);
    }

    /**
     * Recursively find all descendant nodes by `iterator`.
     *
     * @param {Function} iterator
     * @return {Node|Null}
     */

  }, {
    key: 'findDescendant',
    value: function findDescendant(iterator) {
      var found = null;

      this.forEachDescendant(function (node, i, nodes) {
        if (iterator(node, i, nodes)) {
          found = node;
          return false;
        }
      });

      return found;
    }

    /**
     * Recursively iterate over all descendant nodes with `iterator`. If the
     * iterator returns false it will break the loop.
     *
     * @param {Function} iterator
     */

  }, {
    key: 'forEachDescendant',
    value: function forEachDescendant(iterator) {
      var ret = void 0;

      this.nodes.forEach(function (child, i, nodes) {
        if (iterator(child, i, nodes) === false) {
          ret = false;
          return false;
        }

        if (child.object != 'text') {
          ret = child.forEachDescendant(iterator);
          return ret;
        }
      });

      return ret;
    }

    /**
     * Get the path of ancestors of a descendant node by `key`.
     *
     * @param {String|Node} key
     * @return {List<Node>|Null}
     */

  }, {
    key: 'getAncestors',
    value: function getAncestors(key) {
      key = assertKey(key);

      if (key == this.key) return immutable.List();
      if (this.hasChild(key)) return immutable.List([this]);

      var ancestors = void 0;

      this.nodes.find(function (node) {
        if (node.object == 'text') return false;
        ancestors = node.getAncestors(key);
        return ancestors;
      });

      if (ancestors) {
        return ancestors.unshift(this);
      } else {
        return null;
      }
    }

    /**
     * Get the leaf block descendants of the node.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getBlocks',
    value: function getBlocks() {
      var array = this.getBlocksAsArray();
      return new immutable.List(array);
    }

    /**
     * Get the leaf block descendants of the node.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getBlocksAsArray',
    value: function getBlocksAsArray() {
      return this.nodes.reduce(function (array, child) {
        if (child.object != 'block') return array;
        if (!child.isLeafBlock()) return array.concat(child.getBlocksAsArray());
        array.push(child);
        return array;
      }, []);
    }

    /**
     * Get the leaf block descendants in a `range`.
     *
     * @param {Range} range
     * @return {List<Node>}
     */

  }, {
    key: 'getBlocksAtRange',
    value: function getBlocksAtRange(range) {
      var array = this.getBlocksAtRangeAsArray(range);
      // Eliminate duplicates by converting to an `OrderedSet` first.
      return new immutable.List(new immutable.OrderedSet(array));
    }

    /**
     * Get the leaf block descendants in a `range` as an array
     *
     * @param {Range} range
     * @return {Array}
     */

  }, {
    key: 'getBlocksAtRangeAsArray',
    value: function getBlocksAtRangeAsArray(range) {
      range = range.normalize(this);
      if (range.isUnset) return [];

      var _range = range,
          startKey = _range.startKey,
          endKey = _range.endKey;

      var startBlock = this.getClosestBlock(startKey);

      // PERF: the most common case is when the range is in a single block node,
      // where we can avoid a lot of iterating of the tree.
      if (startKey == endKey) return [startBlock];

      var endBlock = this.getClosestBlock(endKey);
      var blocks = this.getBlocksAsArray();
      var start = blocks.indexOf(startBlock);
      var end = blocks.indexOf(endBlock);
      return blocks.slice(start, end + 1);
    }

    /**
     * Get all of the leaf blocks that match a `type`.
     *
     * @param {String} type
     * @return {List<Node>}
     */

  }, {
    key: 'getBlocksByType',
    value: function getBlocksByType(type) {
      var array = this.getBlocksByTypeAsArray(type);
      return new immutable.List(array);
    }

    /**
     * Get all of the leaf blocks that match a `type` as an array
     *
     * @param {String} type
     * @return {Array}
     */

  }, {
    key: 'getBlocksByTypeAsArray',
    value: function getBlocksByTypeAsArray(type) {
      return this.nodes.reduce(function (array, node) {
        if (node.object != 'block') {
          return array;
        } else if (node.isLeafBlock() && node.type == type) {
          array.push(node);
          return array;
        } else {
          return array.concat(node.getBlocksByTypeAsArray(type));
        }
      }, []);
    }

    /**
     * Get all of the characters for every text node.
     *
     * @return {List<Character>}
     */

  }, {
    key: 'getCharacters',
    value: function getCharacters() {
      return this.getTexts().flatMap(function (t) {
        return t.characters;
      });
    }

    /**
     * Get a list of the characters in a `range`.
     *
     * @param {Range} range
     * @return {List<Character>}
     */

  }, {
    key: 'getCharactersAtRange',
    value: function getCharactersAtRange(range) {
      range = range.normalize(this);
      if (range.isUnset) return immutable.List();
      var _range2 = range,
          startKey = _range2.startKey,
          endKey = _range2.endKey,
          startOffset = _range2.startOffset,
          endOffset = _range2.endOffset;


      if (startKey === endKey) {
        var endText = this.getDescendant(endKey);
        return endText.characters.slice(startOffset, endOffset);
      }

      return this.getTextsAtRange(range).flatMap(function (t) {
        if (t.key === startKey) {
          return t.characters.slice(startOffset);
        }

        if (t.key === endKey) {
          return t.characters.slice(0, endOffset);
        }
        return t.characters;
      });
    }

    /**
     * Get a child node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getChild',
    value: function getChild(key) {
      key = assertKey(key);
      return this.nodes.find(function (node) {
        return node.key == key;
      });
    }

    /**
     * Get closest parent of node by `key` that matches `iterator`.
     *
     * @param {String} key
     * @param {Function} iterator
     * @return {Node|Null}
     */

  }, {
    key: 'getClosest',
    value: function getClosest(key, iterator) {
      key = assertKey(key);
      var ancestors = this.getAncestors(key);

      if (!ancestors) {
        throw new Error('Could not find a descendant node with key "' + key + '".');
      }

      // Exclude this node itself.
      return ancestors.rest().findLast(iterator);
    }

    /**
     * Get the closest block parent of a `node`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getClosestBlock',
    value: function getClosestBlock(key) {
      return this.getClosest(key, function (parent) {
        return parent.object == 'block';
      });
    }

    /**
     * Get the closest inline parent of a `node`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getClosestInline',
    value: function getClosestInline(key) {
      return this.getClosest(key, function (parent) {
        return parent.object == 'inline';
      });
    }

    /**
     * Get the closest void parent of a `node`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getClosestVoid',
    value: function getClosestVoid(key) {
      return this.getClosest(key, function (parent) {
        return parent.isVoid;
      });
    }

    /**
     * Get the common ancestor of nodes `one` and `two` by keys.
     *
     * @param {String} one
     * @param {String} two
     * @return {Node}
     */

  }, {
    key: 'getCommonAncestor',
    value: function getCommonAncestor(one, two) {
      one = assertKey(one);
      two = assertKey(two);

      if (one == this.key) return this;
      if (two == this.key) return this;

      this.assertDescendant(one);
      this.assertDescendant(two);
      var ancestors = new immutable.List();
      var oneParent = this.getParent(one);
      var twoParent = this.getParent(two);

      while (oneParent) {
        ancestors = ancestors.push(oneParent);
        oneParent = this.getParent(oneParent.key);
      }

      while (twoParent) {
        if (ancestors.includes(twoParent)) return twoParent;
        twoParent = this.getParent(twoParent.key);
      }
    }

    /**
     * Get the decorations for the node from a `stack`.
     *
     * @param {Stack} stack
     * @return {List}
     */

  }, {
    key: 'getDecorations',
    value: function getDecorations(stack) {
      var decorations = stack.find('decorateNode', this);
      var list = Range.createList(decorations || []);
      return list;
    }

    /**
     * Get the depth of a child node by `key`, with optional `startAt`.
     *
     * @param {String} key
     * @param {Number} startAt (optional)
     * @return {Number} depth
     */

  }, {
    key: 'getDepth',
    value: function getDepth(key) {
      var startAt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      this.assertDescendant(key);
      if (this.hasChild(key)) return startAt;
      return this.getFurthestAncestor(key).getDepth(key, startAt + 1);
    }

    /**
     * Get a descendant node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getDescendant',
    value: function getDescendant(key) {
      key = assertKey(key);
      var descendantFound = null;

      var found = this.nodes.find(function (node) {
        if (node.key === key) {
          return node;
        } else if (node.object !== 'text') {
          descendantFound = node.getDescendant(key);
          return descendantFound;
        } else {
          return false;
        }
      });

      return descendantFound || found;
    }

    /**
     * Get a descendant by `path`.
     *
     * @param {Array} path
     * @return {Node|Null}
     */

  }, {
    key: 'getDescendantAtPath',
    value: function getDescendantAtPath(path) {
      var descendant = this;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var index$$1 = _step.value;

          if (!descendant) return;
          if (!descendant.nodes) return;
          descendant = descendant.nodes.get(index$$1);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return descendant;
    }

    /**
     * Get the first child text node.
     *
     * @return {Node|Null}
     */

  }, {
    key: 'getFirstText',
    value: function getFirstText() {
      var descendantFound = null;

      var found = this.nodes.find(function (node) {
        if (node.object == 'text') return true;
        descendantFound = node.getFirstText();
        return descendantFound;
      });

      return descendantFound || found;
    }

    /**
     * Get a fragment of the node at a `range`.
     *
     * @param {Range} range
     * @return {Document}
     */

  }, {
    key: 'getFragmentAtRange',
    value: function getFragmentAtRange(range) {
      range = range.normalize(this);
      if (range.isUnset) return Document.create();

      var node = this;

      // Make sure the children exist.
      var _range3 = range,
          startKey = _range3.startKey,
          startOffset = _range3.startOffset,
          endKey = _range3.endKey,
          endOffset = _range3.endOffset;

      var startText = node.assertDescendant(startKey);
      var endText = node.assertDescendant(endKey);

      // Split at the start and end.
      var child = startText;
      var previous = void 0;
      var parent = void 0;

      while (parent = node.getParent(child.key)) {
        var index$$1 = parent.nodes.indexOf(child);
        var position = child.object == 'text' ? startOffset : child.nodes.indexOf(previous);

        parent = parent.splitNode(index$$1, position);
        node = node.updateNode(parent);
        previous = parent.nodes.get(index$$1 + 1);
        child = parent;
      }

      child = startKey == endKey ? node.getNextText(startKey) : endText;

      while (parent = node.getParent(child.key)) {
        var _index = parent.nodes.indexOf(child);
        var _position = child.object == 'text' ? startKey == endKey ? endOffset - startOffset : endOffset : child.nodes.indexOf(previous);

        parent = parent.splitNode(_index, _position);
        node = node.updateNode(parent);
        previous = parent.nodes.get(_index + 1);
        child = parent;
      }

      // Get the start and end nodes.
      var startNode = node.getNextSibling(node.getFurthestAncestor(startKey).key);
      var endNode = startKey == endKey ? node.getNextSibling(node.getNextSibling(node.getFurthestAncestor(endKey).key).key) : node.getNextSibling(node.getFurthestAncestor(endKey).key);

      // Get children range of nodes from start to end nodes
      var startIndex = node.nodes.indexOf(startNode);
      var endIndex = node.nodes.indexOf(endNode);
      var nodes = node.nodes.slice(startIndex, endIndex);

      // Return a new document fragment.
      return Document.create({ nodes: nodes });
    }

    /**
     * Get the furthest parent of a node by `key` that matches an `iterator`.
     *
     * @param {String} key
     * @param {Function} iterator
     * @return {Node|Null}
     */

  }, {
    key: 'getFurthest',
    value: function getFurthest(key, iterator) {
      var ancestors = this.getAncestors(key);

      if (!ancestors) {
        key = assertKey(key);
        throw new Error('Could not find a descendant node with key "' + key + '".');
      }

      // Exclude this node itself
      return ancestors.rest().find(iterator);
    }

    /**
     * Get the furthest block parent of a node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getFurthestBlock',
    value: function getFurthestBlock(key) {
      return this.getFurthest(key, function (node) {
        return node.object == 'block';
      });
    }

    /**
     * Get the furthest inline parent of a node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getFurthestInline',
    value: function getFurthestInline(key) {
      return this.getFurthest(key, function (node) {
        return node.object == 'inline';
      });
    }

    /**
     * Get the furthest ancestor of a node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getFurthestAncestor',
    value: function getFurthestAncestor(key) {
      key = assertKey(key);
      return this.nodes.find(function (node) {
        if (node.key == key) return true;
        if (node.object == 'text') return false;
        return node.hasDescendant(key);
      });
    }

    /**
     * Get the furthest ancestor of a node by `key` that has only one child.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getFurthestOnlyChildAncestor',
    value: function getFurthestOnlyChildAncestor(key) {
      var ancestors = this.getAncestors(key);

      if (!ancestors) {
        key = assertKey(key);
        throw new Error('Could not find a descendant node with key "' + key + '".');
      }

      var result = ancestors
      // Skip this node...
      .shift()
      // Take parents until there are more than one child...
      .reverse().takeUntil(function (p) {
        return p.nodes.size > 1;
      })
      // And pick the highest.
      .last();
      if (!result) return null;
      return result;
    }

    /**
     * Get the closest inline nodes for each text node in the node.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getInlines',
    value: function getInlines() {
      var array = this.getInlinesAsArray();
      return new immutable.List(array);
    }

    /**
     * Get the closest inline nodes for each text node in the node, as an array.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getInlinesAsArray',
    value: function getInlinesAsArray() {
      var array = [];

      this.nodes.forEach(function (child) {
        if (child.object == 'text') return;

        if (child.isLeafInline()) {
          array.push(child);
        } else {
          array = array.concat(child.getInlinesAsArray());
        }
      });

      return array;
    }

    /**
     * Get the closest inline nodes for each text node in a `range`.
     *
     * @param {Range} range
     * @return {List<Node>}
     */

  }, {
    key: 'getInlinesAtRange',
    value: function getInlinesAtRange(range) {
      var array = this.getInlinesAtRangeAsArray(range);
      // Remove duplicates by converting it to an `OrderedSet` first.
      return new immutable.List(new immutable.OrderedSet(array));
    }

    /**
     * Get the closest inline nodes for each text node in a `range` as an array.
     *
     * @param {Range} range
     * @return {Array}
     */

  }, {
    key: 'getInlinesAtRangeAsArray',
    value: function getInlinesAtRangeAsArray(range) {
      var _this = this;

      range = range.normalize(this);
      if (range.isUnset) return [];

      return this.getTextsAtRangeAsArray(range).map(function (text) {
        return _this.getClosestInline(text.key);
      }).filter(function (exists) {
        return exists;
      });
    }

    /**
     * Get all of the leaf inline nodes that match a `type`.
     *
     * @param {String} type
     * @return {List<Node>}
     */

  }, {
    key: 'getInlinesByType',
    value: function getInlinesByType(type) {
      var array = this.getInlinesByTypeAsArray(type);
      return new immutable.List(array);
    }

    /**
     * Get all of the leaf inline nodes that match a `type` as an array.
     *
     * @param {String} type
     * @return {Array}
     */

  }, {
    key: 'getInlinesByTypeAsArray',
    value: function getInlinesByTypeAsArray(type) {
      return this.nodes.reduce(function (inlines, node) {
        if (node.object == 'text') {
          return inlines;
        } else if (node.isLeafInline() && node.type == type) {
          inlines.push(node);
          return inlines;
        } else {
          return inlines.concat(node.getInlinesByTypeAsArray(type));
        }
      }, []);
    }

    /**
     * Return a set of all keys in the node as an array.
     *
     * @return {Array<String>}
     */

  }, {
    key: 'getKeysAsArray',
    value: function getKeysAsArray() {
      var keys = [];

      this.forEachDescendant(function (desc) {
        keys.push(desc.key);
      });

      return keys;
    }

    /**
     * Return a set of all keys in the node.
     *
     * @return {Set<String>}
     */

  }, {
    key: 'getKeys',
    value: function getKeys() {
      var keys = this.getKeysAsArray();
      return new immutable.Set(keys);
    }

    /**
     * Get the last child text node.
     *
     * @return {Node|Null}
     */

  }, {
    key: 'getLastText',
    value: function getLastText() {
      var descendantFound = null;

      var found = this.nodes.findLast(function (node) {
        if (node.object == 'text') return true;
        descendantFound = node.getLastText();
        return descendantFound;
      });

      return descendantFound || found;
    }

    /**
     * Get all of the marks for all of the characters of every text node.
     *
     * @return {Set<Mark>}
     */

  }, {
    key: 'getMarks',
    value: function getMarks() {
      var array = this.getMarksAsArray();
      return new immutable.Set(array);
    }

    /**
     * Get all of the marks for all of the characters of every text node.
     *
     * @return {OrderedSet<Mark>}
     */

  }, {
    key: 'getOrderedMarks',
    value: function getOrderedMarks() {
      var array = this.getMarksAsArray();
      return new immutable.OrderedSet(array);
    }

    /**
     * Get all of the marks as an array.
     *
     * @return {Array}
     */

  }, {
    key: 'getMarksAsArray',
    value: function getMarksAsArray() {
      // PERF: use only one concat rather than multiple concat
      // becuase one concat is faster
      var result = [];

      this.nodes.forEach(function (node) {
        result.push(node.getMarksAsArray());
      });
      return Array.prototype.concat.apply([], result);
    }

    /**
     * Get a set of the marks in a `range`.
     *
     * @param {Range} range
     * @return {Set<Mark>}
     */

  }, {
    key: 'getMarksAtRange',
    value: function getMarksAtRange(range) {
      return new immutable.Set(this.getOrderedMarksAtRange(range));
    }

    /**
     * Get a set of the marks in a `range`.
     *
     * @param {Range} range
     * @return {Set<Mark>}
     */

  }, {
    key: 'getInsertMarksAtRange',
    value: function getInsertMarksAtRange(range) {
      range = range.normalize(this);
      if (range.isUnset) return immutable.Set();

      if (range.isCollapsed) {
        // PERF: range is not cachable, use key and offset as proxies for cache
        return this.getMarksAtPosition(range.startKey, range.startOffset);
      }

      var _range4 = range,
          startKey = _range4.startKey,
          startOffset = _range4.startOffset;

      var text = this.getDescendant(startKey);
      return text.getMarksAtIndex(startOffset + 1);
    }

    /**
     * Get a set of the marks in a `range`.
     *
     * @param {Range} range
     * @return {OrderedSet<Mark>}
     */

  }, {
    key: 'getOrderedMarksAtRange',
    value: function getOrderedMarksAtRange(range) {
      range = range.normalize(this);
      if (range.isUnset) return immutable.OrderedSet();

      if (range.isCollapsed) {
        // PERF: range is not cachable, use key and offset as proxies for cache
        return this.getMarksAtPosition(range.startKey, range.startOffset);
      }

      var _range5 = range,
          startKey = _range5.startKey,
          startOffset = _range5.startOffset,
          endKey = _range5.endKey,
          endOffset = _range5.endOffset;

      return this.getOrderedMarksBetweenPositions(startKey, startOffset, endKey, endOffset);
    }

    /**
     * Get a set of the marks in a `range`.
     * PERF: arguments use key and offset for utilizing cache
     *
     * @param {string} startKey
     * @param {number} startOffset
     * @param {string} endKey
     * @param {number} endOffset
     * @returns {OrderedSet<Mark>}
     */

  }, {
    key: 'getOrderedMarksBetweenPositions',
    value: function getOrderedMarksBetweenPositions(startKey, startOffset, endKey, endOffset) {
      if (startKey === endKey) {
        var startText = this.getDescendant(startKey);
        return startText.getMarksBetweenOffsets(startOffset, endOffset);
      }

      var texts = this.getTextsBetweenPositionsAsArray(startKey, endKey);

      return immutable.OrderedSet().withMutations(function (result) {
        texts.forEach(function (text) {
          if (text.key === startKey) {
            result.union(text.getMarksBetweenOffsets(startOffset, text.text.length));
          } else if (text.key === endKey) {
            result.union(text.getMarksBetweenOffsets(0, endOffset));
          } else {
            result.union(text.getMarks());
          }
        });
      });
    }

    /**
     * Get a set of the active marks in a `range`.
     *
     * @param {Range} range
     * @return {Set<Mark>}
     */

  }, {
    key: 'getActiveMarksAtRange',
    value: function getActiveMarksAtRange(range) {
      range = range.normalize(this);
      if (range.isUnset) return immutable.Set();

      if (range.isCollapsed) {
        var _range6 = range,
            _startKey = _range6.startKey,
            _startOffset = _range6.startOffset;

        return this.getMarksAtPosition(_startKey, _startOffset).toSet();
      }

      var _range7 = range,
          startKey = _range7.startKey,
          endKey = _range7.endKey,
          startOffset = _range7.startOffset,
          endOffset = _range7.endOffset;

      var startText = this.getDescendant(startKey);

      if (startKey !== endKey) {
        while (startKey !== endKey && endOffset === 0) {
          var _endText = this.getPreviousText(endKey);
          if (!_endText) {
            break;
          }
          endKey = _endText.key;
          endOffset = _endText.text.length;
        }

        while (startKey !== endKey && startOffset === startText.text.length) {
          startText = this.getNextText(startKey);
          if (!startText) {
            break;
          }
          startKey = startText.key;
          startOffset = 0;
        }
      }

      if (startKey === endKey) {
        return startText.getActiveMarksBetweenOffsets(startOffset, endOffset);
      }

      var startMarks = startText.getActiveMarksBetweenOffsets(startOffset, startText.text.length);
      if (startMarks.size === 0) return immutable.Set();
      var endText = this.getDescendant(endKey);
      var endMarks = endText.getActiveMarksBetweenOffsets(0, endOffset);
      var marks = startMarks.intersect(endMarks);
      // If marks is already empty, the active marks is empty
      if (marks.size === 0) return marks;

      var text = this.getNextText(startKey);

      while (text.key !== endKey) {
        if (text.text.length !== 0) {
          marks = marks.intersect(text.getActiveMarks());
          if (marks.size === 0) return immutable.Set();
        }

        text = this.getNextText(text.key);
      }
      return marks;
    }

    /**
     * Get a set of marks in a `position`, the equivalent of a collapsed range
     *
     * @param {string} key
     * @param {number} offset
     * @return {Set}
     */

  }, {
    key: 'getMarksAtPosition',
    value: function getMarksAtPosition(key, offset) {
      var text = this.getDescendant(key);
      var currentMarks = text.getMarksAtIndex(offset);
      if (offset !== 0) return currentMarks;
      var closestBlock = this.getClosestBlock(key);

      if (closestBlock.text === '') {
        // insert mark for empty block; the empty block are often created by split node or add marks in a range including empty blocks
        return currentMarks;
      }

      var previous = this.getPreviousText(key);
      if (!previous) return immutable.Set();

      if (closestBlock.hasDescendant(previous.key)) {
        return previous.getMarksAtIndex(previous.text.length);
      }

      return currentMarks;
    }

    /**
     * Get all of the marks that match a `type`.
     *
     * @param {String} type
     * @return {Set<Mark>}
     */

  }, {
    key: 'getMarksByType',
    value: function getMarksByType(type) {
      var array = this.getMarksByTypeAsArray(type);
      return new immutable.Set(array);
    }

    /**
     * Get all of the marks that match a `type`.
     *
     * @param {String} type
     * @return {OrderedSet<Mark>}
     */

  }, {
    key: 'getOrderedMarksByType',
    value: function getOrderedMarksByType(type) {
      var array = this.getMarksByTypeAsArray(type);
      return new immutable.OrderedSet(array);
    }

    /**
     * Get all of the marks that match a `type` as an array.
     *
     * @param {String} type
     * @return {Array}
     */

  }, {
    key: 'getMarksByTypeAsArray',
    value: function getMarksByTypeAsArray(type) {
      return this.nodes.reduce(function (array, node) {
        return node.object == 'text' ? array.concat(node.getMarksAsArray().filter(function (m) {
          return m.type == type;
        })) : array.concat(node.getMarksByTypeAsArray(type));
      }, []);
    }

    /**
     * Get the block node before a descendant text node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getNextBlock',
    value: function getNextBlock(key) {
      var child = this.assertDescendant(key);
      var last = void 0;

      if (child.object == 'block') {
        last = child.getLastText();
      } else {
        var block = this.getClosestBlock(key);
        last = block.getLastText();
      }

      var next = this.getNextText(last.key);
      if (!next) return null;

      return this.getClosestBlock(next.key);
    }

    /**
     * Get the node after a descendant by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getNextSibling',
    value: function getNextSibling(key) {
      key = assertKey(key);

      var parent = this.getParent(key);
      var after = parent.nodes.skipUntil(function (child) {
        return child.key == key;
      });

      if (after.size == 0) {
        throw new Error('Could not find a child node with key "' + key + '".');
      }
      return after.get(1);
    }

    /**
     * Get the text node after a descendant text node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getNextText',
    value: function getNextText(key) {
      key = assertKey(key);
      return this.getTexts().skipUntil(function (text) {
        return text.key == key;
      }).get(1);
    }

    /**
     * Get a node in the tree by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getNode',
    value: function getNode(key) {
      key = assertKey(key);
      return this.key == key ? this : this.getDescendant(key);
    }

    /**
     * Get a node in the tree by `path`.
     *
     * @param {Array} path
     * @return {Node|Null}
     */

  }, {
    key: 'getNodeAtPath',
    value: function getNodeAtPath(path) {
      return path.length ? this.getDescendantAtPath(path) : this;
    }

    /**
     * Get the offset for a descendant text node by `key`.
     *
     * @param {String} key
     * @return {Number}
     */

  }, {
    key: 'getOffset',
    value: function getOffset(key) {
      this.assertDescendant(key);

      // Calculate the offset of the nodes before the highest child.
      var child = this.getFurthestAncestor(key);
      var offset = this.nodes.takeUntil(function (n) {
        return n == child;
      }).reduce(function (memo, n) {
        return memo + n.text.length;
      }, 0);

      // Recurse if need be.
      return this.hasChild(key) ? offset : offset + child.getOffset(key);
    }

    /**
     * Get the offset from a `range`.
     *
     * @param {Range} range
     * @return {Number}
     */

  }, {
    key: 'getOffsetAtRange',
    value: function getOffsetAtRange(range) {
      range = range.normalize(this);

      if (range.isUnset) {
        throw new Error('The range cannot be unset to calculcate its offset.');
      }

      if (range.isExpanded) {
        throw new Error('The range must be collapsed to calculcate its offset.');
      }

      var _range8 = range,
          startKey = _range8.startKey,
          startOffset = _range8.startOffset;

      return this.getOffset(startKey) + startOffset;
    }

    /**
     * Get the parent of a child node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getParent',
    value: function getParent(key) {
      if (this.hasChild(key)) return this;

      var node = null;

      this.nodes.find(function (child) {
        if (child.object == 'text') {
          return false;
        } else {
          node = child.getParent(key);
          return node;
        }
      });

      return node;
    }

    /**
     * Get the path of a descendant node by `key`.
     *
     * @param {String|Node} key
     * @return {Array}
     */

  }, {
    key: 'getPath',
    value: function getPath(key) {
      var child = this.assertNode(key);
      var ancestors = this.getAncestors(key);
      var path = [];

      ancestors.reverse().forEach(function (ancestor) {
        var index$$1 = ancestor.nodes.indexOf(child);
        path.unshift(index$$1);
        child = ancestor;
      });

      return path;
    }

    /**
     * Refind the path of node if path is changed.
     *
     * @param {Array} path
     * @param {String} key
     * @return {Array}
     */

  }, {
    key: 'refindPath',
    value: function refindPath(path, key) {
      var node = this.getDescendantAtPath(path);

      if (node && node.key === key) {
        return path;
      }

      return this.getPath(key);
    }

    /**
     *
     * Refind the node with the same node.key after change.
     *
     * @param {Array} path
     * @param {String} key
     * @return {Node|Void}
     */

  }, {
    key: 'refindNode',
    value: function refindNode(path, key) {
      var node = this.getDescendantAtPath(path);

      if (node && node.key === key) {
        return node;
      }

      return this.getDescendant(key);
    }

    /**
     * Get the placeholder for the node from a `schema`.
     *
     * @param {Schema} schema
     * @return {Component|Void}
     */

  }, {
    key: 'getPlaceholder',
    value: function getPlaceholder(schema) {
      return schema.__getPlaceholder(this);
    }

    /**
     * Get the block node before a descendant text node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getPreviousBlock',
    value: function getPreviousBlock(key) {
      var child = this.assertDescendant(key);
      var first = void 0;

      if (child.object == 'block') {
        first = child.getFirstText();
      } else {
        var block = this.getClosestBlock(key);
        first = block.getFirstText();
      }

      var previous = this.getPreviousText(first.key);
      if (!previous) return null;

      return this.getClosestBlock(previous.key);
    }

    /**
     * Get the node before a descendant node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getPreviousSibling',
    value: function getPreviousSibling(key) {
      key = assertKey(key);
      var parent = this.getParent(key);
      var before = parent.nodes.takeUntil(function (child) {
        return child.key == key;
      });

      if (before.size == parent.nodes.size) {
        throw new Error('Could not find a child node with key "' + key + '".');
      }

      return before.last();
    }

    /**
     * Get the text node before a descendant text node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getPreviousText',
    value: function getPreviousText(key) {
      key = assertKey(key);
      return this.getTexts().takeUntil(function (text) {
        return text.key == key;
      }).last();
    }

    /**
     * Get the indexes of the selection for a `range`, given an extra flag for
     * whether the node `isSelected`, to determine whether not finding matches
     * means everything is selected or nothing is.
     *
     * @param {Range} range
     * @param {Boolean} isSelected
     * @return {Object|Null}
     */

  }, {
    key: 'getSelectionIndexes',
    value: function getSelectionIndexes(range) {
      var isSelected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var startKey = range.startKey,
          endKey = range.endKey;

      // PERF: if we're not selected, we can exit early.

      if (!isSelected) {
        return null;
      }

      // if we've been given an invalid selection we can exit early.
      if (range.isUnset) {
        return null;
      }

      // PERF: if the start and end keys are the same, just check for the child
      // that contains that single key.
      if (startKey == endKey) {
        var child = this.getFurthestAncestor(startKey);
        var index$$1 = child ? this.nodes.indexOf(child) : null;
        return { start: index$$1, end: index$$1 + 1 };
      }

      // Otherwise, check all of the children...
      var start = null;
      var end = null;

      this.nodes.forEach(function (child, i) {
        if (child.object == 'text') {
          if (start == null && child.key == startKey) start = i;
          if (end == null && child.key == endKey) end = i + 1;
        } else {
          if (start == null && child.hasDescendant(startKey)) start = i;
          if (end == null && child.hasDescendant(endKey)) end = i + 1;
        }

        // PERF: exit early if both start and end have been found.
        return start == null || end == null;
      });

      if (isSelected && start == null) start = 0;
      if (isSelected && end == null) end = this.nodes.size;
      return start == null ? null : { start: start, end: end };
    }

    /**
     * Get the concatenated text string of all child nodes.
     *
     * @return {String}
     */

  }, {
    key: 'getText',
    value: function getText() {
      return this.nodes.reduce(function (string, node) {
        return string + node.text;
      }, '');
    }

    /**
     * Get the descendent text node at an `offset`.
     *
     * @param {String} offset
     * @return {Node|Null}
     */

  }, {
    key: 'getTextAtOffset',
    value: function getTextAtOffset(offset) {
      // PERF: Add a few shortcuts for the obvious cases.
      if (offset == 0) return this.getFirstText();
      if (offset == this.text.length) return this.getLastText();
      if (offset < 0 || offset > this.text.length) return null;

      var length = 0;

      return this.getTexts().find(function (node, i, nodes) {
        length += node.text.length;
        return length > offset;
      });
    }

    /**
     * Get the direction of the node's text.
     *
     * @return {String}
     */

  }, {
    key: 'getTextDirection',
    value: function getTextDirection() {
      var dir = direction_1(this.text);
      return dir == 'neutral' ? undefined : dir;
    }

    /**
     * Recursively get all of the child text nodes in order of appearance.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getTexts',
    value: function getTexts() {
      var array = this.getTextsAsArray();
      return new immutable.List(array);
    }

    /**
     * Recursively get all the leaf text nodes in order of appearance, as array.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getTextsAsArray',
    value: function getTextsAsArray() {
      var array = [];

      this.nodes.forEach(function (node) {
        if (node.object == 'text') {
          array.push(node);
        } else {
          array = array.concat(node.getTextsAsArray());
        }
      });

      return array;
    }

    /**
     * Get all of the text nodes in a `range`.
     *
     * @param {Range} range
     * @return {List<Node>}
     */

  }, {
    key: 'getTextsAtRange',
    value: function getTextsAtRange(range) {
      range = range.normalize(this);
      if (range.isUnset) return immutable.List();
      var _range9 = range,
          startKey = _range9.startKey,
          endKey = _range9.endKey;

      return new immutable.List(this.getTextsBetweenPositionsAsArray(startKey, endKey));
    }

    /**
     * Get all of the text nodes in a `range` as an array.
     * PERF: use key in arguments for cache
     *
     * @param {string} startKey
     * @param {string} endKey
     * @returns {Array}
     */

  }, {
    key: 'getTextsBetweenPositionsAsArray',
    value: function getTextsBetweenPositionsAsArray(startKey, endKey) {
      var startText = this.getDescendant(startKey);

      // PERF: the most common case is when the range is in a single text node,
      // where we can avoid a lot of iterating of the tree.
      if (startKey == endKey) return [startText];

      var endText = this.getDescendant(endKey);
      var texts = this.getTextsAsArray();
      var start = texts.indexOf(startText);
      var end = texts.indexOf(endText, start);
      return texts.slice(start, end + 1);
    }

    /**
     * Get all of the text nodes in a `range` as an array.
     *
     * @param {Range} range
     * @return {Array}
     */

  }, {
    key: 'getTextsAtRangeAsArray',
    value: function getTextsAtRangeAsArray(range) {
      range = range.normalize(this);
      if (range.isUnset) return [];
      var _range10 = range,
          startKey = _range10.startKey,
          endKey = _range10.endKey;

      return this.getTextsBetweenPositionsAsArray(startKey, endKey);
    }

    /**
     * Check if a child node exists by `key`.
     *
     * @param {String} key
     * @return {Boolean}
     */

  }, {
    key: 'hasChild',
    value: function hasChild(key) {
      return !!this.getChild(key);
    }

    /**
     * Check if a node has block node children.
     *
     * @param {String} key
     * @return {Boolean}
     */

  }, {
    key: 'hasBlocks',
    value: function hasBlocks(key) {
      var node = this.assertNode(key);
      return !!(node.nodes && node.nodes.find(function (n) {
        return n.object === 'block';
      }));
    }

    /**
     * Check if a node has inline node children.
     *
     * @param {String} key
     * @return {Boolean}
     */

  }, {
    key: 'hasInlines',
    value: function hasInlines(key) {
      var node = this.assertNode(key);
      return !!(node.nodes && node.nodes.find(function (n) {
        return Inline.isInline(n) || Text.isText(n);
      }));
    }

    /**
     * Recursively check if a child node exists by `key`.
     *
     * @param {String} key
     * @return {Boolean}
     */

  }, {
    key: 'hasDescendant',
    value: function hasDescendant(key) {
      return !!this.getDescendant(key);
    }

    /**
     * Recursively check if a node exists by `key`.
     *
     * @param {String} key
     * @return {Boolean}
     */

  }, {
    key: 'hasNode',
    value: function hasNode(key) {
      return !!this.getNode(key);
    }

    /**
     * Check if a node has a void parent by `key`.
     *
     * @param {String} key
     * @return {Boolean}
     */

  }, {
    key: 'hasVoidParent',
    value: function hasVoidParent(key) {
      return !!this.getClosestVoid(key);
    }

    /**
     * Insert a `node` at `index`.
     *
     * @param {Number} index
     * @param {Node} node
     * @return {Node}
     */

  }, {
    key: 'insertNode',
    value: function insertNode(index$$1, node) {
      var keys = this.getKeysAsArray();

      if (keys.includes(node.key)) {
        node = node.regenerateKey();
      }

      if (node.object != 'text') {
        node = node.mapDescendants(function (desc) {
          return keys.includes(desc.key) ? desc.regenerateKey() : desc;
        });
      }

      var nodes = this.nodes.insert(index$$1, node);
      return this.set('nodes', nodes);
    }

    /**
     * Check whether the node is in a `range`.
     *
     * @param {Range} range
     * @return {Boolean}
     */

  }, {
    key: 'isInRange',
    value: function isInRange(range) {
      range = range.normalize(this);

      var node = this;
      var _range11 = range,
          startKey = _range11.startKey,
          endKey = _range11.endKey,
          isCollapsed = _range11.isCollapsed;

      // PERF: solve the most common cast where the start or end key are inside
      // the node, for collapsed selections.

      if (node.key == startKey || node.key == endKey || node.hasDescendant(startKey) || node.hasDescendant(endKey)) {
        return true;
      }

      // PERF: if the selection is collapsed and the previous check didn't return
      // true, then it must be false.
      if (isCollapsed) {
        return false;
      }

      // Otherwise, look through all of the leaf text nodes in the range, to see
      // if any of them are inside the node.
      var texts = node.getTextsAtRange(range);
      var memo = false;

      texts.forEach(function (text) {
        if (node.hasDescendant(text.key)) memo = true;
        return memo;
      });

      return memo;
    }

    /**
     * Check whether the node is a leaf block.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isLeafBlock',
    value: function isLeafBlock() {
      return this.object == 'block' && this.nodes.every(function (n) {
        return n.object != 'block';
      });
    }

    /**
     * Check whether the node is a leaf inline.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isLeafInline',
    value: function isLeafInline() {
      return this.object == 'inline' && this.nodes.every(function (n) {
        return n.object != 'inline';
      });
    }

    /**
     * Merge a children node `first` with another children node `second`.
     * `first` and `second` will be concatenated in that order.
     * `first` and `second` must be two Nodes or two Text.
     *
     * @param {Node} first
     * @param {Node} second
     * @return {Node}
     */

  }, {
    key: 'mergeNode',
    value: function mergeNode(withIndex, index$$1) {
      var node = this;
      var one = node.nodes.get(withIndex);
      var two = node.nodes.get(index$$1);

      if (one.object != two.object) {
        throw new Error('Tried to merge two nodes of different objects: "' + one.object + '" and "' + two.object + '".');
      }

      // If the nodes are text nodes, concatenate their leaves together
      if (one.object == 'text') {
        one = one.mergeText(two);
      } else {
        // Otherwise, concatenate their child nodes together.
        var nodes = one.nodes.concat(two.nodes);
        one = one.set('nodes', nodes);
      }

      node = node.removeNode(index$$1);
      node = node.removeNode(withIndex);
      node = node.insertNode(withIndex, one);
      return node;
    }

    /**
     * Map all child nodes, updating them in their parents. This method is
     * optimized to not return a new node if no changes are made.
     *
     * @param {Function} iterator
     * @return {Node}
     */

  }, {
    key: 'mapChildren',
    value: function mapChildren(iterator) {
      var _this2 = this;

      var nodes = this.nodes;


      nodes.forEach(function (node, i) {
        var ret = iterator(node, i, _this2.nodes);
        if (ret != node) nodes = nodes.set(ret.key, ret);
      });

      return this.set('nodes', nodes);
    }

    /**
     * Map all descendant nodes, updating them in their parents. This method is
     * optimized to not return a new node if no changes are made.
     *
     * @param {Function} iterator
     * @return {Node}
     */

  }, {
    key: 'mapDescendants',
    value: function mapDescendants(iterator) {
      var _this3 = this;

      var nodes = this.nodes;


      nodes.forEach(function (node, index$$1) {
        var ret = node;
        if (ret.object != 'text') ret = ret.mapDescendants(iterator);
        ret = iterator(ret, index$$1, _this3.nodes);
        if (ret == node) return;

        nodes = nodes.set(index$$1, ret);
      });

      return this.set('nodes', nodes);
    }

    /**
     * Regenerate the node's key.
     *
     * @return {Node}
     */

  }, {
    key: 'regenerateKey',
    value: function regenerateKey() {
      var key = generateKey();
      return this.set('key', key);
    }

    /**
     * Remove a `node` from the children node map.
     *
     * @param {String} key
     * @return {Node}
     */

  }, {
    key: 'removeDescendant',
    value: function removeDescendant(key) {
      key = assertKey(key);

      var node = this;
      var parent = node.getParent(key);
      if (!parent) throw new Error('Could not find a descendant node with key "' + key + '".');

      var index$$1 = parent.nodes.findIndex(function (n) {
        return n.key === key;
      });
      var nodes = parent.nodes.delete(index$$1);

      parent = parent.set('nodes', nodes);
      node = node.updateNode(parent);
      return node;
    }

    /**
     * Remove a node at `index`.
     *
     * @param {Number} index
     * @return {Node}
     */

  }, {
    key: 'removeNode',
    value: function removeNode(index$$1) {
      var nodes = this.nodes.delete(index$$1);
      return this.set('nodes', nodes);
    }

    /**
     * Split a child node by `index` at `position`.
     *
     * @param {Number} index
     * @param {Number} position
     * @return {Node}
     */

  }, {
    key: 'splitNode',
    value: function splitNode(index$$1, position) {
      var node = this;
      var child = node.nodes.get(index$$1);
      var one = void 0;
      var two = void 0;

      // If the child is a text node, the `position` refers to the text offset at
      // which to split it.
      if (child.object == 'text') {
        
        var _child$splitText = child.splitText(position);

        var _child$splitText2 = slicedToArray(_child$splitText, 2);

        one = _child$splitText2[0];
        two = _child$splitText2[1];
      } else {
        // Otherwise, if the child is not a text node, the `position` refers to the
        // index at which to split its children.
        var befores = child.nodes.take(position);
        var afters = child.nodes.skip(position);
        one = child.set('nodes', befores);
        two = child.set('nodes', afters).regenerateKey();
      }

      // Remove the old node and insert the newly split children.
      node = node.removeNode(index$$1);
      node = node.insertNode(index$$1, two);
      node = node.insertNode(index$$1, one);
      return node;
    }

    /**
     * Set a new value for a child node by `key`.
     *
     * @param {Node} node
     * @return {Node}
     */

  }, {
    key: 'updateNode',
    value: function updateNode(node) {
      if (node.key == this.key) {
        return node;
      }

      var child = this.assertDescendant(node.key);
      var ancestors = this.getAncestors(node.key);

      ancestors.reverse().forEach(function (parent) {
        var _parent = parent,
            nodes = _parent.nodes;

        var index$$1 = nodes.indexOf(child);
        child = parent;
        nodes = nodes.set(index$$1, node);
        parent = parent.set('nodes', nodes);
        node = parent;
      });

      return node;
    }

    /**
     * Validate the node against a `schema`.
     *
     * @param {Schema} schema
     * @return {Function|Null}
     */

  }, {
    key: 'validate',
    value: function validate(schema) {
      return schema.validateNode(this);
    }

    /**
     * Get the first invalid descendant
     *
     * @param {Schema} schema
     * @return {Node|Text|Null}
     */

  }, {
    key: 'getFirstInvalidDescendant',
    value: function getFirstInvalidDescendant(schema) {
      var result = null;

      this.nodes.find(function (n) {
        result = n.validate(schema) ? n : n.getFirstInvalidDescendant(schema);
        return result;
      });
      return result;
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Node` with `attrs`.
     *
     * @param {Object|Node} attrs
     * @return {Node}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Node.isNode(attrs)) {
        return attrs;
      }

      if (isPlainObject(attrs)) {
        var object = attrs.object;


        if (!object && attrs.kind) {
          index.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');

          object = attrs.kind;
        }

        switch (object) {
          case 'block':
            return Block.create(attrs);
          case 'document':
            return Document.create(attrs);
          case 'inline':
            return Inline.create(attrs);
          case 'text':
            return Text.create(attrs);

          default:
            {
              throw new Error('`Node.create` requires a `object` string.');
            }
        }
      }

      throw new Error('`Node.create` only accepts objects or nodes but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Nodes` from an array.
     *
     * @param {Array<Object|Node>} elements
     * @return {List<Node>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (immutable.List.isList(elements) || Array.isArray(elements)) {
        var list = immutable.List(elements.map(Node.create));
        return list;
      }

      throw new Error('`Node.createList` only accepts lists or arrays, but you passed it: ' + elements);
    }

    /**
     * Create a dictionary of settable node properties from `attrs`.
     *
     * @param {Object|String|Node} attrs
     * @return {Object}
     */

  }, {
    key: 'createProperties',
    value: function createProperties() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Block.isBlock(attrs) || Inline.isInline(attrs)) {
        return {
          data: attrs.data,
          isVoid: attrs.isVoid,
          type: attrs.type
        };
      }

      if (typeof attrs == 'string') {
        return { type: attrs };
      }

      if (isPlainObject(attrs)) {
        var props = {};
        if ('type' in attrs) props.type = attrs.type;
        if ('data' in attrs) props.data = Data.create(attrs.data);
        if ('isVoid' in attrs) props.isVoid = attrs.isVoid;
        return props;
      }

      throw new Error('`Node.createProperties` only accepts objects, strings, blocks or inlines, but you passed it: ' + attrs);
    }

    /**
     * Create a `Node` from a JSON `value`.
     *
     * @param {Object} value
     * @return {Node}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(value) {
      var object = value.object;


      if (!object && value.kind) {
        index.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');

        object = value.kind;
      }

      switch (object) {
        case 'block':
          return Block.fromJSON(value);
        case 'document':
          return Document.fromJSON(value);
        case 'inline':
          return Inline.fromJSON(value);
        case 'text':
          return Text.fromJSON(value);

        default:
          {
            throw new Error('`Node.fromJSON` requires an `object` of either \'block\', \'document\', \'inline\' or \'text\', but you passed: ' + value);
          }
      }
    }

    /**
     * Alias `fromJS`.
     */

  }, {
    key: 'isNode',


    /**
     * Check if `any` is a `Node`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isNode(any) {
      return !!['BLOCK', 'DOCUMENT', 'INLINE', 'TEXT'].find(function (type) {
        return isType(type, any);
      });
    }

    /**
     * Check if `any` is a list of nodes.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isNodeList',
    value: function isNodeList(any) {
      return immutable.List.isList(any) && any.every(function (item) {
        return Node.isNode(item);
      });
    }
  }]);
  return Node;
}();

/**
 * Assert a key `arg`.
 *
 * @param {String} arg
 * @return {String}
 */

Node.fromJS = Node.fromJSON;
function assertKey(arg) {
  if (typeof arg == 'string') return arg;
  throw new Error('Invalid `key` argument! It must be a key string, but you passed: ' + arg);
}

/**
 * Memoize read methods.
 */

memoize$2(Node.prototype, ['areDescendantsSorted', 'getAncestors', 'getBlocksAsArray', 'getBlocksAtRangeAsArray', 'getBlocksByTypeAsArray', 'getChild', 'getClosestBlock', 'getClosestInline', 'getClosestVoid', 'getCommonAncestor', 'getDecorations', 'getDepth', 'getDescendant', 'getDescendantAtPath', 'getFirstText', 'getFragmentAtRange', 'getFurthestBlock', 'getFurthestInline', 'getFurthestAncestor', 'getFurthestOnlyChildAncestor', 'getInlinesAsArray', 'getInlinesAtRangeAsArray', 'getInlinesByTypeAsArray', 'getMarksAsArray', 'getMarksAtPosition', 'getOrderedMarksBetweenPositions', 'getInsertMarksAtRange', 'getKeysAsArray', 'getLastText', 'getMarksByTypeAsArray', 'getNextBlock', 'getNextSibling', 'getNextText', 'getNode', 'getNodeAtPath', 'getOffset', 'getOffsetAtRange', 'getParent', 'getPath', 'getPlaceholder', 'getPreviousBlock', 'getPreviousSibling', 'getPreviousText', 'getText', 'getTextAtOffset', 'getTextDirection', 'getTextsAsArray', 'getTextsBetweenPositionsAsArray', 'isLeafBlock', 'isLeafInline', 'validate', 'getFirstInvalidDescendant']);

/**
 * Mix in `Node` methods.
 */

Object.getOwnPropertyNames(Node.prototype).forEach(function (method) {
  if (method == 'constructor') return;
  Block.prototype[method] = Node.prototype[method];
  Inline.prototype[method] = Node.prototype[method];
  Document.prototype[method] = Node.prototype[method];
});

Block.createChildren = Node.createList;
Inline.createChildren = Node.createList;
Document.createChildren = Node.createList;

var esrever = createCommonjsModule(function (module, exports) {
/*! https://mths.be/esrever v0.2.0 by @mathias */
(function(root) {

	// Detect free variables `exports`
	var freeExports = 'object' == 'object' && exports;

	// Detect free variable `module`
	var freeModule = 'object' == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var regexSymbolWithCombiningMarks = /([\0-\u02FF\u0370-\u1AAF\u1B00-\u1DBF\u1E00-\u20CF\u2100-\uD7FF\uE000-\uFE1F\uFE30-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])([\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]+)/g;
	var regexSurrogatePair = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g;

	var reverse = function(string) {
		// Step 1: deal with combining marks and astral symbols (surrogate pairs)
		string = string
			// Swap symbols with their combining marks so the combining marks go first
			.replace(regexSymbolWithCombiningMarks, function($0, $1, $2) {
				// Reverse the combining marks so they will end up in the same order
				// later on (after another round of reversing)
				return reverse($2) + $1;
			})
			// Swap high and low surrogates so the low surrogates go first
			.replace(regexSurrogatePair, '$2$1');
		// Step 2: reverse the code units in the string
		var result = '';
		var index = string.length;
		while (index--) {
			result += string.charAt(index);
		}
		return result;
	};

	/*--------------------------------------------------------------------------*/

	var esrever = {
		'version': '0.2.0',
		'reverse': reverse
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof undefined == 'function' &&
		typeof undefined.amd == 'object' &&
		undefined.amd
	) {
		undefined(function() {
			return esrever;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = esrever;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (var key in esrever) {
				esrever.hasOwnProperty(key) && (freeExports[key] = esrever[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.esrever = esrever;
	}

}(commonjsGlobal));
});

var esrever_1 = esrever.reverse;

/**
 * Surrogate pair start and end points.
 *
 * @type {Number}
 */

var SURROGATE_START = 0xd800;
var SURROGATE_END = 0xdfff;

/**
 * A regex to match space characters.
 *
 * @type {RegExp}
 */

var SPACE = /\s/;

/**
 * A regex to match chameleon characters, that count as word characters as long
 * as they are inside of a word.
 *
 * @type {RegExp}
 */

var CHAMELEON = /['\u2018\u2019]/;

/**
 * A regex that matches punctuation.
 *
 * @type {RegExp}
 */

var PUNCTUATION = /[\u0021-\u0023\u0025-\u002A\u002C-\u002F\u003A\u003B\u003F\u0040\u005B-\u005D\u005F\u007B\u007D\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;

/**
 * Is a character `code` in a surrogate character.
 *
 * @param {Number} code
 * @return {Boolean}
 */

function isSurrogate(code) {
  return SURROGATE_START <= code && code <= SURROGATE_END;
}

/**
 * Is a character a word character? Needs the `remaining` characters too.
 *
 * @param {String} char
 * @param {String|Void} remaining
 * @return {Boolean}
 */

function isWord(char, remaining) {
  if (SPACE.test(char)) return false;

  // If it's a chameleon character, recurse to see if the next one is or not.
  if (CHAMELEON.test(char)) {
    var next = remaining.charAt(0);
    var length = getCharLength(next);
    next = remaining.slice(0, length);
    var rest = remaining.slice(length);
    if (isWord(next, rest)) return true;
  }

  if (PUNCTUATION.test(char)) return false;
  return true;
}

/**
 * Get the length of a `character`.
 *
 * @param {String} char
 * @return {Number}
 */

function getCharLength(char) {
  return isSurrogate(char.charCodeAt(0)) ? 2 : 1;
}

/**
 * Get the offset to the end of the first character in `text`.
 *
 * @param {String} text
 * @return {Number}
 */

function getCharOffset(text) {
  var char = text.charAt(0);
  return getCharLength(char);
}

/**
 * Get the offset to the end of the character before an `offset` in `text`.
 *
 * @param {String} text
 * @param {Number} offset
 * @return {Number}
 */

function getCharOffsetBackward(text, offset) {
  text = text.slice(0, offset);
  text = esrever_1(text);
  return getCharOffset(text);
}

/**
 * Get the offset to the end of the character after an `offset` in `text`.
 *
 * @param {String} text
 * @param {Number} offset
 * @return {Number}
 */

function getCharOffsetForward(text, offset) {
  text = text.slice(offset);
  return getCharOffset(text);
}

/**
 * Get the offset to the end of the first word in `text`.
 *
 * @param {String} text
 * @return {Number}
 */

function getWordOffset(text) {
  var length = 0;
  var i = 0;
  var started = false;
  var char = void 0;

  while (char = text.charAt(i)) {
    var l = getCharLength(char);
    char = text.slice(i, i + l);
    var rest = text.slice(i + l);

    if (isWord(char, rest)) {
      started = true;
      length += l;
    } else if (!started) {
      length += l;
    } else {
      break;
    }

    i += l;
  }

  return length;
}

/**
 * Get the offset to the end of the word before an `offset` in `text`.
 *
 * @param {String} text
 * @param {Number} offset
 * @return {Number}
 */

function getWordOffsetBackward(text, offset) {
  text = text.slice(0, offset);
  text = esrever_1(text);
  var o = getWordOffset(text);
  return o;
}

/**
 * Get the offset to the end of the word after an `offset` in `text`.
 *
 * @param {String} text
 * @param {Number} offset
 * @return {Number}
 */

function getWordOffsetForward(text, offset) {
  text = text.slice(offset);
  var o = getWordOffset(text);
  return o;
}

/**
 * Export.
 *
 * @type {Object}
 */

var String$1 = {
  getCharOffsetForward: getCharOffsetForward,
  getCharOffsetBackward: getCharOffsetBackward,
  getWordOffsetBackward: getWordOffsetBackward,
  getWordOffsetForward: getWordOffsetForward
};

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes$1 = {};

/**
 * Add a new `mark` to the characters at `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Mixed} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.addMarkAtRange = function (change, range, mark) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (range.isCollapsed) return;

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;
  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset;

  var texts = document.getTextsAtRange(range);

  texts.forEach(function (node) {
    var key = node.key;

    var index$$1 = 0;
    var length = node.text.length;

    if (key == startKey) index$$1 = startOffset;
    if (key == endKey) length = endOffset;
    if (key == startKey && key == endKey) length = endOffset - startOffset;

    change.addMarkByKey(key, index$$1, length, mark, { normalize: normalize });
  });
};

/**
 * Add a list of `marks` to the characters at `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Array<Mixed>} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.addMarksAtRange = function (change, range, marks) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  marks.forEach(function (mark) {
    return change.addMarkAtRange(range, mark, options);
  });
};

/**
 * Delete everything in a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteAtRange = function (change, range) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (range.isCollapsed) return;

  // Snapshot the selection, which creates an extra undo save point, so that
  // when you undo a delete, the expanded selection will be retained.
  change.snapshotSelection();

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset;
  var document = value.document;

  var isStartVoid = document.hasVoidParent(startKey);
  var isEndVoid = document.hasVoidParent(endKey);
  var startBlock = document.getClosestBlock(startKey);
  var endBlock = document.getClosestBlock(endKey);

  // Check if we have a "hanging" selection case where the even though the
  // selection extends into the start of the end node, we actually want to
  // ignore that for UX reasons.
  var isHanging = startOffset == 0 && endOffset == 0 && isStartVoid == false && startKey == startBlock.getFirstText().key && endKey == endBlock.getFirstText().key;

  // If it's a hanging selection, nudge it back to end in the previous text.
  if (isHanging && isEndVoid) {
    var prevText = document.getPreviousText(endKey);
    endKey = prevText.key;
    endOffset = prevText.text.length;
    isEndVoid = document.hasVoidParent(endKey);
  }

  // If the start node is inside a void node, remove the void node and update
  // the starting point to be right after it, continuously until the start point
  // is not a void, or until the entire range is handled.
  while (isStartVoid) {
    var startVoid = document.getClosestVoid(startKey);
    var nextText = document.getNextText(startKey);
    change.removeNodeByKey(startVoid.key, { normalize: false });

    // If the start and end keys are the same, we're done.
    if (startKey == endKey) return;

    // If there is no next text node, we're done.
    if (!nextText) return;

    // Continue...
    document = change.value.document;
    startKey = nextText.key;
    startOffset = 0;
    isStartVoid = document.hasVoidParent(startKey);
  }

  // If the end node is inside a void node, do the same thing but backwards. But
  // we don't need any aborting checks because if we've gotten this far there
  // must be a non-void node that will exit the loop.
  while (isEndVoid) {
    var endVoid = document.getClosestVoid(endKey);
    var _prevText = document.getPreviousText(endKey);
    change.removeNodeByKey(endVoid.key, { normalize: false });

    // Continue...
    document = change.value.document;
    endKey = _prevText.key;
    endOffset = _prevText.text.length;
    isEndVoid = document.hasVoidParent(endKey);
  }

  // If the start and end key are the same, and it was a hanging selection, we
  // can just remove the entire block.
  if (startKey == endKey && isHanging) {
    change.removeNodeByKey(startBlock.key, { normalize: normalize });
    return;
  } else if (startKey == endKey) {
    // Otherwise, if it wasn't hanging, we're inside a single text node, so we can
    // simply remove the text in the range.
    var index$$1 = startOffset;
    var length = endOffset - startOffset;
    change.removeTextByKey(startKey, index$$1, length, { normalize: normalize });
    return;
  } else {
    // Otherwise, we need to recursively remove text and nodes inside the start
    // block after the start offset and inside the end block before the end
    // offset. Then remove any blocks that are in between the start and end
    // blocks. Then finally merge the start and end nodes.
    startBlock = document.getClosestBlock(startKey);
    endBlock = document.getClosestBlock(endKey);
    var startText = document.getNode(startKey);
    var endText = document.getNode(endKey);
    var startLength = startText.text.length - startOffset;
    var endLength = endOffset;

    var ancestor = document.getCommonAncestor(startKey, endKey);
    var startChild = ancestor.getFurthestAncestor(startKey);
    var endChild = ancestor.getFurthestAncestor(endKey);

    var startParent = document.getParent(startBlock.key);
    var startParentIndex = startParent.nodes.indexOf(startBlock);
    var endParentIndex = startParent.nodes.indexOf(endBlock);

    var child = void 0;

    // Iterate through all of the nodes in the tree after the start text node
    // but inside the end child, and remove them.
    child = startText;

    while (child.key != startChild.key) {
      var parent = document.getParent(child.key);
      var _index = parent.nodes.indexOf(child);
      var afters = parent.nodes.slice(_index + 1);

      afters.reverse().forEach(function (node) {
        change.removeNodeByKey(node.key, { normalize: false });
      });

      child = parent;
    }

    // Remove all of the middle children.
    var startChildIndex = ancestor.nodes.indexOf(startChild);
    var endChildIndex = ancestor.nodes.indexOf(endChild);
    var middles = ancestor.nodes.slice(startChildIndex + 1, endChildIndex);

    middles.reverse().forEach(function (node) {
      change.removeNodeByKey(node.key, { normalize: false });
    });

    // Remove the nodes before the end text node in the tree.
    child = endText;

    while (child.key != endChild.key) {
      var _parent = document.getParent(child.key);
      var _index2 = _parent.nodes.indexOf(child);
      var befores = _parent.nodes.slice(0, _index2);

      befores.reverse().forEach(function (node) {
        change.removeNodeByKey(node.key, { normalize: false });
      });

      child = _parent;
    }

    // Remove any overlapping text content from the leaf text nodes.
    if (startLength != 0) {
      change.removeTextByKey(startKey, startOffset, startLength, {
        normalize: false
      });
    }

    if (endLength != 0) {
      change.removeTextByKey(endKey, 0, endOffset, { normalize: false });
    }

    // If the start and end blocks aren't the same, move and merge the end block
    // into the start block.
    if (startBlock.key != endBlock.key) {
      document = change.value.document;
      var lonely = document.getFurthestOnlyChildAncestor(endBlock.key);

      // Move the end block to be right after the start block.
      if (endParentIndex != startParentIndex + 1) {
        change.moveNodeByKey(endBlock.key, startParent.key, startParentIndex + 1, { normalize: false });
      }

      // If the selection is hanging, just remove the start block, otherwise
      // merge the end block into it.
      if (isHanging) {
        change.removeNodeByKey(startBlock.key, { normalize: false });
      } else {
        change.mergeNodeByKey(endBlock.key, { normalize: false });
      }

      // If nested empty blocks are left over above the end block, remove them.
      if (lonely) {
        change.removeNodeByKey(lonely.key, { normalize: false });
      }
    }

    // If we should normalize, do it now after everything.
    if (normalize) {
      change.normalizeNodeByKey(ancestor.key);
    }
  }
};

/**
 * Delete backward until the character boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteCharBackwardAtRange = function (change, range, options) {
  var value = change.value;
  var document = value.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  var text = startBlock.text;

  var n = String$1.getCharOffsetBackward(text, o);
  change.deleteBackwardAtRange(range, n, options);
};

/**
 * Delete backward until the line boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteLineBackwardAtRange = function (change, range, options) {
  var value = change.value;
  var document = value.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  change.deleteBackwardAtRange(range, o, options);
};

/**
 * Delete backward until the word boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteWordBackwardAtRange = function (change, range, options) {
  var value = change.value;
  var document = value.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  var text = startBlock.text;

  var n = String$1.getWordOffsetBackward(text, o);
  change.deleteBackwardAtRange(range, n, options);
};

/**
 * Delete backward `n` characters at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Number} n (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteBackwardAtRange = function (change, range) {
  var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (n === 0) return;
  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;
  var _range = range,
      startKey = _range.startKey,
      focusOffset = _range.focusOffset;

  // If the range is expanded, perform a regular delete instead.

  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize: normalize });
    return;
  }

  var voidParent = document.getClosestVoid(startKey);

  // If there is a void parent, delete it.
  if (voidParent) {
    change.removeNodeByKey(voidParent.key, { normalize: normalize });
    return;
  }

  var block = document.getClosestBlock(startKey);

  // If the closest is not void, but empty, remove it
  if (block && block.isEmpty && document.nodes.size !== 1) {
    change.removeNodeByKey(block.key, { normalize: normalize });
    return;
  }

  // If the range is at the start of the document, abort.
  if (range.isAtStartOf(document)) {
    return;
  }

  // If the range is at the start of the text node, we need to figure out what
  // is behind it to know how to delete...
  var text = document.getDescendant(startKey);

  if (range.isAtStartOf(text)) {
    var prev = document.getPreviousText(text.key);
    var prevBlock = document.getClosestBlock(prev.key);
    var prevVoid = document.getClosestVoid(prev.key);

    // If the previous text node has a void parent, remove it.
    if (prevVoid) {
      change.removeNodeByKey(prevVoid.key, { normalize: normalize });
      return;
    }

    // If we're deleting by one character and the previous text node is not
    // inside the current block, we need to merge the two blocks together.
    if (n == 1 && prevBlock != block) {
      range = range.merge({
        anchorKey: prev.key,
        anchorOffset: prev.text.length
      });

      change.deleteAtRange(range, { normalize: normalize });
      return;
    }
  }

  // If the focus offset is farther than the number of characters to delete,
  // just remove the characters backwards inside the current node.
  if (n < focusOffset) {
    range = range.merge({
      focusOffset: focusOffset - n,
      isBackward: true
    });

    change.deleteAtRange(range, { normalize: normalize });
    return;
  }

  // Otherwise, we need to see how many nodes backwards to go.
  var node = text;
  var offset = 0;
  var traversed = focusOffset;

  while (n > traversed) {
    node = document.getPreviousText(node.key);
    var next = traversed + node.text.length;

    if (n <= next) {
      offset = next - n;
      break;
    } else {
      traversed = next;
    }
  }

  range = range.merge({
    focusKey: node.key,
    focusOffset: offset,
    isBackward: true
  });

  change.deleteAtRange(range, { normalize: normalize });
};

/**
 * Delete forward until the character boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteCharForwardAtRange = function (change, range, options) {
  var value = change.value;
  var document = value.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  var text = startBlock.text;

  var n = String$1.getCharOffsetForward(text, o);
  change.deleteForwardAtRange(range, n, options);
};

/**
 * Delete forward until the line boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteLineForwardAtRange = function (change, range, options) {
  var value = change.value;
  var document = value.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  change.deleteForwardAtRange(range, startBlock.text.length - o, options);
};

/**
 * Delete forward until the word boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteWordForwardAtRange = function (change, range, options) {
  var value = change.value;
  var document = value.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  var text = startBlock.text;

  var n = String$1.getWordOffsetForward(text, o);
  change.deleteForwardAtRange(range, n, options);
};

/**
 * Delete forward `n` characters at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Number} n (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteForwardAtRange = function (change, range) {
  var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (n === 0) return;
  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;
  var _range2 = range,
      startKey = _range2.startKey,
      focusOffset = _range2.focusOffset;

  // If the range is expanded, perform a regular delete instead.

  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize: normalize });
    return;
  }

  var voidParent = document.getClosestVoid(startKey);

  // If the node has a void parent, delete it.
  if (voidParent) {
    change.removeNodeByKey(voidParent.key, { normalize: normalize });
    return;
  }

  var block = document.getClosestBlock(startKey);

  // If the closest is not void, but empty, remove it
  if (block && block.isEmpty && document.nodes.size !== 1) {
    var nextBlock = document.getNextBlock(block.key);
    change.removeNodeByKey(block.key, { normalize: normalize });

    if (nextBlock && nextBlock.key) {
      change.moveToStartOf(nextBlock);
    }
    return;
  }

  // If the range is at the start of the document, abort.
  if (range.isAtEndOf(document)) {
    return;
  }

  // If the range is at the start of the text node, we need to figure out what
  // is behind it to know how to delete...
  var text = document.getDescendant(startKey);

  if (range.isAtEndOf(text)) {
    var next = document.getNextText(text.key);
    var _nextBlock = document.getClosestBlock(next.key);
    var nextVoid = document.getClosestVoid(next.key);

    // If the next text node has a void parent, remove it.
    if (nextVoid) {
      change.removeNodeByKey(nextVoid.key, { normalize: normalize });
      return;
    }

    // If we're deleting by one character and the previous text node is not
    // inside the current block, we need to merge the two blocks together.
    if (n == 1 && _nextBlock != block) {
      range = range.merge({
        focusKey: next.key,
        focusOffset: 0
      });

      change.deleteAtRange(range, { normalize: normalize });
      return;
    }
  }

  // If the remaining characters to the end of the node is greater than or equal
  // to the number of characters to delete, just remove the characters forwards
  // inside the current node.
  if (n <= text.text.length - focusOffset) {
    range = range.merge({
      focusOffset: focusOffset + n
    });

    change.deleteAtRange(range, { normalize: normalize });
    return;
  }

  // Otherwise, we need to see how many nodes forwards to go.
  var node = text;
  var offset = focusOffset;
  var traversed = text.text.length - focusOffset;

  while (n > traversed) {
    node = document.getNextText(node.key);
    var _next = traversed + node.text.length;

    if (n <= _next) {
      offset = n - traversed;
      break;
    } else {
      traversed = _next;
    }
  }

  // If the focus node is inside a void, go up until right before it.
  if (document.hasVoidParent(node.key)) {
    var parent = document.getClosestVoid(node.key);
    node = document.getPreviousText(parent.key);
    offset = node.text.length;
  }

  range = range.merge({
    focusKey: node.key,
    focusOffset: offset
  });

  change.deleteAtRange(range, { normalize: normalize });
};

/**
 * Insert a `block` node at `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Block|String|Object} block
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.insertBlockAtRange = function (change, range, block) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  block = Block.create(block);
  var normalize = change.getFlag('normalize', options);

  if (range.isExpanded) {
    change.deleteAtRange(range);
    range = range.collapseToStart();
  }

  var value = change.value;
  var document = value.document;
  var _range3 = range,
      startKey = _range3.startKey,
      startOffset = _range3.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var startInline = document.getClosestInline(startKey);
  var parent = document.getParent(startBlock.key);
  var index$$1 = parent.nodes.indexOf(startBlock);

  if (startBlock.isVoid) {
    var extra = range.isAtEndOf(startBlock) ? 1 : 0;
    change.insertNodeByKey(parent.key, index$$1 + extra, block, { normalize: normalize });
  } else if (startBlock.isEmpty) {
    change.insertNodeByKey(parent.key, index$$1 + 1, block, { normalize: normalize });
  } else if (range.isAtStartOf(startBlock)) {
    change.insertNodeByKey(parent.key, index$$1, block, { normalize: normalize });
  } else if (range.isAtEndOf(startBlock)) {
    change.insertNodeByKey(parent.key, index$$1 + 1, block, { normalize: normalize });
  } else {
    if (startInline && startInline.isVoid) {
      var atEnd = range.isAtEndOf(startInline);
      var siblingText = atEnd ? document.getNextText(startKey) : document.getPreviousText(startKey);

      var splitRange = atEnd ? range.moveToStartOf(siblingText) : range.moveToEndOf(siblingText);

      startKey = splitRange.startKey;
      startOffset = splitRange.startOffset;
    }

    change.splitDescendantsByKey(startBlock.key, startKey, startOffset, {
      normalize: false
    });

    change.insertNodeByKey(parent.key, index$$1 + 1, block, { normalize: normalize });
  }

  if (normalize) {
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Insert a `fragment` at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Document} fragment
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.insertFragmentAtRange = function (change, range, fragment) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var normalize = change.getFlag('normalize', options);

  // If the range is expanded, delete it first.
  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize: false });

    if (change.value.document.getDescendant(range.startKey)) {
      range = range.collapseToStart();
    } else {
      range = range.collapseTo(range.endKey, 0);
    }
  }

  // If the fragment is empty, there's nothing to do after deleting.
  if (!fragment.nodes.size) return;

  // Regenerate the keys for all of the fragments nodes, so that they're
  // guaranteed not to collide with the existing keys in the document. Otherwise
  // they will be rengerated automatically and we won't have an easy way to
  // reference them.
  fragment = fragment.mapDescendants(function (child) {
    return child.regenerateKey();
  });

  // Calculate a few things...
  var _range4 = range,
      startKey = _range4.startKey,
      startOffset = _range4.startOffset;
  var value = change.value;
  var document = value.document;

  var startText = document.getDescendant(startKey);
  var startBlock = document.getClosestBlock(startText.key);
  var startChild = startBlock.getFurthestAncestor(startText.key);
  var isAtStart = range.isAtStartOf(startBlock);
  var parent = document.getParent(startBlock.key);
  var index$$1 = parent.nodes.indexOf(startBlock);
  var blocks = fragment.getBlocks();
  var firstChild = fragment.nodes.first();
  var lastChild = fragment.nodes.last();
  var firstBlock = blocks.first();
  var lastBlock = blocks.last();

  // If the fragment only contains a void block, use `insertBlock` instead.
  if (firstBlock == lastBlock && firstBlock.isVoid) {
    change.insertBlockAtRange(range, firstBlock, options);
    return;
  }

  // If the fragment starts or ends with single nested block, (e.g., table),
  // do not merge this fragment with existing blocks.
  if (fragment.hasBlocks(firstChild.key) || fragment.hasBlocks(lastChild.key)) {
    fragment.nodes.reverse().forEach(function (node) {
      change.insertBlockAtRange(range, node, options);
    });
    return;
  }

  // If the first and last block aren't the same, we need to insert all of the
  // nodes after the fragment's first block at the index.
  if (firstBlock != lastBlock) {
    var lonelyParent = fragment.getFurthest(firstBlock.key, function (p) {
      return p.nodes.size == 1;
    });
    var lonelyChild = lonelyParent || firstBlock;
    var startIndex = parent.nodes.indexOf(startBlock);
    fragment = fragment.removeDescendant(lonelyChild.key);

    fragment.nodes.forEach(function (node, i) {
      var newIndex = startIndex + i + 1;
      change.insertNodeByKey(parent.key, newIndex, node, { normalize: false });
    });
  }

  // Check if we need to split the node.
  if (startOffset != 0) {
    change.splitDescendantsByKey(startChild.key, startKey, startOffset, {
      normalize: false
    });
  }

  // Update our variables with the new value.
  document = change.value.document;
  startText = document.getDescendant(startKey);
  startBlock = document.getClosestBlock(startKey);
  startChild = startBlock.getFurthestAncestor(startText.key);

  // If the first and last block aren't the same, we need to move any of the
  // starting block's children after the split into the last block of the
  // fragment, which has already been inserted.
  if (firstBlock != lastBlock) {
    var nextChild = isAtStart ? startChild : startBlock.getNextSibling(startChild.key);
    var nextNodes = nextChild ? startBlock.nodes.skipUntil(function (n) {
      return n.key == nextChild.key;
    }) : immutable.List();
    var lastIndex = lastBlock.nodes.size;

    nextNodes.forEach(function (node, i) {
      var newIndex = lastIndex + i;

      change.moveNodeByKey(node.key, lastBlock.key, newIndex, {
        normalize: false
      });
    });
  }

  // If the starting block is empty, we replace it entirely with the first block
  // of the fragment, since this leads to a more expected behavior for the user.
  if (startBlock.isEmpty) {
    change.removeNodeByKey(startBlock.key, { normalize: false });
    change.insertNodeByKey(parent.key, index$$1, firstBlock, { normalize: false });
  } else {
    // Otherwise, we maintain the starting block, and insert all of the first
    // block's inline nodes into it at the split point.
    var inlineChild = startBlock.getFurthestAncestor(startText.key);
    var inlineIndex = startBlock.nodes.indexOf(inlineChild);

    firstBlock.nodes.forEach(function (inline, i) {
      var o = startOffset == 0 ? 0 : 1;
      var newIndex = inlineIndex + i + o;

      change.insertNodeByKey(startBlock.key, newIndex, inline, {
        normalize: false
      });
    });
  }

  // Normalize if requested.
  if (normalize) {
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Insert an `inline` node at `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Inline|String|Object} inline
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.insertInlineAtRange = function (change, range, inline) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var normalize = change.getFlag('normalize', options);
  inline = Inline.create(inline);

  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize: false });
    range = range.collapseToStart();
  }

  var value = change.value;
  var document = value.document;
  var _range5 = range,
      startKey = _range5.startKey,
      startOffset = _range5.startOffset;

  var parent = document.getParent(startKey);
  var startText = document.assertDescendant(startKey);
  var index$$1 = parent.nodes.indexOf(startText);

  if (parent.isVoid) return;

  change.splitNodeByKey(startKey, startOffset, { normalize: false });
  change.insertNodeByKey(parent.key, index$$1 + 1, inline, { normalize: false });

  if (normalize) {
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Insert `text` at a `range`, with optional `marks`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.insertTextAtRange = function (change, range, text, marks) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var normalize = options.normalize;
  var value = change.value;
  var document = value.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var key = startKey;
  var offset = startOffset;
  var parent = document.getParent(startKey);

  if (parent.isVoid) return;

  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize: false });

    // Update range start after delete
    if (change.value.startKey !== key) {
      key = change.value.startKey;
      offset = change.value.startOffset;
    }
  }

  // PERF: Unless specified, don't normalize if only inserting text.
  if (normalize === undefined) {
    normalize = range.isExpanded && marks && marks.size !== 0;
  }

  change.insertTextByKey(key, offset, text, marks, { normalize: false });

  if (normalize) {
    // normalize in the narrowest existing block that originally contains startKey and endKey
    var commonAncestor = document.getCommonAncestor(startKey, range.endKey);
    var ancestors = document.getAncestors(commonAncestor.key).push(commonAncestor);
    var normalizeAncestor = ancestors.findLast(function (n) {
      return change.value.document.getDescendant(n.key);
    });
    // it is possible that normalizeAncestor doesn't return any node
    // on that case fallback to startKey to be normalized
    var normalizeKey = normalizeAncestor ? normalizeAncestor.key : startKey;
    change.normalizeNodeByKey(normalizeKey);
  }
};

/**
 * Remove an existing `mark` to the characters at `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Mark|String} mark (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.removeMarkAtRange = function (change, range, mark) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (range.isCollapsed) return;

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var texts = document.getTextsAtRange(range);
  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset;


  texts.forEach(function (node) {
    var key = node.key;

    var index$$1 = 0;
    var length = node.text.length;

    if (key == startKey) index$$1 = startOffset;
    if (key == endKey) length = endOffset;
    if (key == startKey && key == endKey) length = endOffset - startOffset;

    change.removeMarkByKey(key, index$$1, length, mark, { normalize: normalize });
  });
};

/**
 * Set the `properties` of block nodes in a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.setBlocksAtRange = function (change, range, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var blocks = document.getBlocksAtRange(range);

  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset,
      isCollapsed = range.isCollapsed;

  var isStartVoid = document.hasVoidParent(startKey);
  var startBlock = document.getClosestBlock(startKey);
  var endBlock = document.getClosestBlock(endKey);

  // Check if we have a "hanging" selection case where the even though the
  // selection extends into the start of the end node, we actually want to
  // ignore that for UX reasons.
  var isHanging = isCollapsed == false && startOffset == 0 && endOffset == 0 && isStartVoid == false && startKey == startBlock.getFirstText().key && endKey == endBlock.getFirstText().key;

  // If it's a hanging selection, ignore the last block.
  var sets = isHanging ? blocks.slice(0, -1) : blocks;

  sets.forEach(function (block) {
    change.setNodeByKey(block.key, properties, { normalize: normalize });
  });
};

Changes$1.setBlockAtRange = function () {
  index.deprecate('slate@0.33.0', 'The `setBlockAtRange` method of Slate changes has been renamed to `setBlocksAtRange`.');

  Changes$1.setBlocksAtRange.apply(Changes$1, arguments);
};

/**
 * Set the `properties` of inline nodes in a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.setInlinesAtRange = function (change, range, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var inlines = document.getInlinesAtRange(range);

  inlines.forEach(function (inline) {
    change.setNodeByKey(inline.key, properties, { normalize: normalize });
  });
};

Changes$1.setInlineAtRange = function () {
  index.deprecate('slate@0.33.0', 'The `setInlineAtRange` method of Slate changes has been renamed to `setInlinesAtRange`.');

  Changes$1.setInlinesAtRange.apply(Changes$1, arguments);
};

/**
 * Split the block nodes at a `range`, to optional `height`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Number} height (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.splitBlockAtRange = function (change, range) {
  var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var normalize = change.getFlag('normalize', options);

  var _range6 = range,
      startKey = _range6.startKey,
      startOffset = _range6.startOffset,
      endOffset = _range6.endOffset,
      endKey = _range6.endKey;
  var value = change.value;
  var document = value.document;

  var node = document.assertDescendant(startKey);
  var parent = document.getClosestBlock(node.key);
  var h = 0;

  while (parent && parent.object == 'block' && h < height) {
    node = parent;
    parent = document.getClosestBlock(parent.key);
    h++;
  }

  change.splitDescendantsByKey(node.key, startKey, startOffset, {
    normalize: normalize && range.isCollapsed
  });

  if (range.isExpanded) {
    if (range.isBackward) range = range.flip();
    var nextBlock = change.value.document.getNextBlock(node.key);
    range = range.moveAnchorToStartOf(nextBlock);

    if (startKey === endKey) {
      range = range.moveFocusTo(range.anchorKey, endOffset - startOffset);
    }

    change.deleteAtRange(range, { normalize: normalize });
  }
};

/**
 * Split the inline nodes at a `range`, to optional `height`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Number} height (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.splitInlineAtRange = function (change, range) {
  var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var normalize = change.getFlag('normalize', options);

  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize: normalize });
    range = range.collapseToStart();
  }

  var _range7 = range,
      startKey = _range7.startKey,
      startOffset = _range7.startOffset;
  var value = change.value;
  var document = value.document;

  var node = document.assertDescendant(startKey);
  var parent = document.getClosestInline(node.key);
  var h = 0;

  while (parent && parent.object == 'inline' && h < height) {
    node = parent;
    parent = document.getClosestInline(parent.key);
    h++;
  }

  change.splitDescendantsByKey(node.key, startKey, startOffset, { normalize: normalize });
};

/**
 * Add or remove a `mark` from the characters at `range`, depending on whether
 * it's already there.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Mixed} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.toggleMarkAtRange = function (change, range, mark) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (range.isCollapsed) return;

  mark = Mark.create(mark);

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var marks = document.getActiveMarksAtRange(range);
  var exists = marks.some(function (m) {
    return m.equals(mark);
  });

  if (exists) {
    change.removeMarkAtRange(range, mark, { normalize: normalize });
  } else {
    change.addMarkAtRange(range, mark, { normalize: normalize });
  }
};

/**
 * Unwrap all of the block nodes in a `range` from a block with `properties`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {String|Object} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.unwrapBlockAtRange = function (change, range, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  properties = Node.createProperties(properties);

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var blocks = document.getBlocksAtRange(range);
  var wrappers = blocks.map(function (block) {
    return document.getClosest(block.key, function (parent) {
      if (parent.object != 'block') return false;
      if (properties.type != null && parent.type != properties.type) return false;
      if (properties.isVoid != null && parent.isVoid != properties.isVoid) return false;
      if (properties.data != null && !parent.data.isSuperset(properties.data)) return false;
      return true;
    });
  }).filter(function (exists) {
    return exists;
  }).toOrderedSet().toList();

  wrappers.forEach(function (block) {
    var first = block.nodes.first();
    var last = block.nodes.last();
    var parent = document.getParent(block.key);
    var index$$1 = parent.nodes.indexOf(block);

    var children = block.nodes.filter(function (child) {
      return blocks.some(function (b) {
        return child == b || child.hasDescendant(b.key);
      });
    });

    var firstMatch = children.first();
    var lastMatch = children.last();

    if (first == firstMatch && last == lastMatch) {
      block.nodes.forEach(function (child, i) {
        change.moveNodeByKey(child.key, parent.key, index$$1 + i, {
          normalize: false
        });
      });

      change.removeNodeByKey(block.key, { normalize: false });
    } else if (last == lastMatch) {
      block.nodes.skipUntil(function (n) {
        return n == firstMatch;
      }).forEach(function (child, i) {
        change.moveNodeByKey(child.key, parent.key, index$$1 + 1 + i, {
          normalize: false
        });
      });
    } else if (first == firstMatch) {
      block.nodes.takeUntil(function (n) {
        return n == lastMatch;
      }).push(lastMatch).forEach(function (child, i) {
        change.moveNodeByKey(child.key, parent.key, index$$1 + i, {
          normalize: false
        });
      });
    } else {
      var firstText = firstMatch.getFirstText();

      change.splitDescendantsByKey(block.key, firstText.key, 0, {
        normalize: false
      });

      document = change.value.document;

      children.forEach(function (child, i) {
        if (i == 0) {
          var extra = child;
          child = document.getNextBlock(child.key);
          change.removeNodeByKey(extra.key, { normalize: false });
        }

        change.moveNodeByKey(child.key, parent.key, index$$1 + 1 + i, {
          normalize: false
        });
      });
    }
  });

  // TODO: optmize to only normalize the right block
  if (normalize) {
    change.normalizeDocument();
  }
};

/**
 * Unwrap the inline nodes in a `range` from an inline with `properties`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {String|Object} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.unwrapInlineAtRange = function (change, range, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  properties = Node.createProperties(properties);

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var texts = document.getTextsAtRange(range);
  var inlines = texts.map(function (text) {
    return document.getClosest(text.key, function (parent) {
      if (parent.object != 'inline') return false;
      if (properties.type != null && parent.type != properties.type) return false;
      if (properties.isVoid != null && parent.isVoid != properties.isVoid) return false;
      if (properties.data != null && !parent.data.isSuperset(properties.data)) return false;
      return true;
    });
  }).filter(function (exists) {
    return exists;
  }).toOrderedSet().toList();

  inlines.forEach(function (inline) {
    var parent = change.value.document.getParent(inline.key);
    var index$$1 = parent.nodes.indexOf(inline);

    inline.nodes.forEach(function (child, i) {
      change.moveNodeByKey(child.key, parent.key, index$$1 + i, {
        normalize: false
      });
    });
  });

  // TODO: optmize to only normalize the right block
  if (normalize) {
    change.normalizeDocument();
  }
};

/**
 * Wrap all of the blocks in a `range` in a new `block`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Block|Object|String} block
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.wrapBlockAtRange = function (change, range, block) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  block = Block.create(block);
  block = block.set('nodes', block.nodes.clear());

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;


  var blocks = document.getBlocksAtRange(range);
  var firstblock = blocks.first();
  var lastblock = blocks.last();
  var parent = void 0,
      siblings = void 0,
      index$$1 = void 0;

  // If there is only one block in the selection then we know the parent and
  // siblings.
  if (blocks.size === 1) {
    parent = document.getParent(firstblock.key);
    siblings = blocks;
  } else {
    // Determine closest shared parent to all blocks in selection.
    parent = document.getClosest(firstblock.key, function (p1) {
      return !!document.getClosest(lastblock.key, function (p2) {
        return p1 == p2;
      });
    });
  }

  // If no shared parent could be found then the parent is the document.
  if (parent == null) parent = document;

  // Create a list of direct children siblings of parent that fall in the
  // selection.
  if (siblings == null) {
    var indexes = parent.nodes.reduce(function (ind, node, i) {
      if (node == firstblock || node.hasDescendant(firstblock.key)) ind[0] = i;
      if (node == lastblock || node.hasDescendant(lastblock.key)) ind[1] = i;
      return ind;
    }, []);

    index$$1 = indexes[0];
    siblings = parent.nodes.slice(indexes[0], indexes[1] + 1);
  }

  // Get the index to place the new wrapped node at.
  if (index$$1 == null) {
    index$$1 = parent.nodes.indexOf(siblings.first());
  }

  // Inject the new block node into the parent.
  change.insertNodeByKey(parent.key, index$$1, block, { normalize: false });

  // Move the sibling nodes into the new block node.
  siblings.forEach(function (node, i) {
    change.moveNodeByKey(node.key, block.key, i, { normalize: false });
  });

  if (normalize) {
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Wrap the text and inlines in a `range` in a new `inline`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Inline|Object|String} inline
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.wrapInlineAtRange = function (change, range, inline) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var value = change.value;
  var document = value.document;

  var normalize = change.getFlag('normalize', options);
  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset;


  if (range.isCollapsed) {
    // Wrapping an inline void
    var inlineParent = document.getClosestInline(startKey);

    if (!inlineParent.isVoid) {
      return;
    }

    return change.wrapInlineByKey(inlineParent.key, inline, options);
  }

  inline = Inline.create(inline);
  inline = inline.set('nodes', inline.nodes.clear());

  var blocks = document.getBlocksAtRange(range);
  var startBlock = document.getClosestBlock(startKey);
  var endBlock = document.getClosestBlock(endKey);
  var startInline = document.getClosestInline(startKey);
  var endInline = document.getClosestInline(endKey);
  var startChild = startBlock.getFurthestAncestor(startKey);
  var endChild = endBlock.getFurthestAncestor(endKey);

  if (!startInline || startInline != endInline) {
    change.splitDescendantsByKey(endChild.key, endKey, endOffset, {
      normalize: false
    });

    change.splitDescendantsByKey(startChild.key, startKey, startOffset, {
      normalize: false
    });
  }

  document = change.value.document;
  startBlock = document.getDescendant(startBlock.key);
  endBlock = document.getDescendant(endBlock.key);
  startChild = startBlock.getFurthestAncestor(startKey);
  endChild = endBlock.getFurthestAncestor(endKey);
  var startIndex = startBlock.nodes.indexOf(startChild);
  var endIndex = endBlock.nodes.indexOf(endChild);

  if (startInline && startInline == endInline) {
    var text = startBlock.getTextsAtRange(range).get(0).splitText(startOffset)[1].splitText(endOffset - startOffset)[0];
    inline = inline.set('nodes', immutable.List([text]));
    Changes$1.insertInlineAtRange(change, range, inline, { normalize: false });
    var inlinekey = inline.getFirstText().key;
    var rng = {
      anchorKey: inlinekey,
      focusKey: inlinekey,
      anchorOffset: 0,
      focusOffset: endOffset - startOffset,
      isFocused: true
    };
    change.select(rng);
  } else if (startBlock == endBlock) {
    document = change.value.document;
    startBlock = document.getClosestBlock(startKey);
    startChild = startBlock.getFurthestAncestor(startKey);

    var startInner = document.getNextSibling(startChild.key);
    var startInnerIndex = startBlock.nodes.indexOf(startInner);
    var endInner = startKey == endKey ? startInner : startBlock.getFurthestAncestor(endKey);
    var inlines = startBlock.nodes.skipUntil(function (n) {
      return n == startInner;
    }).takeUntil(function (n) {
      return n == endInner;
    }).push(endInner);

    var node = inline.regenerateKey();

    change.insertNodeByKey(startBlock.key, startInnerIndex, node, {
      normalize: false
    });

    inlines.forEach(function (child, i) {
      change.moveNodeByKey(child.key, node.key, i, { normalize: false });
    });

    if (normalize) {
      change.normalizeNodeByKey(startBlock.key);
    }
  } else {
    var startInlines = startBlock.nodes.slice(startIndex + 1);
    var endInlines = endBlock.nodes.slice(0, endIndex + 1);
    var startNode = inline.regenerateKey();
    var endNode = inline.regenerateKey();

    change.insertNodeByKey(startBlock.key, startIndex + 1, startNode, {
      normalize: false
    });

    change.insertNodeByKey(endBlock.key, endIndex, endNode, {
      normalize: false
    });

    startInlines.forEach(function (child, i) {
      change.moveNodeByKey(child.key, startNode.key, i, { normalize: false });
    });

    endInlines.forEach(function (child, i) {
      change.moveNodeByKey(child.key, endNode.key, i, { normalize: false });
    });

    if (normalize) {
      change.normalizeNodeByKey(startBlock.key).normalizeNodeByKey(endBlock.key);
    }

    blocks.slice(1, -1).forEach(function (block) {
      var node = inline.regenerateKey();
      change.insertNodeByKey(block.key, 0, node, { normalize: false });

      block.nodes.forEach(function (child, i) {
        change.moveNodeByKey(child.key, node.key, i, { normalize: false });
      });

      if (normalize) {
        change.normalizeNodeByKey(block.key);
      }
    });
  }
};

/**
 * Wrap the text in a `range` in a prefix/suffix.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {String} prefix
 * @param {String} suffix (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.wrapTextAtRange = function (change, range, prefix) {
  var suffix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : prefix;
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var normalize = change.getFlag('normalize', options);
  var startKey = range.startKey,
      endKey = range.endKey;

  var start = range.collapseToStart();
  var end = range.collapseToEnd();

  if (startKey == endKey) {
    end = end.move(prefix.length);
  }

  change.insertTextAtRange(start, prefix, [], { normalize: normalize });
  change.insertTextAtRange(end, suffix, [], { normalize: normalize });
};

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes$2 = {};

/**
 * Add mark to text at `offset` and `length` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mixed} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.addMarkByKey = function (change, key, offset, length, mark) {
  var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  mark = Mark.create(mark);
  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var path = document.getPath(key);
  var node = document.getNode(key);
  var leaves = node.getLeaves();

  var operations = [];
  var bx = offset;
  var by = offset + length;
  var o = 0;

  leaves.forEach(function (leaf) {
    var ax = o;
    var ay = ax + leaf.text.length;

    o += leaf.text.length;

    // If the leaf doesn't overlap with the operation, continue on.
    if (ay < bx || by < ax) return;

    // If the leaf already has the mark, continue on.
    if (leaf.marks.has(mark)) return;

    // Otherwise, determine which offset and characters overlap.
    var start = Math.max(ax, bx);
    var end = Math.min(ay, by);

    operations.push({
      type: 'add_mark',
      value: value,
      path: path,
      offset: start,
      length: end - start,
      mark: mark
    });
  });

  change.applyOperations(operations);

  if (normalize) {
    var parent = document.getParent(key);
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Insert a `fragment` at `index` in a node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} index
 * @param {Fragment} fragment
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.insertFragmentByKey = function (change, key, index, fragment) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var normalize = change.getFlag('normalize', options);

  fragment.nodes.forEach(function (node, i) {
    change.insertNodeByKey(key, index + i, node);
  });

  if (normalize) {
    change.normalizeNodeByKey(key);
  }
};

/**
 * Insert a `node` at `index` in a node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} index
 * @param {Node} node
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.insertNodeByKey = function (change, key, index, node) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var path = document.getPath(key);

  change.applyOperation({
    type: 'insert_node',
    value: value,
    path: [].concat(toConsumableArray(path), [index]),
    node: node
  });

  if (normalize) {
    change.normalizeNodeByKey(key);
  }
};

/**
 * Insert `text` at `offset` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.insertTextByKey = function (change, key, offset, text, marks) {
  var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  var normalize = change.getFlag('normalize', options);

  var value = change.value;
  var document = value.document;

  var path = document.getPath(key);
  var node = document.getNode(key);
  marks = marks || node.getMarksAtIndex(offset);

  change.applyOperation({
    type: 'insert_text',
    value: value,
    path: path,
    offset: offset,
    text: text,
    marks: marks
  });

  if (normalize) {
    var parent = document.getParent(key);
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Merge a node by `key` with the previous node.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.mergeNodeByKey = function (change, key) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var path = document.getPath(key);
  var original = document.getDescendant(key);
  var previous = document.getPreviousSibling(key);

  if (!previous) {
    throw new Error('Unable to merge node with key "' + key + '", no previous key.');
  }

  var position = previous.object == 'text' ? previous.text.length : previous.nodes.size;

  change.applyOperation({
    type: 'merge_node',
    value: value,
    path: path,
    position: position,
    // for undos to succeed we only need the type and data because
    // these are the only properties that get changed in the merge operation
    properties: {
      type: original.type,
      data: original.data
    },
    target: null
  });

  if (normalize) {
    var parent = document.getParent(key);
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Move a node by `key` to a new parent by `newKey` and `index`.
 * `newKey` is the key of the container (it can be the document itself)
 *
 * @param {Change} change
 * @param {String} key
 * @param {String} newKey
 * @param {Number} index
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.moveNodeByKey = function (change, key, newKey, newIndex) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var path = document.getPath(key);
  var newPath = document.getPath(newKey);

  change.applyOperation({
    type: 'move_node',
    value: value,
    path: path,
    newPath: [].concat(toConsumableArray(newPath), [newIndex])
  });

  if (normalize) {
    var parent = document.getCommonAncestor(key, newKey);
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Remove mark from text at `offset` and `length` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.removeMarkByKey = function (change, key, offset, length, mark) {
  var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  mark = Mark.create(mark);
  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var path = document.getPath(key);
  var node = document.getNode(key);
  var leaves = node.getLeaves();

  var operations = [];
  var bx = offset;
  var by = offset + length;
  var o = 0;

  leaves.forEach(function (leaf) {
    var ax = o;
    var ay = ax + leaf.text.length;

    o += leaf.text.length;

    // If the leaf doesn't overlap with the operation, continue on.
    if (ay < bx || by < ax) return;

    // If the leaf already has the mark, continue on.
    if (!leaf.marks.has(mark)) return;

    // Otherwise, determine which offset and characters overlap.
    var start = Math.max(ax, bx);
    var end = Math.min(ay, by);

    operations.push({
      type: 'remove_mark',
      value: value,
      path: path,
      offset: start,
      length: end - start,
      mark: mark
    });
  });

  change.applyOperations(operations);

  if (normalize) {
    var parent = document.getParent(key);
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Remove all `marks` from node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.removeAllMarksByKey = function (change, key) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var state = change.state;
  var document = state.document;

  var node = document.getNode(key);
  var texts = node.object === 'text' ? [node] : node.getTextsAsArray();

  texts.forEach(function (text) {
    text.getMarksAsArray().forEach(function (mark) {
      change.removeMarkByKey(text.key, 0, text.text.length, mark, options);
    });
  });
};

/**
 * Remove a node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.removeNodeByKey = function (change, key) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var path = document.getPath(key);
  var node = document.getNode(key);

  change.applyOperation({
    type: 'remove_node',
    value: value,
    path: path,
    node: node
  });

  if (normalize) {
    var parent = document.getParent(key);
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Insert `text` at `offset` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.setTextByKey = function (change, key, text, marks) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var textNode = change.value.document.getDescendant(key);
  change.replaceTextByKey(key, 0, textNode.text.length, text, marks, options);
};

/**
 * Replace A Length of Text with another string or text
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {string} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 *
 */

Changes$2.replaceTextByKey = function (change, key, offset, length, text, marks, options) {
  var document = change.value.document;

  var textNode = document.getDescendant(key);

  if (length + offset > textNode.text.length) {
    length = textNode.text.length - offset;
  }

  var range = Range.create({
    anchorKey: key,
    focusKey: key,
    anchorOffset: offset,
    focusOffset: offset + length
  });
  var activeMarks = document.getActiveMarksAtRange(range);

  change.removeTextByKey(key, offset, length, { normalize: false });

  if (!marks) {
    // Do not use mark at index when marks and activeMarks are both empty
    marks = activeMarks ? activeMarks : [];
  } else if (activeMarks) {
    // Do not use `has` because we may want to reset marks like font-size with an updated data;
    activeMarks = activeMarks.filter(function (activeMark) {
      return !marks.find(function (m) {
        return activeMark.type === m.type;
      });
    });

    marks = activeMarks.merge(marks);
  }

  change.insertTextByKey(key, offset, text, marks, options);
};

/**
 * Remove text at `offset` and `length` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.removeTextByKey = function (change, key, offset, length) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var path = document.getPath(key);
  var node = document.getNode(key);
  var leaves = node.getLeaves();
  var text = node.text;


  var removals = [];
  var bx = offset;
  var by = offset + length;
  var o = 0;

  leaves.forEach(function (leaf) {
    var ax = o;
    var ay = ax + leaf.text.length;

    o += leaf.text.length;

    // If the leaf doesn't overlap with the removal, continue on.
    if (ay < bx || by < ax) return;

    // Otherwise, determine which offset and characters overlap.
    var start = Math.max(ax, bx);
    var end = Math.min(ay, by);
    var string = text.slice(start, end);

    removals.push({
      type: 'remove_text',
      value: value,
      path: path,
      offset: start,
      text: string,
      marks: leaf.marks
    });
  });

  // Apply in reverse order, so subsequent removals don't impact previous ones.
  change.applyOperations(removals.reverse());

  if (normalize) {
    var block = document.getClosestBlock(key);
    change.normalizeNodeByKey(block.key);
  }
};

/**
`* Replace a `node` with another `node`
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object|Node} node
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.replaceNodeByKey = function (change, key, newNode) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  newNode = Node.create(newNode);
  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var node = document.getNode(key);
  var parent = document.getParent(key);
  var index = parent.nodes.indexOf(node);
  change.removeNodeByKey(key, { normalize: false });
  change.insertNodeByKey(parent.key, index, newNode, { normalize: false });

  if (normalize) {
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Set `properties` on mark on text at `offset` and `length` in node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.setMarkByKey = function (change, key, offset, length, mark, properties) {
  var options = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

  mark = Mark.create(mark);
  properties = Mark.createProperties(properties);
  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var path = document.getPath(key);

  change.applyOperation({
    type: 'set_mark',
    value: value,
    path: path,
    offset: offset,
    length: length,
    mark: mark,
    properties: properties
  });

  if (normalize) {
    var parent = document.getParent(key);
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Set `properties` on a node by `key`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.setNodeByKey = function (change, key, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  properties = Node.createProperties(properties);
  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var path = document.getPath(key);
  var node = document.getNode(key);

  change.applyOperation({
    type: 'set_node',
    value: value,
    path: path,
    node: node,
    properties: properties
  });

  if (normalize) {
    change.normalizeNodeByKey(node.key);
  }
};

/**
 * Split a node by `key` at `position`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} position
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.splitNodeByKey = function (change, key, position) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$normalize = options.normalize,
      normalize = _options$normalize === undefined ? true : _options$normalize,
      _options$target = options.target,
      target = _options$target === undefined ? null : _options$target;
  var value = change.value;
  var document = value.document;

  var path = document.getPath(key);
  var node = document.getDescendantAtPath(path);

  change.applyOperation({
    type: 'split_node',
    value: value,
    path: path,
    position: position,
    properties: {
      type: node.type,
      data: node.data
    },
    target: target
  });

  if (normalize) {
    var parent = document.getParent(key);
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Split a node deeply down the tree by `key`, `textKey` and `textOffset`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Number} position
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.splitDescendantsByKey = function (change, key, textKey, textOffset) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  if (key == textKey) {
    change.splitNodeByKey(textKey, textOffset, options);
    return;
  }

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;


  var text = document.getNode(textKey);
  var ancestors = document.getAncestors(textKey);
  var nodes = ancestors.skipUntil(function (a) {
    return a.key == key;
  }).reverse().unshift(text);
  var previous = void 0;
  var index = void 0;

  nodes.forEach(function (node) {
    var prevIndex = index == null ? null : index;
    index = previous ? node.nodes.indexOf(previous) + 1 : textOffset;
    previous = node;

    change.splitNodeByKey(node.key, index, {
      normalize: false,
      target: prevIndex
    });
  });

  if (normalize) {
    var parent = document.getParent(key);
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Unwrap content from an inline parent with `properties`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.unwrapInlineByKey = function (change, key, properties, options) {
  var value = change.value;
  var document = value.document,
      selection = value.selection;

  var node = document.assertDescendant(key);
  var first = node.getFirstText();
  var last = node.getLastText();
  var range = selection.moveToRangeOf(first, last);
  change.unwrapInlineAtRange(range, properties, options);
};

/**
 * Unwrap content from a block parent with `properties`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.unwrapBlockByKey = function (change, key, properties, options) {
  var value = change.value;
  var document = value.document,
      selection = value.selection;

  var node = document.assertDescendant(key);
  var first = node.getFirstText();
  var last = node.getLastText();
  var range = selection.moveToRangeOf(first, last);
  change.unwrapBlockAtRange(range, properties, options);
};

/**
 * Unwrap a single node from its parent.
 *
 * If the node is surrounded with siblings, its parent will be
 * split. If the node is the only child, the parent is removed, and
 * simply replaced by the node itself.  Cannot unwrap a root node.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.unwrapNodeByKey = function (change, key) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var parent = document.getParent(key);
  var node = parent.getChild(key);

  var index = parent.nodes.indexOf(node);
  var isFirst = index === 0;
  var isLast = index === parent.nodes.size - 1;

  var parentParent = document.getParent(parent.key);
  var parentIndex = parentParent.nodes.indexOf(parent);

  if (parent.nodes.size === 1) {
    change.moveNodeByKey(key, parentParent.key, parentIndex, {
      normalize: false
    });

    change.removeNodeByKey(parent.key, options);
  } else if (isFirst) {
    // Just move the node before its parent.
    change.moveNodeByKey(key, parentParent.key, parentIndex, options);
  } else if (isLast) {
    // Just move the node after its parent.
    change.moveNodeByKey(key, parentParent.key, parentIndex + 1, options);
  } else {
    // Split the parent.
    change.splitNodeByKey(parent.key, index, { normalize: false });

    // Extract the node in between the splitted parent.
    change.moveNodeByKey(key, parentParent.key, parentIndex + 1, {
      normalize: false
    });

    if (normalize) {
      change.normalizeNodeByKey(parentParent.key);
    }
  }
};

/**
 * Wrap a node in a block with `properties`.
 *
 * @param {Change} change
 * @param {String} key The node to wrap
 * @param {Block|Object|String} block The wrapping block (its children are discarded)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.wrapBlockByKey = function (change, key, block, options) {
  block = Block.create(block);
  block = block.set('nodes', block.nodes.clear());

  var document = change.value.document;

  var node = document.assertDescendant(key);
  var parent = document.getParent(node.key);
  var index = parent.nodes.indexOf(node);

  change.insertNodeByKey(parent.key, index, block, { normalize: false });
  change.moveNodeByKey(node.key, block.key, 0, options);
};

/**
 * Wrap a node in an inline with `properties`.
 *
 * @param {Change} change
 * @param {String} key The node to wrap
 * @param {Block|Object|String} inline The wrapping inline (its children are discarded)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$2.wrapInlineByKey = function (change, key, inline, options) {
  inline = Inline.create(inline);
  inline = inline.set('nodes', inline.nodes.clear());

  var document = change.value.document;

  var node = document.assertDescendant(key);
  var parent = document.getParent(node.key);
  var index = parent.nodes.indexOf(node);

  change.insertNodeByKey(parent.key, index, inline, { normalize: false });
  change.moveNodeByKey(node.key, inline.key, 0, options);
};

/**
 * Wrap a node by `key` with `parent`.
 *
 * @param {Change} change
 * @param {String} key
 * @param {Node|Object} parent
 * @param {Object} options
 */

Changes$2.wrapNodeByKey = function (change, key, parent) {
  parent = Node.create(parent);
  parent = parent.set('nodes', parent.nodes.clear());

  if (parent.object == 'block') {
    change.wrapBlockByKey(key, parent);
    return;
  }

  if (parent.object == 'inline') {
    change.wrapInlineByKey(key, parent);
    return;
  }
};

/**
 * Slate operation attributes.
 *
 * @type {Array}
 */

var OPERATION_ATTRIBUTES = {
  add_mark: ['value', 'path', 'offset', 'length', 'mark'],
  insert_node: ['value', 'path', 'node'],
  insert_text: ['value', 'path', 'offset', 'text', 'marks'],
  merge_node: ['value', 'path', 'position', 'properties', 'target'],
  move_node: ['value', 'path', 'newPath'],
  remove_mark: ['value', 'path', 'offset', 'length', 'mark'],
  remove_node: ['value', 'path', 'node'],
  remove_text: ['value', 'path', 'offset', 'text', 'marks'],
  set_mark: ['value', 'path', 'offset', 'length', 'mark', 'properties'],
  set_node: ['value', 'path', 'node', 'properties'],
  set_selection: ['value', 'selection', 'properties'],
  set_value: ['value', 'properties'],
  split_node: ['value', 'path', 'position', 'properties', 'target']

  /**
   * Export.
   *
   * @type {Object}
   */

};

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache;
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache) {
    var pairs = data.__data__;
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;

var _Stack = Stack;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

var _setCacheAdd = setCacheAdd;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new _MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;

var _SetCache = SetCache;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var _arraySome = arraySome;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;
var COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!_arraySome(other, function(othValue, othIndex) {
            if (!_cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays;

/** Built-in value references. */
var Uint8Array = _root.Uint8Array;

var _Uint8Array = Uint8Array;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1;
var COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var symbolTag$1 = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined;
var symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq_1(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = _mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = _setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag$1:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$7.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

var _getSymbols = getSymbols;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]';
var arrayTag = '[object Array]';
var boolTag$1 = '[object Boolean]';
var dateTag$1 = '[object Date]';
var errorTag$1 = '[object Error]';
var funcTag$1 = '[object Function]';
var mapTag$1 = '[object Map]';
var numberTag$1 = '[object Number]';
var objectTag = '[object Object]';
var regexpTag$1 = '[object RegExp]';
var setTag$1 = '[object Set]';
var stringTag$1 = '[object String]';
var weakMapTag = '[object WeakMap]';

var arrayBufferTag$1 = '[object ArrayBuffer]';
var dataViewTag$1 = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag$1] =
typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag$1] =
typedArrayTags[setTag$1] = typedArrayTags[stringTag$1] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$6.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$9;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$10 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$10.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$7.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$11 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$11.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = _getAllKeys(object),
      objLength = objProps.length,
      othProps = _getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$8.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Promise$1 = _getNative(_root, 'Promise');

var _Promise = Promise$1;

/* Built-in method references that are verified to be native. */
var Set = _getNative(_root, 'Set');

var _Set = Set;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]';
var objectTag$1 = '[object Object]';
var promiseTag = '[object Promise]';
var setTag$2 = '[object Set]';
var weakMapTag$1 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView);
var mapCtorString = _toSource(_Map);
var promiseCtorString = _toSource(_Promise);
var setCtorString = _toSource(_Set);
var weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (_Map && getTag(new _Map) != mapTag$2) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$2) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$2;
        case mapCtorString: return mapTag$2;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$2;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]';
var arrayTag$1 = '[object Array]';
var objectTag$2 = '[object Object]';

/** Used for built-in method references. */
var objectProto$12 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$12.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$1 : _getTag(object),
      othTag = othIsArr ? arrayTag$1 : _getTag(other);

  objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
  othTag = othTag == argsTag$2 ? objectTag$2 : othTag;

  var objIsObj = objTag == objectTag$2,
      othIsObj = othTag == objectTag$2,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer_1(object)) {
    if (!isBuffer_1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack);
    return (objIsArr || isTypedArray_1(object))
      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$9.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$9.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new _Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack);
  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep;

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
    return value !== value && other !== other;
  }
  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

var _baseIsEqual = baseIsEqual;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return _baseIsEqual(value, other);
}

var isEqual_1 = isEqual;

/**
 * Debug.
 *
 * @type {Function}
 */

var debug$2 = browser$2('slate:history');

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$8 = {
  redos: new immutable.Stack(),
  undos: new immutable.Stack()

  /**
   * History.
   *
   * @type {History}
   */

};
var History = function (_Record) {
  inherits(History, _Record);

  function History() {
    classCallCheck(this, History);
    return possibleConstructorReturn(this, (History.__proto__ || Object.getPrototypeOf(History)).apply(this, arguments));
  }

  createClass(History, [{
    key: 'save',


    /**
     * Save an `operation` into the history.
     *
     * @param {Object} operation
     * @param {Object} options
     * @return {History}
     */

    value: function save(operation) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var history = this;
      var _history = history,
          undos = _history.undos,
          redos = _history.redos;
      var merge = options.merge,
          skip = options.skip;

      var prevBatch = undos.peek();
      var prevOperation = prevBatch && prevBatch.last();

      if (skip == null) {
        skip = shouldSkip(operation, prevOperation);
      }

      if (skip) {
        return history;
      }

      if (merge == null) {
        merge = shouldMerge(operation, prevOperation);
      }

      debug$2('save', { operation: operation, merge: merge });

      // If the `merge` flag is true, add the operation to the previous batch.
      if (merge && prevBatch) {
        var batch = prevBatch.push(operation);
        undos = undos.pop();
        undos = undos.push(batch);
      } else {
        // Otherwise, create a new batch with the operation.
        var _batch = new immutable.List([operation]);
        undos = undos.push(_batch);
      }

      // Constrain the history to 100 entries for memory's sake.
      if (undos.size > 100) {
        undos = undos.take(100);
      }

      // Clear the redos and update the history.
      redos = redos.clear();
      history = history.set('undos', undos).set('redos', redos);
      return history;
    }

    /**
     * Return a JSON representation of the history.
     *
     * @return {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var object = {
        object: this.object,
        redos: this.redos.toJSON(),
        undos: this.undos.toJSON()
      };

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS() {
      return this.toJSON();
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'history';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      index.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }
  }], [{
    key: 'create',

    /**
     * Create a new `History` with `attrs`.
     *
     * @param {Object|History} attrs
     * @return {History}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (History.isHistory(attrs)) {
        return attrs;
      }

      if (isPlainObject(attrs)) {
        return History.fromJSON(attrs);
      }

      throw new Error('`History.create` only accepts objects or histories, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Operations` from `operations`.
     *
     * @param {Array<Object>|List<Object>} operations
     * @return {List<Object>}
     */

  }, {
    key: 'createOperationsList',
    value: function createOperationsList() {
      var operations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (immutable.List.isList(operations)) {
        return operations;
      }

      if (Array.isArray(operations)) {
        return new immutable.List(operations);
      }

      throw new Error('`History.createList` only accepts arrays or lists, but you passed it: ' + operations);
    }

    /**
     * Create a `History` from a JSON `object`.
     *
     * @param {Object} object
     * @return {History}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      var _object$redos = object.redos,
          redos = _object$redos === undefined ? [] : _object$redos,
          _object$undos = object.undos,
          undos = _object$undos === undefined ? [] : _object$undos;


      var history = new History({
        redos: new immutable.Stack(redos.map(this.createOperationsList)),
        undos: new immutable.Stack(undos.map(this.createOperationsList))
      });

      return history;
    }

    /**
     * Alias `fromJS`.
     */

    /**
     * Check if `any` is a `History`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }]);
  return History;
}(immutable.Record(DEFAULTS$8));

/**
 * Attach a pseudo-symbol for type checking.
 */

History.fromJS = History.fromJSON;
History.isHistory = isType.bind(null, 'HISTORY');
History.prototype[MODEL_TYPES.HISTORY] = true;

/**
 * Check whether to merge a new operation `o` into the previous operation `p`.
 *
 * @param {Object} o
 * @param {Object} p
 * @return {Boolean}
 */

function shouldMerge(o, p) {
  if (!p) return false;

  var merge = o.type == 'set_selection' && p.type == 'set_selection' || o.type == 'insert_text' && p.type == 'insert_text' && o.offset == p.offset + p.text.length && isEqual_1(o.path, p.path) || o.type == 'remove_text' && p.type == 'remove_text' && o.offset + o.text.length == p.offset && isEqual_1(o.path, p.path);

  return merge;
}

/**
 * Check whether to skip a new operation `o`, given previous operation `p`.
 *
 * @param {Object} o
 * @param {Object} p
 * @return {Boolean}
 */

function shouldSkip(o, p) {
  if (!p) return false;

  var skip = o.type == 'set_selection' && p.type == 'set_selection';

  return skip;
}

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq_1(object[key], value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignMergeValue = assignMergeValue;

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var _createBaseFor = createBaseFor;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = _createBaseFor();

var _baseFor = baseFor;

var _cloneBuffer = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;
});

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
  return result;
}

var _cloneArrayBuffer = cloneArrayBuffer;

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var _cloneTypedArray = cloneTypedArray;

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

var _copyArray = copyArray;

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject_1(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

var _baseCreate = baseCreate;

/** Built-in value references. */
var getPrototype = _overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype;

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !_isPrototype(object))
    ? _baseCreate(_getPrototype(object))
    : {};
}

var _initCloneObject = initCloneObject;

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike_1(value) && isArrayLike_1(value);
}

var isArrayLikeObject_1 = isArrayLikeObject;

/** `Object#toString` result references. */
var objectTag$3 = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype;
var objectProto$13 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$10 = objectProto$13.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString$2.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject$2(value) {
  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag$3) {
    return false;
  }
  var proto = _getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$10.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

var isPlainObject_1 = isPlainObject$2;

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      _baseAssignValue(object, key, newValue);
    } else {
      _assignValue(object, key, newValue);
    }
  }
  return object;
}

var _copyObject = copyObject;

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var _nativeKeysIn = nativeKeysIn;

/** Used for built-in method references. */
var objectProto$14 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$11 = objectProto$14.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject_1(object)) {
    return _nativeKeysIn(object);
  }
  var isProto = _isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$11.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

var _baseKeysIn = baseKeysIn;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn$1(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
}

var keysIn_1 = keysIn$1;

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return _copyObject(value, keysIn_1(value));
}

var toPlainObject_1 = toPlainObject;

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = object[key],
      srcValue = source[key],
      stacked = stack.get(srcValue);

  if (stacked) {
    _assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray_1(srcValue),
        isBuff = !isArr && isBuffer_1(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray_1(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray_1(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject_1(objValue)) {
        newValue = _copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = _cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = _cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject_1(srcValue) || isArguments_1(srcValue)) {
      newValue = objValue;
      if (isArguments_1(objValue)) {
        newValue = toPlainObject_1(objValue);
      }
      else if (!isObject_1(objValue) || (srcIndex && isFunction_1(objValue))) {
        newValue = _initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  _assignMergeValue(object, key, newValue);
}

var _baseMergeDeep = baseMergeDeep;

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  _baseFor(source, function(srcValue, key) {
    if (isObject_1(srcValue)) {
      stack || (stack = new _Stack);
      _baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(object[key], srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      _assignMergeValue(object, key, newValue);
    }
  }, keysIn_1);
}

var _baseMerge = baseMerge;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return _setToString(_overRest(func, start, identity_1), func + '');
}

var _baseRest = baseRest;

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject_1(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike_1(object) && _isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq_1(object[index], value);
  }
  return false;
}

var _isIterateeCall = isIterateeCall;

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return _baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

var _createAssigner = createAssigner;

/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with six arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
 * var object = { 'a': [1], 'b': [2] };
 * var other = { 'a': [3], 'b': [4] };
 *
 * _.mergeWith(object, other, customizer);
 * // => { 'a': [1, 3], 'b': [2, 4] }
 */
var mergeWith = _createAssigner(function(object, source, srcIndex, customizer) {
  _baseMerge(object, source, srcIndex, customizer);
});

var mergeWith_1 = mergeWith;

/**
 * Schema violations.
 *
 * @type {String}
 */

var CHILD_OBJECT_INVALID = 'child_object_invalid';
var CHILD_REQUIRED = 'child_required';
var CHILD_TYPE_INVALID = 'child_type_invalid';
var CHILD_UNKNOWN = 'child_unknown';
var FIRST_CHILD_OBJECT_INVALID = 'first_child_object_invalid';
var FIRST_CHILD_TYPE_INVALID = 'first_child_type_invalid';
var LAST_CHILD_OBJECT_INVALID = 'last_child_object_invalid';
var LAST_CHILD_TYPE_INVALID = 'last_child_type_invalid';
var NODE_DATA_INVALID = 'node_data_invalid';
var NODE_IS_VOID_INVALID = 'node_is_void_invalid';
var NODE_MARK_INVALID = 'node_mark_invalid';
var NODE_TEXT_INVALID = 'node_text_invalid';
var PARENT_OBJECT_INVALID = 'parent_object_invalid';
var PARENT_TYPE_INVALID = 'parent_type_invalid';

/**
 * Define the core schema rules, order-sensitive.
 *
 * @type {Array}
 */

var CORE_SCHEMA_RULES = [
/**
 * Only allow block nodes in documents.
 *
 * @type {Object}
 */

{
  validateNode: function validateNode(node) {
    if (node.object != 'document') return;
    var invalids = node.nodes.filter(function (n) {
      return n.object != 'block';
    });
    if (!invalids.size) return;

    return function (change) {
      invalids.forEach(function (child) {
        change.removeNodeByKey(child.key, { normalize: false });
      });
    };
  }
},

/**
 * Only allow block nodes or inline and text nodes in blocks.
 *
 * @type {Object}
 */

{
  validateNode: function validateNode(node) {
    if (node.object != 'block') return;
    var first = node.nodes.first();
    if (!first) return;
    var objects = first.object == 'block' ? ['block'] : ['inline', 'text'];
    var invalids = node.nodes.filter(function (n) {
      return !objects.includes(n.object);
    });
    if (!invalids.size) return;

    return function (change) {
      invalids.forEach(function (child) {
        change.removeNodeByKey(child.key, { normalize: false });
      });
    };
  }
},

/**
 * Only allow inline and text nodes in inlines.
 *
 * @type {Object}
 */

{
  validateNode: function validateNode(node) {
    if (node.object != 'inline') return;
    var invalids = node.nodes.filter(function (n) {
      return n.object != 'inline' && n.object != 'text';
    });
    if (!invalids.size) return;

    return function (change) {
      invalids.forEach(function (child) {
        change.removeNodeByKey(child.key, { normalize: false });
      });
    };
  }
},

/**
 * Ensure that block and inline nodes have at least one text child.
 *
 * @type {Object}
 */

{
  validateNode: function validateNode(node) {
    if (node.object != 'block' && node.object != 'inline') return;
    if (node.nodes.size > 0) return;

    return function (change) {
      var text = Text.create();
      change.insertNodeByKey(node.key, 0, text, { normalize: false });
    };
  }
},

/**
 * Ensure that inline non-void nodes are never empty.
 *
 * This rule is applied to all blocks and inlines, because when they contain an empty
 * inline, we need to remove the empty inline from that parent node. If `validate`
 * was to be memoized, it should be against the parent node, not the empty inline itself.
 *
 * @type {Object}
 */

{
  validateNode: function validateNode(node) {
    if (node.object != 'inline' && node.object != 'block') return;

    var invalids = node.nodes.filter(function (child) {
      return child.object === 'inline' && child.isEmpty;
    });

    if (!invalids.size) return;

    return function (change) {
      // If all of the block's nodes are invalid, insert an empty text node so
      // that the selection will be preserved when they are all removed.
      if (node.nodes.size == invalids.size) {
        var text = Text.create();
        change.insertNodeByKey(node.key, 1, text, { normalize: false });
      }

      invalids.forEach(function (child) {
        change.removeNodeByKey(child.key, { normalize: false });
      });
    };
  }
},

/**
 * Ensure that inline void nodes are surrounded by text nodes, by adding extra
 * blank text nodes if necessary.
 *
 * @type {Object}
 */

{
  validateNode: function validateNode(node) {
    if (node.object != 'block' && node.object != 'inline') return;

    var invalids = node.nodes.reduce(function (list, child, index) {
      if (child.object !== 'inline') return list;

      var prev = index > 0 ? node.nodes.get(index - 1) : null;
      var next = node.nodes.get(index + 1);

      // We don't test if "prev" is inline, since it has already been
      // processed in the loop
      var insertBefore = !prev;
      var insertAfter = !next || next.object == 'inline';

      if (insertAfter || insertBefore) {
        list = list.push({ insertAfter: insertAfter, insertBefore: insertBefore, index: index });
      }

      return list;
    }, new immutable.List());

    if (!invalids.size) return;

    return function (change) {
      // Shift for every text node inserted previously.
      var shift = 0;

      invalids.forEach(function (_ref) {
        var index = _ref.index,
            insertAfter = _ref.insertAfter,
            insertBefore = _ref.insertBefore;

        if (insertBefore) {
          change.insertNodeByKey(node.key, shift + index, Text.create(), {
            normalize: false
          });

          shift++;
        }

        if (insertAfter) {
          change.insertNodeByKey(node.key, shift + index + 1, Text.create(), {
            normalize: false
          });

          shift++;
        }
      });
    };
  }
},

/**
 * Merge adjacent text nodes.
 *
 * @type {Object}
 */

{
  validateNode: function validateNode(node) {
    if (node.object != 'block' && node.object != 'inline') return;

    var invalids = node.nodes.map(function (child, i) {
      var next = node.nodes.get(i + 1);
      if (child.object != 'text') return;
      if (!next || next.object != 'text') return;
      return next;
    }).filter(Boolean);

    if (!invalids.size) return;

    return function (change) {
      // Reverse the list to handle consecutive merges, since the earlier nodes
      // will always exist after each merge.
      invalids.reverse().forEach(function (n) {
        change.mergeNodeByKey(n.key, { normalize: false });
      });
    };
  }
},

/**
 * Prevent extra empty text nodes, except when adjacent to inline void nodes.
 *
 * @type {Object}
 */

{
  validateNode: function validateNode(node) {
    if (node.object != 'block' && node.object != 'inline') return;
    var nodes = node.nodes;

    if (nodes.size <= 1) return;

    var invalids = nodes.filter(function (desc, i) {
      if (desc.object != 'text') return;
      if (desc.text.length > 0) return;

      var prev = i > 0 ? nodes.get(i - 1) : null;
      var next = nodes.get(i + 1);

      // If it's the first node, and the next is a void, preserve it.
      if (!prev && next.object == 'inline') return;

      // It it's the last node, and the previous is an inline, preserve it.
      if (!next && prev.object == 'inline') return;

      // If it's surrounded by inlines, preserve it.
      if (next && prev && next.object == 'inline' && prev.object == 'inline') return;

      // Otherwise, remove it.
      return true;
    });

    if (!invalids.size) return;

    return function (change) {
      invalids.forEach(function (text) {
        change.removeNodeByKey(text.key, { normalize: false });
      });
    };
  }
}];

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$9 = {
  plugins: []

  /**
   * Stack.
   *
   * @type {Stack}
   */

};
var Stack$2 = function (_Record) {
  inherits(Stack, _Record);

  function Stack() {
    classCallCheck(this, Stack);
    return possibleConstructorReturn(this, (Stack.__proto__ || Object.getPrototypeOf(Stack)).apply(this, arguments));
  }

  createClass(Stack, [{
    key: 'getPluginsWith',


    /**
     * Get all plugins with `property`.
     *
     * @param {String} property
     * @return {Array}
     */

    value: function getPluginsWith(property) {
      return this.plugins.filter(function (plugin) {
        return plugin[property] != null;
      });
    }

    /**
     * Iterate the plugins with `property`, returning the first non-null value.
     *
     * @param {String} property
     * @param {Any} ...args
     */

  }, {
    key: 'find',
    value: function find(property) {
      var plugins = this.getPluginsWith(property);

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var plugin = _step.value;

          var ret = plugin[property].apply(plugin, args);
          if (ret != null) return ret;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Iterate the plugins with `property`, returning all the non-null values.
     *
     * @param {String} property
     * @param {Any} ...args
     * @return {Array}
     */

  }, {
    key: 'map',
    value: function map(property) {
      var plugins = this.getPluginsWith(property);
      var array = [];

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = plugins[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var plugin = _step2.value;

          var ret = plugin[property].apply(plugin, args);
          if (ret != null) array.push(ret);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return array;
    }

    /**
     * Iterate the plugins with `property`, breaking on any a non-null values.
     *
     * @param {String} property
     * @param {Any} ...args
     */

  }, {
    key: 'run',
    value: function run(property) {
      var plugins = this.getPluginsWith(property);

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = plugins[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var plugin = _step3.value;

          var ret = plugin[property].apply(plugin, args);
          if (ret != null) return;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }

    /**
     * Iterate the plugins with `property`, reducing to a set of React children.
     *
     * @param {String} property
     * @param {Object} props
     * @param {Any} ...args
     */

  }, {
    key: 'render',
    value: function render(property, props) {
      for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        args[_key4 - 2] = arguments[_key4];
      }

      var plugins = this.getPluginsWith(property);
      return plugins.reduceRight(function (children, plugin) {
        if (!plugin[property]) return children;
        var ret = plugin[property].apply(plugin, [props].concat(args));
        if (ret == null) return children;
        props.children = ret;
        return ret;
      }, props.children === undefined ? null : props.children);
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'stack';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      index.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }
  }], [{
    key: 'create',

    /**
     * Constructor.
     *
     * @param {Object} attrs
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _attrs$plugins = attrs.plugins,
          plugins = _attrs$plugins === undefined ? [] : _attrs$plugins;

      var stack = new Stack({ plugins: plugins });
      return stack;
    }

    /**
     * Check if `any` is a `Stack`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isStack',
    value: function isStack(any) {
      return !!(any && any[MODEL_TYPES.STACK]);
    }
  }]);
  return Stack;
}(immutable.Record(DEFAULTS$9));

/**
 * Attach a pseudo-symbol for type checking.
 */

Stack$2.prototype[MODEL_TYPES.STACK] = true;

/**
 * Memoize read methods.
 */

memoize$2(Stack$2.prototype, ['getPluginsWith']);

/**
 * Debug.
 *
 * @type {Function}
 */

var debug$3 = browser$2('slate:schema');

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$10 = {
  stack: Stack$2.create(),
  document: {},
  blocks: {},
  inlines: {}

  /**
   * Schema.
   *
   * @type {Schema}
   */

};
var Schema = function (_Record) {
  inherits(Schema, _Record);

  function Schema() {
    classCallCheck(this, Schema);
    return possibleConstructorReturn(this, (Schema.__proto__ || Object.getPrototypeOf(Schema)).apply(this, arguments));
  }

  createClass(Schema, [{
    key: 'getRule',


    /**
     * Get the rule for an `object`.
     *
     * @param {Mixed} object
     * @return {Object}
     */

    value: function getRule(object) {
      switch (object.object) {
        case 'document':
          return this.document;
        case 'block':
          return this.blocks[object.type];
        case 'inline':
          return this.inlines[object.type];
      }
    }

    /**
     * Get a dictionary of the parent rule validations by child type.
     *
     * @return {Object|Null}
     */

  }, {
    key: 'getParentRules',
    value: function getParentRules() {
      var blocks = this.blocks,
          inlines = this.inlines;

      var parents = {};

      for (var key in blocks) {
        var rule = blocks[key];
        if (rule.parent == null) continue;
        parents[key] = rule;
      }

      for (var _key in inlines) {
        var _rule = inlines[_key];
        if (_rule.parent == null) continue;
        parents[_key] = _rule;
      }

      return Object.keys(parents).length == 0 ? null : parents;
    }

    /**
     * Fail validation by returning a normalizing change function.
     *
     * @param {String} violation
     * @param {Object} context
     * @return {Function}
     */

  }, {
    key: 'fail',
    value: function fail(violation, context) {
      var _this2 = this;

      return function (change) {
        debug$3('normalizing', { violation: violation, context: context });
        var rule = context.rule;
        var size = change.operations.size;

        if (rule.normalize) rule.normalize(change, violation, context);
        if (change.operations.size > size) return;
        _this2.normalize(change, violation, context);
      };
    }

    /**
     * Normalize an invalid value with `violation` and `context`.
     *
     * @param {Change} change
     * @param {String} violation
     * @param {Mixed} context
     */

  }, {
    key: 'normalize',
    value: function normalize(change, violation, context) {
      switch (violation) {
        case CHILD_OBJECT_INVALID:
        case CHILD_TYPE_INVALID:
        case CHILD_UNKNOWN:
        case FIRST_CHILD_OBJECT_INVALID:
        case FIRST_CHILD_TYPE_INVALID:
        case LAST_CHILD_OBJECT_INVALID:
        case LAST_CHILD_TYPE_INVALID:
          {
            var child = context.child,
                node = context.node;

            return child.object == 'text' && node.object == 'block' && node.nodes.size == 1 ? change.removeNodeByKey(node.key) : change.removeNodeByKey(child.key);
          }

        case CHILD_REQUIRED:
        case NODE_TEXT_INVALID:
        case PARENT_OBJECT_INVALID:
        case PARENT_TYPE_INVALID:
          {
            var _node = context.node;

            return _node.object == 'document' ? _node.nodes.forEach(function (child) {
              return change.removeNodeByKey(child.key);
            }) : change.removeNodeByKey(_node.key);
          }

        case NODE_DATA_INVALID:
          {
            var _node2 = context.node,
                key = context.key;

            return _node2.data.get(key) === undefined && _node2.object != 'document' ? change.removeNodeByKey(_node2.key) : change.setNodeByKey(_node2.key, { data: _node2.data.delete(key) });
          }

        case NODE_IS_VOID_INVALID:
          {
            var _node3 = context.node;

            return change.setNodeByKey(_node3.key, { isVoid: !_node3.isVoid });
          }

        case NODE_MARK_INVALID:
          {
            var _node4 = context.node,
                mark = context.mark;

            return _node4.getTexts().forEach(function (t) {
              return change.removeMarkByKey(t.key, 0, t.text.length, mark);
            });
          }
      }
    }

    /**
     * Validate a `node` with the schema, returning a function that will fix the
     * invalid node, or void if the node is valid.
     *
     * @param {Node} node
     * @return {Function|Void}
     */

  }, {
    key: 'validateNode',
    value: function validateNode(node) {
      var _this3 = this;

      var ret = this.stack.find('validateNode', node);
      if (ret) return ret;

      if (node.object == 'text') return;

      var rule = this.getRule(node) || {};
      var parents = this.getParentRules();
      var ctx = { node: node, rule: rule };

      if (rule.isVoid != null) {
        if (node.isVoid != rule.isVoid) {
          return this.fail(NODE_IS_VOID_INVALID, ctx);
        }
      }

      if (rule.data != null) {
        for (var key in rule.data) {
          var fn = rule.data[key];
          var value = node.data.get(key);

          if (!fn(value)) {
            return this.fail(NODE_DATA_INVALID, _extends({}, ctx, { key: key, value: value }));
          }
        }
      }

      if (rule.marks != null) {
        var marks = node.getMarks().toArray();

        var _loop = function _loop(mark) {
          if (!rule.marks.some(function (def) {
            return def.type === mark.type;
          })) {
            return {
              v: _this3.fail(NODE_MARK_INVALID, _extends({}, ctx, { mark: mark }))
            };
          }
        };

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = marks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var mark = _step.value;

            var _ret = _loop(mark);

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      if (rule.text != null) {
        var text = node.text;


        if (!rule.text.test(text)) {
          return this.fail(NODE_TEXT_INVALID, _extends({}, ctx, { text: text }));
        }
      }

      if (rule.first != null) {
        var _rule$first = rule.first,
            objects = _rule$first.objects,
            types = _rule$first.types;

        var child = node.nodes.first();

        if (child && objects && !objects.includes(child.object)) {
          return this.fail(FIRST_CHILD_OBJECT_INVALID, _extends({}, ctx, { child: child }));
        }

        if (child && types && !types.includes(child.type)) {
          return this.fail(FIRST_CHILD_TYPE_INVALID, _extends({}, ctx, { child: child }));
        }
      }

      if (rule.last != null) {
        var _rule$last = rule.last,
            _objects = _rule$last.objects,
            _types = _rule$last.types;

        var _child = node.nodes.last();

        if (_child && _objects && !_objects.includes(_child.object)) {
          return this.fail(LAST_CHILD_OBJECT_INVALID, _extends({}, ctx, { child: _child }));
        }

        if (_child && _types && !_types.includes(_child.type)) {
          return this.fail(LAST_CHILD_TYPE_INVALID, _extends({}, ctx, { child: _child }));
        }
      }

      if (rule.nodes != null || parents != null) {
        var nextDef = function nextDef() {
          offset = offset == null ? null : 0;
          def = defs.shift();
          min = def && (def.min == null ? 0 : def.min);
          max = def && (def.max == null ? Infinity : def.max);
          return !!def;
        };

        var nextChild = function nextChild() {
          index$$1 = index$$1 == null ? 0 : index$$1 + 1;
          offset = offset == null ? 0 : offset + 1;
          _child2 = children[index$$1];
          if (max != null && offset == max) nextDef();
          return !!_child2;
        };

        var rewind = function rewind() {
          offset -= 1;
          index$$1 -= 1;
        };

        var children = node.nodes.toArray();
        var defs = rule.nodes != null ? rule.nodes.slice() : [];

        var offset = void 0;
        var min = void 0;
        var index$$1 = void 0;
        var def = void 0;
        var max = void 0;
        var _child2 = void 0;

        if (rule.nodes != null) {
          nextDef();
        }

        while (nextChild()) {
          if (parents != null && _child2.object != 'text' && _child2.type in parents) {
            var r = parents[_child2.type];

            if (r.parent.objects != null && !r.parent.objects.includes(node.object)) {
              return this.fail(PARENT_OBJECT_INVALID, {
                node: _child2,
                parent: node,
                rule: r
              });
            }

            if (r.parent.types != null && !r.parent.types.includes(node.type)) {
              return this.fail(PARENT_TYPE_INVALID, {
                node: _child2,
                parent: node,
                rule: r
              });
            }
          }

          if (rule.nodes != null) {
            if (!def) {
              return this.fail(CHILD_UNKNOWN, _extends({}, ctx, { child: _child2, index: index$$1 }));
            }

            if (def.objects != null && !def.objects.includes(_child2.object)) {
              if (offset >= min && nextDef()) {
                rewind();
                continue;
              }
              return this.fail(CHILD_OBJECT_INVALID, _extends({}, ctx, { child: _child2, index: index$$1 }));
            }

            if (def.types != null && !def.types.includes(_child2.type)) {
              if (offset >= min && nextDef()) {
                rewind();
                continue;
              }
              return this.fail(CHILD_TYPE_INVALID, _extends({}, ctx, { child: _child2, index: index$$1 }));
            }
          }
        }

        if (rule.nodes != null) {
          while (min != null) {
            if (offset < min) {
              return this.fail(CHILD_REQUIRED, _extends({}, ctx, { index: index$$1 }));
            }

            nextDef();
          }
        }
      }
    }

    /**
     * Return a JSON representation of the schema.
     *
     * @return {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var object = {
        object: this.object,
        document: this.document,
        blocks: this.blocks,
        inlines: this.inlines
      };

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS() {
      return this.toJSON();
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'schema';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      index.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Schema` with `attrs`.
     *
     * @param {Object|Schema} attrs
     * @return {Schema}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Schema.isSchema(attrs)) {
        return attrs;
      }

      if (isPlainObject(attrs)) {
        return Schema.fromJSON(attrs);
      }

      throw new Error('`Schema.create` only accepts objects or schemas, but you passed it: ' + attrs);
    }

    /**
     * Create a `Schema` from a JSON `object`.
     *
     * @param {Object} object
     * @return {Schema}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      if (Schema.isSchema(object)) {
        return object;
      }

      var plugins = object.plugins;


      if (object.rules) {
        throw new Error('Schemas in Slate have changed! They are no longer accept a `rules` property.');
      }

      if (object.nodes) {
        throw new Error('Schemas in Slate have changed! They are no longer accept a `nodes` property.');
      }

      if (!plugins) {
        plugins = [{ schema: object }];
      }

      var schema = resolveSchema(plugins);
      var stack = Stack$2.create({ plugins: [].concat(toConsumableArray(CORE_SCHEMA_RULES), toConsumableArray(plugins)) });
      var ret = new Schema(_extends({}, schema, { stack: stack }));
      return ret;
    }

    /**
     * Alias `fromJS`.
     */

  }, {
    key: 'isSchema',


    /**
     * Check if `any` is a `Schema`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isSchema(any) {
      return !!(any && any[MODEL_TYPES.SCHEMA]);
    }
  }]);
  return Schema;
}(immutable.Record(DEFAULTS$10));

/**
 * Resolve a set of schema rules from an array of `plugins`.
 *
 * @param {Array} plugins
 * @return {Object}
 */

Schema.fromJS = Schema.fromJSON;
function resolveSchema() {
  var plugins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var schema = {
    document: {},
    blocks: {},
    inlines: {}
  };

  plugins.slice().reverse().forEach(function (plugin) {
    if (!plugin.schema) return;

    if (plugin.schema.rules) {
      throw new Error('Schemas in Slate have changed! They are no longer accept a `rules` property.');
    }

    if (plugin.schema.nodes) {
      throw new Error('Schemas in Slate have changed! They are no longer accept a `nodes` property.');
    }

    var _plugin$schema = plugin.schema,
        _plugin$schema$docume = _plugin$schema.document,
        document = _plugin$schema$docume === undefined ? {} : _plugin$schema$docume,
        _plugin$schema$blocks = _plugin$schema.blocks,
        blocks = _plugin$schema$blocks === undefined ? {} : _plugin$schema$blocks,
        _plugin$schema$inline = _plugin$schema.inlines,
        inlines = _plugin$schema$inline === undefined ? {} : _plugin$schema$inline;

    var d = resolveDocumentRule(document);
    var bs = {};
    var is = {};

    for (var key in blocks) {
      bs[key] = resolveNodeRule('block', key, blocks[key]);
    }

    for (var _key2 in inlines) {
      is[_key2] = resolveNodeRule('inline', _key2, inlines[_key2]);
    }

    mergeWith_1(schema.document, d, customizer);
    mergeWith_1(schema.blocks, bs, customizer);
    mergeWith_1(schema.inlines, is, customizer);
  });

  return schema;
}

/**
 * Resolve a document rule `obj`.
 *
 * @param {Object} obj
 * @return {Object}
 */

function resolveDocumentRule(obj) {
  return _extends({
    data: {},
    nodes: null
  }, obj);
}

/**
 * Resolve a node rule with `type` from `obj`.
 *
 * @param {String} object
 * @param {String} type
 * @param {Object} obj
 * @return {Object}
 */

function resolveNodeRule(object, type, obj) {
  return _extends({
    data: {},
    isVoid: null,
    nodes: null,
    first: null,
    last: null,
    parent: null,
    text: null
  }, obj);
}

/**
 * A Lodash customizer for merging schema definitions. Special cases `objects`,
 * `marks` and `types` arrays to be unioned, and ignores new `null` values.
 *
 * @param {Mixed} target
 * @param {Mixed} source
 * @return {Array|Void}
 */

function customizer(target, source, key) {
  if (key == 'objects' || key == 'types' || key == 'marks') {
    return target == null ? source : target.concat(source);
  } else {
    return source == null ? target : source;
  }
}

/**
 * Attach a pseudo-symbol for type checking.
 */

Schema.prototype[MODEL_TYPES.SCHEMA] = true;

/**
 * Memoize read methods.
 */

memoize$2(Schema.prototype, ['getParentRules']);

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$11 = {
  data: new immutable.Map(),
  decorations: null,
  document: Document.create(),
  history: History.create(),
  schema: Schema.create(),
  selection: Range.create()

  /**
   * Value.
   *
   * @type {Value}
   */

};
var Value = function (_Record) {
  inherits(Value, _Record);

  function Value() {
    classCallCheck(this, Value);
    return possibleConstructorReturn(this, (Value.__proto__ || Object.getPrototypeOf(Value)).apply(this, arguments));
  }

  createClass(Value, [{
    key: 'change',


    /**
     * Create a new `Change` with the current value as a starting point.
     *
     * @param {Object} attrs
     * @return {Change}
     */

    value: function change() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new Change(_extends({}, attrs, { value: this }));
    }

    /**
     * Return a JSON representation of the value.
     *
     * @param {Object} options
     * @return {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var object = {
        object: this.object,
        document: this.document.toJSON(options)
      };

      if (options.preserveData) {
        object.data = this.data.toJSON();
      }

      if (options.preserveDecorations) {
        object.decorations = this.decorations ? this.decorations.toArray().map(function (d) {
          return d.toJSON();
        }) : null;
      }

      if (options.preserveHistory) {
        object.history = this.history.toJSON();
      }

      if (options.preserveSelection) {
        object.selection = this.selection.toJSON();
      }

      if (options.preserveSchema) {
        object.schema = this.schema.toJSON();
      }

      if (options.preserveSelection && !options.preserveKeys) {
        var document = this.document,
            selection = this.selection;


        object.selection.anchorPath = selection.isSet ? document.getPath(selection.anchorKey) : null;

        object.selection.focusPath = selection.isSet ? document.getPath(selection.focusKey) : null;

        delete object.selection.anchorKey;
        delete object.selection.focusKey;
      }

      if (options.preserveDecorations && object.decorations && !options.preserveKeys) {
        var _document = this.document;


        object.decorations = object.decorations.map(function (decoration) {
          var withPath = _extends({}, decoration, {
            anchorPath: _document.getPath(decoration.anchorKey),
            focusPath: _document.getPath(decoration.focusKey)
          });
          delete withPath.anchorKey;
          delete withPath.focusKey;
          return withPath;
        });
      }

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS(options) {
      return this.toJSON(options);
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'value';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      index.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }

    /**
     * Are there undoable events?
     *
     * @return {Boolean}
     */

  }, {
    key: 'hasUndos',
    get: function get$$1() {
      return this.history.undos.size > 0;
    }

    /**
     * Are there redoable events?
     *
     * @return {Boolean}
     */

  }, {
    key: 'hasRedos',
    get: function get$$1() {
      return this.history.redos.size > 0;
    }

    /**
     * Is the current selection blurred?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isBlurred',
    get: function get$$1() {
      return this.selection.isBlurred;
    }

    /**
     * Is the current selection focused?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isFocused',
    get: function get$$1() {
      return this.selection.isFocused;
    }

    /**
     * Is the current selection collapsed?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isCollapsed',
    get: function get$$1() {
      return this.selection.isCollapsed;
    }

    /**
     * Is the current selection expanded?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isExpanded',
    get: function get$$1() {
      return this.selection.isExpanded;
    }

    /**
     * Is the current selection backward?
     *
     * @return {Boolean} isBackward
     */

  }, {
    key: 'isBackward',
    get: function get$$1() {
      return this.selection.isBackward;
    }

    /**
     * Is the current selection forward?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isForward',
    get: function get$$1() {
      return this.selection.isForward;
    }

    /**
     * Get the current start key.
     *
     * @return {String}
     */

  }, {
    key: 'startKey',
    get: function get$$1() {
      return this.selection.startKey;
    }

    /**
     * Get the current end key.
     *
     * @return {String}
     */

  }, {
    key: 'endKey',
    get: function get$$1() {
      return this.selection.endKey;
    }

    /**
     * Get the current start offset.
     *
     * @return {String}
     */

  }, {
    key: 'startOffset',
    get: function get$$1() {
      return this.selection.startOffset;
    }

    /**
     * Get the current end offset.
     *
     * @return {String}
     */

  }, {
    key: 'endOffset',
    get: function get$$1() {
      return this.selection.endOffset;
    }

    /**
     * Get the current anchor key.
     *
     * @return {String}
     */

  }, {
    key: 'anchorKey',
    get: function get$$1() {
      return this.selection.anchorKey;
    }

    /**
     * Get the current focus key.
     *
     * @return {String}
     */

  }, {
    key: 'focusKey',
    get: function get$$1() {
      return this.selection.focusKey;
    }

    /**
     * Get the current anchor offset.
     *
     * @return {String}
     */

  }, {
    key: 'anchorOffset',
    get: function get$$1() {
      return this.selection.anchorOffset;
    }

    /**
     * Get the current focus offset.
     *
     * @return {String}
     */

  }, {
    key: 'focusOffset',
    get: function get$$1() {
      return this.selection.focusOffset;
    }

    /**
     * Get the current start text node's closest block parent.
     *
     * @return {Block}
     */

  }, {
    key: 'startBlock',
    get: function get$$1() {
      return this.startKey && this.document.getClosestBlock(this.startKey);
    }

    /**
     * Get the current end text node's closest block parent.
     *
     * @return {Block}
     */

  }, {
    key: 'endBlock',
    get: function get$$1() {
      return this.endKey && this.document.getClosestBlock(this.endKey);
    }

    /**
     * Get the current anchor text node's closest block parent.
     *
     * @return {Block}
     */

  }, {
    key: 'anchorBlock',
    get: function get$$1() {
      return this.anchorKey && this.document.getClosestBlock(this.anchorKey);
    }

    /**
     * Get the current focus text node's closest block parent.
     *
     * @return {Block}
     */

  }, {
    key: 'focusBlock',
    get: function get$$1() {
      return this.focusKey && this.document.getClosestBlock(this.focusKey);
    }

    /**
     * Get the current start text node's closest inline parent.
     *
     * @return {Inline}
     */

  }, {
    key: 'startInline',
    get: function get$$1() {
      return this.startKey && this.document.getClosestInline(this.startKey);
    }

    /**
     * Get the current end text node's closest inline parent.
     *
     * @return {Inline}
     */

  }, {
    key: 'endInline',
    get: function get$$1() {
      return this.endKey && this.document.getClosestInline(this.endKey);
    }

    /**
     * Get the current anchor text node's closest inline parent.
     *
     * @return {Inline}
     */

  }, {
    key: 'anchorInline',
    get: function get$$1() {
      return this.anchorKey && this.document.getClosestInline(this.anchorKey);
    }

    /**
     * Get the current focus text node's closest inline parent.
     *
     * @return {Inline}
     */

  }, {
    key: 'focusInline',
    get: function get$$1() {
      return this.focusKey && this.document.getClosestInline(this.focusKey);
    }

    /**
     * Get the current start text node.
     *
     * @return {Text}
     */

  }, {
    key: 'startText',
    get: function get$$1() {
      return this.startKey && this.document.getDescendant(this.startKey);
    }

    /**
     * Get the current end node.
     *
     * @return {Text}
     */

  }, {
    key: 'endText',
    get: function get$$1() {
      return this.endKey && this.document.getDescendant(this.endKey);
    }

    /**
     * Get the current anchor node.
     *
     * @return {Text}
     */

  }, {
    key: 'anchorText',
    get: function get$$1() {
      return this.anchorKey && this.document.getDescendant(this.anchorKey);
    }

    /**
     * Get the current focus node.
     *
     * @return {Text}
     */

  }, {
    key: 'focusText',
    get: function get$$1() {
      return this.focusKey && this.document.getDescendant(this.focusKey);
    }

    /**
     * Get the next block node.
     *
     * @return {Block}
     */

  }, {
    key: 'nextBlock',
    get: function get$$1() {
      return this.endKey && this.document.getNextBlock(this.endKey);
    }

    /**
     * Get the previous block node.
     *
     * @return {Block}
     */

  }, {
    key: 'previousBlock',
    get: function get$$1() {
      return this.startKey && this.document.getPreviousBlock(this.startKey);
    }

    /**
     * Get the next inline node.
     *
     * @return {Inline}
     */

  }, {
    key: 'nextInline',
    get: function get$$1() {
      return this.endKey && this.document.getNextInline(this.endKey);
    }

    /**
     * Get the previous inline node.
     *
     * @return {Inline}
     */

  }, {
    key: 'previousInline',
    get: function get$$1() {
      return this.startKey && this.document.getPreviousInline(this.startKey);
    }

    /**
     * Get the next text node.
     *
     * @return {Text}
     */

  }, {
    key: 'nextText',
    get: function get$$1() {
      return this.endKey && this.document.getNextText(this.endKey);
    }

    /**
     * Get the previous text node.
     *
     * @return {Text}
     */

  }, {
    key: 'previousText',
    get: function get$$1() {
      return this.startKey && this.document.getPreviousText(this.startKey);
    }

    /**
     * Get the characters in the current selection.
     *
     * @return {List<Character>}
     */

  }, {
    key: 'characters',
    get: function get$$1() {
      return this.selection.isUnset ? new immutable.List() : this.document.getCharactersAtRange(this.selection);
    }

    /**
     * Get the marks of the current selection.
     *
     * @return {Set<Mark>}
     */

  }, {
    key: 'marks',
    get: function get$$1() {
      return this.selection.isUnset ? new immutable.Set() : this.selection.marks || this.document.getMarksAtRange(this.selection);
    }

    /**
     * Get the active marks of the current selection.
     *
     * @return {Set<Mark>}
     */

  }, {
    key: 'activeMarks',
    get: function get$$1() {
      return this.selection.isUnset ? new immutable.Set() : this.selection.marks || this.document.getActiveMarksAtRange(this.selection);
    }

    /**
     * Get the block nodes in the current selection.
     *
     * @return {List<Block>}
     */

  }, {
    key: 'blocks',
    get: function get$$1() {
      return this.selection.isUnset ? new immutable.List() : this.document.getBlocksAtRange(this.selection);
    }

    /**
     * Get the fragment of the current selection.
     *
     * @return {Document}
     */

  }, {
    key: 'fragment',
    get: function get$$1() {
      return this.selection.isUnset ? Document.create() : this.document.getFragmentAtRange(this.selection);
    }

    /**
     * Get the inline nodes in the current selection.
     *
     * @return {List<Inline>}
     */

  }, {
    key: 'inlines',
    get: function get$$1() {
      return this.selection.isUnset ? new immutable.List() : this.document.getInlinesAtRange(this.selection);
    }

    /**
     * Get the text nodes in the current selection.
     *
     * @return {List<Text>}
     */

  }, {
    key: 'texts',
    get: function get$$1() {
      return this.selection.isUnset ? new immutable.List() : this.document.getTextsAtRange(this.selection);
    }

    /**
     * Check whether the selection is empty.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isEmpty',
    get: function get$$1() {
      if (this.isCollapsed) return true;
      if (this.endOffset != 0 && this.startOffset != 0) return false;
      return this.fragment.isEmpty;
    }

    /**
     * Check whether the selection is collapsed in a void node.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isInVoid',
    get: function get$$1() {
      if (this.isExpanded) return false;
      return this.document.hasVoidParent(this.startKey);
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Value` with `attrs`.
     *
     * @param {Object|Value} attrs
     * @param {Object} options
     * @return {Value}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (Value.isValue(attrs)) {
        return attrs;
      }

      if (isPlainObject(attrs)) {
        return Value.fromJSON(attrs, options);
      }

      throw new Error('`Value.create` only accepts objects or values, but you passed it: ' + attrs);
    }

    /**
     * Create a dictionary of settable value properties from `attrs`.
     *
     * @param {Object|Value} attrs
     * @return {Object}
     */

  }, {
    key: 'createProperties',
    value: function createProperties() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Value.isValue(attrs)) {
        return {
          data: attrs.data,
          decorations: attrs.decorations,
          schema: attrs.schema
        };
      }

      if (isPlainObject(attrs)) {
        var props = {};
        if ('data' in attrs) props.data = Data.create(attrs.data);
        if ('decorations' in attrs) props.decorations = Range.createList(attrs.decorations);
        if ('schema' in attrs) props.schema = Schema.create(attrs.schema);
        return props;
      }

      throw new Error('`Value.createProperties` only accepts objects or values, but you passed it: ' + attrs);
    }

    /**
     * Create a `Value` from a JSON `object`.
     *
     * @param {Object} object
     * @param {Object} options
     *   @property {Boolean} normalize
     *   @property {Array} plugins
     * @return {Value}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _object$document = object.document,
          document = _object$document === undefined ? {} : _object$document,
          _object$selection = object.selection,
          selection = _object$selection === undefined ? {} : _object$selection,
          _object$schema = object.schema,
          schema = _object$schema === undefined ? {} : _object$schema,
          _object$history = object.history,
          history = _object$history === undefined ? {} : _object$history;


      var data = new immutable.Map();

      document = Document.fromJSON(document);

      // rebuild selection from anchorPath and focusPath if keys were dropped
      var _selection = selection,
          anchorPath = _selection.anchorPath,
          focusPath = _selection.focusPath,
          anchorKey = _selection.anchorKey,
          focusKey = _selection.focusKey;


      if (anchorPath !== undefined && anchorKey === undefined) {
        selection.anchorKey = document.assertPath(anchorPath).key;
      }

      if (focusPath !== undefined && focusKey === undefined) {
        selection.focusKey = document.assertPath(focusPath).key;
      }

      selection = Range.fromJSON(selection);
      schema = Schema.fromJSON(schema);
      history = History.fromJSON(history);

      // Allow plugins to set a default value for `data`.
      if (options.plugins) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = options.plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var plugin = _step.value;

            if (plugin.data) data = data.merge(plugin.data);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      // Then merge in the `data` provided.
      if ('data' in object) {
        data = data.merge(object.data);
      }

      if (selection.isUnset) {
        var text = document.getFirstText();
        if (text) selection = selection.collapseToStartOf(text);
      }

      var value = new Value({
        data: data,
        document: document,
        selection: selection,
        schema: schema,
        history: history
      });

      if (options.normalize !== false) {
        value = value.change({ save: false }).normalize().value;
      }

      return value;
    }

    /**
     * Alias `fromJS`.
     */

  }, {
    key: 'isValue',


    /**
     * Check if a `value` is a `Value`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

    value: function isValue(value) {
      return !!(value && value[MODEL_TYPES.VALUE]);
    }
  }]);
  return Value;
}(immutable.Record(DEFAULTS$11));

/**
 * Attach a pseudo-symbol for type checking.
 */

Value.fromJS = Value.fromJSON;
Value.prototype[MODEL_TYPES.VALUE] = true;

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$12 = {
  length: undefined,
  mark: undefined,
  marks: undefined,
  newPath: undefined,
  node: undefined,
  offset: undefined,
  path: undefined,
  position: undefined,
  properties: undefined,
  selection: undefined,
  target: undefined,
  text: undefined,
  type: undefined,
  value: undefined

  /**
   * Operation.
   *
   * @type {Operation}
   */

};
var Operation = function (_Record) {
  inherits(Operation, _Record);

  function Operation() {
    classCallCheck(this, Operation);
    return possibleConstructorReturn(this, (Operation.__proto__ || Object.getPrototypeOf(Operation)).apply(this, arguments));
  }

  createClass(Operation, [{
    key: 'toJSON',


    /**
     * Return a JSON representation of the operation.
     *
     * @param {Object} options
     * @return {Object}
     */

    value: function toJSON() {
      var object = this.object,
          type = this.type;

      var json = { object: object, type: type };
      var ATTRIBUTES = OPERATION_ATTRIBUTES[type];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = ATTRIBUTES[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          var value = this[key];

          // Skip keys for objects that should not be serialized, and are only used
          // for providing the local-only invert behavior for the history stack.
          if (key == 'document') continue;
          if (key == 'selection') continue;
          if (key == 'value') continue;
          if (key == 'node' && type != 'insert_node') continue;

          if (key == 'mark' || key == 'marks' || key == 'node') {
            value = value.toJSON();
          }

          if (key == 'properties' && type == 'merge_node') {
            var v = {};
            if ('data' in value) v.data = value.data.toJS();
            if ('type' in value) v.type = value.type;
            value = v;
          }

          if (key == 'properties' && type == 'set_mark') {
            var _v = {};
            if ('data' in value) _v.data = value.data.toJS();
            if ('type' in value) _v.type = value.type;
            value = _v;
          }

          if (key == 'properties' && type == 'set_node') {
            var _v2 = {};
            if ('data' in value) _v2.data = value.data.toJS();
            if ('isVoid' in value) _v2.isVoid = value.isVoid;
            if ('type' in value) _v2.type = value.type;
            value = _v2;
          }

          if (key == 'properties' && type == 'set_selection') {
            var _v3 = {};
            if ('anchorOffset' in value) _v3.anchorOffset = value.anchorOffset;
            if ('anchorPath' in value) _v3.anchorPath = value.anchorPath;
            if ('focusOffset' in value) _v3.focusOffset = value.focusOffset;
            if ('focusPath' in value) _v3.focusPath = value.focusPath;
            if ('isBackward' in value) _v3.isBackward = value.isBackward;
            if ('isFocused' in value) _v3.isFocused = value.isFocused;
            if ('marks' in value) _v3.marks = value.marks == null ? null : value.marks.toJSON();
            value = _v3;
          }

          if (key == 'properties' && type == 'set_value') {
            var _v4 = {};
            if ('data' in value) _v4.data = value.data.toJS();
            if ('decorations' in value) _v4.decorations = value.decorations.toJS();
            if ('schema' in value) _v4.schema = value.schema.toJS();
            value = _v4;
          }

          if (key == 'properties' && type == 'split_node') {
            var _v5 = {};
            if ('data' in value) _v5.data = value.data.toJS();
            if ('type' in value) _v5.type = value.type;
            value = _v5;
          }

          json[key] = value;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return json;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS(options) {
      return this.toJSON(options);
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'operation';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      index.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Operation` with `attrs`.
     *
     * @param {Object|Array|List|String|Operation} attrs
     * @return {Operation}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Operation.isOperation(attrs)) {
        return attrs;
      }

      if (isPlainObject(attrs)) {
        return Operation.fromJSON(attrs);
      }

      throw new Error('`Operation.create` only accepts objects or operations, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Operations` from `elements`.
     *
     * @param {Array<Operation|Object>|List<Operation|Object>} elements
     * @return {List<Operation>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (immutable.List.isList(elements) || Array.isArray(elements)) {
        var list = new immutable.List(elements.map(Operation.create));
        return list;
      }

      throw new Error('`Operation.createList` only accepts arrays or lists, but you passed it: ' + elements);
    }

    /**
     * Create a `Operation` from a JSON `object`.
     *
     * @param {Object|Operation} object
     * @return {Operation}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      if (Operation.isOperation(object)) {
        return object;
      }

      var type = object.type,
          value = object.value;

      var ATTRIBUTES = OPERATION_ATTRIBUTES[type];
      var attrs = { type: type };

      if (!ATTRIBUTES) {
        throw new Error('`Operation.fromJSON` was passed an unrecognized operation type: "' + type + '"');
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = ATTRIBUTES[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          var v = object[key];

          if (v === undefined) {
            // Skip keys for objects that should not be serialized, and are only used
            // for providing the local-only invert behavior for the history stack.
            if (key == 'document') continue;
            if (key == 'selection') continue;
            if (key == 'value') continue;
            if (key == 'node' && type != 'insert_node') continue;

            throw new Error('`Operation.fromJSON` was passed a "' + type + '" operation without the required "' + key + '" attribute.');
          }

          if (key == 'mark') {
            v = Mark.create(v);
          }

          if (key == 'marks' && v != null) {
            v = Mark.createSet(v);
          }

          if (key == 'node') {
            v = Node.create(v);
          }

          if (key == 'selection') {
            v = Range.create(v);
          }

          if (key == 'value') {
            v = Value.create(v);
          }

          if (key == 'properties' && type == 'merge_node') {
            v = Node.createProperties(v);
          }

          if (key == 'properties' && type == 'set_mark') {
            v = Mark.createProperties(v);
          }

          if (key == 'properties' && type == 'set_node') {
            v = Node.createProperties(v);
          }

          if (key == 'properties' && type == 'set_selection') {
            var _v6 = v,
                anchorKey = _v6.anchorKey,
                focusKey = _v6.focusKey,
                rest = objectWithoutProperties(_v6, ['anchorKey', 'focusKey']);

            v = Range.createProperties(rest);

            if (anchorKey !== undefined) {
              v.anchorPath = anchorKey === null ? null : value.document.getPath(anchorKey);
            }

            if (focusKey !== undefined) {
              v.focusPath = focusKey === null ? null : value.document.getPath(focusKey);
            }
          }

          if (key == 'properties' && type == 'set_value') {
            v = Value.createProperties(v);
          }

          if (key == 'properties' && type == 'split_node') {
            v = Node.createProperties(v);
          }

          attrs[key] = v;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var node = new Operation(attrs);
      return node;
    }

    /**
     * Alias `fromJS`.
     */

  }, {
    key: 'isOperation',


    /**
     * Check if `any` is a `Operation`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isOperation(any) {
      return !!(any && any[MODEL_TYPES.OPERATION]);
    }

    /**
     * Check if `any` is a list of operations.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isOperationList',
    value: function isOperationList(any) {
      return immutable.List.isList(any) && any.every(function (item) {
        return Operation.isOperation(item);
      });
    }
  }]);
  return Operation;
}(immutable.Record(DEFAULTS$12));

/**
 * Attach a pseudo-symbol for type checking.
 */

Operation.fromJS = Operation.fromJSON;
Operation.prototype[MODEL_TYPES.OPERATION] = true;

/**
 * Debug.
 *
 * @type {Function}
 */

var debug$4 = browser$2('slate:operation:invert');

/**
 * Invert an `op`.
 *
 * @param {Object} op
 * @return {Object}
 */

function invertOperation(op) {
  op = Operation.create(op);
  var _op = op,
      type = _op.type;

  debug$4(type, op);

  /**
   * Insert node.
   */

  if (type == 'insert_node') {
    var inverse = op.set('type', 'remove_node');
    return inverse;
  }

  /**
   * Remove node.
   */

  if (type == 'remove_node') {
    var _inverse = op.set('type', 'insert_node');
    return _inverse;
  }

  /**
   * Move node.
   */

  if (type == 'move_node') {
    var _op2 = op,
        newPath = _op2.newPath,
        path = _op2.path;

    var inversePath = newPath;
    var inverseNewPath = path;

    var pathLast = path.length - 1;
    var newPathLast = newPath.length - 1;

    // If the node's old position was a left sibling of an ancestor of
    // its new position, we need to adjust part of the path by -1.
    if (path.length < inversePath.length && path.slice(0, pathLast).every(function (e, i) {
      return e == inversePath[i];
    }) && path[pathLast] < inversePath[pathLast]) {
      inversePath = inversePath.slice(0, pathLast).concat([inversePath[pathLast] - 1]).concat(inversePath.slice(pathLast + 1, inversePath.length));
    }

    // If the node's new position is an ancestor of the old position,
    // or a left sibling of an ancestor of its old position, we need
    // to adjust part of the path by 1.
    if (newPath.length < inverseNewPath.length && newPath.slice(0, newPathLast).every(function (e, i) {
      return e == inverseNewPath[i];
    }) && newPath[newPathLast] <= inverseNewPath[newPathLast]) {
      inverseNewPath = inverseNewPath.slice(0, newPathLast).concat([inverseNewPath[newPathLast] + 1]).concat(inverseNewPath.slice(newPathLast + 1, inverseNewPath.length));
    }

    var _inverse2 = op.set('path', inversePath).set('newPath', inverseNewPath);
    return _inverse2;
  }

  /**
   * Merge node.
   */

  if (type == 'merge_node') {
    var _op3 = op,
        _path = _op3.path;
    var length = _path.length;

    var last = length - 1;
    var _inversePath = _path.slice(0, last).concat([_path[last] - 1]);
    var _inverse3 = op.set('type', 'split_node').set('path', _inversePath);
    return _inverse3;
  }

  /**
   * Split node.
   */

  if (type == 'split_node') {
    var _op4 = op,
        _path2 = _op4.path;
    var _length = _path2.length;

    var _last = _length - 1;
    var _inversePath2 = _path2.slice(0, _last).concat([_path2[_last] + 1]);
    var _inverse4 = op.set('type', 'merge_node').set('path', _inversePath2);
    return _inverse4;
  }

  /**
   * Set node.
   */

  if (type == 'set_node') {
    var _op5 = op,
        properties = _op5.properties,
        node = _op5.node;

    var inverseNode = node.merge(properties);
    var inverseProperties = pick_1(node, Object.keys(properties));
    var _inverse5 = op.set('node', inverseNode).set('properties', inverseProperties);
    return _inverse5;
  }

  /**
   * Insert text.
   */

  if (type == 'insert_text') {
    var _inverse6 = op.set('type', 'remove_text');
    return _inverse6;
  }

  /**
   * Remove text.
   */

  if (type == 'remove_text') {
    var _inverse7 = op.set('type', 'insert_text');
    return _inverse7;
  }

  /**
   * Add mark.
   */

  if (type == 'add_mark') {
    var _inverse8 = op.set('type', 'remove_mark');
    return _inverse8;
  }

  /**
   * Remove mark.
   */

  if (type == 'remove_mark') {
    var _inverse9 = op.set('type', 'add_mark');
    return _inverse9;
  }

  /**
   * Set mark.
   */

  if (type == 'set_mark') {
    var _op6 = op,
        _properties = _op6.properties,
        mark = _op6.mark;

    var inverseMark = mark.merge(_properties);
    var _inverseProperties = pick_1(mark, Object.keys(_properties));
    var _inverse10 = op.set('mark', inverseMark).set('properties', _inverseProperties);
    return _inverse10;
  }

  /**
   * Set selection.
   */

  if (type == 'set_selection') {
    var _op7 = op,
        _properties2 = _op7.properties,
        selection = _op7.selection,
        value = _op7.value;
    var anchorPath = _properties2.anchorPath,
        focusPath = _properties2.focusPath,
        props = objectWithoutProperties(_properties2, ['anchorPath', 'focusPath']);
    var document = value.document;


    if (anchorPath !== undefined) {
      props.anchorKey = anchorPath === null ? null : document.assertPath(anchorPath).key;
    }

    if (focusPath !== undefined) {
      props.focusKey = focusPath === null ? null : document.assertPath(focusPath).key;
    }

    var inverseSelection = selection.merge(props);
    var inverseProps = pick_1(selection, Object.keys(props));

    if (anchorPath !== undefined) {
      inverseProps.anchorPath = inverseProps.anchorKey === null ? null : document.getPath(inverseProps.anchorKey);

      delete inverseProps.anchorKey;
    }

    if (focusPath !== undefined) {
      inverseProps.focusPath = inverseProps.focusKey === null ? null : document.getPath(inverseProps.focusKey);

      delete inverseProps.focusKey;
    }

    var _inverse11 = op.set('selection', inverseSelection).set('properties', inverseProps);
    return _inverse11;
  }

  /**
   * Set value.
   */

  if (type == 'set_value') {
    var _op8 = op,
        _properties3 = _op8.properties,
        _value = _op8.value;

    var inverseValue = _value.merge(_properties3);
    var _inverseProperties2 = pick_1(_value, Object.keys(_properties3));
    var _inverse12 = op.set('value', inverseValue).set('properties', _inverseProperties2);
    return _inverse12;
  }
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var _arrayEach = arrayEach;

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && _copyObject(source, keys_1(source), object);
}

var _baseAssign = baseAssign;

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && _copyObject(source, keysIn_1(source), object);
}

var _baseAssignIn = baseAssignIn;

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return _copyObject(source, _getSymbols(source), object);
}

var _copySymbols = copySymbols;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols$1 ? stubArray_1 : function(object) {
  var result = [];
  while (object) {
    _arrayPush(result, _getSymbols(object));
    object = _getPrototype(object);
  }
  return result;
};

var _getSymbolsIn = getSymbolsIn;

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return _copyObject(source, _getSymbolsIn(source), object);
}

var _copySymbolsIn = copySymbolsIn;

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
}

var _getAllKeysIn = getAllKeysIn;

/** Used for built-in method references. */
var objectProto$15 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$12 = objectProto$15.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty$12.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

var _initCloneArray = initCloneArray;

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

var _cloneDataView = cloneDataView;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

var _addMapEntry = addMapEntry;

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

var _arrayReduce = arrayReduce;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(_mapToArray(map), CLONE_DEEP_FLAG) : _mapToArray(map);
  return _arrayReduce(array, _addMapEntry, new map.constructor);
}

var _cloneMap = cloneMap;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

var _cloneRegExp = cloneRegExp;

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

var _addSetEntry = addSetEntry;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$1 = 1;

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(_setToArray(set), CLONE_DEEP_FLAG$1) : _setToArray(set);
  return _arrayReduce(array, _addSetEntry, new set.constructor);
}

var _cloneSet = cloneSet;

/** Used to convert symbols to primitives and strings. */
var symbolProto$2 = _Symbol ? _Symbol.prototype : undefined;
var symbolValueOf$1 = symbolProto$2 ? symbolProto$2.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
}

var _cloneSymbol = cloneSymbol;

/** `Object#toString` result references. */
var boolTag$2 = '[object Boolean]';
var dateTag$2 = '[object Date]';
var mapTag$3 = '[object Map]';
var numberTag$2 = '[object Number]';
var regexpTag$2 = '[object RegExp]';
var setTag$3 = '[object Set]';
var stringTag$2 = '[object String]';
var symbolTag$2 = '[object Symbol]';

var arrayBufferTag$2 = '[object ArrayBuffer]';
var dataViewTag$3 = '[object DataView]';
var float32Tag$1 = '[object Float32Array]';
var float64Tag$1 = '[object Float64Array]';
var int8Tag$1 = '[object Int8Array]';
var int16Tag$1 = '[object Int16Array]';
var int32Tag$1 = '[object Int32Array]';
var uint8Tag$1 = '[object Uint8Array]';
var uint8ClampedTag$1 = '[object Uint8ClampedArray]';
var uint16Tag$1 = '[object Uint16Array]';
var uint32Tag$1 = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$2:
      return _cloneArrayBuffer(object);

    case boolTag$2:
    case dateTag$2:
      return new Ctor(+object);

    case dataViewTag$3:
      return _cloneDataView(object, isDeep);

    case float32Tag$1: case float64Tag$1:
    case int8Tag$1: case int16Tag$1: case int32Tag$1:
    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
      return _cloneTypedArray(object, isDeep);

    case mapTag$3:
      return _cloneMap(object, isDeep, cloneFunc);

    case numberTag$2:
    case stringTag$2:
      return new Ctor(object);

    case regexpTag$2:
      return _cloneRegExp(object);

    case setTag$3:
      return _cloneSet(object, isDeep, cloneFunc);

    case symbolTag$2:
      return _cloneSymbol(object);
  }
}

var _initCloneByTag = initCloneByTag;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$2 = 1;
var CLONE_FLAT_FLAG = 2;
var CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag$3 = '[object Arguments]';
var arrayTag$2 = '[object Array]';
var boolTag$3 = '[object Boolean]';
var dateTag$3 = '[object Date]';
var errorTag$2 = '[object Error]';
var funcTag$2 = '[object Function]';
var genTag$1 = '[object GeneratorFunction]';
var mapTag$4 = '[object Map]';
var numberTag$3 = '[object Number]';
var objectTag$4 = '[object Object]';
var regexpTag$3 = '[object RegExp]';
var setTag$4 = '[object Set]';
var stringTag$3 = '[object String]';
var symbolTag$3 = '[object Symbol]';
var weakMapTag$2 = '[object WeakMap]';

var arrayBufferTag$3 = '[object ArrayBuffer]';
var dataViewTag$4 = '[object DataView]';
var float32Tag$2 = '[object Float32Array]';
var float64Tag$2 = '[object Float64Array]';
var int8Tag$2 = '[object Int8Array]';
var int16Tag$2 = '[object Int16Array]';
var int32Tag$2 = '[object Int32Array]';
var uint8Tag$2 = '[object Uint8Array]';
var uint8ClampedTag$2 = '[object Uint8ClampedArray]';
var uint16Tag$2 = '[object Uint16Array]';
var uint32Tag$2 = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag$3] = cloneableTags[arrayTag$2] =
cloneableTags[arrayBufferTag$3] = cloneableTags[dataViewTag$4] =
cloneableTags[boolTag$3] = cloneableTags[dateTag$3] =
cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] =
cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] =
cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] =
cloneableTags[numberTag$3] = cloneableTags[objectTag$4] =
cloneableTags[regexpTag$3] = cloneableTags[setTag$4] =
cloneableTags[stringTag$3] = cloneableTags[symbolTag$3] =
cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] =
cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
cloneableTags[errorTag$2] = cloneableTags[funcTag$2] =
cloneableTags[weakMapTag$2] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG$2,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject_1(value)) {
    return value;
  }
  var isArr = isArray_1(value);
  if (isArr) {
    result = _initCloneArray(value);
    if (!isDeep) {
      return _copyArray(value, result);
    }
  } else {
    var tag = _getTag(value),
        isFunc = tag == funcTag$2 || tag == genTag$1;

    if (isBuffer_1(value)) {
      return _cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$4 || tag == argsTag$3 || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : _initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? _copySymbolsIn(value, _baseAssignIn(result, value))
          : _copySymbols(value, _baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = _initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new _Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  var keysFunc = isFull
    ? (isFlat ? _getAllKeysIn : _getAllKeys)
    : (isFlat ? keysIn : keys_1);

  var props = isArr ? undefined : keysFunc(value);
  _arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    _assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

var _baseClone = baseClone;

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

var last_1 = last;

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

var _baseSlice = baseSlice;

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : _baseGet(object, _baseSlice(path, 0, -1));
}

var _parent = parent;

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = _castPath(path, object);
  object = _parent(object, path);
  return object == null || delete object[_toKey(last_1(path))];
}

var _baseUnset = baseUnset;

/**
 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
 * objects.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} key The key of the property to inspect.
 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
 */
function customOmitClone(value) {
  return isPlainObject_1(value) ? undefined : value;
}

var _customOmitClone = customOmitClone;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$3 = 1;
var CLONE_FLAT_FLAG$1 = 2;
var CLONE_SYMBOLS_FLAG$1 = 4;

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = _flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = _arrayMap(paths, function(path) {
    path = _castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  _copyObject(object, _getAllKeysIn(object), result);
  if (isDeep) {
    result = _baseClone(result, CLONE_DEEP_FLAG$3 | CLONE_FLAT_FLAG$1 | CLONE_SYMBOLS_FLAG$1, _customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    _baseUnset(result, paths[length]);
  }
  return result;
});

var omit_1 = omit;

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes$3 = {};

/**
 * Redo to the next value in the history.
 *
 * @param {Change} change
 */

Changes$3.redo = function (change) {
  var value = change.value;
  var _value = value,
      history = _value.history;

  if (!history) return;

  var _history = history,
      undos = _history.undos,
      redos = _history.redos;

  var next = redos.peek();
  if (!next) return;

  // Shift the next value into the undo stack.
  redos = redos.pop();
  undos = undos.push(next);

  // Replay the next operations.
  next.forEach(function (op) {
    var _op = op,
        type = _op.type,
        properties = _op.properties;

    // When the operation mutates the selection, omit its `isFocused` value to
    // prevent the editor focus from changing during redoing.

    if (type == 'set_selection') {
      op = op.set('properties', omit_1(properties, 'isFocused'));
    }

    change.applyOperation(op, { save: false });
  });

  // Update the history.
  value = change.value;
  history = history.set('undos', undos).set('redos', redos);
  value = value.set('history', history);
  change.value = value;
};

/**
 * Undo the previous operations in the history.
 *
 * @param {Change} change
 */

Changes$3.undo = function (change) {
  var value = change.value;
  var _value2 = value,
      history = _value2.history;

  if (!history) return;

  var _history2 = history,
      undos = _history2.undos,
      redos = _history2.redos;

  var previous = undos.peek();
  if (!previous) return;

  // Shift the previous operations into the redo stack.
  undos = undos.pop();
  redos = redos.push(previous);

  // Replay the inverse of the previous operations.
  previous.slice().reverse().map(invertOperation).forEach(function (inverse) {
    var _inverse = inverse,
        type = _inverse.type,
        properties = _inverse.properties;

    // When the operation mutates the selection, omit its `isFocused` value to
    // prevent the editor focus from changing during undoing.

    if (type == 'set_selection') {
      inverse = inverse.set('properties', omit_1(properties, 'isFocused'));
    }

    change.applyOperation(inverse, { save: false });
  });

  // Update the history.
  value = change.value;
  history = history.set('undos', undos).set('redos', redos);
  value = value.set('history', history);
  change.value = value;
};

/**
 * Has own property.
 *
 * @type {Function}
 */

var has = Object.prototype.hasOwnProperty;

/**
 * To string.
 *
 * @type {Function}
 */

var toString$2 = Object.prototype.toString;

/**
 * Test whether a value is "empty".
 *
 * @param {Mixed} val
 * @return {Boolean}
 */

function isEmpty(val) {
  // Null and Undefined...
  if (val == null) return true

  // Booleans...
  if ('boolean' == typeof val) return false

  // Numbers...
  if ('number' == typeof val) return val === 0

  // Strings...
  if ('string' == typeof val) return val.length === 0

  // Functions...
  if ('function' == typeof val) return val.length === 0

  // Arrays...
  if (Array.isArray(val)) return val.length === 0

  // Errors...
  if (val instanceof Error) return val.message === ''

  // Objects...
  if (val.toString == toString$2) {
    switch (val.toString()) {

      // Maps, Sets, Files and Errors...
      case '[object File]':
      case '[object Map]':
      case '[object Set]': {
        return val.size === 0
      }

      // Plain objects...
      case '[object Object]': {
        for (var key in val) {
          if (has.call(val, key)) return false
        }

        return true
      }
    }
  }

  // Anything else...
  return false
}

/**
 * Export `isEmpty`.
 *
 * @type {Function}
 */

var lib = isEmpty;

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes$4 = {};

/**
 * Set `properties` on the selection.
 *
 * @param {Change} change
 * @param {Object} properties
 */

Changes$4.select = function (change, properties) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  properties = Range.createProperties(properties);

  var _options$snapshot = options.snapshot,
      snapshot = _options$snapshot === undefined ? false : _options$snapshot;
  var value = change.value;
  var document = value.document,
      selection = value.selection;

  var props = {};
  var sel = selection.toJSON();
  var next = selection.merge(properties).normalize(document);
  properties = pick_1(next, Object.keys(properties));

  // Remove any properties that are already equal to the current selection. And
  // create a dictionary of the previous values for all of the properties that
  // are being changed, for the inverse operation.
  for (var k in properties) {
    if (snapshot == false && properties[k] == sel[k]) continue;
    props[k] = properties[k];
  }

  // If the selection moves, clear any marks, unless the new selection
  // properties change the marks in some way.
  var moved = ['anchorKey', 'anchorOffset', 'focusKey', 'focusOffset'].some(function (p) {
    return props.hasOwnProperty(p);
  });

  if (sel.marks && properties.marks == sel.marks && moved) {
    props.marks = null;
  }

  // If there are no new properties to set, abort.
  if (lib(props)) {
    return;
  }

  // Apply the operation.
  change.applyOperation({
    type: 'set_selection',
    value: value,
    properties: props,
    selection: sel
  }, snapshot ? { skip: false, merge: false } : {});
};

/**
 * Select the whole document.
 *
 * @param {Change} change
 */

Changes$4.selectAll = function (change) {
  var value = change.value;
  var document = value.document,
      selection = value.selection;

  var next = selection.moveToRangeOf(document);
  change.select(next);
};

/**
 * Snapshot the current selection.
 *
 * @param {Change} change
 */

Changes$4.snapshotSelection = function (change) {
  var value = change.value;
  var selection = value.selection;

  change.select(selection, { snapshot: true });
};

/**
 * Move the anchor point backward, accounting for being at the start of a block.
 *
 * @param {Change} change
 */

Changes$4.moveAnchorCharBackward = function (change) {
  var value = change.value;
  var document = value.document,
      selection = value.selection,
      anchorText = value.anchorText,
      anchorBlock = value.anchorBlock;
  var anchorOffset = selection.anchorOffset;

  var previousText = document.getPreviousText(anchorText.key);
  var isInVoid = document.hasVoidParent(anchorText.key);
  var isPreviousInVoid = previousText && document.hasVoidParent(previousText.key);

  if (!isInVoid && anchorOffset > 0) {
    change.moveAnchor(-1);
    return;
  }

  if (!previousText) {
    return;
  }

  change.moveAnchorToEndOf(previousText);

  if (!isInVoid && !isPreviousInVoid && anchorBlock.hasNode(previousText.key)) {
    change.moveAnchor(-1);
  }
};

/**
 * Move the anchor point forward, accounting for being at the end of a block.
 *
 * @param {Change} change
 */

Changes$4.moveAnchorCharForward = function (change) {
  var value = change.value;
  var document = value.document,
      selection = value.selection,
      anchorText = value.anchorText,
      anchorBlock = value.anchorBlock;
  var anchorOffset = selection.anchorOffset;

  var nextText = document.getNextText(anchorText.key);
  var isInVoid = document.hasVoidParent(anchorText.key);
  var isNextInVoid = nextText && document.hasVoidParent(nextText.key);

  if (!isInVoid && anchorOffset < anchorText.text.length) {
    change.moveAnchor(1);
    return;
  }

  if (!nextText) {
    return;
  }

  change.moveAnchorToStartOf(nextText);

  if (!isInVoid && !isNextInVoid && anchorBlock.hasNode(nextText.key)) {
    change.moveAnchor(1);
  }
};

/**
 * Move the focus point backward, accounting for being at the start of a block.
 *
 * @param {Change} change
 */

Changes$4.moveFocusCharBackward = function (change) {
  var value = change.value;
  var document = value.document,
      selection = value.selection,
      focusText = value.focusText,
      focusBlock = value.focusBlock;
  var focusOffset = selection.focusOffset;

  var previousText = document.getPreviousText(focusText.key);
  var isInVoid = document.hasVoidParent(focusText.key);
  var isPreviousInVoid = previousText && document.hasVoidParent(previousText.key);

  if (!isInVoid && focusOffset > 0) {
    change.moveFocus(-1);
    return;
  }

  if (!previousText) {
    return;
  }

  change.moveFocusToEndOf(previousText);

  if (!isInVoid && !isPreviousInVoid && focusBlock.hasNode(previousText.key)) {
    change.moveFocus(-1);
  }
};

/**
 * Move the focus point forward, accounting for being at the end of a block.
 *
 * @param {Change} change
 */

Changes$4.moveFocusCharForward = function (change) {
  var value = change.value;
  var document = value.document,
      selection = value.selection,
      focusText = value.focusText,
      focusBlock = value.focusBlock;
  var focusOffset = selection.focusOffset;

  var nextText = document.getNextText(focusText.key);
  var isInVoid = document.hasVoidParent(focusText.key);
  var isNextInVoid = nextText && document.hasVoidParent(nextText.key);

  if (!isInVoid && focusOffset < focusText.text.length) {
    change.moveFocus(1);
    return;
  }

  if (!nextText) {
    return;
  }

  change.moveFocusToStartOf(nextText);

  if (!isInVoid && !isNextInVoid && focusBlock.hasNode(nextText.key)) {
    change.moveFocus(1);
  }
};

/**
 * Mix in move methods.
 */

var MOVE_DIRECTIONS = ['Forward', 'Backward'];

MOVE_DIRECTIONS.forEach(function (direction) {
  var anchor = 'moveAnchorChar' + direction;
  var focus = 'moveFocusChar' + direction;

  Changes$4['moveChar' + direction] = function (change) {
    change[anchor]()[focus]();
  };

  Changes$4['moveStartChar' + direction] = function (change) {
    if (change.value.isBackward) {
      change[focus]();
    } else {
      change[anchor]();
    }
  };

  Changes$4['moveEndChar' + direction] = function (change) {
    if (change.value.isBackward) {
      change[anchor]();
    } else {
      change[focus]();
    }
  };

  Changes$4['extendChar' + direction] = function (change) {
    change['moveFocusChar' + direction]();
  };

  Changes$4['collapseChar' + direction] = function (change) {
    var collapse = direction == 'Forward' ? 'collapseToEnd' : 'collapseToStart';
    change[collapse]()['moveChar' + direction]();
  };
});

/**
 * Mix in alias methods.
 */

var ALIAS_METHODS$1 = [['collapseLineBackward', 'collapseToStartOfBlock'], ['collapseLineForward', 'collapseToEndOfBlock'], ['extendLineBackward', 'extendToStartOfBlock'], ['extendLineForward', 'extendToEndOfBlock']];

ALIAS_METHODS$1.forEach(function (_ref) {
  var _ref2 = slicedToArray(_ref, 2),
      alias = _ref2[0],
      method = _ref2[1];

  Changes$4[alias] = function (change) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    change[method].apply(change, [change].concat(args));
  };
});

/**
 * Mix in selection changes that are just a proxy for the selection method.
 */

var PROXY_TRANSFORMS$1 = ['blur', 'collapseTo', 'collapseToAnchor', 'collapseToEnd', 'collapseToEndOf', 'collapseToFocus', 'collapseToStart', 'collapseToStartOf', 'extend', 'extendTo', 'extendToEndOf', 'extendToStartOf', 'flip', 'focus', 'move', 'moveAnchor', 'moveAnchorOffsetTo', 'moveAnchorTo', 'moveAnchorToEndOf', 'moveAnchorToStartOf', 'moveEnd', 'moveEndOffsetTo', 'moveEndTo', 'moveFocus', 'moveFocusOffsetTo', 'moveFocusTo', 'moveFocusToEndOf', 'moveFocusToStartOf', 'moveOffsetsTo', 'moveStart', 'moveStartOffsetTo', 'moveStartTo', 'moveTo', 'moveToEnd', 'moveToEndOf', 'moveToRangeOf', 'moveToStart', 'moveToStartOf', 'deselect'];

PROXY_TRANSFORMS$1.forEach(function (method) {
  Changes$4[method] = function (change) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var normalize = method != 'deselect';
    var value = change.value;
    var document = value.document,
        selection = value.selection;

    var next = selection[method].apply(selection, args);
    if (normalize) next = next.normalize(document);
    change.select(next);
  };
});

/**
 * Mix in node-related changes.
 */

var PREFIXES = ['moveTo', 'moveAnchorTo', 'moveFocusTo', 'moveStartTo', 'moveEndTo', 'collapseTo', 'extendTo'];

var DIRECTIONS = ['Next', 'Previous'];

var OBJECTS = ['Block', 'Inline', 'Text'];

PREFIXES.forEach(function (prefix) {
  var edges = ['Start', 'End'];

  if (prefix == 'moveTo') {
    edges.push('Range');
  }

  edges.forEach(function (edge) {
    var method = '' + prefix + edge + 'Of';

    OBJECTS.forEach(function (object) {
      var getNode = object == 'Text' ? 'getNode' : 'getClosest' + object;

      Changes$4['' + method + object] = function (change) {
        var value = change.value;
        var document = value.document,
            selection = value.selection;

        var node = document[getNode](selection.startKey);
        if (!node) return;
        change[method](node);
      };

      DIRECTIONS.forEach(function (direction) {
        var getDirectionNode = 'get' + direction + object;
        var directionKey = direction == 'Next' ? 'startKey' : 'endKey';

        Changes$4['' + method + direction + object] = function (change) {
          var value = change.value;
          var document = value.document,
              selection = value.selection;

          var node = document[getNode](selection[directionKey]);
          if (!node) return;
          var target = document[getDirectionNode](node.key);
          if (!target) return;
          change[method](target);
        };
      });
    });
  });
});

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes$5 = {};

/**
 * Set `properties` on the value.
 *
 * @param {Change} change
 * @param {Object|Value} properties
 * @param {Object} options
 */

Changes$5.setValue = function (change, properties) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  properties = Value.createProperties(properties);
  var value = change.value;


  change.applyOperation({
    type: 'set_value',
    properties: properties,
    value: value
  }, options);
};

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes$6 = {};

/**
 * Normalize the value with its schema.
 *
 * @param {Change} change
 */

Changes$6.normalize = function (change) {
  change.normalizeDocument();
};

/**
 * Normalize the document with the value's schema.
 *
 * @param {Change} change
 */

Changes$6.normalizeDocument = function (change) {
  var value = change.value;
  var document = value.document;

  change.normalizeNodeByKey(document.key);
};

/**
 * Normalize a `node` and its children with the value's schema.
 *
 * @param {Change} change
 * @param {Node|String} key
 */

Changes$6.normalizeNodeByKey = function (change, key) {
  var value = change.value;
  var document = value.document,
      schema = value.schema;

  var node = document.assertNode(key);

  normalizeNodeAndChildren(change, node, schema);

  document = change.value.document;
  var ancestors = document.getAncestors(key);
  if (!ancestors) return;

  ancestors.forEach(function (ancestor) {
    if (change.value.document.getDescendant(ancestor.key)) {
      normalizeNode(change, ancestor, schema);
    }
  });
};

/**
 * Normalize a `node` and its children with a `schema`.
 *
 * @param {Change} change
 * @param {Node} node
 * @param {Schema} schema
 */

function normalizeNodeAndChildren(change, node, schema) {
  if (node.object == 'text') {
    normalizeNode(change, node, schema);
    return;
  }

  var child = node.getFirstInvalidDescendant(schema);
  var path = change.value.document.getPath(node.key);

  while (node && child) {
    normalizeNodeAndChildren(change, child, schema);
    node = change.value.document.refindNode(path, node.key);

    if (!node) {
      path = [];
      child = null;
    } else {
      path = change.value.document.refindPath(path, node.key);
      child = node.getFirstInvalidDescendant(schema);
    }
  }

  // Normalize the node itself if it still exists.
  if (node) {
    normalizeNode(change, node, schema);
  }
}

/**
 * Normalize a `node` with a `schema`, but not its children.
 *
 * @param {Change} change
 * @param {Node} node
 * @param {Schema} schema
 */

function normalizeNode(change, node, schema) {
  var max = schema.stack.plugins.length + 1;
  var iterations = 0;

  function iterate(c, n) {
    var normalize = n.validate(schema);
    if (!normalize) return;

    // Run the `normalize` function to fix the node.
    var path = c.value.document.getPath(n.key);
    normalize(c);

    // Re-find the node reference, in case it was updated. If the node no longer
    // exists, we're done for this branch.
    n = c.value.document.refindNode(path, n.key);
    if (!n) return;

    path = c.value.document.refindPath(path, n.key);

    // Increment the iterations counter, and check to make sure that we haven't
    // exceeded the max. Without this check, it's easy for the `validate` or
    // `normalize` function of a schema rule to be written incorrectly and for
    // an infinite invalid loop to occur.
    iterations++;

    if (iterations > max) {
      throw new Error('A schema rule could not be validated after sufficient iterations. This is usually due to a `rule.validate` or `rule.normalize` function of a schema being incorrectly written, causing an infinite loop.');
    }

    // Otherwise, iterate again.
    iterate(c, n);
  }

  iterate(change, node);
}

/**
 * Export.
 *
 * @type {Object}
 */

var Changes$7 = _extends({}, Changes, Changes$1, Changes$2, Changes$3, Changes$4, Changes$5, Changes$6);

/**
 * Debug.
 *
 * @type {Function}
 */

var debug$5 = browser$2('slate:operation:apply');

/**
 * Apply adjustments to affected ranges (selections, decorations);
 * accepts (value, checking function(range) -> bool, applying function(range) -> range)
 * returns value with affected ranges updated
 *
 * @param {Value} value
 * @param {Function} checkAffected
 * @param {Function} adjustRange
 * @return {Value}
 */

function applyRangeAdjustments(value, checkAffected, adjustRange) {
  // check selection, apply adjustment if affected
  if (value.selection && checkAffected(value.selection)) {
    value = value.set('selection', adjustRange(value.selection));
  }

  if (!value.decorations) return value;

  // check all ranges, apply adjustment if affected
  var decorations = value.decorations.map(function (decoration) {
    return checkAffected(decoration) ? adjustRange(decoration) : decoration;
  }).filter(function (decoration) {
    return decoration.anchorKey !== null;
  });
  return value.set('decorations', decorations);
}

/**
 * clear any atomic ranges (in decorations) if they contain the point (key, offset, offset-end?)
 * specified
 *
 * @param {Value} value
 * @param {String} key
 * @param {Number} offset
 * @param {Number?} offsetEnd
 * @return {Value}
 */

function clearAtomicRangesIfContains(value, key, offset) {
  var offsetEnd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  return applyRangeAdjustments(value, function (range) {
    if (!range.isAtomic) return false;
    var startKey = range.startKey,
        startOffset = range.startOffset,
        endKey = range.endKey,
        endOffset = range.endOffset;

    return startKey == key && startOffset < offset && (endKey != key || endOffset > offset) || offsetEnd && startKey == key && startOffset < offsetEnd && (endKey != key || endOffset > offsetEnd);
  }, function (range) {
    return range.deselect();
  });
}

/**
 * Applying functions.
 *
 * @type {Object}
 */

var APPLIERS = {
  /**
   * Add mark to text at `offset` and `length` in node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  add_mark: function add_mark(value, operation) {
    var path = operation.path,
        offset = operation.offset,
        length = operation.length,
        mark = operation.mark;
    var _value = value,
        document = _value.document;

    var node = document.assertPath(path);
    node = node.addMark(offset, length, mark);
    document = document.updateNode(node);
    value = value.set('document', document);
    return value;
  },


  /**
   * Insert a `node` at `index` in a node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  insert_node: function insert_node(value, operation) {
    var path = operation.path,
        node = operation.node;

    var index = path[path.length - 1];
    var rest = path.slice(0, -1);
    var _value2 = value,
        document = _value2.document;

    var parent = document.assertPath(rest);
    parent = parent.insertNode(index, node);
    document = document.updateNode(parent);
    value = value.set('document', document);
    return value;
  },


  /**
   * Insert `text` at `offset` in node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  insert_text: function insert_text(value, operation) {
    var path = operation.path,
        offset = operation.offset,
        text = operation.text,
        marks = operation.marks;
    var _value3 = value,
        document = _value3.document;

    var node = document.assertPath(path);

    // Update the document
    node = node.insertText(offset, text, marks);
    document = document.updateNode(node);

    value = value.set('document', document);

    // if insert happens within atomic ranges, clear
    value = clearAtomicRangesIfContains(value, node.key, offset);

    // Update the selection, decorations
    value = applyRangeAdjustments(value, function (_ref) {
      var anchorKey = _ref.anchorKey,
          anchorOffset = _ref.anchorOffset,
          isBackward = _ref.isBackward,
          isAtomic = _ref.isAtomic;
      return anchorKey == node.key && (anchorOffset > offset || anchorOffset == offset && (!isAtomic || !isBackward));
    }, function (range) {
      return range.moveAnchor(text.length);
    });

    value = applyRangeAdjustments(value, function (_ref2) {
      var focusKey = _ref2.focusKey,
          focusOffset = _ref2.focusOffset,
          isBackward = _ref2.isBackward,
          isAtomic = _ref2.isAtomic;
      return focusKey == node.key && (focusOffset > offset || focusOffset == offset && (!isAtomic || isBackward));
    }, function (range) {
      return range.moveFocus(text.length);
    });

    return value;
  },


  /**
   * Merge a node at `path` with the previous node.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  merge_node: function merge_node(value, operation) {
    var path = operation.path;

    var withPath = path.slice(0, path.length - 1).concat([path[path.length - 1] - 1]);
    var _value4 = value,
        document = _value4.document;

    var one = document.assertPath(withPath);
    var two = document.assertPath(path);
    var parent = document.getParent(one.key);
    var oneIndex = parent.nodes.indexOf(one);
    var twoIndex = parent.nodes.indexOf(two);

    // Perform the merge in the document.
    parent = parent.mergeNode(oneIndex, twoIndex);
    document = document.updateNode(parent);
    value = value.set('document', document);

    if (one.object == 'text') {
      value = applyRangeAdjustments(value,
      // If the nodes are text nodes and the range is inside the second node:
      function (_ref3) {
        var anchorKey = _ref3.anchorKey,
            focusKey = _ref3.focusKey;
        return anchorKey == two.key || focusKey == two.key;
      },
      // update it to refer to the first node instead:
      function (range) {
        if (range.anchorKey == two.key) range = range.moveAnchorTo(one.key, one.text.length + range.anchorOffset);
        if (range.focusKey == two.key) range = range.moveFocusTo(one.key, one.text.length + range.focusOffset);
        return range.normalize(document);
      });
    }

    return value;
  },


  /**
   * Move a node by `path` to `newPath`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  move_node: function move_node(value, operation) {
    var path = operation.path,
        newPath = operation.newPath;

    var newIndex = newPath[newPath.length - 1];
    var newParentPath = newPath.slice(0, -1);
    var oldParentPath = path.slice(0, -1);
    var oldIndex = path[path.length - 1];
    var _value5 = value,
        document = _value5.document;

    var node = document.assertPath(path);

    // Remove the node from its current parent.
    var parent = document.getParent(node.key);
    parent = parent.removeNode(oldIndex);
    document = document.updateNode(parent);

    // Find the new target...
    var target = void 0;

    // If the old path and the rest of the new path are the same, then the new
    // target is the old parent.
    if (oldParentPath.every(function (x, i) {
      return x === newParentPath[i];
    }) && oldParentPath.length === newParentPath.length) {
      target = parent;
    } else if (oldParentPath.every(function (x, i) {
      return x === newParentPath[i];
    }) && oldIndex < newParentPath[oldParentPath.length]) {
      // Otherwise, if the old path removal resulted in the new path being no longer
      // correct, we need to decrement the new path at the old path's last index.
      newParentPath[oldParentPath.length]--;
      target = document.assertPath(newParentPath);
    } else {
      // Otherwise, we can just grab the target normally...
      target = document.assertPath(newParentPath);
    }

    // Insert the new node to its new parent.
    target = target.insertNode(newIndex, node);
    document = document.updateNode(target);
    value = value.set('document', document);
    return value;
  },


  /**
   * Remove mark from text at `offset` and `length` in node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  remove_mark: function remove_mark(value, operation) {
    var path = operation.path,
        offset = operation.offset,
        length = operation.length,
        mark = operation.mark;
    var _value6 = value,
        document = _value6.document;

    var node = document.assertPath(path);
    node = node.removeMark(offset, length, mark);
    document = document.updateNode(node);
    value = value.set('document', document);
    return value;
  },


  /**
   * Remove a node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  remove_node: function remove_node(value, operation) {
    var path = operation.path;
    var _value7 = value,
        document = _value7.document,
        selection = _value7.selection;

    var node = document.assertPath(path);

    if (selection.isSet || value.decorations !== null) {
      var first = node.object == 'text' ? node : node.getFirstText() || node;
      var last = node.object == 'text' ? node : node.getLastText() || node;
      var prev = document.getPreviousText(first.key);
      var next = document.getNextText(last.key);

      value = applyRangeAdjustments(value,
      // If the start or end point was in this node
      function (_ref4) {
        var startKey = _ref4.startKey,
            endKey = _ref4.endKey;
        return node.hasNode(startKey) || node.hasNode(endKey);
      },
      // update it to be just before/after
      function (range) {
        var _range = range,
            startKey = _range.startKey,
            endKey = _range.endKey;


        if (node.hasNode(startKey)) {
          range = prev ? range.moveStartTo(prev.key, prev.text.length) : next ? range.moveStartTo(next.key, 0) : range.deselect();
        }

        if (node.hasNode(endKey)) {
          range = prev ? range.moveEndTo(prev.key, prev.text.length) : next ? range.moveEndTo(next.key, 0) : range.deselect();
        }

        // If the range wasn't deselected, normalize it.
        if (range.isSet) return range.normalize(document);
        return range;
      });
    }

    // Remove the node from the document.
    var parent = document.getParent(node.key);
    var index = parent.nodes.indexOf(node);
    parent = parent.removeNode(index);
    document = document.updateNode(parent);

    // Update the document and range.
    value = value.set('document', document);
    return value;
  },


  /**
   * Remove `text` at `offset` in node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  remove_text: function remove_text(value, operation) {
    var path = operation.path,
        offset = operation.offset,
        text = operation.text;
    var length = text.length;

    var rangeOffset = offset + length;
    var _value8 = value,
        document = _value8.document;


    var node = document.assertPath(path);

    // if insert happens within atomic ranges, clear
    value = clearAtomicRangesIfContains(value, node.key, offset, offset + length);

    value = applyRangeAdjustments(value,
    // if anchor of range is here
    function (_ref5) {
      var anchorKey = _ref5.anchorKey;
      return anchorKey == node.key;
    },
    // adjust if it is in or past the removal range
    function (range) {
      return range.anchorOffset >= rangeOffset ? range.moveAnchor(-length) : range.anchorOffset > offset ? range.moveAnchorTo(range.anchorKey, offset) : range;
    });

    value = applyRangeAdjustments(value,
    // if focus of range is here
    function (_ref6) {
      var focusKey = _ref6.focusKey;
      return focusKey == node.key;
    },
    // adjust if it is in or past the removal range
    function (range) {
      return range.focusOffset >= rangeOffset ? range.moveFocus(-length) : range.focusOffset > offset ? range.moveFocusTo(range.focusKey, offset) : range;
    });

    node = node.removeText(offset, length);
    document = document.updateNode(node);
    value = value.set('document', document);
    return value;
  },


  /**
   * Set `properties` on mark on text at `offset` and `length` in node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  set_mark: function set_mark(value, operation) {
    var path = operation.path,
        offset = operation.offset,
        length = operation.length,
        mark = operation.mark,
        properties = operation.properties;
    var _value9 = value,
        document = _value9.document;

    var node = document.assertPath(path);
    node = node.updateMark(offset, length, mark, properties);
    document = document.updateNode(node);
    value = value.set('document', document);
    return value;
  },


  /**
   * Set `properties` on a node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  set_node: function set_node(value, operation) {
    var path = operation.path,
        properties = operation.properties;
    var _value10 = value,
        document = _value10.document;

    var node = document.assertPath(path);
    node = node.merge(properties);
    document = document.updateNode(node);
    value = value.set('document', document);
    return value;
  },


  /**
   * Set `properties` on the selection.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  set_selection: function set_selection(value, operation) {
    var properties = operation.properties;
    var anchorPath = properties.anchorPath,
        focusPath = properties.focusPath,
        props = objectWithoutProperties(properties, ['anchorPath', 'focusPath']);
    var _value11 = value,
        document = _value11.document,
        selection = _value11.selection;


    if (anchorPath !== undefined) {
      props.anchorKey = anchorPath === null ? null : document.assertPath(anchorPath).key;
    }

    if (focusPath !== undefined) {
      props.focusKey = focusPath === null ? null : document.assertPath(focusPath).key;
    }

    selection = selection.merge(props);
    selection = selection.normalize(document);
    value = value.set('selection', selection);
    return value;
  },


  /**
   * Set `properties` on `value`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  set_value: function set_value(value, operation) {
    var properties = operation.properties;

    value = value.merge(properties);
    return value;
  },


  /**
   * Split a node by `path` at `offset`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  split_node: function split_node(value, operation) {
    var path = operation.path,
        position = operation.position,
        properties = operation.properties;
    var _value12 = value,
        document = _value12.document;

    // Calculate a few things...

    var node = document.assertPath(path);
    var parent = document.getParent(node.key);
    var index = parent.nodes.indexOf(node);

    // Split the node by its parent.
    parent = parent.splitNode(index, position);

    if (properties) {
      var splitNode = parent.nodes.get(index + 1);

      if (splitNode.object !== 'text') {
        parent = parent.updateNode(splitNode.merge(properties));
      }
    }

    document = document.updateNode(parent);
    var next = document.getNextText(node.key);

    value = applyRangeAdjustments(value,
    // check if range is affected
    function (_ref7) {
      var startKey = _ref7.startKey,
          startOffset = _ref7.startOffset,
          endKey = _ref7.endKey,
          endOffset = _ref7.endOffset;
      return node.key == startKey && position <= startOffset || node.key == endKey && position <= endOffset;
    },
    // update its start / end as needed
    function (range) {
      var _range2 = range,
          startKey = _range2.startKey,
          startOffset = _range2.startOffset,
          endKey = _range2.endKey,
          endOffset = _range2.endOffset;

      var normalize = false;

      if (node.key == startKey && position <= startOffset) {
        range = range.moveStartTo(next.key, startOffset - position);
        normalize = true;
      }

      if (node.key == endKey && position <= endOffset) {
        range = range.moveEndTo(next.key, endOffset - position);
        normalize = true;
      }

      // Normalize the selection if we changed it
      if (normalize) return range.normalize(document);
      return range;
    });

    // Return the updated value.
    value = value.set('document', document);
    return value;
  }
};

/**
 * Apply an `operation` to a `value`.
 *
 * @param {Value} value
 * @param {Object|Operation} operation
 * @return {Value} value
 */

function applyOperation(value, operation) {
  operation = Operation.create(operation);
  var _operation = operation,
      type = _operation.type;

  var apply = APPLIERS[type];

  if (!apply) {
    throw new Error('Unknown operation type: "' + type + '".');
  }

  debug$5(type, operation);
  value = apply(value, operation);
  return value;
}

/**
 * Debug.
 *
 * @type {Function}
 */

var debug$6 = browser$2('slate:change');

/**
 * Change.
 *
 * @type {Change}
 */

var Change = function () {

  /**
   * Create a new `Change` with `attrs`.
   *
   * @param {Object} attrs
   *   @property {Value} value
   */

  function Change(attrs) {
    classCallCheck(this, Change);
    var value = attrs.value;

    this.value = value;
    this.operations = new immutable.List();

    this.flags = _extends({
      normalize: true
    }, pick_1(attrs, ['merge', 'save', 'normalize']));
  }

  /**
   * Object.
   *
   * @return {String}
   */

  /**
   * Check if `any` is a `Change`.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  createClass(Change, [{
    key: 'applyOperation',


    /**
     * Apply an `operation` to the current value, saving the operation to the
     * history if needed.
     *
     * @param {Operation|Object} operation
     * @param {Object} options
     * @return {Change}
     */

    value: function applyOperation$$1(operation) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var operations = this.operations,
          flags = this.flags;
      var value = this.value;
      var _value = value,
          history = _value.history;

      // Add in the current `value` in case the operation was serialized.

      if (isPlainObject(operation)) {
        operation = _extends({}, operation, { value: value });
      }

      operation = Operation.create(operation);

      // Default options to the change-level flags, this allows for setting
      // specific options for all of the operations of a given change.
      options = _extends({}, flags, options);

      // Derive the default option values.
      var _options = options,
          _options$merge = _options.merge,
          merge = _options$merge === undefined ? operations.size == 0 ? null : true : _options$merge,
          _options$save = _options.save,
          save = _options$save === undefined ? true : _options$save,
          _options$skip = _options.skip,
          skip = _options$skip === undefined ? null : _options$skip;

      // Apply the operation to the value.

      debug$6('apply', { operation: operation, save: save, merge: merge });
      value = applyOperation(value, operation);

      // If needed, save the operation to the history.
      if (history && save) {
        history = history.save(operation, { merge: merge, skip: skip });
        value = value.set('history', history);
      }

      // Update the mutable change object.
      this.value = value;
      this.operations = operations.push(operation);
      return this;
    }

    /**
     * Apply a series of `operations` to the current value.
     *
     * @param {Array|List} operations
     * @param {Object} options
     * @return {Change}
     */

  }, {
    key: 'applyOperations',
    value: function applyOperations(operations, options) {
      var _this = this;

      operations.forEach(function (op) {
        return _this.applyOperation(op, options);
      });
      return this;
    }

    /**
     * Call a change `fn` with arguments.
     *
     * @param {Function} fn
     * @param {Mixed} ...args
     * @return {Change}
     */

  }, {
    key: 'call',
    value: function call(fn) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      fn.apply(undefined, [this].concat(args));
      return this;
    }

    /**
     * Applies a series of change mutations and defers normalization until the end.
     *
     * @param {Function} customChange - function that accepts a change object and executes change operations
     * @return {Change}
     */

  }, {
    key: 'withoutNormalization',
    value: function withoutNormalization(customChange) {
      var original = this.flags.normalize;
      this.setOperationFlag('normalize', false);

      try {
        customChange(this);
        // if the change function worked then run normalization
        this.normalizeDocument();
      } finally {
        // restore the flag to whatever it was
        this.setOperationFlag('normalize', original);
      }
      return this;
    }

    /**
     * Set an operation flag by `key` to `value`.
     *
     * @param {String} key
     * @param {Any} value
     * @return {Change}
     */

  }, {
    key: 'setOperationFlag',
    value: function setOperationFlag(key, value) {
      this.flags[key] = value;
      return this;
    }

    /**
     * Get the `value` of the specified flag by its `key`. Optionally accepts an `options`
     * object with override flags.
     *
     * @param {String} key
     * @param {Object} options
     * @return {Change}
     */

  }, {
    key: 'getFlag',
    value: function getFlag(key) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return options[key] !== undefined ? options[key] : this.flags[key];
    }

    /**
     * Unset an operation flag by `key`.
     *
     * @param {String} key
     * @return {Change}
     */

  }, {
    key: 'unsetOperationFlag',
    value: function unsetOperationFlag(key) {
      delete this.flags[key];
      return this;
    }
  }, {
    key: 'object',
    get: function get$$1() {
      return 'change';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      index.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }
  }]);
  return Change;
}();

/**
 * Attach a pseudo-symbol for type checking.
 */

Change.isChange = isType.bind(null, 'CHANGE');
Change.prototype[MODEL_TYPES.CHANGE] = true;

/**
 * Add a change method for each of the changes.
 */

Object.keys(Changes$7).forEach(function (type) {
  Change.prototype[type] = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    debug$6(type, { args: args });
    this.call.apply(this, [Changes$7[type]].concat(args));
    return this;
  };
});

/**
 * Export.
 *
 * @type {Object}
 */

var Operations = {
  apply: applyOperation,
  invert: invertOperation
};

var index$1 = {
  Block: Block,
  Changes: Changes$7,
  Character: Character,
  Data: Data,
  Document: Document,
  History: History,
  Inline: Inline,
  Leaf: Leaf,
  Mark: Mark,
  Node: Node,
  Operation: Operation,
  Operations: Operations,
  Range: Range,
  Schema: Schema,
  Stack: Stack$2,
  Text: Text,
  Value: Value,
  resetKeyGenerator: resetKeyGenerator,
  setKeyGenerator: setKeyGenerator,
  resetMemoization: resetMemoization,
  useMemoization: useMemoization
};

exports.Block = Block;
exports.Change = Change;
exports.Changes = Changes$7;
exports.Character = Character;
exports.Data = Data;
exports.Document = Document;
exports.History = History;
exports.Inline = Inline;
exports.Leaf = Leaf;
exports.Mark = Mark;
exports.Node = Node;
exports.Operation = Operation;
exports.Operations = Operations;
exports.Range = Range;
exports.Schema = Schema;
exports.Stack = Stack$2;
exports.Text = Text;
exports.Value = Value;
exports.resetKeyGenerator = resetKeyGenerator;
exports.setKeyGenerator = setKeyGenerator;
exports.resetMemoization = resetMemoization;
exports.useMemoization = useMemoization;
exports.default = index$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));