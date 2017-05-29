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

var dispatch = function dispatch(action) {
  console.log("from main", action);
  messager.post({ type: "HI" });
};

var messager = exports.messager = (0, _postmessageRaf.workerMessager)({ onAction: dispatch });

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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWU0MDdiZmJiNGJhOGFiMjI2MTIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NsYXZlL21lc3NhZ2VyLmpzIiwid2VicGFjazovLy8uL34vQHZrYW1tZXJlci9wb3N0bWVzc2FnZS1yYWYvc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vQHZrYW1tZXJlci9wb3N0bWVzc2FnZS1yYWYvc3JjL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NyYy9zbGF2ZS9zbGF2ZS5qcyJdLCJuYW1lcyI6WyJkaXNwYXRjaCIsImNvbnNvbGUiLCJsb2ciLCJhY3Rpb24iLCJtZXNzYWdlciIsInBvc3QiLCJ0eXBlIiwib25BY3Rpb24iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDaEVBOztBQUVBLElBQU1BLFdBQVcsU0FBWEEsUUFBVyxTQUFVO0FBQ3pCQyxVQUFRQyxHQUFSLENBQVksV0FBWixFQUF5QkMsTUFBekI7QUFDQUMsV0FBU0MsSUFBVCxDQUFjLEVBQUVDLE1BQU0sSUFBUixFQUFkO0FBQ0QsQ0FIRDs7QUFLTyxJQUFNRiw4QkFBVyxvQ0FBZSxFQUFFRyxVQUFVUCxRQUFaLEVBQWYsQ0FBakIsQzs7Ozs7Ozs7O0FDUDRCOztBQUVuQyx1QkFBOEIsbUJBQW1CO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFdBQVc7QUFDL0I7QUFDQTtBQUNBLGFBQWEsV0FBVztBQUN4QjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxZQUFZLGlCQUFpQixFQUFFO0FBQzVDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLGtCQUFrQjtBQUM1Qyw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQUE7QUFBQTs7QUFFQSx5QkFBZ0MsbUJBQW1CO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxvQkFBb0Isd0JBQXdCO0FBQzVDO0FBQ0E7QUFDQSxhQUFhLHdCQUF3QjtBQUNyQztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEscUJBQXFCO0FBQ2xDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBCQUEwQix3QkFBd0I7QUFDbEQsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBLGFBQWEsdUJBQXVCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLGFBQWEsc0JBQXNCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7OztBQ1JBLHVDIiwiZmlsZSI6IjFlNDA3YmZiYjRiYThhYjIyNjEyLndvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMWU0MDdiZmJiNGJhOGFiMjI2MTIiLCJpbXBvcnQgeyB3b3JrZXJNZXNzYWdlciB9IGZyb20gXCJAdmthbW1lcmVyL3Bvc3RtZXNzYWdlLXJhZlwiO1xuXG5jb25zdCBkaXNwYXRjaCA9IGFjdGlvbiA9PiB7XG4gIGNvbnNvbGUubG9nKFwiZnJvbSBtYWluXCIsIGFjdGlvbik7XG4gIG1lc3NhZ2VyLnBvc3QoeyB0eXBlOiBcIkhJXCIgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgbWVzc2FnZXIgPSB3b3JrZXJNZXNzYWdlcih7IG9uQWN0aW9uOiBkaXNwYXRjaCB9KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zbGF2ZS9tZXNzYWdlci5qcyIsImltcG9ydCB7IHNlbmRUb1dvcmtlciwgc2VuZFRvTWFpbiB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCBjb25zdCBtYWluTWVzc2FnZXIgPSAoeyB3b3JrZXIsIG9uQWN0aW9uIH0pID0+IHtcbiAgLy8gU1RBVEVcbiAgY29uc3QgcyA9IHtcbiAgICBwaW5naW5nOiBmYWxzZSxcbiAgICBpbk9wZXJhdGlvbnM6IHt9LFxuICAgIG91dE9wZXJhdGlvbnM6IFtdLFxuICAgIGNvdW50OiAwXG4gIH07XG4gIHdpbmRvdy5vcGVyYXRpb25zID0gcy5vcGVyYXRpb25zO1xuXG4gIC8vIElOSVRcbiAgd29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2UobUUpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gSlNPTi5wYXJzZShtRS5kYXRhKTtcbiAgICBpZiAoIW1lc3NhZ2UudHlwZSB8fCBtZXNzYWdlLnR5cGUgIT09IFwiUE1SQUZfVE9fTUFJTlwiKSByZXR1cm47XG4gICAgbWVzc2FnZS5wYXlsb2FkLmZvckVhY2gob25PcGVyYXRpb24pO1xuICAgIGlmIChtZXNzYWdlLm1ldGEucGluZ1JlcXVlc3QgPT09IFwic3RhcnRcIikgc3RhcnRQaW5nKCk7XG4gICAgaWYgKG1lc3NhZ2UubWV0YS5waW5nUmVxdWVzdCA9PT0gXCJzdG9wXCIpIHN0b3BQaW5nKCk7XG4gIH0pO1xuXG4gIC8vIFBSSVZBVEVcbiAgY29uc3Qgb25PcGVyYXRpb24gPSBvcGVyYXRpb24gPT4ge1xuICAgIGlmICghcy5waW5naW5nKSByZXR1cm4gb25BY3Rpb24ob3BlcmF0aW9uLnBheWxvYWQpO1xuICAgIGlmICghb3BlcmF0aW9uLm1ldGEgfHwgIW9wZXJhdGlvbi5tZXRhLmRlbGF5KSB7XG4gICAgICBzLmluT3BlcmF0aW9uc1tzLmNvdW50XSA9IHMuaW5PcGVyYXRpb25zW3MuY291bnRdIHx8IFtdO1xuICAgICAgcmV0dXJuIHMuaW5PcGVyYXRpb25zW3MuY291bnRdLnB1c2gob3BlcmF0aW9uKTtcbiAgICB9XG4gICAgaWYgKG9wZXJhdGlvbi5tZXRhLmRlbGF5LmNvdW50ICYmIG9wZXJhdGlvbi5tZXRhLmRlbGF5LmNvdW50ID49IHMuY291bnQpIHtcbiAgICAgIHMuaW5PcGVyYXRpb25zW29wZXJhdGlvbi5tZXRhLmRlbGF5LmNvdW50XSA9IHMuaW5PcGVyYXRpb25zW1xuICAgICAgICBvcGVyYXRpb24ubWV0YS5kZWxheS5jb3VudFxuICAgICAgXSB8fCBbXTtcbiAgICAgIHJldHVybiBzLmluT3BlcmF0aW9uc1tvcGVyYXRpb24ubWV0YS5kZWxheS5jb3VudF0ucHVzaChvcGVyYXRpb24pO1xuICAgIH1cbiAgICBpZiAob3BlcmF0aW9uLm1ldGEuZGVsYXkuaW5kZXggJiYgb3BlcmF0aW9uLm1ldGEuZGVsYXkuaW5kZXggPj0gMCkge1xuICAgICAgcy5pbk9wZXJhdGlvbnNbcy5jb3VudCArIG9wZXJhdGlvbi5tZXRhLmRlbGF5LmluZGV4XSA9IHMuaW5PcGVyYXRpb25zW1xuICAgICAgICBzLmNvdW50ICsgb3BlcmF0aW9uLm1ldGEuZGVsYXkuaW5kZXhcbiAgICAgIF0gfHwgW107XG4gICAgICByZXR1cm4gcy5pbk9wZXJhdGlvbnNbcy5jb3VudCArIG9wZXJhdGlvbi5tZXRhLmRlbGF5LmluZGV4XS5wdXNoKFxuICAgICAgICBvcGVyYXRpb25cbiAgICAgICk7XG4gICAgfVxuICB9O1xuICBjb25zdCBwcm9jZXNzSW5PcGVyYXRpb25zID0gKCkgPT4ge1xuICAgIGlmICghcy5pbk9wZXJhdGlvbnNbcy5jb3VudF0pIHJldHVybjtcbiAgICBzLmluT3BlcmF0aW9uc1tzLmNvdW50XS5mb3JFYWNoKG9wZXJhdGlvbiA9PiBvbkFjdGlvbihvcGVyYXRpb24ucGF5bG9hZCkpO1xuICAgIHMuaW5PcGVyYXRpb25zW3MuY291bnRdLmxlbmd0aCA9IDA7XG4gIH07XG4gIGNvbnN0IHNlbmRBbGwgPSAoeyBwaW5nRGF0YSB9KSA9PiB7XG4gICAgc2VuZFRvV29ya2VyKHdvcmtlciwge1xuICAgICAgdHlwZTogXCJQTVJBRl9UT19XT1JLRVJcIixcbiAgICAgIG1ldGE6IHsgcGluZ0RhdGEgfSxcbiAgICAgIHBheWxvYWQ6IHMub3V0T3BlcmF0aW9uc1xuICAgIH0pO1xuICAgIHMub3V0T3BlcmF0aW9ucy5sZW5ndGggPSAwO1xuICB9O1xuICBjb25zdCBwaW5nID0gKCkgPT4ge1xuICAgIGlmICghcy5waW5naW5nKSByZXR1cm47XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHBpbmcpO1xuICAgIHNlbmRBbGwoeyBwaW5nRGF0YTogeyBjb3VudDogcy5jb3VudCB9IH0pO1xuICAgIHByb2Nlc3NJbk9wZXJhdGlvbnMoKTtcbiAgICBzLmNvdW50Kys7XG4gIH07XG5cbiAgLy8gUFVCTElDXG4gIGNvbnN0IHBvc3QgPSBhY3Rpb24gPT4ge1xuICAgIHMub3V0T3BlcmF0aW9ucy5wdXNoKHsgcGF5bG9hZDogYWN0aW9uIH0pO1xuICAgIGlmICghcy5waW5naW5nKSBzZW5kQWxsKHt9KTtcbiAgfTtcbiAgY29uc3Qgc3RhcnRQaW5nID0gKCkgPT4ge1xuICAgIHMucGluZ2luZyA9IHRydWU7XG4gICAgcy5jb3VudCA9IDA7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHBpbmcpO1xuICB9O1xuICBjb25zdCBzdG9wUGluZyA9ICgpID0+IHtcbiAgICBzLnBpbmdpbmcgPSBmYWxzZTtcbiAgICBzZW5kQWxsKHt9KTtcbiAgICBwcm9jZXNzSW5PcGVyYXRpb25zKCk7XG4gIH07XG4gIHJldHVybiB7IHBvc3QgfTtcbn07XG5cbmV4cG9ydCBjb25zdCB3b3JrZXJNZXNzYWdlciA9ICh7IG9uQWN0aW9uLCBvblBvbmcgfSkgPT4ge1xuICAvLyBTVEFURVxuICBjb25zdCBzID0ge1xuICAgIHBpbmdpbmc6IGZhbHNlLFxuICAgIG91dE9wZXJhdGlvbnM6IFtdXG4gIH07XG4gIHNlbGYub3BlcmF0aW9ucyA9IHMub3BlcmF0aW9ucztcblxuICAvLyBJTklUXG4gIHNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24gaGFuZGxlTWVzc2FnZShtRSkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKG1FLmRhdGEpO1xuICAgIGlmICghbWVzc2FnZS50eXBlIHx8IG1lc3NhZ2UudHlwZSAhPT0gXCJQTVJBRl9UT19XT1JLRVJcIikgcmV0dXJuO1xuICAgIGlmIChtZXNzYWdlLm1ldGEucGluZ0RhdGEpIHBvbmcobWVzc2FnZS5tZXRhLnBpbmdEYXRhKTtcbiAgICBtZXNzYWdlLnBheWxvYWQuZm9yRWFjaChvbk9wZXJhdGlvbik7XG4gIH0pO1xuXG4gIC8vIFBSSVZBVEVcbiAgY29uc3Qgb25PcGVyYXRpb24gPSBvcGVyYXRpb24gPT4gb25BY3Rpb24ob3BlcmF0aW9uLnBheWxvYWQpO1xuICBjb25zdCBzZW5kQWxsID0gKHsgcGluZ1JlcXVlc3QsIHBvbmdEYXRhIH0pID0+IHtcbiAgICBzZW5kVG9NYWluKHtcbiAgICAgIHR5cGU6IFwiUE1SQUZfVE9fTUFJTlwiLFxuICAgICAgbWV0YTogeyBwaW5nUmVxdWVzdCwgcG9uZ0RhdGEgfSxcbiAgICAgIHBheWxvYWQ6IHMub3V0T3BlcmF0aW9uc1xuICAgIH0pO1xuICAgIHMub3V0T3BlcmF0aW9ucy5sZW5ndGggPSAwO1xuICB9O1xuICBjb25zdCBwb25nID0gcGluZ0RhdGEgPT4ge1xuICAgIGlmICghcy5waW5naW5nKSByZXR1cm47XG4gICAgc2VuZEFsbCh7IHBvbmdEYXRhOiBwaW5nRGF0YSB9KTtcbiAgICBpZiAob25Qb25nKSBvblBvbmcocGluZ0RhdGEpO1xuICB9O1xuXG4gIC8vIFBVQkxJQ1xuICBjb25zdCBwb3N0ID0gKGFjdGlvbiwgbWV0YSkgPT4ge1xuICAgIHMub3V0T3BlcmF0aW9ucy5wdXNoKHsgcGF5bG9hZDogYWN0aW9uLCBtZXRhIH0pO1xuICAgIGlmICghcy5waW5naW5nKSBzZW5kQWxsKHt9KTtcbiAgfTtcbiAgY29uc3Qgc3RhcnRQaW5nID0gKCkgPT4ge1xuICAgIHMucGluZ2luZyA9IHRydWU7XG4gICAgc2VuZEFsbCh7IHBpbmdSZXF1ZXN0OiBcInN0YXJ0XCIgfSk7XG4gIH07XG4gIGNvbnN0IHN0b3BQaW5nID0gKCkgPT4ge1xuICAgIHMucGluZ2luZyA9IGZhbHNlO1xuICAgIHNlbmRBbGwoeyBwaW5nUmVxdWVzdDogXCJzdG9wXCIgfSk7XG4gIH07XG4gIHJldHVybiB7XG4gICAgcG9zdCxcbiAgICBzdGFydFBpbmcsXG4gICAgc3RvcFBpbmdcbiAgfTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vQHZrYW1tZXJlci9wb3N0bWVzc2FnZS1yYWYvc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBjb25zdCBzZW5kVG9Xb3JrZXIgPSAod29ya2VyLCBtZXNzYWdlKSA9PiB7XG4gIGNvbnN0IHN0cmluZ2VkID0gSlNPTi5zdHJpbmdpZnkobWVzc2FnZSk7XG4gIHdvcmtlci5wb3N0TWVzc2FnZShzdHJpbmdlZCk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2VuZFRvTWFpbiA9IG1lc3NhZ2UgPT4ge1xuICBjb25zdCBzdHJpbmdlZCA9IEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpO1xuICBzZWxmLnBvc3RNZXNzYWdlKHN0cmluZ2VkKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vQHZrYW1tZXJlci9wb3N0bWVzc2FnZS1yYWYvc3JjL3V0aWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IG1lc3NhZ2VyIH0gZnJvbSBcIi4vbWVzc2FnZXJcIjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zbGF2ZS9zbGF2ZS5qcyJdLCJzb3VyY2VSb290IjoiIn0=