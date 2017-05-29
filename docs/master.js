/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messager = undefined;

var _postmessageRaf = __webpack_require__(1);

var _slaveWorker = __webpack_require__(4);

var dispatch = function dispatch(action) {
  console.log("from worker", action);
};

var messager = exports.messager = (0, _postmessageRaf.mainMessager)({
  worker: _slaveWorker.slaveWorker,
  onAction: dispatch
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(2);


const mainMessager = ({ worker, onAction }) => {
  // STATE
  const s = {
    pinging: false,
    inOperations: {},
    outOperations: [],
    count: 0
  };
  window.operations = s.operations;

  // INIT
  worker.addEventListener("message", function handleMessage(mE) {
    const message = JSON.parse(mE.data);
    if (!message.type || message.type !== "PMRAF_TO_MAIN") return;
    message.payload.forEach(onOperation);
    if (message.meta.pingRequest === "start") startPing();
    if (message.meta.pingRequest === "stop") stopPing();
  });

  // PRIVATE
  const onOperation = operation => {
    if (!s.pinging) return onAction(operation.payload);
    if (!operation.meta || !operation.meta.delay) {
      s.inOperations[s.count] = s.inOperations[s.count] || [];
      return s.inOperations[s.count].push(operation);
    }
    if (operation.meta.delay.count && operation.meta.delay.count >= s.count) {
      s.inOperations[operation.meta.delay.count] = s.inOperations[
        operation.meta.delay.count
      ] || [];
      return s.inOperations[operation.meta.delay.count].push(operation);
    }
    if (operation.meta.delay.index && operation.meta.delay.index >= 0) {
      s.inOperations[s.count + operation.meta.delay.index] = s.inOperations[
        s.count + operation.meta.delay.index
      ] || [];
      return s.inOperations[s.count + operation.meta.delay.index].push(
        operation
      );
    }
  };
  const processInOperations = () => {
    if (!s.inOperations[s.count]) return;
    s.inOperations[s.count].forEach(operation => onAction(operation.payload));
    s.inOperations[s.count].length = 0;
  };
  const sendAll = ({ pingData }) => {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* sendToWorker */])(worker, {
      type: "PMRAF_TO_WORKER",
      meta: { pingData },
      payload: s.outOperations
    });
    s.outOperations.length = 0;
  };
  const ping = () => {
    if (!s.pinging) return;
    requestAnimationFrame(ping);
    sendAll({ pingData: { count: s.count } });
    processInOperations();
    s.count++;
  };

  // PUBLIC
  const post = action => {
    s.outOperations.push({ payload: action });
    if (!s.pinging) sendAll({});
  };
  const startPing = () => {
    s.pinging = true;
    s.count = 0;
    requestAnimationFrame(ping);
  };
  const stopPing = () => {
    s.pinging = false;
    sendAll({});
    processInOperations();
  };
  return { post };
};
/* harmony export (immutable) */ __webpack_exports__["mainMessager"] = mainMessager;


const workerMessager = ({ onAction, onPong }) => {
  // STATE
  const s = {
    pinging: false,
    outOperations: []
  };
  self.operations = s.operations;

  // INIT
  self.addEventListener("message", function handleMessage(mE) {
    const message = JSON.parse(mE.data);
    if (!message.type || message.type !== "PMRAF_TO_WORKER") return;
    if (message.meta.pingData) pong(message.meta.pingData);
    message.payload.forEach(onOperation);
  });

  // PRIVATE
  const onOperation = operation => onAction(operation.payload);
  const sendAll = ({ pingRequest, pongData }) => {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* sendToMain */])({
      type: "PMRAF_TO_MAIN",
      meta: { pingRequest, pongData },
      payload: s.outOperations
    });
    s.outOperations.length = 0;
  };
  const pong = pingData => {
    if (!s.pinging) return;
    sendAll({ pongData: pingData });
    if (onPong) onPong(pingData);
  };

  // PUBLIC
  const post = (action, meta) => {
    s.outOperations.push({ payload: action, meta });
    if (!s.pinging) sendAll({});
  };
  const startPing = () => {
    s.pinging = true;
    sendAll({ pingRequest: "start" });
  };
  const stopPing = () => {
    s.pinging = false;
    sendAll({ pingRequest: "stop" });
  };
  return {
    post,
    startPing,
    stopPing
  };
};
/* harmony export (immutable) */ __webpack_exports__["workerMessager"] = workerMessager;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const sendToWorker = (worker, message) => {
  const stringed = JSON.stringify(message);
  worker.postMessage(stringed);
};
/* harmony export (immutable) */ __webpack_exports__["a"] = sendToWorker;


