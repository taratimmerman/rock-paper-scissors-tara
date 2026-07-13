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
  externals,
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
        if (externals[name]) {
          return externals[name];
        }
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
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
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
  function $parcel$resolve(url) {  url = importMap[url] || url;  return import.meta.resolve(distDir + url);}newRequire.resolve = $parcel$resolve;

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
})({"3dtlh":[function(require,module,exports,__globalThis) {
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
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
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
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _model = require("./model/model");
var _controller = require("./controller/controller");
var _arenaView = require("./views/arena/ArenaView");
var _arenaViewDefault = parcelHelpers.interopDefault(_arenaView);
var _controlsView = require("./views/controls/ControlsView");
var _controlsViewDefault = parcelHelpers.interopDefault(_controlsView);
var _gameView = require("./views/game/GameView");
var _gameViewDefault = parcelHelpers.interopDefault(_gameView);
var _menuView = require("./views/menu/MenuView");
var _menuViewDefault = parcelHelpers.interopDefault(_menuView);
var _statsView = require("./views/stats/StatsView");
var _statsViewDefault = parcelHelpers.interopDefault(_statsView);
var _statusView = require("./views/status/StatusView");
var _statusViewDefault = parcelHelpers.interopDefault(_statusView);
document.addEventListener("DOMContentLoaded", ()=>{
    const model = new (0, _model.Model)();
    const controller = new (0, _controller.Controller)(model, {
        arenaView: new (0, _arenaViewDefault.default)(),
        controlsView: new (0, _controlsViewDefault.default)(),
        gameView: new (0, _gameViewDefault.default)(),
        menuView: new (0, _menuViewDefault.default)(),
        statsView: new (0, _statsViewDefault.default)(),
        statusView: new (0, _statusViewDefault.default)()
    });
    controller.initialize();
});

},{"./model/model":"04Yt3","./controller/controller":"gC2t0","./views/arena/ArenaView":"3JtbA","./views/controls/ControlsView":"h40xR","./views/game/GameView":"6jvBq","./views/menu/MenuView":"bsCwB","./views/stats/StatsView":"gGdhp","./views/status/StatusView":"1xK0k","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"04Yt3":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Model", ()=>Model);
var _dataUtils = require("../utils/dataUtils");
var _adaptiveComputer = require("../utils/computer/AdaptiveComputer");
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
    computer;
    constructor(gameStorage = new (0, _localStorageGameStorage.LocalStorageGameStorage)(), computer = new (0, _adaptiveComputer.AdaptiveComputer)()){
        this.gameStorage = gameStorage;
        this.computer = computer;
        this.state.scores.player = this.gameStorage.getScore((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.state.scores.computer = this.gameStorage.getScore((0, _dataUtils.PARTICIPANTS).COMPUTER);
        this.state.taras.player = this.gameStorage.getTaraCount((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.state.taras.computer = this.gameStorage.getTaraCount((0, _dataUtils.PARTICIPANTS).COMPUTER);
        this.state.mostCommonMove.player = this.gameStorage.getMostCommonMove((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.state.mostCommonMove.computer = this.gameStorage.getMostCommonMove((0, _dataUtils.PARTICIPANTS).COMPUTER);
        this.state.moveCounts.player = this.gameStorage.getMoveCounts((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.state.moveCounts.computer = this.gameStorage.getMoveCounts((0, _dataUtils.PARTICIPANTS).COMPUTER);
        this._loadMatchState();
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
    determineWinner(playerMove, computerMove) {
        if (playerMove === computerMove) return "tie";
        return this.doesMoveBeat(playerMove, computerMove) ? (0, _dataUtils.PARTICIPANTS).PLAYER : (0, _dataUtils.PARTICIPANTS).COMPUTER;
    }
    applyRoundResults(winner, pMove, cMove, damage) {
        if (winner === "tie") {
            this.decrementHealth((0, _dataUtils.PARTICIPANTS).PLAYER, damage);
            this.decrementHealth((0, _dataUtils.PARTICIPANTS).COMPUTER, damage);
            return;
        }
        const winningMove = winner === (0, _dataUtils.PARTICIPANTS).PLAYER ? pMove : cMove;
        const loser = winner === (0, _dataUtils.PARTICIPANTS).PLAYER ? (0, _dataUtils.PARTICIPANTS).COMPUTER : (0, _dataUtils.PARTICIPANTS).PLAYER;
        this.handleRoundWin(winner, winningMove);
        this.decrementHealth(loser, damage);
    }
    evaluateRound() {
        const rawPlayerMove = this.getPlayerMove();
        const rawComputerMove = this.getComputerMove();
        if (!rawPlayerMove || !rawComputerMove) throw new Error("Cannot evaluate round with missing moves.");
        // Step 1: Validate intended moves (Handles Tara consumption/penalties)
        const pMove = this.getEffectiveMove((0, _dataUtils.PARTICIPANTS).PLAYER, rawPlayerMove);
        const cMove = this.getEffectiveMove((0, _dataUtils.PARTICIPANTS).COMPUTER, rawComputerMove);
        // Step 2: Calculate the outcome
        const winner = this.determineWinner(pMove, cMove);
        const taraInPlay = pMove === (0, _dataUtils.MOVES).TARA || cMove === (0, _dataUtils.MOVES).TARA;
        const damage = this.getDamageAmount(winner === "tie", taraInPlay);
        // Step 3: Apply the outcome to the Model's state
        this.applyRoundResults(winner, pMove, cMove, damage);
        // Step 4: Return pure data for the Controller/View to use
        return {
            winner,
            damageCalculated: damage,
            isDoubleKO: this.isDoubleKO()
        };
    }
    isMatchActive() {
        return this.gameStorage.getMatch() !== null;
    }
    resetGame() {
        this.resetScores();
        this.resetTaras();
        this.resetMostCommonMoves();
        this.resetMoveCounts();
        this.resetMatchData();
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
    resetScores() {
        this.resetScore((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.resetScore((0, _dataUtils.PARTICIPANTS).COMPUTER);
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
    resetMostCommonMoves() {
        this.resetMostCommonMove((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.resetMostCommonMove((0, _dataUtils.PARTICIPANTS).COMPUTER);
    }
    setMostCommonMove(key, moveCounts) {
        const mostCommonMove = this.determineMostCommonMove(moveCounts);
        this.state.mostCommonMove[key] = mostCommonMove;
        this.gameStorage.setMostCommonMove(key, mostCommonMove);
    }
    getMostCommonMove(key) {
        return this.state.mostCommonMove[key];
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
    getCalculatedComputerMove() {
        return this.computer.calculateNextMove(this.state);
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
    resetMoveCount(key) {
        this.state.moveCounts[key] = {
            rock: 0,
            paper: 0,
            scissors: 0
        };
        this.gameStorage.removeMoveCounts(key);
    }
    resetMoveCounts() {
        this.resetMoveCount((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.resetMoveCount((0, _dataUtils.PARTICIPANTS).COMPUTER);
    }
    getMoveCounts(key) {
        return this.state.moveCounts[key];
    }
    showMostCommonMove() {
        return this.getPlayerMostCommonMove() !== null || this.getComputerMostCommonMove() !== null;
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
        this.setRoundNumber(this.getRoundNumber() + 1);
    }
    isTie() {
        const playerMove = this.getPlayerMove();
        const computerMove = this.getComputerMove();
        const isTaraTie = playerMove === (0, _dataUtils.MOVES).TARA && computerMove === (0, _dataUtils.MOVES).TARA;
        if (isTaraTie) return "tara-tie";
        return playerMove !== null && computerMove !== null && playerMove === computerMove ? true : false;
    }
    // ===== Tara Methods =====
    decrementTaraCount(key) {
        const current = this.getTaraCount(key);
        if (current > 1) this.setTaraCount(key, current - 1);
        else if (current === 1) this.resetTaraCount(key);
    }
    /**
     * Checks if a Tara move is valid. If valid, consumes a charge.
     * If invalid (no charges left), forces the move to ROCK as a fallback.
     */ getEffectiveMove(participant, intendedMove) {
        if (intendedMove !== (0, _dataUtils.MOVES).TARA) return intendedMove;
        if (this.getTaraCount(participant) > 0) {
            this.decrementTaraCount(participant);
            return (0, _dataUtils.MOVES).TARA; // Valid Tara
        }
        // Invalid Tara! Force fallback to Rock and update the state to match.
        this.setMove(participant, (0, _dataUtils.MOVES).ROCK);
        return (0, _dataUtils.MOVES).ROCK;
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
    resetTaras() {
        this.resetTaraCount((0, _dataUtils.PARTICIPANTS).PLAYER);
        this.resetTaraCount((0, _dataUtils.PARTICIPANTS).COMPUTER);
    }
    setPlayerTaraCount(count) {
        this.setTaraCount((0, _dataUtils.PARTICIPANTS).PLAYER, count);
    }
    setComputerTaraCount(count) {
        this.setTaraCount((0, _dataUtils.PARTICIPANTS).COMPUTER, count);
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
        const result = this.getMatchWinner();
        if (result !== "draw") this.setScore(result, this.getScore(result) + 1);
        return result;
    }
    isDoubleKO() {
        return this.isMatchOver() && this.getHealth((0, _dataUtils.PARTICIPANTS).PLAYER) === 0 && this.getHealth((0, _dataUtils.PARTICIPANTS).COMPUTER) === 0;
    }
    setMatch(match) {
        this.state.currentMatch = match;
        this.gameStorage.setMatch(match);
    }
    setMatchNumber(matchNumber) {
        this.state.globalMatchNumber = matchNumber;
        this.gameStorage.setGlobalMatchNumber(matchNumber);
    }
    setDefaultMatchData() {
        if (!this.isMatchActive()) this.setMatch({
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
        const playerDefeated = this.isDefeated((0, _dataUtils.PARTICIPANTS).PLAYER);
        const computerDefeated = this.isDefeated((0, _dataUtils.PARTICIPANTS).COMPUTER);
        if (playerDefeated && computerDefeated) return "draw";
        if (playerDefeated) return (0, _dataUtils.PARTICIPANTS).COMPUTER;
        if (computerDefeated) return (0, _dataUtils.PARTICIPANTS).PLAYER;
        return "draw";
    }
    incrementMatchNumber() {
        this.setMatchNumber(this.getMatchNumber() + 1);
    }
    _loadMatchState() {
        this.state.globalMatchNumber = this.gameStorage.getGlobalMatchNumber();
        this.state.currentMatch = this.gameStorage.getMatch();
    }
    // ===== Health Methods =====
    getHealth(participant) {
        const match = this.state.currentMatch;
        if (!match) return 0, _dataUtils.INITIAL_HEALTH;
        const value = match[(0, _dataUtils.HEALTH_KEYS)[participant]];
        return value !== undefined && value !== null ? value : (0, _dataUtils.INITIAL_HEALTH);
    }
    getDamageAmount(isTie, taraInPlay) {
        if (isTie) // If it's a tie AND Tara is in play, they both played Tara
        return taraInPlay ? (0, _dataUtils.DAMAGE_PER_TARA_TIE) : (0, _dataUtils.DAMAGE_PER_TIE);
        else // If it's a win/loss AND Tara is in play, someone took Tara damage
        return taraInPlay ? (0, _dataUtils.DAMAGE_PER_TARA_LOSS) : (0, _dataUtils.DAMAGE_PER_LOSS);
    }
    decrementHealth(participant, damage) {
        const match = this.state.currentMatch;
        if (!match) return false;
        const key = (0, _dataUtils.HEALTH_KEYS)[participant];
        this.setMatch({
            ...match,
            [key]: Math.max(0, (match[key] ?? 0) - damage)
        });
        return true;
    }
    isDefeated(participant) {
        const health = this.getHealth(participant);
        return health !== null && health <= 0;
    }
}

},{"../utils/dataUtils":"hnBcW","../utils/computer/AdaptiveComputer":"giSqN","../storage/localStorageGameStorage":"ht5L2","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"hnBcW":[function(require,module,exports,__globalThis) {
// =============================================================================
// 🧱 CONFIGURATION FILE: GAME CONSTANTS
//
// This module defines all core game data (moves, health, etc.).
// All move-related constants (lists, maps, types) are generated dynamically
// from the MOVES_DATABASE to ensure data consistency.
// =============================================================================
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "MOVES_DATABASE", ()=>MOVES_DATABASE);
parcelHelpers.export(exports, "CARD_BACKS_DATABASE", ()=>CARD_BACKS_DATABASE);
parcelHelpers.export(exports, "MOVES", ()=>MOVES);
parcelHelpers.export(exports, "MOVE_DATA", ()=>MOVE_DATA);
parcelHelpers.export(exports, "ALL_MOVE_NAMES", ()=>ALL_MOVE_NAMES);
parcelHelpers.export(exports, "MOVE_DATA_MAP", ()=>MOVE_DATA_MAP);
parcelHelpers.export(exports, "STANDARD_MOVE_DATA", ()=>STANDARD_MOVE_DATA);
parcelHelpers.export(exports, "STANDARD_MOVE_NAMES", ()=>STANDARD_MOVE_NAMES);
parcelHelpers.export(exports, "STANDARD_MOVE_DATA_MAP", ()=>STANDARD_MOVE_DATA_MAP);
parcelHelpers.export(exports, "PLAYER_MOVES_DATA", ()=>PLAYER_MOVES_DATA);
parcelHelpers.export(exports, "MOVE_DISPLAY_NAMES", ()=>MOVE_DISPLAY_NAMES);
parcelHelpers.export(exports, "PARTICIPANTS", ()=>PARTICIPANTS);
parcelHelpers.export(exports, "INITIAL_ROUND_NUMBER", ()=>INITIAL_ROUND_NUMBER);
parcelHelpers.export(exports, "INITIAL_HEALTH", ()=>INITIAL_HEALTH);
parcelHelpers.export(exports, "DAMAGE_PER_LOSS", ()=>DAMAGE_PER_LOSS);
parcelHelpers.export(exports, "DAMAGE_PER_TARA_LOSS", ()=>DAMAGE_PER_TARA_LOSS);
parcelHelpers.export(exports, "DAMAGE_PER_TARA_TIE", ()=>DAMAGE_PER_TARA_TIE);
parcelHelpers.export(exports, "DAMAGE_PER_TIE", ()=>DAMAGE_PER_TIE);
parcelHelpers.export(exports, "DEFAULT_MATCH_NUMBER", ()=>DEFAULT_MATCH_NUMBER);
parcelHelpers.export(exports, "MAX_TARA", ()=>MAX_TARA);
parcelHelpers.export(exports, "DEFAULT_MATCH", ()=>DEFAULT_MATCH);
parcelHelpers.export(exports, "HEALTH_KEYS", ()=>HEALTH_KEYS);
var _taraPng = require("url:../../public/images/tara.png");
var _taraPngDefault = parcelHelpers.interopDefault(_taraPng);
var _cardBluePng = require("url:../../public/images/card-blue.png");
var _cardBluePngDefault = parcelHelpers.interopDefault(_cardBluePng);
var _cardRedPng = require("url:../../public/images/card-red.png");
var _cardRedPngDefault = parcelHelpers.interopDefault(_cardRedPng);
const MOVES_DATABASE = {
    ROCK: {
        id: "rock",
        beats: [
            "scissors"
        ],
        isStandard: true,
        text: "Rock",
        icon: "\uD83E\uDEA8"
    },
    PAPER: {
        id: "paper",
        beats: [
            "rock"
        ],
        isStandard: true,
        text: "Paper",
        icon: "\uD83D\uDCC4"
    },
    SCISSORS: {
        id: "scissors",
        beats: [
            "paper"
        ],
        isStandard: true,
        text: "Scissors",
        icon: "\u2702\uFE0F"
    },
    TARA: {
        id: "tara",
        beats: [
            "rock",
            "paper",
            "scissors"
        ],
        isStandard: false,
        text: "Tara",
        icon: (0, _taraPngDefault.default)
    }
};
const CARD_BACKS_DATABASE = {
    PLAYER: {
        id: "player",
        image: (0, _cardBluePngDefault.default)
    },
    COMPUTER: {
        id: "computer",
        image: (0, _cardRedPngDefault.default)
    }
};
// -----------------------------------------------------------------------------
// SECTION 4: DYNAMIC CONSTANTS (Runtime Data Structures)
//
// Generated at runtime by mapping over the MOVES_DATABASE.
// -----------------------------------------------------------------------------
// Helper for iteration
const DB_VALUES = Object.values(MOVES_DATABASE);
const MOVES = Object.fromEntries(Object.entries(MOVES_DATABASE).map(([key, val])=>[
        key,
        val.id
    ]));
const MOVE_DATA = DB_VALUES.map((entry)=>({
        name: entry.id,
        beats: entry.beats
    }));
const ALL_MOVE_NAMES = DB_VALUES.map((entry)=>entry.id);
const MOVE_DATA_MAP = new Map(MOVE_DATA.map((m)=>[
        m.name,
        m
    ]));
const STANDARD_MOVE_DATA = MOVE_DATA.filter((_, i)=>DB_VALUES[i].isStandard);
const STANDARD_MOVE_NAMES = STANDARD_MOVE_DATA.map((data)=>data.name);
const STANDARD_MOVE_DATA_MAP = new Map(STANDARD_MOVE_DATA.map((m)=>[
        m.name,
        m
    ]));
const PLAYER_MOVES_DATA = DB_VALUES.map((entry)=>({
        id: entry.id,
        text: entry.text,
        icon: entry.icon
    }));
const MOVE_DISPLAY_NAMES = Object.fromEntries(DB_VALUES.map((entry)=>[
        entry.id,
        entry.text
    ]));
const PARTICIPANTS = {
    PLAYER: "player",
    COMPUTER: "computer"
};
const INITIAL_ROUND_NUMBER = 1;
const INITIAL_HEALTH = 100;
const DAMAGE_PER_LOSS = 50;
const DAMAGE_PER_TARA_LOSS = 70;
const DAMAGE_PER_TARA_TIE = 20;
const DAMAGE_PER_TIE = 10;
const DEFAULT_MATCH_NUMBER = 1;
const MAX_TARA = 3;
const DEFAULT_MATCH = {
    matchRoundNumber: INITIAL_ROUND_NUMBER,
    playerHealth: INITIAL_HEALTH,
    computerHealth: INITIAL_HEALTH
};
const HEALTH_KEYS = {
    player: "playerHealth",
    computer: "computerHealth"
};

},{"url:../../public/images/tara.png":"7LenK","url:../../public/images/card-blue.png":"hBpbE","url:../../public/images/card-red.png":"38ONL","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"7LenK":[function(require,module,exports,__globalThis) {
module.exports = module.bundle.resolve("tara.62cce216.png") + "?" + Date.now();

},{}],"hBpbE":[function(require,module,exports,__globalThis) {
module.exports = module.bundle.resolve("card-blue.d427fcde.png") + "?" + Date.now();

},{}],"38ONL":[function(require,module,exports,__globalThis) {
module.exports = module.bundle.resolve("card-red.17cb6649.png") + "?" + Date.now();

},{}],"jnFvT":[function(require,module,exports,__globalThis) {
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

},{}],"giSqN":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "AdaptiveComputer", ()=>AdaptiveComputer);
var _dataUtils = require("../dataUtils");
var _gameRules = require("../gameRules");
class AdaptiveComputer {
    calculateNextMove(state) {
        const hasTara = state.taras.computer > 0;
        const availableMoves = (0, _gameRules.getAvailableMoves)(hasTara);
        const weights = this.getComputerMoveWeights(state, availableMoves);
        const move = this.chooseWeightedRandomMove(availableMoves, weights);
        return move;
    }
    getBaseWeights() {
        return {
            [(0, _dataUtils.MOVES).ROCK]: 1,
            [(0, _dataUtils.MOVES).PAPER]: 1,
            [(0, _dataUtils.MOVES).SCISSORS]: 1,
            [(0, _dataUtils.MOVES).TARA]: 0
        };
    }
    getTaraWeight(state, moves) {
        if (!moves.includes((0, _dataUtils.MOVES).TARA)) return null;
        const { player, computer } = state.scores;
        const scoreDiff = player - computer;
        if (scoreDiff > 0) return Math.min(3 + scoreDiff, 10);
        if (scoreDiff < 0) return 1;
        return 2;
    }
    getStandardMoveWeights(state) {
        const weights = {
            [(0, _dataUtils.MOVES).ROCK]: 1,
            [(0, _dataUtils.MOVES).PAPER]: 1,
            [(0, _dataUtils.MOVES).SCISSORS]: 1
        };
        const playerMostCommon = state.mostCommonMove.player;
        const computerMostCommon = state.mostCommonMove.computer;
        // SCENARIO A: Counter the player
        if (playerMostCommon) {
            const counterMap = {
                [(0, _dataUtils.MOVES).ROCK]: (0, _dataUtils.MOVES).PAPER,
                [(0, _dataUtils.MOVES).PAPER]: (0, _dataUtils.MOVES).SCISSORS,
                [(0, _dataUtils.MOVES).SCISSORS]: (0, _dataUtils.MOVES).ROCK
            };
            const counter = counterMap[playerMostCommon];
            return {
                [(0, _dataUtils.MOVES).ROCK]: counter === (0, _dataUtils.MOVES).ROCK ? 5 : 2,
                [(0, _dataUtils.MOVES).PAPER]: counter === (0, _dataUtils.MOVES).PAPER ? 5 : 2,
                [(0, _dataUtils.MOVES).SCISSORS]: counter === (0, _dataUtils.MOVES).SCISSORS ? 5 : 2
            };
        }
        // SCENARIO B: Fall back to computer habit
        if (computerMostCommon) weights[computerMostCommon] += 2;
        return weights;
    }
    getComputerMoveWeights(state, moves) {
        const baseWeights = this.getBaseWeights();
        const taraWeight = this.getTaraWeight(state, moves);
        const standardWeights = this.getStandardMoveWeights(state);
        return {
            ...baseWeights,
            ...standardWeights,
            ...taraWeight !== null ? {
                [(0, _dataUtils.MOVES).TARA]: taraWeight
            } : {}
        };
    }
    chooseWeightedRandomMove(moves, weights) {
        const weightedPool = moves.flatMap((move)=>Array(weights[move]).fill(move));
        const randomIndex = Math.floor(Math.random() * weightedPool.length);
        return weightedPool[randomIndex];
    }
}

},{"../dataUtils":"hnBcW","../gameRules":"20DWz","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"20DWz":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getAvailableMoves", ()=>getAvailableMoves);
var _dataUtils = require("../utils/dataUtils");
function getAvailableMoves(hasTara) {
    if (hasTara) return 0, _dataUtils.ALL_MOVE_NAMES;
    else return 0, _dataUtils.STANDARD_MOVE_NAMES;
}

},{"../utils/dataUtils":"hnBcW","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"ht5L2":[function(require,module,exports,__globalThis) {
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
            if (!raw) return {
                ...DEFAULT_MOVE_COUNTS
            };
            const parsed = JSON.parse(raw);
            return {
                rock: parsed.rock ?? 0,
                paper: parsed.paper ?? 0,
                scissors: parsed.scissors ?? 0
            };
        } catch (e) {
            console.warn(`LocalStorage Error: Failed to parse "${key}".`, e);
            return {
                ...DEFAULT_MOVE_COUNTS
            };
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
    removeGlobalMatchNumber() {
        localStorage.removeItem(KEY_GLOBAL_MATCH_NUMBER);
    }
}

},{"../utils/dataUtils":"hnBcW","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"gC2t0":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Controller", ()=>Controller);
var _dataUtils = require("../utils/dataUtils");
class Controller {
    model;
    arenaView;
    controlsView;
    gameView;
    menuView;
    statsView;
    statusView;
    constructor(model, views){
        this.model = model;
        this.arenaView = views.arenaView;
        this.controlsView = views.controlsView;
        this.gameView = views.gameView;
        this.menuView = views.menuView;
        this.statsView = views.statsView;
        this.statusView = views.statusView;
    }
    updateControlsView() {
        this.controlsView.render({
            playerMove: this.model.getPlayerMove(),
            isMatchOver: this.model.isMatchOver(),
            taraIsEnabled: this.model.taraIsEnabled(),
            moves: (0, _dataUtils.PLAYER_MOVES_DATA)
        });
    }
    updateStatsView() {
        const data = {
            playerHealth: this.model.getHealth((0, _dataUtils.PARTICIPANTS).PLAYER) ?? 100,
            computerHealth: this.model.getHealth((0, _dataUtils.PARTICIPANTS).COMPUTER) ?? 100,
            playerScore: this.model.getPlayerScore() || 0,
            computerScore: this.model.getComputerScore() || 0,
            playerTara: this.model.getPlayerTaraCount() || 0,
            computerTara: this.model.getComputerTaraCount() || 0,
            playerMostCommonMove: this.model.getPlayerMostCommonMove(),
            computerMostCommonMove: this.model.getComputerMostCommonMove(),
            matchNumber: this.model.getMatchNumber(),
            roundNumber: this.model.getRoundNumber()
        };
        this.statsView.update(data);
    }
    async startGame() {
        this.model.setDefaultMatchData();
        this.updateStatsView();
        this.resetArenaVisuals();
        this.statusView.handleEvent({
            type: "READY"
        });
        this.menuView.toggleMenuVisibility(false);
        this.gameView.toggleVisibility(true);
        this.statsView.toggleGameStatsVisibility(true);
        this.controlsView.toggleVisibility(true);
        await this.handleNextRound();
    }
    async endRound() {
        const matchOver = this.model.isMatchOver();
        const isDoubleKO = this.model.isDoubleKO();
        // --- MATCH END ---
        if (matchOver) {
            const result = this.model.handleMatchWin();
            this.arenaView.playMatchResult(result, isDoubleKO);
            this.updateStatsView();
            this.updateControlsView();
            this.model.incrementMatchNumber();
            this.model.setMatch(null);
            return;
        }
        // --- ROUND CONTINUES ---
        this.model.increaseRoundNumber();
        this.updateStatsView();
        setTimeout(()=>{
            this.handleNextRound();
        }, 250);
    }
    async handleNextRound() {
        this.statusView.handleEvent({
            type: "PREPARE"
        });
        this.model.resetMoves();
        this.arenaView.clear();
        this.updateControlsView();
        this.updateStatsView();
        await this.controlsView.flipAll(true);
        this.statusView.handleEvent({
            type: "CHOOSE"
        });
    }
    async resetGameState() {
        this.model.resetGame();
        this.menuView.updateMenu({
            isMatchActive: false
        });
        this.menuView.bindStartMatch(()=>this.startGame());
        this.menuView.bindResetGame(()=>this.resetGameState());
        this.resetArenaVisuals();
        this.controlsView.toggleVisibility(false);
    }
    resetArenaVisuals() {
        this.arenaView.clear();
        this.updateStatsView();
    }
    async handlePlayerMove(move) {
        this.statusView.handleEvent({
            type: "LOCK_IN"
        });
        await this.controlsView.flipAll(false);
        const computerMove = this.model.getCalculatedComputerMove();
        this.model.registerPlayerMove(move);
        this.model.registerComputerMove(computerMove);
        const roundResult = this.model.evaluateRound();
        // 1. Status bar updates: "You played X. Computer played Y."
        this.statusView.announceRound((0, _dataUtils.MOVE_DISPLAY_NAMES)[move], (0, _dataUtils.MOVE_DISPLAY_NAMES)[computerMove]);
        // 2. Play the visual sequence
        await this.arenaView.playRoundSequence({
            phase: "waiting",
            playerMoveId: move,
            computerMoveId: computerMove,
            winner: roundResult.winner,
            isDoubleKO: roundResult.isDoubleKO,
            damage: roundResult.damageCalculated
        }, ()=>{
            // 💥 IMPACT FRAME 💥
            // Smoothly drop health bars
            this.statsView.updateHealth(this.model.getHealth((0, _dataUtils.PARTICIPANTS).PLAYER) ?? 100, this.model.getHealth((0, _dataUtils.PARTICIPANTS).COMPUTER) ?? 100);
            // Flash the round outcome text (e.g., "PLAYER LANDS A BLOW!")
            this.arenaView.playRoundResult(roundResult);
        });
        // 3. Resolve the round once all drama and delays are finished
        await this.endRound();
    }
    async initialize() {
        const isMatchActive = this.model.isMatchActive();
        this.menuView.render({
            isMatchActive
        });
        this.arenaView.render({
            phase: "waiting"
        });
        this.statusView.render({
            message: ""
        });
        this.updateControlsView();
        this.updateStatsView();
        this.statsView.toggleGameStatsVisibility(false);
        this.controlsView.toggleVisibility(false);
        this.menuView.toggleMenuVisibility(true);
        this.menuView.bindStartMatch(()=>this.startGame());
        this.menuView.bindResetGame(()=>this.resetGameState());
        this.controlsView.bindPlayerMove((move)=>this.handlePlayerMove(move));
        this.controlsView.bindStartNewMatch(()=>this.startGame());
    }
}

},{"../utils/dataUtils":"hnBcW","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"3JtbA":[function(require,module,exports,__globalThis) {
// ArenaView.ts
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _view = require("../View");
var _viewDefault = parcelHelpers.interopDefault(_view);
var _dataUtils = require("../../utils/dataUtils");
var _imageUtils = require("../../utils/imageUtils");
var _i18N = require("../../utils/i18n");
class ArenaView extends (0, _viewDefault.default) {
    _parentElement = document.getElementById("arena");
    _generateMarkup() {
        const { phase, playerMoveId, computerMoveId, announcementMessage } = this._data;
        if (phase === "waiting") return `<div class="arena-content" inert></div>`;
        const isFullyRevealed = phase === "combat" || phase === "result";
        const positionClass = isFullyRevealed ? "slide-in" : "";
        const flipClass = isFullyRevealed ? "is-flipped" : "";
        const getStanceClass = (moveId)=>{
            return phase === "combat" && moveId ? `stance-${moveId}` : "";
        };
        const getCardContent = (moveId)=>{
            if (!moveId) return `<div class="icon">\u{2753}</div><div class="label">Waiting...</div>`;
            const moveData = (0, _dataUtils.PLAYER_MOVES_DATA).find((m)=>m.id === moveId);
            const icon = moveData ? moveData.icon : "\u2753";
            const label = moveData ? moveData.text : moveId;
            return `
    <div class="icon">${(0, _imageUtils.renderIcon)(icon)}</div>
    <div class="label">${label}</div>
  `;
        };
        const playerStanceClass = getStanceClass(playerMoveId);
        const computerStanceClass = getStanceClass(computerMoveId);
        return `
      <div class="arena-content">
        <div id="announcement-container" aria-live="polite" aria-atomic="true">
          <h2>${announcementMessage || ""}</h2>
        </div>
        
        <div id="move-reveal">
          <div id="reveal-player" class="card entering-player ${positionClass} ${playerStanceClass}" style="--facing: 1;">
            <div class="card-inner ${flipClass}">
              <div class="card-back player-theme">
                <img
                  src="${(0, _dataUtils.CARD_BACKS_DATABASE).PLAYER.image}"
                  alt=""
                  class="card-back-image"
                  aria-hidden="true"
                />
              </div>
              <div class="card-front">
                ${getCardContent(playerMoveId)}
              </div>
            </div>
          </div>

          <div class="vs-label">VS</div>

          <div id="reveal-computer" class="card entering-computer ${positionClass} ${computerStanceClass}" style="--facing: -1;">
            <div class="card-inner ${flipClass}">
              <div class="card-back computer-theme">
                <img
                  src="${(0, _dataUtils.CARD_BACKS_DATABASE).COMPUTER.image}"
                  alt=""
                  class="card-back-image"
                  aria-hidden="true"
                />
              </div>
              <div class="card-front">
                 ${getCardContent(computerMoveId)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    async playRoundSequence(data, onOutcomeStart) {
        // 1. Render initial hidden cards
        this.render({
            ...data,
            phase: "revealing",
            announcementMessage: ""
        });
        this._toggleVisibility(this._parentElement, true);
        const pCard = this._getElement("reveal-player");
        const cCard = this._getElement("reveal-computer");
        const moveRevealContainer = this._getElement("move-reveal");
        // 2. Entrance
        await new Promise((resolve)=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
        pCard.classList.add("slide-in");
        cCard.classList.add("slide-in");
        await this._waitForAnimation(pCard);
        // 3. Flip
        await new Promise((resolve)=>setTimeout(resolve, 300));
        pCard.querySelector(".card-inner")?.classList.add("is-flipped");
        cCard.querySelector(".card-inner")?.classList.add("is-flipped");
        await this._waitForAnimation(pCard.querySelector(".card-inner"));
        // 4. Stances (stance classes now part of markup when phase === "combat")
        this.update({
            ...data,
            phase: "combat",
            announcementMessage: ""
        });
        // Get fresh card references after DOM update
        const pCardUpdated = this._getElement("reveal-player");
        const cCardUpdated = this._getElement("reveal-computer");
        // Add arena shake for rock moves
        if (data.playerMoveId === "rock" || data.computerMoveId === "rock") moveRevealContainer.classList.add("arena-shake");
        // Wait for stance animations to complete
        const stancePromises = [];
        if (data.playerMoveId) stancePromises.push(this._waitForAnimation(pCardUpdated));
        if (data.computerMoveId) stancePromises.push(this._waitForAnimation(cCardUpdated));
        if (data.playerMoveId === "rock" || data.computerMoveId === "rock") stancePromises.push(this._waitForAnimation(moveRevealContainer));
        if (stancePromises.length > 0) {
            await Promise.all(stancePromises);
            moveRevealContainer.classList.remove("arena-shake");
        }
        // 5. Outcome Drama
        this.update({
            ...data,
            phase: "result"
        });
        // Trigger health update the moment the blow lands
        onOutcomeStart?.();
        await this.executeOutcomeDrama(data);
    }
    spawnDamageText(targetCard, damageValue) {
        const rect = targetCard.getBoundingClientRect();
        const floater = document.createElement("div");
        floater.textContent = `-${damageValue}`;
        floater.classList.add("floating-damage");
        floater.style.position = "fixed";
        floater.style.left = `${rect.left + rect.width / 2}px`;
        floater.style.top = `${rect.top + rect.height / 2}px`;
        document.body.appendChild(floater);
        floater.addEventListener("animationend", ()=>floater.remove());
    }
    async executeOutcomeDrama(data) {
        const playerCard = this._getElement("reveal-player");
        const computerCard = this._getElement("reveal-computer");
        const container = this._getElement("move-reveal");
        const damage = data.damage || 0;
        // Helper to spawn damage
        const hit = (card)=>{
            if (damage > 0) this.spawnDamageText(card, damage);
            card.classList.add("card-impact", "card-defeated");
        };
        if (data.isDoubleKO || data.winner === "tie") {
            // Both take damage in a tie/double KO
            hit(playerCard);
            hit(computerCard);
            container.classList.add("arena-shake");
            await this._waitForAnimation(playerCard);
            return;
        }
        // Standard Win/Loss
        const losingCard = data.winner === (0, _dataUtils.PARTICIPANTS).PLAYER ? computerCard : playerCard;
        hit(losingCard);
        container.classList.add("arena-shake");
        await this._waitForAnimation(losingCard);
        // Winner gets highlight
        const winningCard = data.winner === (0, _dataUtils.PARTICIPANTS).PLAYER ? playerCard : computerCard;
        winningCard.classList.add("winner-highlight");
        await this._waitForAnimation(winningCard);
    }
    clear() {
        this.render({
            phase: "waiting"
        });
    }
    /**
     * Interprets round outcome and emits the corresponding announcement.
     *
     * Decision logic:
     * 1. If both took mutual damage (double KO) → DOUBLE_KO event
     * 2. If there's a winner → ROUND_WIN with winner name
     * 3. If neither won → TIE event
     *
     * This demonstrates the data-driven pattern: the view receives semantic game state
     * and decides what UI event to emit, rather than the controller deciding.
     */ playRoundResult(roundResult) {
        const event = this.determineRoundAnnouncement(roundResult);
        this.setAnnouncement(event);
    }
    /**
     * Interprets match outcome, manages the cinematic delay, and emits the announcement.
     */ playMatchResult(winner, isDoubleKO) {
        // 1. Announce the match winner
        const event = this.determineMatchAnnouncement(winner, isDoubleKO);
        this.setAnnouncement(event);
        // 2. Re-enforce the winner styles (in case of a tie-breaker or double KO context)
        this.applyWinnerStyles(winner);
    }
    /**
     * Helper: Determines which round announcement event to emit based on game state.
     * @private
     */ determineRoundAnnouncement(roundResult) {
        if (roundResult.isDoubleKO) return {
            type: "DOUBLE_KO"
        };
        if (roundResult.winner !== "tie") return {
            type: "ROUND_WIN",
            payload: {
                winner: roundResult.winner
            }
        };
        return {
            type: "TIE"
        };
    }
    /**
     * Helper: Determines which match announcement event to emit based on game outcome.
     * @private
     */ determineMatchAnnouncement(winner, isDoubleKO) {
        return isDoubleKO ? {
            type: "MATCH_DOUBLE_KO"
        } : {
            type: "MATCH_WIN",
            payload: {
                winner
            }
        };
    }
    setAnnouncement(event) {
        let announcementMessage;
        switch(event.type){
            case "DOUBLE_KO":
                announcementMessage = (0, _i18N.t)("arena_doubleKo");
                break;
            case "ROUND_WIN":
                announcementMessage = (0, _i18N.t)("arena_roundWin", {
                    winner: event.payload.winner.toUpperCase()
                });
                break;
            case "TIE":
                announcementMessage = (0, _i18N.t)("arena_tie");
                break;
            case "MATCH_DOUBLE_KO":
                announcementMessage = (0, _i18N.t)("arena_matchDoubleKo");
                break;
            case "MATCH_WIN":
                announcementMessage = (0, _i18N.t)("arena_matchWinner", {
                    winner: event.payload.winner.toUpperCase()
                });
                break;
            case "CUSTOM":
                announcementMessage = event.message;
                break;
            default:
                const _exhaustive = event;
                throw new Error(`Unhandled event type: ${_exhaustive}`);
        }
        this._data = {
            ...this._data,
            announcementMessage
        };
        // Update only the announcement container to preserve animation classes on cards
        const announcementContainer = this._getElement("announcement-container");
        announcementContainer.innerHTML = `<h2>${announcementMessage}</h2>`;
    }
    update(data) {
        this._data = {
            ...this._data,
            ...data
        };
        this._parentElement.innerHTML = this._generateMarkup();
        // If we are in the result phase and have a winner, re-apply the styles
        if (data.phase === "result" && data.winner) this.applyWinnerStyles(data.winner);
    }
    applyWinnerStyles(winner) {
        if (winner === "tie") return;
        const playerCard = this._getElement("reveal-player");
        const computerCard = this._getElement("reveal-computer");
        if (winner === "player") {
            playerCard.classList.add("winner-highlight");
            computerCard.classList.add("card-defeated");
        } else if (winner === "computer") {
            computerCard.classList.add("winner-highlight");
            playerCard.classList.add("card-defeated");
        }
    }
}
exports.default = ArenaView;

},{"../View":"dvzuG","../../utils/dataUtils":"hnBcW","../../utils/imageUtils":"3rXs5","../../utils/i18n":"8qZcS","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"dvzuG":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class View {
    _data;
    _parentElement;
    /**
     * Returns true if the view has been provided with data.
     */ get hasData() {
        return this._data !== undefined;
    }
    /**
     * Standard render method used by all views.
     *
     * @param data The state/data needed for the UI render.
     */ render(data) {
        if (!data) return;
        this._data = data;
        const markup = this._generateMarkup();
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }
    /**
     * Patches the DOM by comparing new markup to current nodes.
     *
     * @note Requires `_generateMarkup()` to return a single root element.
     * @note Best for data updates (health/scores); use `render()` if the
     * number of elements or the DOM structure changes.
     *
     * @param data The state/data needed for the UI update.
     */ update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll("*"));
        const currentElements = Array.from(this._parentElement.querySelectorAll("*"));
        newElements.forEach((newElement, i)=>{
            const currentElement = currentElements[i];
            // 1. Update changed TEXT
            if (!newElement.isEqualNode(currentElement) && newElement.firstChild?.nodeValue?.trim() !== "" && newElement.firstChild?.nodeValue?.trim() !== undefined) currentElement.textContent = newElement.textContent;
            // 2. Update changed ATTRIBUTES
            if (!newElement.isEqualNode(currentElement)) {
                // Add or update attributes from new to current
                Array.from(newElement.attributes).forEach((attr)=>currentElement.setAttribute(attr.name, attr.value));
                // Remove attributes from current that aren't in new
                Array.from(currentElement.attributes).forEach((attr)=>{
                    if (!newElement.hasAttribute(attr.name)) currentElement.removeAttribute(attr.name);
                });
            }
        });
    }
    _clear() {
        this._parentElement.innerHTML = "";
    }
    _getElement(id) {
        const element = document.getElementById(id);
        if (!element) throw new Error(`Element #${id} not found.`);
        return element;
    }
    _toggleVisibility(element, show) {
        element.classList.toggle("hidden", !show);
        if (show) element.removeAttribute("inert");
        else element.setAttribute("inert", "");
    }
    _waitForAnimation(element, maxWaitMs = 5000) {
        return new Promise((resolve)=>{
            const style = getComputedStyle(element);
            // Helper to parse "0.6s, 0.2s" into [0.6, 0.2]
            const getMaxTime = (timeStr)=>Math.max(...timeStr.split(",").map((t)=>(parseFloat(t) || 0) * 1000));
            const transitionDuration = getMaxTime(style.transitionDuration);
            const animationDuration = getMaxTime(style.animationDuration);
            const totalWait = Math.max(transitionDuration, animationDuration);
            // If no animation is detected, resolve immediately
            if (totalWait === 0) {
                resolve();
                return;
            }
            let resolved = false;
            const timer = setTimeout(()=>{
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            }, Math.min(totalWait + 50, maxWaitMs)); // Safety cap
            const handler = (e)=>{
                if (e.target === element) {
                    element.removeEventListener("transitionend", handler);
                    element.removeEventListener("animationend", handler);
                    if (!resolved) {
                        resolved = true;
                        clearTimeout(timer);
                        resolve();
                    }
                }
            };
            element.addEventListener("transitionend", handler);
            element.addEventListener("animationend", handler);
        });
    }
}
exports.default = View;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"3rXs5":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "renderIcon", ()=>renderIcon);
const renderIcon = (icon)=>{
    // Checks for file extensions OR base64 data URLs OR absolute/relative paths
    const isImage = /\.(png|jpe?g|svg|gif|webp)(\?.*)?$/i.test(icon) || icon.startsWith("data:image") || icon.includes("/");
    if (isImage) return `<img src="${icon}" alt="" class="icon-image" aria-hidden="true" />`;
    return `<span class="icon-emoji" aria-hidden="true">${icon}</span>`;
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"8qZcS":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Translates a key from the dictionary and optionally substitutes variables.
 *
 * ## Variable Substitution
 * Variables in templates use double curly braces: `{{variableName}}`
 *
 * If a variable is provided in the `variables` map, it replaces the placeholder.
 * If a variable is undefined, it falls back to showing the literal placeholder
 * (e.g., `"{{unknownVar}"` remains in the output). This prevents broken UI when
 * data is missing while making the gap obvious during development.
 *
 * @param key - The translation key from the dictionary
 * @param variables - Optional record of variable names and their string/number values
 * @returns The translated string with variables substituted
 *
 * @example
 * t("status_ready") // "Get ready..."
 * t("status_roundResult", { playerMove: "Rock", computerMove: "Paper" })
 * // "You played Rock. Computer played Paper."
 */ parcelHelpers.export(exports, "t", ()=>t);
var _enJson = require("../locales/en.json");
var _enJsonDefault = parcelHelpers.interopDefault(_enJson);
function t(key, variables) {
    const template = (0, _enJsonDefault.default)[key];
    if (!variables) return template;
    return template.replace(/\{\{(\w+)\}\}/g, (match, varName)=>{
        return String(variables[varName] ?? match);
    });
}

},{"../locales/en.json":"6L9RB","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"6L9RB":[function(require,module,exports,__globalThis) {
module.exports = JSON.parse("{\"arena_doubleKo\":\"MUTUAL DESTRUCTION!\",\"arena_matchDoubleKo\":\"DOUBLE KO! NOBODY WINS!\",\"arena_matchWinner\":\"{{winner}} WON THE MATCH!\",\"arena_roundWin\":\"{{winner}} LANDS A BLOW!\",\"arena_tie\":\"IT'S A TIE!\",\"status_choose\":\"Choose your attack!\",\"status_lockIn\":\"Locking in move...\",\"status_prepare\":\"Prepare your next move...\",\"status_ready\":\"Get ready...\",\"status_roundResult\":\"You played {{playerMove}}. Computer played {{computerMove}}.\"}");

},{}],"h40xR":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _view = require("../View");
var _viewDefault = parcelHelpers.interopDefault(_view);
var _dataUtils = require("../../utils/dataUtils");
var _imageUtils = require("../../utils/imageUtils");
class ControlsView extends (0, _viewDefault.default) {
    _moveHandler;
    _isFaceUp = false;
    render(data) {
        this._parentElement = this._getElement("game-controls");
        super.render(data);
        this._setupListeners();
    }
    /**
     * Orchestrates the 3D flip for all choice cards.
     */ async flipAll(faceUp) {
        this._isFaceUp = faceUp;
        const cards = this._parentElement.querySelectorAll(".card-inner");
        if (cards.length === 0) return;
        this._parentElement.classList.toggle("interaction-locked", !faceUp);
        cards.forEach((card)=>{
            faceUp ? card.classList.add("is-flipped") : card.classList.remove("is-flipped");
        });
        await this._waitForAnimation(cards[0]);
    }
    _generateMarkup() {
        const { isMatchOver, moves, taraIsEnabled } = this._data;
        if (isMatchOver) return `
        <div id="progression-zone" aria-live="polite">
          <button id="play-again" class="btn-primary">
            Start New Match
          </button>
        </div>`;
        return `
      <div id="choices" role="group" aria-label="Select your move">
        ${moves.map((move)=>{
            const isRuleDisabled = move.id === "tara" && !taraIsEnabled;
            const flipClass = this._isFaceUp ? "is-flipped" : "";
            return `
            <button
              id="${move.id}"
              class="card-button"
              ${isRuleDisabled ? "disabled" : ""}
            >
              <div class="card-inner ${flipClass}">
                <div class="card-back player-theme">
                  <img
                    src="${(0, _dataUtils.CARD_BACKS_DATABASE).PLAYER.image}"
                    alt=""
                    class="card-back-image"
                    aria-hidden="true"
                  />
                </div>
                <div class="card-front">
                  <span class="icon" aria-hidden="true">${(0, _imageUtils.renderIcon)(move.icon)}</span>
                  <span class="label">${move.text}</span>
                </div>
              </div>
            </button>`;
        }).join("")}
      </div>`;
    }
    toggleVisibility(show) {
        if (!this._parentElement) this._parentElement = this._getElement("game-controls");
        this._toggleVisibility(this._parentElement, show);
    }
    bindPlayerMove(handler) {
        this._moveHandler = handler;
    }
    /**
     * Uses event delegation to ensure the listener survives re-renders.
     */ bindStartNewMatch(handler) {
        this._parentElement.addEventListener("click", (e)=>{
            const btn = e.target.closest("#play-again");
            if (btn) handler();
        });
    }
    _setupListeners() {
        this._parentElement.onclick = (e)=>{
            const target = e.target;
            // Prevent interaction if cards are face-down or match is over
            if (!this._isFaceUp) return;
            const moveBtn = target.closest(".card-button");
            if (moveBtn && !moveBtn.disabled && this._moveHandler) {
                moveBtn.classList.add("is-hidden");
                moveBtn.disabled = true;
                this._moveHandler(moveBtn.id);
            }
        };
    }
}
exports.default = ControlsView;

},{"../View":"dvzuG","../../utils/dataUtils":"hnBcW","../../utils/imageUtils":"3rXs5","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"6jvBq":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _view = require("../View");
var _viewDefault = parcelHelpers.interopDefault(_view);
class GameView extends (0, _viewDefault.default) {
    _ensureParentElement() {
        if (!this._parentElement || !document.body.contains(this._parentElement)) this._parentElement = this._getElement("game-container");
    }
    toggleVisibility(show) {
        this._ensureParentElement();
        this._toggleVisibility(this._parentElement, show);
    }
    // Satisfy the abstract requirement without doing anything
    _generateMarkup() {
        return "";
    }
}
exports.default = GameView;

},{"../View":"dvzuG","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bsCwB":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _view = require("../View");
var _viewDefault = parcelHelpers.interopDefault(_view);
class MenuView extends (0, _viewDefault.default) {
    // Cache the specific buttons
    _startBtn;
    _resetBtn;
    _generateMarkup() {
        const startText = this._data.isMatchActive ? "Continue Match" : "Start Match";
        return `
      <div class="menu-content">
        <h1 id="game-title" class="title-large">Rock Paper Scissors Tara</h1>
        <div class="menu-controls">
          <button id="start" class="btn-primary">${startText}</button>
          <button id="reset-game-state" class="btn-secondary">Reset Game State</button>
        </div>
      </div>
    `;
    }
    _ensureParentElement() {
        if (!this._parentElement || !document.body.contains(this._parentElement)) this._parentElement = this._getElement("main-menu");
    }
    render(data) {
        this._ensureParentElement();
        super.render(data);
        // Cache the elements immediately after they are injected into the DOM
        this._startBtn = this._getElement("start");
        this._resetBtn = this._getElement("reset-game-state");
    }
    // ===== Event Bindings (Much more efficient now) =====
    bindStartMatch(handler) {
        this._startBtn?.addEventListener("click", (e)=>{
            e.preventDefault();
            handler();
        });
    }
    bindResetGame(handler) {
        this._resetBtn?.addEventListener("click", (e)=>{
            e.preventDefault();
            handler();
        });
    }
    toggleMenuVisibility(show) {
        this._ensureParentElement();
        this._toggleVisibility(this._parentElement, show);
    }
    updateMenu(data) {
        this._data = {
            ...this._data,
            ...data
        };
        this.update(this._data);
        // After an update, re-cache in case elements were replaced
        this._startBtn = this._getElement("start");
        this._resetBtn = this._getElement("reset-game-state");
    }
}
exports.default = MenuView;

},{"../View":"dvzuG","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"gGdhp":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _view = require("../View");
var _viewDefault = parcelHelpers.interopDefault(_view);
var _imageUtils = require("../../utils/imageUtils");
var _dataUtils = require("../../utils/dataUtils");
class StatsView extends (0, _viewDefault.default) {
    _ensureParentElement() {
        if (!this._parentElement || !document.body.contains(this._parentElement)) this._parentElement = this._getElement("game-stats");
    }
    update(data) {
        this._ensureParentElement();
        if (!this.hasData) super.render(data);
        else super.update(data);
    }
    toggleGameStatsVisibility(show) {
        this._ensureParentElement();
        this._toggleVisibility(this._parentElement, show);
    }
    updateHealth(playerHealth, computerHealth) {
        const playerBar = this._parentElement?.querySelector("#player-health");
        const computerBar = this._parentElement?.querySelector("#computer-health");
        if (playerBar) playerBar.style.width = `${playerHealth}%`;
        if (computerBar) computerBar.style.width = `${computerHealth}%`;
        this._data.playerHealth = playerHealth;
        this._data.computerHealth = computerHealth;
    }
    _generateTaraIcons(availableCount) {
        let iconsMarkup = "";
        for(let i = 0; i < (0, _dataUtils.MAX_TARA); i++){
            // If the current index is less than the available count, it's active
            const statusClass = i < availableCount ? "tara-active" : "tara-inactive";
            iconsMarkup += `
        <div class="tara-icon-wrapper ${statusClass}">
          ${(0, _imageUtils.renderIcon)((0, _dataUtils.MOVES_DATABASE).TARA.icon)}
        </div>
      `;
        }
        return iconsMarkup;
    }
    _generateCommonMoveSlot(moveId, alignment) {
        let allIconsMarkup = "";
        (0, _dataUtils.STANDARD_MOVE_NAMES).forEach((standardMove)=>{
            const moveObj = (0, _dataUtils.PLAYER_MOVES_DATA).find((m)=>m.id === standardMove);
            if (moveObj) {
                // Only remove the hidden class if it matches the current moveId
                const isCurrentMove = moveId === standardMove;
                const hiddenClass = isCurrentMove ? "" : "hidden";
                allIconsMarkup += `
          <div class="common-icon-slot ${hiddenClass}" data-move="${standardMove}">
            ${(0, _imageUtils.renderIcon)(moveObj.icon)}
          </div>
        `;
            }
        });
        return `
      <div class="common-move-wrapper ${alignment}-aligned">
        <span class="common-move-label">COMMON MOVE</span>
        <div class="common-move-slot">
          ${allIconsMarkup}
        </div>
      </div>
    `;
    }
    _generateMarkup() {
        const { playerHealth, computerHealth, playerScore, computerScore, playerTara, computerTara, playerMostCommonMove, computerMostCommonMove, matchNumber, roundNumber } = this._data;
        return `
      <aside id="player-stats" class="stats">
        <div class="score-row"><span>${playerScore.toString().padStart(2, "0")}</span> <span>WINS</span></div>

        <div class="bar-wrapper">
          <div class="bar" id="player-health" style="width: ${playerHealth}%"></div>
          <span class="bar-text">PLAYER</span>
        </div>

        <div class="tara-container player-tara-container">
          ${this._generateTaraIcons(playerTara)}
        </div>

        ${this._generateCommonMoveSlot(playerMostCommonMove, "left")}
      </aside>

      <section id="game-progress-container">
        <h2>Match ${matchNumber}</h2>
        <h3>Round ${roundNumber}</h3>
      </section>

      <aside id="computer-stats" class="stats">
        <div class="score-row"><span>WINS</span> <span>${computerScore.toString().padStart(2, "0")}</span></div>

        <div class="bar-wrapper">
          <div class="bar" id="computer-health" style="width: ${computerHealth}%"></div>
          <span class="bar-text">COMPUTER</span>
        </div>

        <div class="tara-container computer-tara-container">
          ${this._generateTaraIcons(computerTara)}
        </div>

        ${this._generateCommonMoveSlot(computerMostCommonMove, "right")}
      </aside>
    `;
    }
}
exports.default = StatsView;

},{"../View":"dvzuG","../../utils/imageUtils":"3rXs5","../../utils/dataUtils":"hnBcW","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"1xK0k":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _view = require("../View");
var _viewDefault = parcelHelpers.interopDefault(_view);
var _i18N = require("../../utils/i18n");
class StatusView extends (0, _viewDefault.default) {
    _messageElement = null;
    render(data) {
        this._parentElement = this._getElement("status-container");
        super.render(data);
        // Cache the element right after rendering
        this._messageElement = this._parentElement.querySelector("#status");
    }
    _generateMarkup() {
        return `<p id="status">${this._data.message}</p>`;
    }
    setMessage(message) {
        this._data = {
            message
        };
        if (this._messageElement) this._messageElement.textContent = message;
        else {
            // Fallback in case setMessage is called before render
            const el = document.getElementById("status");
            if (el) el.textContent = message;
        }
    }
    /**
     * Handles semantic events by translating them to localized messages.
     *
     * The Controller sends events, the View decides what text to display.
     */ handleEvent(event) {
        const message = this.translateEvent(event);
        this.setMessage(message);
    }
    /**
     * Announces a round result by translating move names to a localized message.
     * Demonstrates data-driven pattern: Controller passes data, View handles translation.
     */ announceRound(playerMove, computerMove) {
        const message = (0, _i18N.t)("status_roundResult", {
            playerMove,
            computerMove
        });
        this.setMessage(message);
    }
    /**
     * Helper: Translates a semantic event to its localized message.
     * Extracted for clarity and testability.
     * @private
     */ translateEvent(event) {
        switch(event.type){
            case "READY":
                return (0, _i18N.t)("status_ready");
            case "LOCK_IN":
                return (0, _i18N.t)("status_lockIn");
            case "PREPARE":
                return (0, _i18N.t)("status_prepare");
            case "CHOOSE":
                return (0, _i18N.t)("status_choose");
            case "CUSTOM":
                return event.message;
            default:
                const _exhaustive = event;
                throw new Error(`Unhandled event type: ${_exhaustive}`);
        }
    }
}
exports.default = StatusView;

},{"../View":"dvzuG","../../utils/i18n":"8qZcS","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}]},["3dtlh","gH3Lb"], "gH3Lb", "parcelRequire232d", {}, "./", "/")

//# sourceMappingURL=public.34df32e0.js.map
