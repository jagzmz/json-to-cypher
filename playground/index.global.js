var JSON2Cypher=(function(exports){'use strict';function w(e){"@babel/helpers - typeof";return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?w=function(t){return typeof t}:w=function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},w(e)}function Z(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function tt(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:true,configurable:true}}),t&&x(e,t);}function U(e){return U=Object.setPrototypeOf?Object.getPrototypeOf:function(r){return r.__proto__||Object.getPrototypeOf(r)},U(e)}function x(e,t){return x=Object.setPrototypeOf||function(i,n){return i.__proto__=n,i},x(e,t)}function L(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return  false;if(typeof Proxy=="function")return  true;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return  false}}function M(e,t,r){return L()?M=Reflect.construct:M=function(n,o,a){var u=[null];u.push.apply(u,o);var s=Function.bind.apply(n,u),f=new s;return a&&x(f,a.prototype),f},M.apply(null,arguments)}function et(e){return Function.toString.call(e).indexOf("[native code]")!==-1}function J(e){var t=typeof Map=="function"?new Map:void 0;return J=function(i){if(i===null||!et(i))return i;if(typeof i!="function")throw new TypeError("Super expression must either be null or a function");if(typeof t<"u"){if(t.has(i))return t.get(i);t.set(i,n);}function n(){return M(i,arguments,U(this).constructor)}return n.prototype=Object.create(i.prototype,{constructor:{value:n,enumerable:false,writable:true,configurable:true}}),x(n,i)},J(e)}function rt(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function nt(e,t){return t&&(typeof t=="object"||typeof t=="function")?t:rt(e)}function it(e){var t=L();return function(){var i=U(e),n;if(t){var o=U(this).constructor;n=Reflect.construct(i,arguments,o);}else n=i.apply(this,arguments);return nt(this,n)}}function H(e){return ot(e)||at(e)||z(e)||st()}function ot(e){if(Array.isArray(e))return G(e)}function at(e){if(typeof Symbol<"u"&&Symbol.iterator in Object(e))return Array.from(e)}function z(e,t){if(e){if(typeof e=="string")return G(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor&&(r=e.constructor.name),r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return G(e,t)}}function G(e,t){(t==null||t>e.length)&&(t=e.length);for(var r=0,i=new Array(t);r<t;r++)i[r]=e[r];return i}function st(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function ut(e,t){var r;if(typeof Symbol>"u"||e[Symbol.iterator]==null){if(Array.isArray(e)||(r=z(e))||t){r&&(e=r);var i=0,n=function(){};return {s:n,n:function(){return i>=e.length?{done:true}:{done:false,value:e[i++]}},e:function(s){throw s},f:n}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var o=true,a=false,u;return {s:function(){r=e[Symbol.iterator]();},n:function(){var s=r.next();return o=s.done,s},e:function(s){a=true,u=s;},f:function(){try{!o&&r.return!=null&&r.return();}finally{if(a)throw u}}}}var v=Object.prototype.hasOwnProperty;function j(e,t){return e=e.slice(),e.push(t),e}function I(e,t){return t=t.slice(),t.unshift(e),t}var ft=function(e){tt(r,e);var t=it(r);function r(i){var n;return Z(this,r),n=t.call(this,'JSONPath should not be called with "new" (it prevents return of (unwrapped) scalar values)'),n.avoidNew=true,n.value=i,n.name="NewError",n}return r}(J(Error));function p(e,t,r,i,n){if(!(this instanceof p))try{return new p(e,t,r,i,n)}catch(s){if(!s.avoidNew)throw s;return s.value}typeof e=="string"&&(n=i,i=r,r=t,t=e,e=null);var o=e&&w(e)==="object";if(e=e||{},this.json=e.json||r,this.path=e.path||t,this.resultType=e.resultType||"value",this.flatten=e.flatten||false,this.wrap=v.call(e,"wrap")?e.wrap:true,this.sandbox=e.sandbox||{},this.preventEval=e.preventEval||false,this.parent=e.parent||null,this.parentProperty=e.parentProperty||null,this.callback=e.callback||i||null,this.otherTypeCallback=e.otherTypeCallback||n||function(){throw new TypeError("You must supply an otherTypeCallback callback option with the @other() operator.")},e.autostart!==false){var a={path:o?e.path:t};o?"json"in e&&(a.json=e.json):a.json=r;var u=this.evaluate(a);if(!u||w(u)!=="object")throw new ft(u);return u}}p.prototype.evaluate=function(e,t,r,i){var n=this,o=this.parent,a=this.parentProperty,u=this.flatten,s=this.wrap;if(this.currResultType=this.resultType,this.currPreventEval=this.preventEval,this.currSandbox=this.sandbox,r=r||this.callback,this.currOtherTypeCallback=i||this.otherTypeCallback,t=t||this.json,e=e||this.path,e&&w(e)==="object"&&!Array.isArray(e)){if(!e.path&&e.path!=="")throw new TypeError('You must supply a "path" property when providing an object argument to JSONPath.evaluate().');if(!v.call(e,"json"))throw new TypeError('You must supply a "json" property when providing an object argument to JSONPath.evaluate().');var f=e;t=f.json,u=v.call(e,"flatten")?e.flatten:u,this.currResultType=v.call(e,"resultType")?e.resultType:this.currResultType,this.currSandbox=v.call(e,"sandbox")?e.sandbox:this.currSandbox,s=v.call(e,"wrap")?e.wrap:s,this.currPreventEval=v.call(e,"preventEval")?e.preventEval:this.currPreventEval,r=v.call(e,"callback")?e.callback:r,this.currOtherTypeCallback=v.call(e,"otherTypeCallback")?e.otherTypeCallback:this.currOtherTypeCallback,o=v.call(e,"parent")?e.parent:o,a=v.call(e,"parentProperty")?e.parentProperty:a,e=e.path;}if(o=o||null,a=a||null,Array.isArray(e)&&(e=p.toPathString(e)),!(!e&&e!==""||!t)){var c=p.toPathArray(e);c[0]==="$"&&c.length>1&&c.shift(),this._hasParentSelector=null;var l=this._trace(c,t,["$"],o,a,r).filter(function(h){return h&&!h.isParentSelector});return l.length?!s&&l.length===1&&!l[0].hasArrExpr?this._getPreferredOutput(l[0]):l.reduce(function(h,g){var y=n._getPreferredOutput(g);return u&&Array.isArray(y)?h=h.concat(y):h.push(y),h},[]):s?[]:void 0}};p.prototype._getPreferredOutput=function(e){var t=this.currResultType;switch(t){case "all":{var r=Array.isArray(e.path)?e.path:p.toPathArray(e.path);return e.pointer=p.toPointer(r),e.path=typeof e.path=="string"?e.path:p.toPathString(e.path),e}case "value":case "parent":case "parentProperty":return e[t];case "path":return p.toPathString(e[t]);case "pointer":return p.toPointer(e.path);default:throw new TypeError("Unknown result type")}};p.prototype._handleCallback=function(e,t,r){if(t){var i=this._getPreferredOutput(e);e.path=typeof e.path=="string"?e.path:p.toPathString(e.path),t(i,r,e);}};p.prototype._trace=function(e,t,r,i,n,o,a,u){var s=this,f;if(!e.length)return f={path:r,value:t,parent:i,parentProperty:n,hasArrExpr:a},this._handleCallback(f,o,"value"),f;var c=e[0],l=e.slice(1),h=[];function g(b){Array.isArray(b)?b.forEach(function(R){h.push(R);}):h.push(b);}if((typeof c!="string"||u)&&t&&v.call(t,c))g(this._trace(l,t[c],j(r,c),t,c,o,a));else if(c==="*")this._walk(c,l,t,r,i,n,o,function(b,R,N,S,E,O,T,C){g(s._trace(I(b,N),S,E,O,T,C,true,true));});else if(c==="..")g(this._trace(l,t,r,i,n,o,a)),this._walk(c,l,t,r,i,n,o,function(b,R,N,S,E,O,T,C){w(S[b])==="object"&&g(s._trace(I(R,N),S[b],j(E,b),S,b,C,true));});else {if(c==="^")return this._hasParentSelector=true,{path:r.slice(0,-1),expr:l,isParentSelector:true};if(c==="~")return f={path:j(r,c),value:n,parent:i,parentProperty:null},this._handleCallback(f,o,"property"),f;if(c==="$")g(this._trace(l,t,r,null,null,o,a));else if(/^(\x2D?[0-9]*):(\x2D?[0-9]*):?([0-9]*)$/.test(c))g(this._slice(c,l,t,r,i,n,o));else if(c.indexOf("?(")===0){if(this.currPreventEval)throw new Error("Eval [?(expr)] prevented in JSONPath expression.");this._walk(c,l,t,r,i,n,o,function(b,R,N,S,E,O,T,C){s._eval(R.replace(/^\?\(((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?)\)$/,"$1"),S[b],b,E,O,T)&&g(s._trace(I(b,N),S,E,O,T,C,true));});}else if(c[0]==="("){if(this.currPreventEval)throw new Error("Eval [(expr)] prevented in JSONPath expression.");g(this._trace(I(this._eval(c,t,r[r.length-1],r.slice(0,-1),i,n),l),t,r,i,n,o,a));}else if(c[0]==="@"){var y=false,_=c.slice(1,-2);switch(_){case "scalar":(!t||!["object","function"].includes(w(t)))&&(y=true);break;case "boolean":case "string":case "undefined":case "function":w(t)===_&&(y=true);break;case "integer":Number.isFinite(t)&&!(t%1)&&(y=true);break;case "number":Number.isFinite(t)&&(y=true);break;case "nonFinite":typeof t=="number"&&!Number.isFinite(t)&&(y=true);break;case "object":t&&w(t)===_&&(y=true);break;case "array":Array.isArray(t)&&(y=true);break;case "other":y=this.currOtherTypeCallback(t,r,i,n);break;case "null":t===null&&(y=true);break;default:throw new TypeError("Unknown value type "+_)}if(y)return f={path:r,value:t,parent:i,parentProperty:n},this._handleCallback(f,o,"value"),f}else if(c[0]==="`"&&t&&v.call(t,c.slice(1))){var P=c.slice(1);g(this._trace(l,t[P],j(r,P),t,P,o,a,true));}else if(c.includes(",")){var d=c.split(","),m=ut(d),F;try{for(m.s();!(F=m.n()).done;){var Q=F.value;g(this._trace(I(Q,l),t,r,i,n,o,!0));}}catch(b){m.e(b);}finally{m.f();}}else !u&&t&&v.call(t,c)&&g(this._trace(l,t[c],j(r,c),t,c,o,a,true));}if(this._hasParentSelector)for(var D=0;D<h.length;D++){var A=h[D];if(A&&A.isParentSelector){var $=this._trace(A.expr,t,A.path,i,n,o,a);if(Array.isArray($)){h[D]=$[0];for(var V=$.length,W=1;W<V;W++)D++,h.splice(D,0,$[W]);}else h[D]=$;}}return h};p.prototype._walk=function(e,t,r,i,n,o,a,u){if(Array.isArray(r))for(var s=r.length,f=0;f<s;f++)u(f,e,t,r,i,n,o,a);else r&&w(r)==="object"&&Object.keys(r).forEach(function(c){u(c,e,t,r,i,n,o,a);});};p.prototype._slice=function(e,t,r,i,n,o,a){if(Array.isArray(r)){var u=r.length,s=e.split(":"),f=s[2]&&Number.parseInt(s[2])||1,c=s[0]&&Number.parseInt(s[0])||0,l=s[1]&&Number.parseInt(s[1])||u;c=c<0?Math.max(0,c+u):Math.min(u,c),l=l<0?Math.max(0,l+u):Math.min(u,l);for(var h=[],g=c;g<l;g+=f){var y=this._trace(I(g,t),r,i,n,o,a,true);y.forEach(function(_){h.push(_);});}return h}};p.prototype._eval=function(e,t,r,i,n,o){e.includes("@parentProperty")&&(this.currSandbox._$_parentProperty=o,e=e.replace(/@parentProperty/g,"_$_parentProperty")),e.includes("@parent")&&(this.currSandbox._$_parent=n,e=e.replace(/@parent/g,"_$_parent")),e.includes("@property")&&(this.currSandbox._$_property=r,e=e.replace(/@property/g,"_$_property")),e.includes("@path")&&(this.currSandbox._$_path=p.toPathString(i.concat([r])),e=e.replace(/@path/g,"_$_path")),e.includes("@root")&&(this.currSandbox._$_root=this.json,e=e.replace(/@root/g,"_$_root")),/@([\t-\r \)\.\[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])/.test(e)&&(this.currSandbox._$_v=t,e=e.replace(/@([\t-\r \)\.\[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])/g,"_$_v$1"));try{return this.vm.runInNewContext(e,this.currSandbox)}catch(a){throw console.log(a),new Error("jsonPath: "+a.message+": "+e)}};p.cache={};p.toPathString=function(e){for(var t=e,r=t.length,i="$",n=1;n<r;n++)/^(~|\^|@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\(\))$/.test(t[n])||(i+=/^[\*0-9]+$/.test(t[n])?"["+t[n]+"]":"['"+t[n]+"']");return i};p.toPointer=function(e){for(var t=e,r=t.length,i="",n=1;n<r;n++)/^(~|\^|@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\(\))$/.test(t[n])||(i+="/"+t[n].toString().replace(/~/g,"~0").replace(/\//g,"~1"));return i};p.toPathArray=function(e){var t=p.cache;if(t[e])return t[e].concat();var r=[],i=e.replace(/@(?:null|boolean|number|string|integer|undefined|nonFinite|scalar|array|object|function|other)\(\)/g,";$&;").replace(/['\[](\??\((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\))['\]]/g,function(o,a){return "[#"+(r.push(a)-1)+"]"}).replace(/\['((?:(?!['\]])[\s\S])*)'\]/g,function(o,a){return "['"+a.replace(/\./g,"%@%").replace(/~/g,"%%@@%%")+"']"}).replace(/~/g,";~;").replace(/'?\.'?(?!(?:(?!\[)[\s\S])*\])|\['?/g,";").replace(/%@%/g,".").replace(/%%@@%%/g,"~").replace(/(?:;)?(\^+)(?:;)?/g,function(o,a){return ";"+a.split("").join(";")+";"}).replace(/;;;|;;/g,";..;").replace(/;$|'?\]|'$/g,""),n=i.split(";").map(function(o){var a=o.match(/#([0-9]+)/);return !a||!a[1]?o:r[a[1]]});return t[e]=n,t[e]};var ct=function(t,r,i){for(var n=t.length,o=0;o<n;o++){var a=t[o];i(a)&&r.push(t.splice(o--,1)[0]);}};p.prototype.vm={runInNewContext:function(t,r){var i=Object.keys(r),n=[];ct(i,n,function(f){return typeof r[f]=="function"});var o=i.map(function(f,c){return r[f]}),a=n.reduce(function(f,c){var l=r[c].toString();return /function/.test(l)||(l="function "+l),"var "+c+"="+l+";"+f},"");t=a+t,!/(["'])use strict\1/.test(t)&&!i.includes("arguments")&&(t="var arguments = undefined;"+t),t=t.replace(/;[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/,"");var u=t.lastIndexOf(";"),s=u>-1?t.slice(0,u+1)+" return "+t.slice(u+1):" return "+t;return M(Function,H(i).concat([s])).apply(void 0,H(o))}};var Y=window.neo4j.int,K=window.neo4j.DateTime;function X(){if(typeof crypto<"u"&&typeof crypto.randomUUID=="function")try{return crypto.randomUUID()}catch(e){throw console.error("Error calling crypto.randomUUID directly in uuid replacement:",e),new Error("Failed to generate UUID using crypto.randomUUID")}else throw console.error("crypto.randomUUID is not available in this environment. Cannot generate UUID."),new Error("UUID generation not supported: crypto.randomUUID missing.")}var B=class{currentVariable=0;getNext(){return this.currentVariable+=1,`c${this.currentVariable}`}};var k=class{transformers={};register(t,r){this.transformers[t]=r;}get(t){return this.transformers[t]}getRegisteredIds(){return Object.keys(this.transformers)}};var q=class e{constructor(t,r){this.schema=t;this.variableGenerator=new B,this.transformerRegistry=r||new k,this.registerDefaultTransformers();}variableGenerator;transformerRegistry;registerDefaultTransformers(){this.transformerRegistry.register("toString",t=>(t==null?void 0:t.toString())||""),this.transformerRegistry.register("toNumber",t=>Number(t)||0),this.transformerRegistry.register("extractText",t=>(t==null?void 0:t.text)||""),this.transformerRegistry.register("extractQuestionText",t=>(t==null?void 0:t.question)||""),this.transformerRegistry.register("extractAnswerText",t=>(t==null?void 0:t.answer)||""),this.transformerRegistry.register("parentId",(t,r,i)=>{var a,u,s,f;let n=(i==null?void 0:i.idField)||"id",o=i==null?void 0:i.parentType;return o?(a=r.parentContext)!=null&&a[`${o}${n.charAt(0).toUpperCase()}${n.slice(1)}`]?r.parentContext[`${o}${n.charAt(0).toUpperCase()}${n.slice(1)}`]:(s=(u=r.parentContext)==null?void 0:u[o])!=null&&s[n]?r.parentContext[o][n]:(f=r.parentContext)!=null&&f.parentContext?this.findParentIdInContext(r.parentContext.parentContext,o,n):"":""}),this.transformerRegistry.register("jsonpath",(t,r,i)=>{if(!(!(i!=null&&i.path)||t===void 0||t===null))try{let n=p({path:i.path,json:t,wrap:!1});if((n===void 0||n===t)&&(i.path.includes("(")||i.path.includes("["))){let o=i.path.replace(/^\$..?/,""),a=`return $${o.startsWith("[")?"":"."}${o};`;n=new Function("$",a)(t);}return n}catch(n){console.error(`Error evaluating JSONPath transformer path "${i.path}" on value:`,t,n);return}});}findParentIdInContext(t,r,i){var n;return t?t[`${r}${i.charAt(0).toUpperCase()}${i.slice(1)}`]?t[`${r}${i.charAt(0).toUpperCase()}${i.slice(1)}`]:(n=t[r])!=null&&n[i]?t[r][i]:this.findParentIdInContext(t.parentContext,r,i):""}evaluateContextPath(t,r,i=false){let n;t.startsWith("$current.")?n=p({path:t.replace("$current.","$."),json:r.current}):t.startsWith("$parent.")?n=p({path:t.replace("$parent.","$."),json:r.parent}):t.startsWith("$root.")?n=p({path:t.replace("$root.","$."),json:r.root}):t.startsWith("$global.")?n=p({path:t.replace("$global.","$."),json:r.global}):t.startsWith("$data.")?n=p({path:t.replace("$data.","$."),json:r.data}):n=p({path:t,json:r});let o=i||t.endsWith("..id")||t.includes("[?(@");return Array.isArray(n)?o?n:n.length>0?n[0]:void 0:o&&n!==void 0?[n]:n}async generateQueries(t){let{nodes:r,relationships:i}=await this.mapDataToGraph(this.schema,t),n=await Promise.all(r.map(a=>this.createNodeQuery(a))),o=await Promise.all(i.map(a=>this.createRelationshipQuery(a)));return {queries:[...n,...o]}}async mapDataToGraph(t,r,i=new Map,n={},o={}){let a=[],u=[],s={},f=t.sourceDataPath?this.getNestedValue(r,t.sourceDataPath.split(".")):r;if(!f)return {nodes:a,relationships:u};let c=t.iterationMode==="collection"&&Array.isArray(f)?f:[f];for(let h=0;h<c.length;h++){let g=c[h],y={data:g,index:h,parent:n.current||{},root:o.nodes||{},global:n.global||{},current:{}},_={},P={};for(let d of t.nodes)P[d.type]=this.generateNodeId(d,g);for(let d of t.nodes){let m=P[d.type];_[d.type]=m;let F=this.extractNodeProperties(d,g,{...y,nodeIds:P});({type:d.type,...F});y.current[d.type]={id:m,...F};let D={id:m,type:d.type,properties:F,isReference:d.isReference??false},A=i.get(m);(!A||A.isReference&&!D.isReference)&&i.set(m,D),s[d.type]||(s[d.type]=[]);let $=s[d.type].findIndex(V=>V.id===m);$===-1?s[d.type].push({id:m,index:h,properties:F}):s[d.type][$].properties=F,Object.keys(n).length===0&&(o.nodes||(o.nodes={}),o.nodes[d.type]={id:m,...F}),d.isReference&&(y.global[d.type]||(y.global[d.type]=[]),y.global[d.type].push({id:m,...F}));}if(this.createRelationshipsWithJSONPath(t.relationships,y,u),t.subMappings)for(let d of t.subMappings){let{nodes:m,relationships:F}=await this.mapDataToGraph(d,g,i,y,o);u.push(...F);}}return {nodes:Array.from(i.values()).map(h=>({id:h.id,type:h.type,...h.properties})),relationships:u}}createRelationshipsWithJSONPath(t,r,i){for(let n of t){let o=[],a=[];if(n.from.selector&&n.from.nodeType)o=this.resolveNodeIds(n.from.nodeType,n.from.selector,r);else if(n.from.path){let u=n.mapping!=="oneToOne",s=this.evaluateContextPath(n.from.path,r,u);if(Array.isArray(s))o=s.map(f=>typeof f=="object"&&f!==null?f.id:f).filter(f=>f!=null);else if(s!=null){let f=typeof s=="object"&&s!==null?s.id:s;f!=null&&(o=[f]);}}if(n.to.selector&&n.to.nodeType)a=this.resolveNodeIds(n.to.nodeType,n.to.selector,r);else if(n.to.path){let u=n.mapping!=="oneToOne",s=this.evaluateContextPath(n.to.path,r,u);if(Array.isArray(s))a=s.map(f=>typeof f=="object"&&f!==null?f.id:f).filter(f=>f!=null);else if(s!=null){let f=typeof s=="object"&&s!==null?s.id:s;f!=null&&(a=[f]);}}if(o.length===0||a.length===0){console.log(`No nodes found for relationship ${n.type}`);continue}if(n.mapping==="oneToOne"){let u=Math.min(o.length,a.length);for(let s=0;s<u;s++)i.push({from:o[s],to:a[s],type:n.type});}else for(let u of o)for(let s of a)i.push({from:u,to:s,type:n.type});}}resolveNodeIds(t,r,i){var n,o,a,u;if(r==="current"&&((n=i.current)!=null&&n[t]))return [i.current[t].id];if(r==="parent"&&((o=i.parent)!=null&&o[t]))return [i.parent[t].id];if(r==="root"&&((a=i.root)!=null&&a[t]))return [i.root[t].id];if(r.includes("=")){let[s,f]=r.split("=");if((u=i.global)!=null&&u[t])return i.global[t].filter(l=>l[s]===f).map(l=>l.id)}return []}generateNodeId(t,r){let i=t.idField||"id";switch(t.idStrategy){case "fixed":if(!t.idValue)throw new Error(`Fixed ID strategy requires an idValue for node type ${t.type}`);return t.idValue;case "fromData":let n=i==="."?r:this.getNestedValue(r,i.split("."));if(n==null)throw new Error(`ID field '${i}' not found in data for node type ${t.type} using 'fromData' strategy.`);return String(n);case "uuid":default:return X()}}extractNodeProperties(t,r,i){let n={};n.createdAt=K.fromStandardDate(new Date);for(let o of t.properties){let a;if(o.path==="."&&(typeof r!="object"||r===null)?a=r:o.path&&o.path.startsWith("$")?a=this.evaluateContextPath(o.path,i,false):o.path&&(a=this.getNestedValue(r,o.path.split("."))),o.transformerId){let u=this.transformerRegistry.get(o.transformerId);u&&(a=u(a,i,o.transformerParams));}a===void 0&&o.default!==void 0&&(a=o.default),o.type&&(a=this.convertValueToType(a,o.type)),n[o.name]=a;}return n}convertValueToType(t,r){if(t==null)return t;switch(r.toLowerCase()){case "integer":case "int":return Y(t);case "float":case "double":return Number.isFinite(t)?t:parseFloat(t);case "boolean":case "bool":return !!t;case "string":return String(t);case "date":return new Date(t);default:return t}}getNestedValue(t,r){return r.reduce((i,n)=>i&&i[n]!==void 0?i[n]:void 0,t)}async createNodeQuery(t){let{id:r,type:i,...n}=t,o=this.variableGenerator.getNext(),a=this.findNodeDefinition(i),u=(a==null?void 0:a.isReference)===true,f=`
      ${u?"MERGE":"CREATE"} (${o}:${i} {id: $id_${o}}) 
      SET ${o} += $props_${o}
    `,c={[`id_${o}`]:r,[`props_${o}`]:n};return {query:f,params:c,isMerge:u}}findNodeDefinition(t){let r=i=>{let n=i.nodes.find(o=>o.type===t);if(n)return n;if(i.subMappings)for(let o of i.subMappings){let a=r(o);if(a)return a}};return r(this.schema)}async createRelationshipQuery(t){let{from:r,to:i,type:n}=t;return {query:`
      MATCH (source) WHERE source.id = $fromId
      MATCH (target) WHERE target.id = $toId
      CREATE (source)-[${this.variableGenerator.getNext()}:${n}]->(target)
    `,params:{fromId:r,toId:i}}}serializeSchema(){return JSON.stringify(this.schema,null,2)}static fromSerialized(t,r){let i=JSON.parse(t);return new e(i,r)}};exports.JSON2Cypher=q;exports.TransformerRegistry=k;exports.VariableGenerator=B;return exports;})({});