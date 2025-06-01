// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"7Js9b":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "4b8ea06834df32e0";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            if (err.message) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"gH3Lb":[function(require,module,exports,__globalThis) {
var _model = require("./model/model");
var _view = require("./view");
var _controller = require("./controller/controller");
document.addEventListener("DOMContentLoaded", ()=>{
    const model = new (0, _model.Model)();
    const view = new (0, _view.View)();
    const controller = new (0, _controller.Controller)(model, view);
    controller.initialize();
});

},{"./model/model":"04Yt3","./view":"5hI6v","./controller/controller":"gC2t0"}],"04Yt3":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Model", ()=>Model);
var _dataUtils = require("../utils/dataUtils");
var _localStorageGameStorage = require("../storage/localStorageGameStorage");
class Model {
    state = {
        scores: {
            player: 0,
            computer: 0
        },
        moves: {
            player: null,
            computer: null
        },
        taras: {
            player: 0,
            computer: 0
        },
        mostCommonMove: {
            player: null,
            computer: null
        },
        moveCounts: {
            player: {
                rock: 0,
                paper: 0,
                scissors: 0
            },
            computer: {
                rock: 0,
                paper: 0,
                scissors: 0
            }
        },
        globalMatchNumber: null,
        currentMatch: null
    };
    gameStorage;
    constructor(gameStorage = new (0, _localStorageGameStorage.LocalStorageGameStorage)()){
        this.gameStorage = gameStorage;
        this.state.scores.player = this.gameStorage.getScore((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.state.scores.computer = this.gameStorage.getScore((0, _dataUtils.PARTICIPANTS).COMPUTER);
        this.state.taras.player = this.gameStorage.getTaraCount((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.state.taras.computer = this.gameStorage.getTaraCount((0, _dataUtils.PARTICIPANTS).COMPUTER);
        this.state.mostCommonMove.player = this.gameStorage.getMostCommonMove((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.state.mostCommonMove.computer = this.gameStorage.getMostCommonMove((0, _dataUtils.PARTICIPANTS).COMPUTER);
        this.state.moveCounts.player = this.gameStorage.getMoveCounts((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.state.moveCounts.computer = this.gameStorage.getMoveCounts((0, _dataUtils.PARTICIPANTS).COMPUTER);
        this._loadOrMigrateMatchState();
    }
    // ===== General Methods =====
    doesMoveBeat(a, b) {
        return (0, _dataUtils.MOVE_DATA_MAP).get(a)?.beats.includes(b) ?? false;
    }
    handleRoundWin(winner, winningMove) {
        if (this.isStandardMove(winningMove)) {
            const currentTara = this.getTaraCount(winner);
            if (currentTara < 3) this.setTaraCount(winner, currentTara + 1);
        }
    }
    evaluateRound() {
        const playerMove = this.getPlayerMove();
        const computerMove = this.getComputerMove();
        if (playerMove === null || computerMove === null) return "Invalid round";
        this.handleTaraMove((0, _dataUtils.PARTICIPANTS).PLAYER, playerMove);
        this.handleTaraMove((0, _dataUtils.PARTICIPANTS).COMPUTER, computerMove);
        if (playerMove === computerMove) return "It's a tie!";
        if (this.doesMoveBeat(playerMove, computerMove)) {
            this.handleRoundWin((0, _dataUtils.PARTICIPANTS).PLAYER, playerMove);
            this.decrementHealth((0, _dataUtils.PARTICIPANTS).COMPUTER);
            return "You win the round!";
        } else {
            this.handleRoundWin((0, _dataUtils.PARTICIPANTS).COMPUTER, computerMove);
            this.decrementHealth((0, _dataUtils.PARTICIPANTS).PLAYER);
            return "Computer wins the round!";
        }
    }
    isMatchActive() {
        return this.gameStorage.getMatch() !== null;
    }
    // ===== Score Methods =====
    setScore(key, value) {
        this.state.scores[key] = value;
        this.gameStorage.setScore(key, value);
    }
    getScore(key) {
        return this.state.scores[key];
    }
    resetScore(key) {
        this.state.scores[key] = 0;
        this.gameStorage.removeScore(key);
    }
    setPlayerScore(score) {
        this.setScore((0, _dataUtils.PARTICIPANTS).PLAYER, score);
    }
    setComputerScore(score) {
        this.setScore((0, _dataUtils.PARTICIPANTS).COMPUTER, score);
    }
    getPlayerScore() {
        return this.getScore((0, _dataUtils.PARTICIPANTS).PLAYER);
    }
    getComputerScore() {
        return this.getScore((0, _dataUtils.PARTICIPANTS).COMPUTER);
    }
    resetScores() {
        this.resetScore((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.resetScore((0, _dataUtils.PARTICIPANTS).COMPUTER);
    }
    // ===== Move Methods =====
    isStandardMove(value) {
        return typeof value === "string" && value !== (0, _dataUtils.MOVES).TARA;
    }
    setMove(key, move) {
        this.state.moves[key] = move;
    }
    getMove(key) {
        return this.state.moves[key];
    }
    determineMostCommonMove(moveCounts) {
        let mostCommonMove = null;
        let highestCount = 0;
        let hasMoveFrequencyTie = false;
        for (const [move, count] of Object.entries(moveCounts)){
            if (count > highestCount) {
                highestCount = count;
                mostCommonMove = move;
                hasMoveFrequencyTie = false;
            } else if (count === highestCount && count !== 0) hasMoveFrequencyTie = true;
        }
        return hasMoveFrequencyTie ? null : mostCommonMove;
    }
    resetMostCommonMove(key) {
        this.state.mostCommonMove[key] = null;
        this.gameStorage.removeMostCommonMove(key);
    }
    setMostCommonMove(key, moveCounts) {
        const mostCommonMove = this.determineMostCommonMove(moveCounts);
        this.state.mostCommonMove[key] = mostCommonMove;
        this.gameStorage.setMostCommonMove(key, mostCommonMove);
    }
    getMostCommonMove(key) {
        return this.state.mostCommonMove[key];
    }
    getAvailableMoves(hasTara) {
        if (hasTara) return 0, _dataUtils.ALL_MOVE_NAMES;
        else return 0, _dataUtils.STANDARD_MOVE_NAMES;
    }
    getBaseWeights() {
        return {
            [(0, _dataUtils.MOVES).ROCK]: 1,
            [(0, _dataUtils.MOVES).PAPER]: 1,
            [(0, _dataUtils.MOVES).SCISSORS]: 1,
            [(0, _dataUtils.MOVES).TARA]: 0
        };
    }
    getTaraWeight(moves) {
        if (!moves.includes((0, _dataUtils.MOVES).TARA)) return null;
        const { player, computer } = this.state.scores;
        const scoreDiff = player - computer;
        if (scoreDiff > 0) return Math.min(3 + scoreDiff, 10);
        if (scoreDiff < 0) return 1;
        return 2;
    }
    getStandardMoveWeights() {
        const weights = {
            [(0, _dataUtils.MOVES).ROCK]: 1,
            [(0, _dataUtils.MOVES).PAPER]: 1,
            [(0, _dataUtils.MOVES).SCISSORS]: 1
        };
        const mostCommon = this.state.mostCommonMove.player;
        if (!mostCommon) return weights;
        const counterMap = {
            [(0, _dataUtils.MOVES).ROCK]: (0, _dataUtils.MOVES).PAPER,
            [(0, _dataUtils.MOVES).PAPER]: (0, _dataUtils.MOVES).SCISSORS,
            [(0, _dataUtils.MOVES).SCISSORS]: (0, _dataUtils.MOVES).ROCK
        };
        const counter = counterMap[mostCommon];
        return {
            [(0, _dataUtils.MOVES).ROCK]: counter === (0, _dataUtils.MOVES).ROCK ? 5 : 2,
            [(0, _dataUtils.MOVES).PAPER]: counter === (0, _dataUtils.MOVES).PAPER ? 5 : 2,
            [(0, _dataUtils.MOVES).SCISSORS]: counter === (0, _dataUtils.MOVES).SCISSORS ? 5 : 2
        };
    }
    chooseWeightedRandomMove(moves, weights) {
        const weightedPool = moves.flatMap((move)=>Array(weights[move]).fill(move));
        const randomIndex = Math.floor(Math.random() * weightedPool.length);
        return weightedPool[randomIndex];
    }
    getComputerMoveWeights(moves) {
        const baseWeights = this.getBaseWeights();
        const taraWeight = this.getTaraWeight(moves);
        const standardWeights = this.getStandardMoveWeights();
        return {
            ...baseWeights,
            ...standardWeights,
            ...taraWeight !== null ? {
                [(0, _dataUtils.MOVES).TARA]: taraWeight
            } : {}
        };
    }
    getWeightedComputerMove() {
        const hasTara = this.getComputerTaraCount() > 0;
        const availableMoves = this.getAvailableMoves(hasTara);
        const weights = this.getComputerMoveWeights(availableMoves);
        return this.chooseWeightedRandomMove(availableMoves, weights);
    }
    setPlayerMove(move) {
        this.setMove((0, _dataUtils.PARTICIPANTS).PLAYER, move);
    }
    getPlayerMove() {
        return this.getMove((0, _dataUtils.PARTICIPANTS).PLAYER);
    }
    setComputerMove(move) {
        this.setMove((0, _dataUtils.PARTICIPANTS).COMPUTER, move);
    }
    getComputerMove() {
        return this.getMove((0, _dataUtils.PARTICIPANTS).COMPUTER);
    }
    resetMoves() {
        this.setPlayerMove(null);
        this.setComputerMove(null);
    }
    chooseComputerMove() {
        const move = this.getWeightedComputerMove();
        this.registerComputerMove(move);
    }
    registerPlayerMove(move) {
        this.setPlayerMove(move);
        if (this.isStandardMove(move)) {
            this.setMoveCounts((0, _dataUtils.PARTICIPANTS).PLAYER, move);
            this.setPlayerMostCommonMove();
        }
    }
    registerComputerMove(move) {
        this.setComputerMove(move);
        if (this.isStandardMove(move)) {
            this.setMoveCounts((0, _dataUtils.PARTICIPANTS).COMPUTER, move);
            this.setComputerMostCommonMove();
        }
    }
    setPlayerMostCommonMove() {
        const moveCounts = this.getMoveCounts((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.setMostCommonMove((0, _dataUtils.PARTICIPANTS).PLAYER, moveCounts);
    }
    setComputerMostCommonMove() {
        const moveCounts = this.getMoveCounts((0, _dataUtils.PARTICIPANTS).COMPUTER);
        this.setMostCommonMove((0, _dataUtils.PARTICIPANTS).COMPUTER, moveCounts);
    }
    resetMostCommonMoves() {
        this.resetMostCommonMove((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.resetMostCommonMove((0, _dataUtils.PARTICIPANTS).COMPUTER);
    }
    getPlayerMostCommonMove() {
        return this.getMostCommonMove((0, _dataUtils.PARTICIPANTS).PLAYER);
    }
    getComputerMostCommonMove() {
        return this.getMostCommonMove((0, _dataUtils.PARTICIPANTS).COMPUTER);
    }
    setMoveCounts(key, move) {
        this.state.moveCounts[key][move] = (this.state.moveCounts[key][move] || 0) + 1;
        this.gameStorage.setMoveCounts(key, this.state.moveCounts[key]);
    }
    resetMoveCounts(key) {
        this.state.moveCounts[key] = {
            rock: 0,
            paper: 0,
            scissors: 0
        };
        this.gameStorage.removeMoveCounts(key);
    }
    getMoveCounts(key) {
        return this.state.moveCounts[key];
    }
    resetBothMoveCounts() {
        this.resetMoveCounts((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.resetMoveCounts((0, _dataUtils.PARTICIPANTS).COMPUTER);
    }
    showMostCommonMove() {
        return this.getPlayerMostCommonMove() !== null || this.getComputerMostCommonMove() !== null;
    }
    resetHistory(key) {
        this.gameStorage.removeHistory(key);
    }
    resetHistories() {
        this.resetHistory((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.resetHistory((0, _dataUtils.PARTICIPANTS).COMPUTER);
    }
    // ===== Round Methods =====
    getRoundNumber() {
        return this.state.currentMatch?.matchRoundNumber ?? 1;
    }
    setRoundNumber(value) {
        if (!this.state.currentMatch) return;
        this.state.currentMatch.matchRoundNumber = value;
        this.gameStorage.setMatch(this.state.currentMatch);
    }
    increaseRoundNumber() {
        const current = this.getRoundNumber();
        this.setRoundNumber(current + 1);
    }
    // ===== Tara Methods =====
    decrementTaraCount(key) {
        const current = this.getTaraCount(key);
        if (current > 1) this.setTaraCount(key, current - 1);
        else if (current === 1) this.resetTaraCount(key);
    }
    handleTaraMove(key, move) {
        if (move === (0, _dataUtils.MOVES).TARA) {
            const currentTara = this.getTaraCount(key);
            if (currentTara > 0) this.decrementTaraCount(key);
            else this.setMove(key, (0, _dataUtils.MOVES).ROCK);
        }
    }
    setTaraCount(key, value) {
        this.state.taras[key] = value;
        this.gameStorage.setTaraCount(key, value);
    }
    getTaraCount(key) {
        return this.state.taras[key];
    }
    resetTaraCount(key) {
        this.state.taras[key] = 0;
        this.gameStorage.removeTaraCount(key);
    }
    setPlayerTaraCount(count) {
        this.setTaraCount((0, _dataUtils.PARTICIPANTS).PLAYER, count);
    }
    setComputerTaraCount(count) {
        this.setTaraCount((0, _dataUtils.PARTICIPANTS).COMPUTER, count);
    }
    resetTaras() {
        this.resetTaraCount((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.resetTaraCount((0, _dataUtils.PARTICIPANTS).COMPUTER);
    }
    getPlayerTaraCount() {
        return this.getTaraCount((0, _dataUtils.PARTICIPANTS).PLAYER);
    }
    getComputerTaraCount() {
        return this.getTaraCount((0, _dataUtils.PARTICIPANTS).COMPUTER);
    }
    taraIsEnabled() {
        return this.getTaraCount((0, _dataUtils.PARTICIPANTS).PLAYER) > 0;
    }
    // ===== Match Methods =====
    handleMatchWin() {
        const winner = this.getMatchWinner();
        this.setScore(winner, this.getScore(winner) + 1);
        return winner;
    }
    setMatch(match) {
        this.state.currentMatch = match;
        this.gameStorage.setMatch(match);
    }
    setMatchNumber(matchNumber) {
        this.state.globalMatchNumber = matchNumber;
        this.gameStorage.setGlobalMatchNumber(matchNumber);
    }
    /**
     * Sets default match data if no match is currently active.
     *
     * Used as a fallback when no match data is loaded (e.g., from `_loadOrMigrateMatchState()`).
     * Does not overwrite existing match state.
     */ setDefaultMatchData() {
        const isMatchActive = this.isMatchActive();
        if (!isMatchActive) this.setMatch({
            ...(0, _dataUtils.DEFAULT_MATCH)
        });
    }
    resetMatchData() {
        this.state.currentMatch = null;
        this.gameStorage.setMatch(null);
        this.setMatchNumber(null);
    }
    getMatchNumber() {
        return this.state.globalMatchNumber ?? 1;
    }
    isMatchOver() {
        return this.isDefeated((0, _dataUtils.PARTICIPANTS).PLAYER) || this.isDefeated((0, _dataUtils.PARTICIPANTS).COMPUTER);
    }
    getMatchWinner() {
        if (this.isDefeated((0, _dataUtils.PARTICIPANTS).PLAYER)) return (0, _dataUtils.PARTICIPANTS).COMPUTER;
        else return (0, _dataUtils.PARTICIPANTS).PLAYER;
    }
    incrementMatchNumber() {
        const currentMatchNumber = this.getMatchNumber();
        this.setMatchNumber(currentMatchNumber + 1);
    }
    /**
     * Initializes the game state based on available storage.
     *
     * This method is called during Model construction. It checks for:
     * - A valid saved match (loads it and skips migration),
     * - An old-format global round number (migrates it into a new match),
     * - Or no valid data (leaves currentMatch unset).
     *
     * It also ensures the global match number is set appropriately.
     */ _loadOrMigrateMatchState() {
        if (this.isMatchActive()) {
            this._loadExistingMatchState();
            return;
        }
        const oldGlobalRoundNumber = this.gameStorage.getOldGlobalRoundNumber();
        if (oldGlobalRoundNumber !== null && oldGlobalRoundNumber > 0) this._migrateOldData(oldGlobalRoundNumber);
    // Otherwise: no migration, and no existing match — do nothing.
    }
    /**
     * Loads state for an existing match stored in the new format.
     */ _loadExistingMatchState() {
        this.state.globalMatchNumber = this.gameStorage.getGlobalMatchNumber();
        this.state.currentMatch = this.gameStorage.getMatch();
    }
    /**
     * Migrates match state from an older game version to the current format.
     *
     * @param oldRoundNumber - The round number from the old game format.
     */ _migrateOldData(oldRoundNumber) {
        const migratedMatch = {
            matchRoundNumber: oldRoundNumber,
            playerHealth: (0, _dataUtils.INITIAL_HEALTH),
            computerHealth: (0, _dataUtils.INITIAL_HEALTH),
            initialHealth: (0, _dataUtils.INITIAL_HEALTH),
            damagePerLoss: (0, _dataUtils.DAMAGE_PER_LOSS)
        };
        this.setMatch(migratedMatch);
        this.gameStorage.removeOldGlobalRoundNumber();
        this.state.globalMatchNumber = 1;
        this.gameStorage.setGlobalMatchNumber(this.state.globalMatchNumber);
    }
    // ===== Health Methods =====
    getHealthKey(participant) {
        return (0, _dataUtils.HEALTH_KEYS)[participant];
    }
    getHealth(participant) {
        const match = this.state.currentMatch;
        if (!match) return null;
        const key = this.getHealthKey(participant);
        return match[key];
    }
    decrementHealth(participant) {
        const match = this.state.currentMatch;
        if (!match) return false;
        const key = this.getHealthKey(participant);
        const currentHealth = match[key];
        if (currentHealth <= 0) return false;
        match[key] = Math.max(0, currentHealth - (0, _dataUtils.DAMAGE_PER_LOSS));
        return true;
    }
    isDefeated(participant) {
        const health = this.getHealth(participant);
        return health !== null && health <= 0;
    }
}

},{"../utils/dataUtils":"hnBcW","../storage/localStorageGameStorage":"ht5L2","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"hnBcW":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PARTICIPANTS", ()=>PARTICIPANTS);
parcelHelpers.export(exports, "INITIAL_ROUND_NUMBER", ()=>INITIAL_ROUND_NUMBER);
parcelHelpers.export(exports, "INITIAL_HEALTH", ()=>INITIAL_HEALTH);
parcelHelpers.export(exports, "DAMAGE_PER_LOSS", ()=>DAMAGE_PER_LOSS);
parcelHelpers.export(exports, "DEFAULT_MATCH_NUMBER", ()=>DEFAULT_MATCH_NUMBER);
parcelHelpers.export(exports, "DEFAULT_MATCH", ()=>DEFAULT_MATCH);
parcelHelpers.export(exports, "HEALTH_KEYS", ()=>HEALTH_KEYS);
parcelHelpers.export(exports, "MOVES", ()=>MOVES);
parcelHelpers.export(exports, "MOVE_DATA", ()=>MOVE_DATA);
parcelHelpers.export(exports, "ALL_MOVE_NAMES", ()=>ALL_MOVE_NAMES);
parcelHelpers.export(exports, "MOVE_DATA_MAP", ()=>MOVE_DATA_MAP);
parcelHelpers.export(exports, "STANDARD_MOVE_DATA", ()=>STANDARD_MOVE_DATA);
parcelHelpers.export(exports, "STANDARD_MOVE_NAMES", ()=>STANDARD_MOVE_NAMES);
parcelHelpers.export(exports, "STANDARD_MOVE_DATA_MAP", ()=>STANDARD_MOVE_DATA_MAP);
const PARTICIPANTS = {
    PLAYER: "player",
    COMPUTER: "computer"
};
const INITIAL_ROUND_NUMBER = 1;
const INITIAL_HEALTH = 100;
const DAMAGE_PER_LOSS = 50;
const DEFAULT_MATCH_NUMBER = 1;
const DEFAULT_MATCH = {
    matchRoundNumber: INITIAL_ROUND_NUMBER,
    playerHealth: INITIAL_HEALTH,
    computerHealth: INITIAL_HEALTH
};
const HEALTH_KEYS = {
    player: "playerHealth",
    computer: "computerHealth"
};
const MOVES = {
    ROCK: "rock",
    PAPER: "paper",
    SCISSORS: "scissors",
    TARA: "tara"
};
const MOVE_DATA = [
    {
        name: MOVES.ROCK,
        beats: [
            MOVES.SCISSORS
        ]
    },
    {
        name: MOVES.PAPER,
        beats: [
            MOVES.ROCK
        ]
    },
    {
        name: MOVES.SCISSORS,
        beats: [
            MOVES.PAPER
        ]
    },
    {
        name: MOVES.TARA,
        beats: [
            MOVES.ROCK,
            MOVES.PAPER,
            MOVES.SCISSORS
        ]
    }
];
const ALL_MOVE_NAMES = MOVE_DATA.map((data)=>data.name);
const MOVE_DATA_MAP = new Map(MOVE_DATA.map((move)=>[
        move.name,
        move
    ]));
const STANDARD_MOVE_DATA = MOVE_DATA.filter((move)=>move.name !== MOVES.TARA);
const STANDARD_MOVE_NAMES = STANDARD_MOVE_DATA.map((data)=>data.name);
const STANDARD_MOVE_DATA_MAP = new Map(STANDARD_MOVE_DATA.map((move)=>[
        move.name,
        move
    ]));

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"jnFvT":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"ht5L2":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Implementation of IGameStorage using browser's localStorage.
 */ parcelHelpers.export(exports, "LocalStorageGameStorage", ()=>LocalStorageGameStorage);
var _dataUtils = require("../utils/dataUtils");
const KEY_SUFFIX_SCORE = "Score";
const KEY_SUFFIX_TARA_COUNT = "TaraCount";
const KEY_SUFFIX_MOST_COMMON_MOVE = "MostCommonMove";
const KEY_SUFFIX_MOVE_COUNTS = "MoveCounts";
const KEY_SUFFIX_HISTORY = "History";
const KEY_ROUND_NUMBER = "roundNumber";
const KEY_GLOBAL_MATCH_NUMBER = "globalMatchNumber";
const KEY_CURRENT_MATCH = "currentMatch";
const DEFAULT_NUMERIC_VALUE = 0;
const DEFAULT_MOVE_COUNTS = {
    [(0, _dataUtils.MOVES).ROCK]: 0,
    [(0, _dataUtils.MOVES).PAPER]: 0,
    [(0, _dataUtils.MOVES).SCISSORS]: 0
};
class LocalStorageGameStorage {
    formatKey(participant, suffix) {
        return `${participant}${suffix}`;
    }
    safelySetItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn(`LocalStorage Error: Failed to save "${key}".`, e);
        }
    }
    // ===== Getters =====
    getScore(participant) {
        const key = this.formatKey(participant, KEY_SUFFIX_SCORE);
        return parseInt(localStorage.getItem(key) || DEFAULT_NUMERIC_VALUE.toString(), 10);
    }
    getTaraCount(participant) {
        const key = this.formatKey(participant, KEY_SUFFIX_TARA_COUNT);
        return parseInt(localStorage.getItem(key) || DEFAULT_NUMERIC_VALUE.toString(), 10);
    }
    getMostCommonMove(participant) {
        const key = this.formatKey(participant, KEY_SUFFIX_MOST_COMMON_MOVE);
        const move = localStorage.getItem(key);
        return move && (0, _dataUtils.STANDARD_MOVE_NAMES).includes(move) ? move : null;
    }
    getMoveCounts(participant) {
        const key = this.formatKey(participant, KEY_SUFFIX_MOVE_COUNTS);
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : DEFAULT_MOVE_COUNTS;
        } catch (e) {
            console.warn(`LocalStorage Error: Failed to parse "${key}".`, e);
            return DEFAULT_MOVE_COUNTS;
        }
    }
    getGlobalMatchNumber() {
        const stored = localStorage.getItem(KEY_GLOBAL_MATCH_NUMBER);
        return stored !== null ? parseInt(stored, 10) : null;
    }
    getMatch() {
        try {
            const raw = localStorage.getItem(KEY_CURRENT_MATCH);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.warn(`LocalStorage Error: Failed to parse currentMatch.`, e);
            return null;
        }
    }
    getOldGlobalRoundNumber() {
        const roundString = localStorage.getItem(KEY_ROUND_NUMBER);
        // If the item doesn't exist in localStorage, getItem returns null.
        if (roundString === null) return null;
        // Attempt to parse the string to an integer.
        const parsedRound = parseInt(roundString, 10);
        // Check if parsing resulted in NaN (Not a Number), meaning the stored value was invalid.
        if (isNaN(parsedRound)) {
            console.warn(`Legacy 'roundNumber' in localStorage (${roundString}) is not a valid number. Skipping migration.`);
            return null; // Treat invalid data as if it doesn't exist for migration purposes
        }
        return parsedRound;
    }
    // ===== Setters =====
    setScore(participant, score) {
        const key = this.formatKey(participant, KEY_SUFFIX_SCORE);
        this.safelySetItem(key, score.toString());
    }
    setTaraCount(participant, count) {
        const key = this.formatKey(participant, KEY_SUFFIX_TARA_COUNT);
        this.safelySetItem(key, count.toString());
    }
    setMostCommonMove(participant, move) {
        const key = this.formatKey(participant, KEY_SUFFIX_MOST_COMMON_MOVE);
        if (move) this.safelySetItem(key, move);
        else localStorage.removeItem(key);
    }
    setMoveCounts(participant, moveCounts) {
        const key = this.formatKey(participant, KEY_SUFFIX_MOVE_COUNTS);
        this.safelySetItem(key, JSON.stringify(moveCounts));
    }
    setGlobalMatchNumber(matchNumber) {
        if (matchNumber) this.safelySetItem(KEY_GLOBAL_MATCH_NUMBER, matchNumber.toString());
        else localStorage.removeItem(KEY_GLOBAL_MATCH_NUMBER);
    }
    setMatch(match) {
        if (match) this.safelySetItem(KEY_CURRENT_MATCH, JSON.stringify(match));
        else localStorage.removeItem(KEY_CURRENT_MATCH);
    }
    // ===== Removers =====
    removeScore(participant) {
        const key = this.formatKey(participant, KEY_SUFFIX_SCORE);
        localStorage.removeItem(key);
    }
    removeTaraCount(participant) {
        const key = this.formatKey(participant, KEY_SUFFIX_TARA_COUNT);
        localStorage.removeItem(key);
    }
    removeMostCommonMove(participant) {
        const key = this.formatKey(participant, KEY_SUFFIX_MOST_COMMON_MOVE);
        localStorage.removeItem(key);
    }
    removeMoveCounts(participant) {
        const key = this.formatKey(participant, KEY_SUFFIX_MOVE_COUNTS);
        localStorage.removeItem(key);
    }
    removeHistory(participant) {
        const key = this.formatKey(participant, KEY_SUFFIX_HISTORY);
        localStorage.removeItem(key);
    }
    removeGlobalMatchNumber() {
        localStorage.removeItem(KEY_GLOBAL_MATCH_NUMBER);
    }
    removeOldGlobalRoundNumber() {
        localStorage.removeItem(KEY_ROUND_NUMBER);
    }
}

},{"../utils/dataUtils":"hnBcW","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"5hI6v":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "View", ()=>View);
var _dataUtils = require("./utils/dataUtils");
class View {
    messageEl = document.getElementById("message");
    playerScoreEl = document.getElementById("player-score");
    computerScoreEl = document.getElementById("computer-score");
    playerHealthEl = document.getElementById("player-health");
    computerHealthEl = document.getElementById("computer-health");
    playerMostCommonMoveEl = document.getElementById("player-most-common-move");
    computerMostCommonMoveEl = document.getElementById("computer-most-common-move");
    movesEl = document.getElementById("round-moves");
    resultEl = document.getElementById("round-result");
    taraBtn = document.getElementById("tara");
    startBtn = document.getElementById("start");
    // ===== General Methods =====
    updateMessage(text) {
        if (this.messageEl) this.messageEl.textContent = text;
    }
    toggleStartButton(show) {
        const btn = document.getElementById("start");
        if (btn) btn.style.display = show ? "inline" : "none";
    }
    updateRound(round) {
        const roundElem = document.getElementById("round");
        if (roundElem) {
            roundElem.textContent = `Round ${round}`;
            roundElem.style.display = "block";
        }
    }
    updateMatch(match) {
        const matchElem = document.getElementById("match");
        if (matchElem) {
            matchElem.textContent = `Match ${match}`;
            matchElem.style.display = "block";
        }
    }
    showRoundOutcome(playerMove, computerMove, result) {
        this.movesEl.textContent = `You played ${playerMove}. Computer played ${computerMove}.`;
        this.resultEl.textContent = result.toUpperCase();
        this.movesEl.style.display = "block";
        this.resultEl.style.display = "block";
    }
    showMatchOutcome(playerMove, computerMove, winner) {
        this.movesEl.textContent = `You played ${playerMove}. Computer played ${computerMove}.`;
        this.resultEl.textContent = `${winner.toUpperCase()} WON THE MATCH!`;
        this.movesEl.style.display = "block";
        this.resultEl.style.display = "block";
    }
    toggleResetGameState(show) {
        const btn = document.getElementById("reset-game-state");
        if (btn) btn.style.display = show ? "inline-block" : "none";
    }
    toggleMoveButtons(show) {
        Object.values((0, _dataUtils.MOVES)).forEach((move)=>{
            const btn = document.getElementById(move);
            if (btn) btn.style.display = show ? "inline" : "none";
        });
    }
    togglePlayAgain(show) {
        const btn = document.getElementById("play-again");
        if (btn) btn.style.display = show ? "inline-block" : "none";
    }
    toggleMostCommonMoveTable(show) {
        const table = document.getElementById("most-common-move-table");
        if (table) table.style.display = show ? "table" : "none";
    }
    resetForNextRound() {
        this.toggleHealthTable(true);
        this.toggleMostCommonMoveTable(true);
        this.toggleMoveButtons(true);
        this.togglePlayAgain(false);
        this.movesEl.style.display = "none";
        this.resultEl.style.display = "none";
    }
    updateStartButton(isMatchActive) {
        if (this.startBtn && isMatchActive) this.startBtn.textContent = `Resume Match`;
        else if (this.startBtn && !isMatchActive) this.startBtn.textContent = `Start Match`;
    }
    // ===== Score Methods =====
    updateScores(player, computer) {
        if (this.playerScoreEl) this.playerScoreEl.textContent = player.toString();
        if (this.computerScoreEl) this.computerScoreEl.textContent = computer.toString();
    }
    // ===== Tara Methods =====
    updateTaraCounts(playerCount, computerCount) {
        document.getElementById("player-tara").textContent = playerCount.toString();
        document.getElementById("computer-tara").textContent = computerCount.toString();
    }
    updateTaraButton(isEnabled, taraCount) {
        if (this.taraBtn instanceof HTMLButtonElement) this.taraBtn.disabled = !isEnabled;
        this.taraBtn.textContent = `Tara (x${taraCount})`;
    }
    // ===== History Methods =====
    updateMostCommonMoves(player, computer) {
        if (this.playerMostCommonMoveEl) this.playerMostCommonMoveEl.textContent = player ?? "X";
        if (this.computerMostCommonMoveEl) this.computerMostCommonMoveEl.textContent = computer ?? "X";
    }
    // ===== Health Methods =====
    updateHealth(playerHealth, computerHealth) {
        this.playerHealthEl.textContent = (playerHealth ?? 0).toString();
        this.computerHealthEl.textContent = (computerHealth ?? 0).toString();
    }
    toggleHealthTable(show) {
        const table = document.getElementById("health-table");
        if (table) table.style.display = show ? "table" : "none";
    }
}

},{"./utils/dataUtils":"hnBcW","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"gC2t0":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Controller", ()=>Controller);
var _dataUtils = require("../utils/dataUtils");
class Controller {
    model;
    view;
    constructor(model, view){
        this.model = model;
        this.view = view;
    }
    updateScoreView() {
        this.view.updateScores(this.model.getPlayerScore(), this.model.getComputerScore());
    }
    updateTaraView() {
        this.view.updateTaraCounts(this.model.getPlayerTaraCount(), this.model.getComputerTaraCount());
    }
    updateMostCommonMoveView() {
        this.view.updateMostCommonMoves(this.model.getPlayerMostCommonMove(), this.model.getComputerMostCommonMove());
    }
    updateHealthView() {
        this.view.updateHealth(this.model.getHealth((0, _dataUtils.PARTICIPANTS).PLAYER), this.model.getHealth((0, _dataUtils.PARTICIPANTS).COMPUTER));
    }
    updateTaraButtonView() {
        const isEnabled = this.model.taraIsEnabled();
        const taraCount = this.model.getPlayerTaraCount();
        this.view.updateTaraButton(isEnabled, taraCount);
    }
    startGame() {
        const roundNumber = this.model.getRoundNumber();
        const matchNumber = this.model.getMatchNumber();
        const showMostCommonMove = this.model.showMostCommonMove();
        this.model.setDefaultMatchData();
        this.view.updateRound(roundNumber);
        this.view.updateMatch(matchNumber);
        this.view.toggleStartButton(false);
        this.view.toggleResetGameState(false);
        this.view.toggleHealthTable(true);
        this.view.toggleMostCommonMoveTable(showMostCommonMove);
        this.view.toggleMoveButtons(true);
        this.updateHealthView();
    }
    endRound() {
        const playerMove = this.model.getPlayerMove();
        const computerMove = this.model.getComputerMove();
        const result = this.model.evaluateRound();
        const isMatchOver = this.model.isMatchOver();
        this.updateHealthView();
        if (isMatchOver) {
            const winner = this.model.handleMatchWin();
            this.view.showMatchOutcome(playerMove, computerMove, winner);
            this.model.incrementMatchNumber();
            this.model.setMatch(null);
        } else {
            this.view.showRoundOutcome(playerMove, computerMove, result);
            this.model.increaseRoundNumber();
        }
        this.view.toggleMostCommonMoveTable(false);
        this.view.toggleMoveButtons(false);
        this.view.togglePlayAgain(true);
        this.updateScoreView();
        this.updateTaraView();
        this.updateMostCommonMoveView();
        this.updateTaraButtonView();
    }
    handleNextRound() {
        this.model.setDefaultMatchData();
        const roundNumber = this.model.getRoundNumber();
        const matchNumber = this.model.getMatchNumber();
        this.updateHealthView();
        this.view.updateRound(roundNumber);
        this.view.updateMatch(matchNumber);
        this.view.resetForNextRound();
    }
    resetGameState() {
        this.model.resetScores();
        this.model.resetMoves();
        this.model.resetTaras();
        this.model.resetHistories();
        this.model.resetBothMoveCounts();
        this.model.resetMostCommonMoves();
        this.model.resetMatchData();
        this.updateScoreView();
        this.updateTaraView();
        this.updateHealthView();
        this.updateMostCommonMoveView();
        this.updateTaraButtonView();
        const isMatchActive = this.model.isMatchActive();
        this.view.updateStartButton(isMatchActive);
    }
    handlePlayerMove(move) {
        this.model.resetMoves();
        this.model.registerPlayerMove(move);
        this.model.chooseComputerMove();
        this.endRound();
    }
    initialize() {
        const isMatchActive = this.model.isMatchActive();
        this.view.updateMessage("Rock, Paper, Scissors, Tara");
        this.updateScoreView();
        this.updateTaraView();
        this.updateMostCommonMoveView();
        this.updateTaraButtonView();
        this.view.updateStartButton(isMatchActive);
        this.view.toggleHealthTable(false);
        this.view.toggleMostCommonMoveTable(false);
        this.view.toggleMoveButtons(false);
        this.view.togglePlayAgain(false);
        this.view.toggleStartButton(true);
        document.getElementById("start")?.addEventListener("click", ()=>this.startGame());
        document.getElementById("play-again")?.addEventListener("click", ()=>this.handleNextRound());
        Object.values((0, _dataUtils.MOVES)).forEach((move)=>{
            document.getElementById(move)?.addEventListener("click", ()=>this.handlePlayerMove(move));
        });
        document.getElementById("reset-game-state")?.addEventListener("click", ()=>this.resetGameState());
    }
}

},{"../utils/dataUtils":"hnBcW","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}]},["7Js9b","gH3Lb"], "gH3Lb", "parcelRequire232d")

//# sourceMappingURL=public.34df32e0.js.map