const sendToMain = message => {
  const stringed = JSON.stringify(message);
  self.postMessage(stringed);
};
/* harmony export (immutable) */ __webpack_exports__["b"] = sendToMain;



/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _messager = __webpack_require__(0);

_messager.messager.post({ type: "HELLO" });

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var SlaveWorker = __webpack_require__(5);

var slaveWorker = exports.slaveWorker = new SlaveWorker();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {
	return new Worker(__webpack_require__.p + "1e407bfbb4ba8ab22612.worker.js");
};

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgN2U3NWIxODllNmNmZDU1MDBlNGQiLCJ3ZWJwYWNrOi8vLy4vc3JjL21hc3Rlci9tZXNzYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9+L0B2a2FtbWVyZXIvcG9zdG1lc3NhZ2UtcmFmL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L0B2a2FtbWVyZXIvcG9zdG1lc3NhZ2UtcmFmL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFzdGVyL21hc3Rlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFzdGVyL3NsYXZlV29ya2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9zbGF2ZS9zbGF2ZS5qcyJdLCJuYW1lcyI6WyJkaXNwYXRjaCIsImNvbnNvbGUiLCJsb2ciLCJhY3Rpb24iLCJtZXNzYWdlciIsIndvcmtlciIsIm9uQWN0aW9uIiwicG9zdCIsInR5cGUiLCJTbGF2ZVdvcmtlciIsInJlcXVpcmUiLCJzbGF2ZVdvcmtlciJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNoRUE7O0FBQ0E7O0FBRUEsSUFBTUEsV0FBVyxTQUFYQSxRQUFXLFNBQVU7QUFDekJDLFVBQVFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCQyxNQUEzQjtBQUNELENBRkQ7O0FBSU8sSUFBTUMsOEJBQVcsa0NBQWE7QUFDbkNDLGtDQURtQztBQUVuQ0MsWUFBVU47QUFGeUIsQ0FBYixDQUFqQixDOzs7Ozs7Ozs7QUNQNEI7O0FBRW5DLHVCQUE4QixtQkFBbUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsV0FBVztBQUMvQjtBQUNBO0FBQ0EsYUFBYSxXQUFXO0FBQ3hCO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFlBQVksaUJBQWlCLEVBQUU7QUFDNUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQkFBMEIsa0JBQWtCO0FBQzVDLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFBQTtBQUFBOztBQUVBLHlCQUFnQyxtQkFBbUI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLG9CQUFvQix3QkFBd0I7QUFDNUM7QUFDQTtBQUNBLGFBQWEsd0JBQXdCO0FBQ3JDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxxQkFBcUI7QUFDbEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLHdCQUF3QjtBQUNsRCw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0EsYUFBYSx1QkFBdUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBYSxzQkFBc0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7OztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7O0FDUkE7O0FBRUEsbUJBQVNPLElBQVQsQ0FBYyxFQUFFQyxNQUFNLE9BQVIsRUFBZCxFOzs7Ozs7Ozs7Ozs7QUNGQSxJQUFNQyxjQUFjLG1CQUFBQyxDQUFRLENBQVIsQ0FBcEI7O0FBRU8sSUFBTUMsb0NBQWMsSUFBSUYsV0FBSixFQUFwQixDOzs7Ozs7QUNGUDtBQUNBO0FBQ0EsRSIsImZpbGUiOiJtYXN0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDMpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDdlNzViMTg5ZTZjZmQ1NTAwZTRkIiwiaW1wb3J0IHsgbWFpbk1lc3NhZ2VyIH0gZnJvbSBcIkB2a2FtbWVyZXIvcG9zdG1lc3NhZ2UtcmFmXCI7XG5pbXBvcnQgeyBzbGF2ZVdvcmtlciB9IGZyb20gXCIuL3NsYXZlV29ya2VyLmpzXCI7XG5cbmNvbnN0IGRpc3BhdGNoID0gYWN0aW9uID0+IHtcbiAgY29uc29sZS5sb2coXCJmcm9tIHdvcmtlclwiLCBhY3Rpb24pO1xufTtcblxuZXhwb3J0IGNvbnN0IG1lc3NhZ2VyID0gbWFpbk1lc3NhZ2VyKHtcbiAgd29ya2VyOiBzbGF2ZVdvcmtlcixcbiAgb25BY3Rpb246IGRpc3BhdGNoXG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9tYXN0ZXIvbWVzc2FnZXIuanMiLCJpbXBvcnQgeyBzZW5kVG9Xb3JrZXIsIHNlbmRUb01haW4gfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgY29uc3QgbWFpbk1lc3NhZ2VyID0gKHsgd29ya2VyLCBvbkFjdGlvbiB9KSA9PiB7XG4gIC8vIFNUQVRFXG4gIGNvbnN0IHMgPSB7XG4gICAgcGluZ2luZzogZmFsc2UsXG4gICAgaW5PcGVyYXRpb25zOiB7fSxcbiAgICBvdXRPcGVyYXRpb25zOiBbXSxcbiAgICBjb3VudDogMFxuICB9O1xuICB3aW5kb3cub3BlcmF0aW9ucyA9IHMub3BlcmF0aW9ucztcblxuICAvLyBJTklUXG4gIHdvcmtlci5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbiBoYW5kbGVNZXNzYWdlKG1FKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UobUUuZGF0YSk7XG4gICAgaWYgKCFtZXNzYWdlLnR5cGUgfHwgbWVzc2FnZS50eXBlICE9PSBcIlBNUkFGX1RPX01BSU5cIikgcmV0dXJuO1xuICAgIG1lc3NhZ2UucGF5bG9hZC5mb3JFYWNoKG9uT3BlcmF0aW9uKTtcbiAgICBpZiAobWVzc2FnZS5tZXRhLnBpbmdSZXF1ZXN0ID09PSBcInN0YXJ0XCIpIHN0YXJ0UGluZygpO1xuICAgIGlmIChtZXNzYWdlLm1ldGEucGluZ1JlcXVlc3QgPT09IFwic3RvcFwiKSBzdG9wUGluZygpO1xuICB9KTtcblxuICAvLyBQUklWQVRFXG4gIGNvbnN0IG9uT3BlcmF0aW9uID0gb3BlcmF0aW9uID0+IHtcbiAgICBpZiAoIXMucGluZ2luZykgcmV0dXJuIG9uQWN0aW9uKG9wZXJhdGlvbi5wYXlsb2FkKTtcbiAgICBpZiAoIW9wZXJhdGlvbi5tZXRhIHx8ICFvcGVyYXRpb24ubWV0YS5kZWxheSkge1xuICAgICAgcy5pbk9wZXJhdGlvbnNbcy5jb3VudF0gPSBzLmluT3BlcmF0aW9uc1tzLmNvdW50XSB8fCBbXTtcbiAgICAgIHJldHVybiBzLmluT3BlcmF0aW9uc1tzLmNvdW50XS5wdXNoKG9wZXJhdGlvbik7XG4gICAgfVxuICAgIGlmIChvcGVyYXRpb24ubWV0YS5kZWxheS5jb3VudCAmJiBvcGVyYXRpb24ubWV0YS5kZWxheS5jb3VudCA+PSBzLmNvdW50KSB7XG4gICAgICBzLmluT3BlcmF0aW9uc1tvcGVyYXRpb24ubWV0YS5kZWxheS5jb3VudF0gPSBzLmluT3BlcmF0aW9uc1tcbiAgICAgICAgb3BlcmF0aW9uLm1ldGEuZGVsYXkuY291bnRcbiAgICAgIF0gfHwgW107XG4gICAgICByZXR1cm4gcy5pbk9wZXJhdGlvbnNbb3BlcmF0aW9uLm1ldGEuZGVsYXkuY291bnRdLnB1c2gob3BlcmF0aW9uKTtcbiAgICB9XG4gICAgaWYgKG9wZXJhdGlvbi5tZXRhLmRlbGF5LmluZGV4ICYmIG9wZXJhdGlvbi5tZXRhLmRlbGF5LmluZGV4ID49IDApIHtcbiAgICAgIHMuaW5PcGVyYXRpb25zW3MuY291bnQgKyBvcGVyYXRpb24ubWV0YS5kZWxheS5pbmRleF0gPSBzLmluT3BlcmF0aW9uc1tcbiAgICAgICAgcy5jb3VudCArIG9wZXJhdGlvbi5tZXRhLmRlbGF5LmluZGV4XG4gICAgICBdIHx8IFtdO1xuICAgICAgcmV0dXJuIHMuaW5PcGVyYXRpb25zW3MuY291bnQgKyBvcGVyYXRpb24ubWV0YS5kZWxheS5pbmRleF0ucHVzaChcbiAgICAgICAgb3BlcmF0aW9uXG4gICAgICApO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgcHJvY2Vzc0luT3BlcmF0aW9ucyA9ICgpID0+IHtcbiAgICBpZiAoIXMuaW5PcGVyYXRpb25zW3MuY291bnRdKSByZXR1cm47XG4gICAgcy5pbk9wZXJhdGlvbnNbcy5jb3VudF0uZm9yRWFjaChvcGVyYXRpb24gPT4gb25BY3Rpb24ob3BlcmF0aW9uLnBheWxvYWQpKTtcbiAgICBzLmluT3BlcmF0aW9uc1tzLmNvdW50XS5sZW5ndGggPSAwO1xuICB9O1xuICBjb25zdCBzZW5kQWxsID0gKHsgcGluZ0RhdGEgfSkgPT4ge1xuICAgIHNlbmRUb1dvcmtlcih3b3JrZXIsIHtcbiAgICAgIHR5cGU6IFwiUE1SQUZfVE9fV09SS0VSXCIsXG4gICAgICBtZXRhOiB7IHBpbmdEYXRhIH0sXG4gICAgICBwYXlsb2FkOiBzLm91dE9wZXJhdGlvbnNcbiAgICB9KTtcbiAgICBzLm91dE9wZXJhdGlvbnMubGVuZ3RoID0gMDtcbiAgfTtcbiAgY29uc3QgcGluZyA9ICgpID0+IHtcbiAgICBpZiAoIXMucGluZ2luZykgcmV0dXJuO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShwaW5nKTtcbiAgICBzZW5kQWxsKHsgcGluZ0RhdGE6IHsgY291bnQ6IHMuY291bnQgfSB9KTtcbiAgICBwcm9jZXNzSW5PcGVyYXRpb25zKCk7XG4gICAgcy5jb3VudCsrO1xuICB9O1xuXG4gIC8vIFBVQkxJQ1xuICBjb25zdCBwb3N0ID0gYWN0aW9uID0+IHtcbiAgICBzLm91dE9wZXJhdGlvbnMucHVzaCh7IHBheWxvYWQ6IGFjdGlvbiB9KTtcbiAgICBpZiAoIXMucGluZ2luZykgc2VuZEFsbCh7fSk7XG4gIH07XG4gIGNvbnN0IHN0YXJ0UGluZyA9ICgpID0+IHtcbiAgICBzLnBpbmdpbmcgPSB0cnVlO1xuICAgIHMuY291bnQgPSAwO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShwaW5nKTtcbiAgfTtcbiAgY29uc3Qgc3RvcFBpbmcgPSAoKSA9PiB7XG4gICAgcy5waW5naW5nID0gZmFsc2U7XG4gICAgc2VuZEFsbCh7fSk7XG4gICAgcHJvY2Vzc0luT3BlcmF0aW9ucygpO1xuICB9O1xuICByZXR1cm4geyBwb3N0IH07XG59O1xuXG5leHBvcnQgY29uc3Qgd29ya2VyTWVzc2FnZXIgPSAoeyBvbkFjdGlvbiwgb25Qb25nIH0pID0+IHtcbiAgLy8gU1RBVEVcbiAgY29uc3QgcyA9IHtcbiAgICBwaW5naW5nOiBmYWxzZSxcbiAgICBvdXRPcGVyYXRpb25zOiBbXVxuICB9O1xuICBzZWxmLm9wZXJhdGlvbnMgPSBzLm9wZXJhdGlvbnM7XG5cbiAgLy8gSU5JVFxuICBzZWxmLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2UobUUpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gSlNPTi5wYXJzZShtRS5kYXRhKTtcbiAgICBpZiAoIW1lc3NhZ2UudHlwZSB8fCBtZXNzYWdlLnR5cGUgIT09IFwiUE1SQUZfVE9fV09SS0VSXCIpIHJldHVybjtcbiAgICBpZiAobWVzc2FnZS5tZXRhLnBpbmdEYXRhKSBwb25nKG1lc3NhZ2UubWV0YS5waW5nRGF0YSk7XG4gICAgbWVzc2FnZS5wYXlsb2FkLmZvckVhY2gob25PcGVyYXRpb24pO1xuICB9KTtcblxuICAvLyBQUklWQVRFXG4gIGNvbnN0IG9uT3BlcmF0aW9uID0gb3BlcmF0aW9uID0+IG9uQWN0aW9uKG9wZXJhdGlvbi5wYXlsb2FkKTtcbiAgY29uc3Qgc2VuZEFsbCA9ICh7IHBpbmdSZXF1ZXN0LCBwb25nRGF0YSB9KSA9PiB7XG4gICAgc2VuZFRvTWFpbih7XG4gICAgICB0eXBlOiBcIlBNUkFGX1RPX01BSU5cIixcbiAgICAgIG1ldGE6IHsgcGluZ1JlcXVlc3QsIHBvbmdEYXRhIH0sXG4gICAgICBwYXlsb2FkOiBzLm91dE9wZXJhdGlvbnNcbiAgICB9KTtcbiAgICBzLm91dE9wZXJhdGlvbnMubGVuZ3RoID0gMDtcbiAgfTtcbiAgY29uc3QgcG9uZyA9IHBpbmdEYXRhID0+IHtcbiAgICBpZiAoIXMucGluZ2luZykgcmV0dXJuO1xuICAgIHNlbmRBbGwoeyBwb25nRGF0YTogcGluZ0RhdGEgfSk7XG4gICAgaWYgKG9uUG9uZykgb25Qb25nKHBpbmdEYXRhKTtcbiAgfTtcblxuICAvLyBQVUJMSUNcbiAgY29uc3QgcG9zdCA9IChhY3Rpb24sIG1ldGEpID0+IHtcbiAgICBzLm91dE9wZXJhdGlvbnMucHVzaCh7IHBheWxvYWQ6IGFjdGlvbiwgbWV0YSB9KTtcbiAgICBpZiAoIXMucGluZ2luZykgc2VuZEFsbCh7fSk7XG4gIH07XG4gIGNvbnN0IHN0YXJ0UGluZyA9ICgpID0+IHtcbiAgICBzLnBpbmdpbmcgPSB0cnVlO1xuICAgIHNlbmRBbGwoeyBwaW5nUmVxdWVzdDogXCJzdGFydFwiIH0pO1xuICB9O1xuICBjb25zdCBzdG9wUGluZyA9ICgpID0+IHtcbiAgICBzLnBpbmdpbmcgPSBmYWxzZTtcbiAgICBzZW5kQWxsKHsgcGluZ1JlcXVlc3Q6IFwic3RvcFwiIH0pO1xuICB9O1xuICByZXR1cm4ge1xuICAgIHBvc3QsXG4gICAgc3RhcnRQaW5nLFxuICAgIHN0b3BQaW5nXG4gIH07XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L0B2a2FtbWVyZXIvcG9zdG1lc3NhZ2UtcmFmL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY29uc3Qgc2VuZFRvV29ya2VyID0gKHdvcmtlciwgbWVzc2FnZSkgPT4ge1xuICBjb25zdCBzdHJpbmdlZCA9IEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpO1xuICB3b3JrZXIucG9zdE1lc3NhZ2Uoc3RyaW5nZWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNlbmRUb01haW4gPSBtZXNzYWdlID0+IHtcbiAgY29uc3Qgc3RyaW5nZWQgPSBKU09OLnN0cmluZ2lmeShtZXNzYWdlKTtcbiAgc2VsZi5wb3N0TWVzc2FnZShzdHJpbmdlZCk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L0B2a2FtbWVyZXIvcG9zdG1lc3NhZ2UtcmFmL3NyYy91dGlscy5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBtZXNzYWdlciB9IGZyb20gXCIuL21lc3NhZ2VyXCI7XG5cbm1lc3NhZ2VyLnBvc3QoeyB0eXBlOiBcIkhFTExPXCIgfSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWFzdGVyL21hc3Rlci5qcyIsImNvbnN0IFNsYXZlV29ya2VyID0gcmVxdWlyZShcIndvcmtlci1sb2FkZXIhLi4vc2xhdmUvc2xhdmUuanNcIik7XG5cbmV4cG9ydCBjb25zdCBzbGF2ZVdvcmtlciA9IG5ldyBTbGF2ZVdvcmtlcigpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21hc3Rlci9zbGF2ZVdvcmtlci5qcyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBuZXcgV29ya2VyKF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCIxZTQwN2JmYmI0YmE4YWIyMjYxMi53b3JrZXIuanNcIik7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi93b3JrZXItbG9hZGVyIS4vc3JjL3NsYXZlL3NsYXZlLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=