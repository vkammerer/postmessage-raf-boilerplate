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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var sendToWorker = exports.sendToWorker = function sendToWorker(worker) {
  return function (message) {
    var stringed = JSON.stringify(message);
    worker.postMessage(stringed);
  };
};

var sendToMain = exports.sendToMain = function sendToMain(message) {
  var stringed = JSON.stringify(message);
  self.postMessage(stringed);
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var SlaveWorker = __webpack_require__(3);

var slaveWorker = exports.slaveWorker = new SlaveWorker();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utils = __webpack_require__(0);

var _slaveWorker = __webpack_require__(1);

var onMessage = function onMessage(mE) {
  var data = JSON.parse(mE.data);
  console.log(data.msg);
};

_slaveWorker.slaveWorker.addEventListener("message", onMessage);

(0, _utils.sendToWorker)(_slaveWorker.slaveWorker)({ msg: "ping" });

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {
	return new Worker(__webpack_require__.p + "b1d58f9bc900b5dd8818.worker.js");
};

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMmU5Njc2M2UyMTFiMjRiOTY1ZGYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFzdGVyL3NsYXZlV29ya2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9tYXN0ZXIvbWFzdGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9zbGF2ZS9zbGF2ZS5qcyJdLCJuYW1lcyI6WyJzZW5kVG9Xb3JrZXIiLCJzdHJpbmdlZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJtZXNzYWdlIiwid29ya2VyIiwicG9zdE1lc3NhZ2UiLCJzZW5kVG9NYWluIiwic2VsZiIsIlNsYXZlV29ya2VyIiwicmVxdWlyZSIsInNsYXZlV29ya2VyIiwib25NZXNzYWdlIiwiZGF0YSIsInBhcnNlIiwibUUiLCJjb25zb2xlIiwibG9nIiwibXNnIiwiYWRkRXZlbnRMaXN0ZW5lciJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDaEVPLElBQU1BLHNDQUFlLFNBQWZBLFlBQWU7QUFBQSxTQUFVLG1CQUFXO0FBQy9DLFFBQU1DLFdBQVdDLEtBQUtDLFNBQUwsQ0FBZUMsT0FBZixDQUFqQjtBQUNBQyxXQUFPQyxXQUFQLENBQW1CTCxRQUFuQjtBQUNELEdBSDJCO0FBQUEsQ0FBckI7O0FBS0EsSUFBTU0sa0NBQWEsU0FBYkEsVUFBYSxVQUFXO0FBQ25DLE1BQU1OLFdBQVdDLEtBQUtDLFNBQUwsQ0FBZUMsT0FBZixDQUFqQjtBQUNBSSxPQUFLRixXQUFMLENBQWlCTCxRQUFqQjtBQUNELENBSE0sQzs7Ozs7Ozs7Ozs7O0FDTFAsSUFBTVEsY0FBYyxtQkFBQUMsQ0FBUSxDQUFSLENBQXBCOztBQUVPLElBQU1DLG9DQUFjLElBQUlGLFdBQUosRUFBcEIsQzs7Ozs7Ozs7O0FDRlA7O0FBQ0E7O0FBRUEsSUFBTUcsWUFBWSxTQUFaQSxTQUFZLEtBQU07QUFDdEIsTUFBTUMsT0FBT1gsS0FBS1ksS0FBTCxDQUFXQyxHQUFHRixJQUFkLENBQWI7QUFDQUcsVUFBUUMsR0FBUixDQUFZSixLQUFLSyxHQUFqQjtBQUNELENBSEQ7O0FBS0EseUJBQVlDLGdCQUFaLENBQTZCLFNBQTdCLEVBQXdDUCxTQUF4Qzs7QUFFQSxtREFBMEIsRUFBRU0sS0FBSyxNQUFQLEVBQTFCLEU7Ozs7OztBQ1ZBO0FBQ0E7QUFDQSxFIiwiZmlsZSI6Im1hc3Rlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMmU5Njc2M2UyMTFiMjRiOTY1ZGYiLCJleHBvcnQgY29uc3Qgc2VuZFRvV29ya2VyID0gd29ya2VyID0+IG1lc3NhZ2UgPT4ge1xuICBjb25zdCBzdHJpbmdlZCA9IEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpO1xuICB3b3JrZXIucG9zdE1lc3NhZ2Uoc3RyaW5nZWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNlbmRUb01haW4gPSBtZXNzYWdlID0+IHtcbiAgY29uc3Qgc3RyaW5nZWQgPSBKU09OLnN0cmluZ2lmeShtZXNzYWdlKTtcbiAgc2VsZi5wb3N0TWVzc2FnZShzdHJpbmdlZCk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbW1vbi91dGlscy5qcyIsImNvbnN0IFNsYXZlV29ya2VyID0gcmVxdWlyZShcIndvcmtlci1sb2FkZXIhLi4vc2xhdmUvc2xhdmUuanNcIik7XG5cbmV4cG9ydCBjb25zdCBzbGF2ZVdvcmtlciA9IG5ldyBTbGF2ZVdvcmtlcigpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21hc3Rlci9zbGF2ZVdvcmtlci5qcyIsImltcG9ydCB7IHNlbmRUb1dvcmtlciB9IGZyb20gXCIuLi9jb21tb24vdXRpbHMuanNcIjtcbmltcG9ydCB7IHNsYXZlV29ya2VyIH0gZnJvbSBcIi4vc2xhdmVXb3JrZXIuanNcIjtcblxuY29uc3Qgb25NZXNzYWdlID0gbUUgPT4ge1xuICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShtRS5kYXRhKTtcbiAgY29uc29sZS5sb2coZGF0YS5tc2cpO1xufTtcblxuc2xhdmVXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgb25NZXNzYWdlKTtcblxuc2VuZFRvV29ya2VyKHNsYXZlV29ya2VyKSh7IG1zZzogXCJwaW5nXCIgfSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWFzdGVyL21hc3Rlci5qcyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBuZXcgV29ya2VyKF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJiMWQ1OGY5YmM5MDBiNWRkODgxOC53b3JrZXIuanNcIik7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi93b3JrZXItbG9hZGVyIS4vc3JjL3NsYXZlL3NsYXZlLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=