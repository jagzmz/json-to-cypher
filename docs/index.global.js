var JSON2Cypher = (function (exports) {
  'use strict';

  // node_modules/.pnpm/jsonpath-plus-browser@5.0.6/node_modules/jsonpath-plus-browser/dist/index-browser-esm.js
  function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof = function(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct2(Parent2, args2, Class2) {
        var a = [null];
        a.push.apply(a, args2);
        var Constructor = Function.bind.apply(Parent2, a);
        var instance = new Constructor();
        if (Class2) _setPrototypeOf(instance, Class2.prototype);
        return instance;
      };
    }
    return _construct.apply(null, arguments);
  }
  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
    _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
      if (Class2 === null || !_isNativeFunction(Class2)) return Class2;
      if (typeof Class2 !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class2)) return _cache.get(Class2);
        _cache.set(Class2, Wrapper);
      }
      function Wrapper() {
        return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
      }
      Wrapper.prototype = Object.create(Class2.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class2);
    };
    return _wrapNativeSuper(Class);
  }
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }
    return _assertThisInitialized(self);
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;
    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike) {
        if (it) o = it;
        var i = 0;
        var F = function() {
        };
        return {
          s: F,
          n: function() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function(e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return {
      s: function() {
        it = o[Symbol.iterator]();
      },
      n: function() {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function(e) {
        didErr = true;
        err = e;
      },
      f: function() {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }
  var hasOwnProp = Object.prototype.hasOwnProperty;
  function push(arr, item) {
    arr = arr.slice();
    arr.push(item);
    return arr;
  }
  function unshift(item, arr) {
    arr = arr.slice();
    arr.unshift(item);
    return arr;
  }
  var NewError = /* @__PURE__ */ function(_Error) {
    _inherits(NewError2, _Error);
    var _super = _createSuper(NewError2);
    function NewError2(value) {
      var _this;
      _classCallCheck(this, NewError2);
      _this = _super.call(this, 'JSONPath should not be called with "new" (it prevents return of (unwrapped) scalar values)');
      _this.avoidNew = true;
      _this.value = value;
      _this.name = "NewError";
      return _this;
    }
    return NewError2;
  }(/* @__PURE__ */ _wrapNativeSuper(Error));
  function JSONPath(opts, expr, obj, callback, otherTypeCallback) {
    if (!(this instanceof JSONPath)) {
      try {
        return new JSONPath(opts, expr, obj, callback, otherTypeCallback);
      } catch (e) {
        if (!e.avoidNew) {
          throw e;
        }
        return e.value;
      }
    }
    if (typeof opts === "string") {
      otherTypeCallback = callback;
      callback = obj;
      obj = expr;
      expr = opts;
      opts = null;
    }
    var optObj = opts && _typeof(opts) === "object";
    opts = opts || {};
    this.json = opts.json || obj;
    this.path = opts.path || expr;
    this.resultType = opts.resultType || "value";
    this.flatten = opts.flatten || false;
    this.wrap = hasOwnProp.call(opts, "wrap") ? opts.wrap : true;
    this.sandbox = opts.sandbox || {};
    this.preventEval = opts.preventEval || false;
    this.parent = opts.parent || null;
    this.parentProperty = opts.parentProperty || null;
    this.callback = opts.callback || callback || null;
    this.otherTypeCallback = opts.otherTypeCallback || otherTypeCallback || function() {
      throw new TypeError("You must supply an otherTypeCallback callback option with the @other() operator.");
    };
    if (opts.autostart !== false) {
      var args = {
        path: optObj ? opts.path : expr
      };
      if (!optObj) {
        args.json = obj;
      } else if ("json" in opts) {
        args.json = opts.json;
      }
      var ret = this.evaluate(args);
      if (!ret || _typeof(ret) !== "object") {
        throw new NewError(ret);
      }
      return ret;
    }
  }
  JSONPath.prototype.evaluate = function(expr, json, callback, otherTypeCallback) {
    var _this2 = this;
    var currParent = this.parent, currParentProperty = this.parentProperty;
    var flatten = this.flatten, wrap = this.wrap;
    this.currResultType = this.resultType;
    this.currPreventEval = this.preventEval;
    this.currSandbox = this.sandbox;
    callback = callback || this.callback;
    this.currOtherTypeCallback = otherTypeCallback || this.otherTypeCallback;
    json = json || this.json;
    expr = expr || this.path;
    if (expr && _typeof(expr) === "object" && !Array.isArray(expr)) {
      if (!expr.path && expr.path !== "") {
        throw new TypeError('You must supply a "path" property when providing an object argument to JSONPath.evaluate().');
      }
      if (!hasOwnProp.call(expr, "json")) {
        throw new TypeError('You must supply a "json" property when providing an object argument to JSONPath.evaluate().');
      }
      var _expr = expr;
      json = _expr.json;
      flatten = hasOwnProp.call(expr, "flatten") ? expr.flatten : flatten;
      this.currResultType = hasOwnProp.call(expr, "resultType") ? expr.resultType : this.currResultType;
      this.currSandbox = hasOwnProp.call(expr, "sandbox") ? expr.sandbox : this.currSandbox;
      wrap = hasOwnProp.call(expr, "wrap") ? expr.wrap : wrap;
      this.currPreventEval = hasOwnProp.call(expr, "preventEval") ? expr.preventEval : this.currPreventEval;
      callback = hasOwnProp.call(expr, "callback") ? expr.callback : callback;
      this.currOtherTypeCallback = hasOwnProp.call(expr, "otherTypeCallback") ? expr.otherTypeCallback : this.currOtherTypeCallback;
      currParent = hasOwnProp.call(expr, "parent") ? expr.parent : currParent;
      currParentProperty = hasOwnProp.call(expr, "parentProperty") ? expr.parentProperty : currParentProperty;
      expr = expr.path;
    }
    currParent = currParent || null;
    currParentProperty = currParentProperty || null;
    if (Array.isArray(expr)) {
      expr = JSONPath.toPathString(expr);
    }
    if (!expr && expr !== "" || !json) {
      return void 0;
    }
    var exprList = JSONPath.toPathArray(expr);
    if (exprList[0] === "$" && exprList.length > 1) {
      exprList.shift();
    }
    this._hasParentSelector = null;
    var result = this._trace(exprList, json, ["$"], currParent, currParentProperty, callback).filter(function(ea) {
      return ea && !ea.isParentSelector;
    });
    if (!result.length) {
      return wrap ? [] : void 0;
    }
    if (!wrap && result.length === 1 && !result[0].hasArrExpr) {
      return this._getPreferredOutput(result[0]);
    }
    return result.reduce(function(rslt, ea) {
      var valOrPath = _this2._getPreferredOutput(ea);
      if (flatten && Array.isArray(valOrPath)) {
        rslt = rslt.concat(valOrPath);
      } else {
        rslt.push(valOrPath);
      }
      return rslt;
    }, []);
  };
  JSONPath.prototype._getPreferredOutput = function(ea) {
    var resultType = this.currResultType;
    switch (resultType) {
      case "all": {
        var path = Array.isArray(ea.path) ? ea.path : JSONPath.toPathArray(ea.path);
        ea.pointer = JSONPath.toPointer(path);
        ea.path = typeof ea.path === "string" ? ea.path : JSONPath.toPathString(ea.path);
        return ea;
      }
      case "value":
      case "parent":
      case "parentProperty":
        return ea[resultType];
      case "path":
        return JSONPath.toPathString(ea[resultType]);
      case "pointer":
        return JSONPath.toPointer(ea.path);
      default:
        throw new TypeError("Unknown result type");
    }
  };
  JSONPath.prototype._handleCallback = function(fullRetObj, callback, type) {
    if (callback) {
      var preferredOutput = this._getPreferredOutput(fullRetObj);
      fullRetObj.path = typeof fullRetObj.path === "string" ? fullRetObj.path : JSONPath.toPathString(fullRetObj.path);
      callback(preferredOutput, type, fullRetObj);
    }
  };
  JSONPath.prototype._trace = function(expr, val, path, parent, parentPropName, callback, hasArrExpr, literalPriority) {
    var _this3 = this;
    var retObj;
    if (!expr.length) {
      retObj = {
        path,
        value: val,
        parent,
        parentProperty: parentPropName,
        hasArrExpr
      };
      this._handleCallback(retObj, callback, "value");
      return retObj;
    }
    var loc = expr[0], x = expr.slice(1);
    var ret = [];
    function addRet(elems) {
      if (Array.isArray(elems)) {
        elems.forEach(function(t2) {
          ret.push(t2);
        });
      } else {
        ret.push(elems);
      }
    }
    if ((typeof loc !== "string" || literalPriority) && val && hasOwnProp.call(val, loc)) {
      addRet(this._trace(x, val[loc], push(path, loc), val, loc, callback, hasArrExpr));
    } else if (loc === "*") {
      this._walk(loc, x, val, path, parent, parentPropName, callback, function(m, l, _x, v, p, par, pr, cb) {
        addRet(_this3._trace(unshift(m, _x), v, p, par, pr, cb, true, true));
      });
    } else if (loc === "..") {
      addRet(this._trace(x, val, path, parent, parentPropName, callback, hasArrExpr));
      this._walk(loc, x, val, path, parent, parentPropName, callback, function(m, l, _x, v, p, par, pr, cb) {
        if (_typeof(v[m]) === "object") {
          addRet(_this3._trace(unshift(l, _x), v[m], push(p, m), v, m, cb, true));
        }
      });
    } else if (loc === "^") {
      this._hasParentSelector = true;
      return {
        path: path.slice(0, -1),
        expr: x,
        isParentSelector: true
      };
    } else if (loc === "~") {
      retObj = {
        path: push(path, loc),
        value: parentPropName,
        parent,
        parentProperty: null
      };
      this._handleCallback(retObj, callback, "property");
      return retObj;
    } else if (loc === "$") {
      addRet(this._trace(x, val, path, null, null, callback, hasArrExpr));
    } else if (/^(\x2D?[0-9]*):(\x2D?[0-9]*):?([0-9]*)$/.test(loc)) {
      addRet(this._slice(loc, x, val, path, parent, parentPropName, callback));
    } else if (loc.indexOf("?(") === 0) {
      if (this.currPreventEval) {
        throw new Error("Eval [?(expr)] prevented in JSONPath expression.");
      }
      this._walk(loc, x, val, path, parent, parentPropName, callback, function(m, l, _x, v, p, par, pr, cb) {
        if (_this3._eval(l.replace(/^\?\(((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?)\)$/, "$1"), v[m], m, p, par, pr)) {
          addRet(_this3._trace(unshift(m, _x), v, p, par, pr, cb, true));
        }
      });
    } else if (loc[0] === "(") {
      if (this.currPreventEval) {
        throw new Error("Eval [(expr)] prevented in JSONPath expression.");
      }
      addRet(this._trace(unshift(this._eval(loc, val, path[path.length - 1], path.slice(0, -1), parent, parentPropName), x), val, path, parent, parentPropName, callback, hasArrExpr));
    } else if (loc[0] === "@") {
      var addType = false;
      var valueType = loc.slice(1, -2);
      switch (valueType) {
        case "scalar":
          if (!val || !["object", "function"].includes(_typeof(val))) {
            addType = true;
          }
          break;
        case "boolean":
        case "string":
        case "undefined":
        case "function":
          if (_typeof(val) === valueType) {
            addType = true;
          }
          break;
        case "integer":
          if (Number.isFinite(val) && !(val % 1)) {
            addType = true;
          }
          break;
        case "number":
          if (Number.isFinite(val)) {
            addType = true;
          }
          break;
        case "nonFinite":
          if (typeof val === "number" && !Number.isFinite(val)) {
            addType = true;
          }
          break;
        case "object":
          if (val && _typeof(val) === valueType) {
            addType = true;
          }
          break;
        case "array":
          if (Array.isArray(val)) {
            addType = true;
          }
          break;
        case "other":
          addType = this.currOtherTypeCallback(val, path, parent, parentPropName);
          break;
        case "null":
          if (val === null) {
            addType = true;
          }
          break;
        /* istanbul ignore next */
        default:
          throw new TypeError("Unknown value type " + valueType);
      }
      if (addType) {
        retObj = {
          path,
          value: val,
          parent,
          parentProperty: parentPropName
        };
        this._handleCallback(retObj, callback, "value");
        return retObj;
      }
    } else if (loc[0] === "`" && val && hasOwnProp.call(val, loc.slice(1))) {
      var locProp = loc.slice(1);
      addRet(this._trace(x, val[locProp], push(path, locProp), val, locProp, callback, hasArrExpr, true));
    } else if (loc.includes(",")) {
      var parts = loc.split(",");
      var _iterator = _createForOfIteratorHelper(parts), _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var part = _step.value;
          addRet(this._trace(unshift(part, x), val, path, parent, parentPropName, callback, true));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else if (!literalPriority && val && hasOwnProp.call(val, loc)) {
      addRet(this._trace(x, val[loc], push(path, loc), val, loc, callback, hasArrExpr, true));
    }
    if (this._hasParentSelector) {
      for (var t = 0; t < ret.length; t++) {
        var rett = ret[t];
        if (rett && rett.isParentSelector) {
          var tmp = this._trace(rett.expr, val, rett.path, parent, parentPropName, callback, hasArrExpr);
          if (Array.isArray(tmp)) {
            ret[t] = tmp[0];
            var tl = tmp.length;
            for (var tt = 1; tt < tl; tt++) {
              t++;
              ret.splice(t, 0, tmp[tt]);
            }
          } else {
            ret[t] = tmp;
          }
        }
      }
    }
    return ret;
  };
  JSONPath.prototype._walk = function(loc, expr, val, path, parent, parentPropName, callback, f) {
    if (Array.isArray(val)) {
      var n = val.length;
      for (var i = 0; i < n; i++) {
        f(i, loc, expr, val, path, parent, parentPropName, callback);
      }
    } else if (val && _typeof(val) === "object") {
      Object.keys(val).forEach(function(m) {
        f(m, loc, expr, val, path, parent, parentPropName, callback);
      });
    }
  };
  JSONPath.prototype._slice = function(loc, expr, val, path, parent, parentPropName, callback) {
    if (!Array.isArray(val)) {
      return void 0;
    }
    var len = val.length, parts = loc.split(":"), step = parts[2] && Number.parseInt(parts[2]) || 1;
    var start = parts[0] && Number.parseInt(parts[0]) || 0, end = parts[1] && Number.parseInt(parts[1]) || len;
    start = start < 0 ? Math.max(0, start + len) : Math.min(len, start);
    end = end < 0 ? Math.max(0, end + len) : Math.min(len, end);
    var ret = [];
    for (var i = start; i < end; i += step) {
      var tmp = this._trace(unshift(i, expr), val, path, parent, parentPropName, callback, true);
      tmp.forEach(function(t) {
        ret.push(t);
      });
    }
    return ret;
  };
  JSONPath.prototype._eval = function(code, _v, _vname, path, parent, parentPropName) {
    if (code.includes("@parentProperty")) {
      this.currSandbox._$_parentProperty = parentPropName;
      code = code.replace(/@parentProperty/g, "_$_parentProperty");
    }
    if (code.includes("@parent")) {
      this.currSandbox._$_parent = parent;
      code = code.replace(/@parent/g, "_$_parent");
    }
    if (code.includes("@property")) {
      this.currSandbox._$_property = _vname;
      code = code.replace(/@property/g, "_$_property");
    }
    if (code.includes("@path")) {
      this.currSandbox._$_path = JSONPath.toPathString(path.concat([_vname]));
      code = code.replace(/@path/g, "_$_path");
    }
    if (code.includes("@root")) {
      this.currSandbox._$_root = this.json;
      code = code.replace(/@root/g, "_$_root");
    }
    if (/@([\t-\r \)\.\[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])/.test(code)) {
      this.currSandbox._$_v = _v;
      code = code.replace(/@([\t-\r \)\.\[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])/g, "_$_v$1");
    }
    try {
      return this.vm.runInNewContext(code, this.currSandbox);
    } catch (e) {
      console.log(e);
      throw new Error("jsonPath: " + e.message + ": " + code);
    }
  };
  JSONPath.cache = {};
  JSONPath.toPathString = function(pathArr) {
    var x = pathArr, n = x.length;
    var p = "$";
    for (var i = 1; i < n; i++) {
      if (!/^(~|\^|@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\(\))$/.test(x[i])) {
        p += /^[\*0-9]+$/.test(x[i]) ? "[" + x[i] + "]" : "['" + x[i] + "']";
      }
    }
    return p;
  };
  JSONPath.toPointer = function(pointer) {
    var x = pointer, n = x.length;
    var p = "";
    for (var i = 1; i < n; i++) {
      if (!/^(~|\^|@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\(\))$/.test(x[i])) {
        p += "/" + x[i].toString().replace(/~/g, "~0").replace(/\//g, "~1");
      }
    }
    return p;
  };
  JSONPath.toPathArray = function(expr) {
    var cache = JSONPath.cache;
    if (cache[expr]) {
      return cache[expr].concat();
    }
    var subx = [];
    var normalized = expr.replace(/@(?:null|boolean|number|string|integer|undefined|nonFinite|scalar|array|object|function|other)\(\)/g, ";$&;").replace(/['\[](\??\((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\))['\]]/g, function($0, $1) {
      return "[#" + (subx.push($1) - 1) + "]";
    }).replace(/\['((?:(?!['\]])[\s\S])*)'\]/g, function($0, prop) {
      return "['" + prop.replace(/\./g, "%@%").replace(/~/g, "%%@@%%") + "']";
    }).replace(/~/g, ";~;").replace(/'?\.'?(?!(?:(?!\[)[\s\S])*\])|\['?/g, ";").replace(/%@%/g, ".").replace(/%%@@%%/g, "~").replace(/(?:;)?(\^+)(?:;)?/g, function($0, ups) {
      return ";" + ups.split("").join(";") + ";";
    }).replace(/;;;|;;/g, ";..;").replace(/;$|'?\]|'$/g, "");
    var exprList = normalized.split(";").map(function(exp) {
      var match = exp.match(/#([0-9]+)/);
      return !match || !match[1] ? exp : subx[match[1]];
    });
    cache[expr] = exprList;
    return cache[expr];
  };
  var moveToAnotherArray = function moveToAnotherArray2(source, target, conditionCb) {
    var il = source.length;
    for (var i = 0; i < il; i++) {
      var item = source[i];
      if (conditionCb(item)) {
        target.push(source.splice(i--, 1)[0]);
      }
    }
  };
  JSONPath.prototype.vm = {
    /**
     * @param {string} expr Expression to evaluate
     * @param {PlainObject} context Object whose items will be added
     *   to evaluation
     * @returns {any} Result of evaluated code
     */
    runInNewContext: function runInNewContext(expr, context) {
      var keys = Object.keys(context);
      var funcs = [];
      moveToAnotherArray(keys, funcs, function(key) {
        return typeof context[key] === "function";
      });
      var values = keys.map(function(vr, i) {
        return context[vr];
      });
      var funcString = funcs.reduce(function(s, func) {
        var fString = context[func].toString();
        if (!/function/.test(fString)) {
          fString = "function " + fString;
        }
        return "var " + func + "=" + fString + ";" + s;
      }, "");
      expr = funcString + expr;
      if (!/(["'])use strict\1/.test(expr) && !keys.includes("arguments")) {
        expr = "var arguments = undefined;" + expr;
      }
      expr = expr.replace(/;[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/, "");
      var lastStatementEnd = expr.lastIndexOf(";");
      var code = lastStatementEnd > -1 ? expr.slice(0, lastStatementEnd + 1) + " return " + expr.slice(lastStatementEnd + 1) : " return " + expr;
      return _construct(Function, _toConsumableArray(keys).concat([code])).apply(void 0, _toConsumableArray(values));
    }
  };

  // neo4j-replace:neo4j-driver
  var int = window.neo4j.int;
  var DateTime = window.neo4j.DateTime;

  // uuid-replace:uuid
  function v4() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      try {
        return crypto.randomUUID();
      } catch (e) {
        console.error("Error calling crypto.randomUUID directly in uuid replacement:", e);
        throw new Error("Failed to generate UUID using crypto.randomUUID");
      }
    } else {
      console.error("crypto.randomUUID is not available in this environment. Cannot generate UUID.");
      throw new Error("UUID generation not supported: crypto.randomUUID missing.");
    }
  }

  // src/VariableGenerator.ts
  var VariableGenerator = class {
    currentVariable = 0;
    getNext() {
      this.currentVariable += 1;
      return `c${this.currentVariable}`;
    }
  };

  // src/TransformerRegistry.ts
  var TransformerRegistry = class {
    transformers = {};
    register(id, fn) {
      this.transformers[id] = fn;
    }
    get(id) {
      return this.transformers[id];
    }
    // For serialization support - returns registered transformer IDs
    getRegisteredIds() {
      return Object.keys(this.transformers);
    }
  };

  // src/JSON2Cypher.ts
  var JSON2Cypher = class _JSON2Cypher {
    constructor(schema, transformerRegistry) {
      this.schema = schema;
      this.variableGenerator = new VariableGenerator();
      this.transformerRegistry = transformerRegistry || new TransformerRegistry();
      this.registerDefaultTransformers();
    }
    variableGenerator;
    transformerRegistry;
    registerDefaultTransformers() {
      this.transformerRegistry.register(
        "toString",
        (value) => (value == null ? void 0 : value.toString()) || ""
      );
      this.transformerRegistry.register(
        "toNumber",
        (value) => Number(value) || 0
      );
      this.transformerRegistry.register("extractText", (obj) => (obj == null ? void 0 : obj.text) || "");
      this.transformerRegistry.register(
        "extractQuestionText",
        (value) => (value == null ? void 0 : value.question) || ""
      );
      this.transformerRegistry.register(
        "extractAnswerText",
        (value) => (value == null ? void 0 : value.answer) || ""
      );
      this.transformerRegistry.register("parentId", (value, context, params) => {
        var _a, _b, _c, _d;
        const idField = (params == null ? void 0 : params.idField) || "id";
        const parentType = params == null ? void 0 : params.parentType;
        if (!parentType) {
          return "";
        }
        if ((_a = context.parentContext) == null ? void 0 : _a[`${parentType}${idField.charAt(0).toUpperCase()}${idField.slice(1)}`]) {
          return context.parentContext[`${parentType}${idField.charAt(0).toUpperCase()}${idField.slice(1)}`];
        }
        if ((_c = (_b = context.parentContext) == null ? void 0 : _b[parentType]) == null ? void 0 : _c[idField]) {
          return context.parentContext[parentType][idField];
        }
        if ((_d = context.parentContext) == null ? void 0 : _d.parentContext) {
          return this.findParentIdInContext(
            context.parentContext.parentContext,
            parentType,
            idField
          );
        }
        return "";
      });
      this.transformerRegistry.register("jsonpath", (value, context, params) => {
        if (!(params == null ? void 0 : params.path) || value === void 0 || value === null) return void 0;
        try {
          let result = JSONPath({ path: params.path, json: value, wrap: false });
          if ((result === void 0 || result === value) && (params.path.includes("(") || params.path.includes("["))) {
            const expression = params.path.replace(/^\$..?/, "");
            const functionBody = `return $${expression.startsWith("[") ? "" : "."}${expression};`;
            const evaluator = new Function("$", functionBody);
            result = evaluator(value);
          }
          return result;
        } catch (e) {
          console.error(
            `Error evaluating JSONPath transformer path "${params.path}" on value:`,
            value,
            e
          );
          return void 0;
        }
      });
    }
    findParentIdInContext(context, parentType, idField) {
      var _a;
      if (!context) return "";
      if (context[`${parentType}${idField.charAt(0).toUpperCase()}${idField.slice(1)}`]) {
        return context[`${parentType}${idField.charAt(0).toUpperCase()}${idField.slice(1)}`];
      }
      if ((_a = context[parentType]) == null ? void 0 : _a[idField]) {
        return context[parentType][idField];
      }
      return this.findParentIdInContext(
        context.parentContext,
        parentType,
        idField
      );
    }
    // Add a method to evaluate context-aware JSONPath expressions
    evaluateContextPath(path, context, returnArray = false) {
      let result;
      if (path.startsWith("$current.")) {
        result = JSONPath({
          path: path.replace("$current.", "$."),
          json: context.current
        });
      } else if (path.startsWith("$parent.")) {
        result = JSONPath({
          path: path.replace("$parent.", "$."),
          json: context.parent
        });
      } else if (path.startsWith("$root.")) {
        result = JSONPath({
          path: path.replace("$root.", "$."),
          json: context.root
        });
      } else if (path.startsWith("$global.")) {
        result = JSONPath({
          path: path.replace("$global.", "$."),
          json: context.global
        });
      } else if (path.startsWith("$data.")) {
        result = JSONPath({
          path: path.replace("$data.", "$."),
          json: context.data
        });
      } else {
        result = JSONPath({ path, json: context });
      }
      const wantsArray = returnArray || path.endsWith("..id") || path.includes("[?(@");
      if (Array.isArray(result)) {
        if (wantsArray) {
          return result;
        }
        return result.length > 0 ? result[0] : void 0;
      }
      if (wantsArray && result !== void 0) {
        return [result];
      }
      return result;
    }
    async generateQueries(data) {
      const addedNodeIds = /* @__PURE__ */ new Set();
      const { nodes, relationships } = await this.mapDataToGraph(
        this.schema,
        data,
        addedNodeIds
        // Pass the set to the initial call
      );
      const nodeQueries = await Promise.all(
        nodes.map((node) => this.createNodeQuery(node))
      );
      const relationshipQueries = await Promise.all(
        relationships.map((rel) => this.createRelationshipQuery(rel))
      );
      return { queries: [...nodeQueries, ...relationshipQueries] };
    }
    async mapDataToGraph(schema, data, addedNodeIds, parentContext = {}, rootNodes = {}) {
      const nodes = [];
      const relationships = [];
      const createdNodesByType = {};
      const sourceData = schema.sourceDataPath ? this.getNestedValue(data, schema.sourceDataPath.split(".")) : data;
      if (!sourceData) return { nodes, relationships };
      const dataItems = schema.iterationMode === "collection" && Array.isArray(sourceData) ? sourceData : [sourceData];
      for (let i = 0; i < dataItems.length; i++) {
        const item = dataItems[i];
        const itemContext = {
          data: item,
          index: i,
          parent: parentContext.current || {},
          root: rootNodes.nodes || {},
          global: parentContext.global || {},
          current: {}
        };
        const currentLevelNodes = {};
        const nodeIds = {};
        for (const nodeDef of schema.nodes) {
          nodeIds[nodeDef.type] = this.generateNodeId(nodeDef, item);
        }
        for (const nodeDef of schema.nodes) {
          const nodeId = nodeIds[nodeDef.type];
          currentLevelNodes[nodeDef.type] = nodeId;
          const nodeProps = this.extractNodeProperties(nodeDef, item, {
            ...itemContext,
            nodeIds
          });
          const node = {
            id: nodeId,
            type: nodeDef.type,
            ...nodeProps
          };
          itemContext.current[nodeDef.type] = {
            id: nodeId,
            ...nodeProps
          };
          if (!addedNodeIds.has(nodeId)) {
            nodes.push(node);
            addedNodeIds.add(nodeId);
          }
          if (!createdNodesByType[nodeDef.type]) {
            createdNodesByType[nodeDef.type] = [];
          }
          const existingNodeIndex = createdNodesByType[nodeDef.type].findIndex(
            (n) => n.id === nodeId
          );
          if (existingNodeIndex === -1) {
            createdNodesByType[nodeDef.type].push({
              id: nodeId,
              index: i,
              properties: nodeProps
            });
          } else {
            createdNodesByType[nodeDef.type][existingNodeIndex].properties = nodeProps;
          }
          if (Object.keys(parentContext).length === 0) {
            if (!rootNodes.nodes) rootNodes.nodes = {};
            rootNodes.nodes[nodeDef.type] = {
              id: nodeId,
              ...nodeProps
            };
          }
          if (nodeDef.isReference) {
            if (!itemContext.global[nodeDef.type]) {
              itemContext.global[nodeDef.type] = [];
            }
            itemContext.global[nodeDef.type].push({
              id: nodeId,
              ...nodeProps
            });
          }
        }
        this.createRelationshipsWithJSONPath(
          schema.relationships,
          itemContext,
          relationships
        );
        if (schema.subMappings) {
          for (const subMapping of schema.subMappings) {
            const { nodes: childNodes, relationships: childRels } = await this.mapDataToGraph(
              subMapping,
              item,
              addedNodeIds,
              // Pass the SAME set down recursively
              itemContext,
              rootNodes
            );
            nodes.push(...childNodes);
            relationships.push(...childRels);
          }
        }
      }
      return { nodes, relationships };
    }
    createRelationshipsWithJSONPath(relationshipDefs, context, relationships) {
      for (const relDef of relationshipDefs) {
        let fromIds = [];
        let toIds = [];
        if (relDef.from.selector && relDef.from.nodeType) {
          fromIds = this.resolveNodeIds(
            relDef.from.nodeType,
            relDef.from.selector,
            context
          );
        } else if (relDef.from.path) {
          const needsArray = relDef.mapping !== "oneToOne";
          const result = this.evaluateContextPath(
            relDef.from.path,
            context,
            needsArray
          );
          if (Array.isArray(result)) {
            fromIds = result.map((r) => typeof r === "object" && r !== null ? r.id : r).filter((id) => id != null);
          } else if (result != null) {
            const id = typeof result === "object" && result !== null ? result.id : result;
            if (id != null) {
              fromIds = [id];
            }
          }
        }
        if (relDef.to.selector && relDef.to.nodeType) {
          toIds = this.resolveNodeIds(
            relDef.to.nodeType,
            relDef.to.selector,
            context
          );
        } else if (relDef.to.path) {
          const needsArray = relDef.mapping !== "oneToOne";
          const result = this.evaluateContextPath(
            relDef.to.path,
            context,
            needsArray
          );
          if (Array.isArray(result)) {
            toIds = result.map((r) => typeof r === "object" && r !== null ? r.id : r).filter((id) => id != null);
          } else if (result != null) {
            const id = typeof result === "object" && result !== null ? result.id : result;
            if (id != null) {
              toIds = [id];
            }
          }
        }
        if (fromIds.length === 0 || toIds.length === 0) {
          console.log(`No nodes found for relationship ${relDef.type}`);
          continue;
        }
        if (relDef.mapping === "oneToOne") {
          const maxLength = Math.min(fromIds.length, toIds.length);
          for (let i = 0; i < maxLength; i++) {
            relationships.push({
              from: fromIds[i],
              to: toIds[i],
              type: relDef.type
            });
          }
        } else {
          for (const fromId of fromIds) {
            for (const toId of toIds) {
              relationships.push({
                from: fromId,
                to: toId,
                type: relDef.type
              });
            }
          }
        }
      }
    }
    // Legacy method - keep for backward compatibility
    resolveNodeIds(nodeType, selector, context) {
      var _a, _b, _c, _d;
      if (selector === "current" && ((_a = context.current) == null ? void 0 : _a[nodeType])) {
        return [context.current[nodeType].id];
      }
      if (selector === "parent" && ((_b = context.parent) == null ? void 0 : _b[nodeType])) {
        return [context.parent[nodeType].id];
      }
      if (selector === "root" && ((_c = context.root) == null ? void 0 : _c[nodeType])) {
        return [context.root[nodeType].id];
      }
      if (selector.includes("=")) {
        const [propName, propValue] = selector.split("=");
        if ((_d = context.global) == null ? void 0 : _d[nodeType]) {
          const matchingNodes = context.global[nodeType].filter(
            (n) => n[propName] === propValue
          );
          return matchingNodes.map((n) => n.id);
        }
      }
      return [];
    }
    generateNodeId(nodeDef, data) {
      const idField = nodeDef.idField || "id";
      switch (nodeDef.idStrategy) {
        case "fixed":
          if (!nodeDef.idValue) {
            throw new Error(
              `Fixed ID strategy requires an idValue for node type ${nodeDef.type}`
            );
          }
          return nodeDef.idValue;
        case "fromData":
          const idValue = idField === "." ? data : this.getNestedValue(data, idField.split("."));
          if (idValue === null || idValue === void 0) {
            throw new Error(
              `ID field '${idField}' not found in data for node type ${nodeDef.type} using 'fromData' strategy.`
            );
          }
          return String(idValue);
        // Ensure ID is a string
        case "uuid":
        default:
          return v4();
      }
    }
    extractNodeProperties(nodeDef, data, context) {
      const result = {};
      result.createdAt = DateTime.fromStandardDate(/* @__PURE__ */ new Date());
      for (const propDef of nodeDef.properties) {
        let value;
        if (propDef.path === "." && (typeof data !== "object" || data === null)) {
          value = data;
        } else if (propDef.path && propDef.path.startsWith("$")) {
          value = this.evaluateContextPath(propDef.path, context, false);
        } else if (propDef.path) {
          value = this.getNestedValue(data, propDef.path.split("."));
        }
        if (propDef.transformerId) {
          const transformer = this.transformerRegistry.get(propDef.transformerId);
          if (transformer) {
            value = transformer(value, context, propDef.transformerParams);
          }
        }
        if (value === void 0 && propDef.default !== void 0) {
          value = propDef.default;
        }
        if (propDef.type) {
          value = this.convertValueToType(value, propDef.type);
        }
        result[propDef.name] = value;
      }
      return result;
    }
    convertValueToType(value, type) {
      if (value === null || value === void 0) {
        return value;
      }
      switch (type.toLowerCase()) {
        case "integer":
        case "int":
          return int(value);
        case "float":
        case "double":
          return Number.isFinite(value) ? value : parseFloat(value);
        case "boolean":
        case "bool":
          return Boolean(value);
        case "string":
          return String(value);
        case "date":
          return new Date(value);
        default:
          return value;
      }
    }
    getNestedValue(obj, path) {
      return path.reduce(
        (prev, curr) => prev && prev[curr] !== void 0 ? prev[curr] : void 0,
        obj
      );
    }
    async createNodeQuery(node) {
      const { id, type, ...properties } = node;
      const varName = this.variableGenerator.getNext();
      const nodeDefinition = this.findNodeDefinition(type);
      const isMerge = (nodeDefinition == null ? void 0 : nodeDefinition.isReference) === true;
      const operation = isMerge ? "MERGE" : "CREATE";
      const query = `
      ${operation} (${varName}:${type} {id: $id_${varName}}) 
      SET ${varName} += $props_${varName}
    `;
      const params = {
        [`id_${varName}`]: id,
        [`props_${varName}`]: properties
      };
      return { query, params, isMerge };
    }
    findNodeDefinition(type) {
      const findInMapping = (mapping) => {
        const direct = mapping.nodes.find((n) => n.type === type);
        if (direct) return direct;
        if (mapping.subMappings) {
          for (const subMapping of mapping.subMappings) {
            const inSub = findInMapping(subMapping);
            if (inSub) return inSub;
          }
        }
        return void 0;
      };
      return findInMapping(this.schema);
    }
    async createRelationshipQuery(relationship) {
      const { from, to, type } = relationship;
      const relVar = this.variableGenerator.getNext();
      const query = `
      MATCH (source) WHERE source.id = $fromId
      MATCH (target) WHERE target.id = $toId
      CREATE (source)-[${relVar}:${type}]->(target)
    `;
      const params = {
        fromId: from,
        toId: to
      };
      return { query, params };
    }
    serializeSchema() {
      return JSON.stringify(this.schema, null, 2);
    }
    static fromSerialized(serializedSchema, transformerRegistry) {
      const schema = JSON.parse(serializedSchema);
      return new _JSON2Cypher(schema, transformerRegistry);
    }
  };

  exports.JSON2Cypher = JSON2Cypher;
  exports.TransformerRegistry = TransformerRegistry;
  exports.VariableGenerator = VariableGenerator;

  return exports;

})({});
