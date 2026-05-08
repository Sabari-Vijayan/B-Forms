/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/forms/[id]/submissions/route";
exports.ids = ["app/api/forms/[id]/submissions/route"];
exports.modules = {

/***/ "(rsc)/./app/api/forms/[id]/submissions/route.ts":
/*!*************************************************!*\
  !*** ./app/api/forms/[id]/submissions/route.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_server_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/server/auth */ \"(rsc)/./lib/server/auth.ts\");\n/* harmony import */ var _lib_server_modules_submissions_submissions_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/server/modules/submissions/submissions.service */ \"(rsc)/./lib/server/modules/submissions/submissions.service.ts\");\n\n\n\nasync function GET(req, { params }) {\n    const user = await (0,_lib_server_auth__WEBPACK_IMPORTED_MODULE_1__.getUser)(req);\n    if (!user) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Unauthorized\"\n    }, {\n        status: 401\n    });\n    try {\n        const id = (await params).id;\n        const submissions = await _lib_server_modules_submissions_submissions_service__WEBPACK_IMPORTED_MODULE_2__.SubmissionsService.getFormSubmissions(user.token, id);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(submissions);\n    } catch (error) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error.message\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2Zvcm1zL1tpZF0vc3VibWlzc2lvbnMvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUF3RDtBQUNaO0FBQzhDO0FBRW5GLGVBQWVHLElBQ3BCQyxHQUFnQixFQUNoQixFQUFFQyxNQUFNLEVBQXVDO0lBRS9DLE1BQU1DLE9BQU8sTUFBTUwseURBQU9BLENBQUNHO0lBQzNCLElBQUksQ0FBQ0UsTUFBTSxPQUFPTixxREFBWUEsQ0FBQ08sSUFBSSxDQUFDO1FBQUVDLE9BQU87SUFBZSxHQUFHO1FBQUVDLFFBQVE7SUFBSTtJQUU3RSxJQUFJO1FBQ0YsTUFBTUMsS0FBSyxDQUFDLE1BQU1MLE1BQUssRUFBR0ssRUFBRTtRQUM1QixNQUFNQyxjQUFjLE1BQU1ULG1HQUFrQkEsQ0FBQ1Usa0JBQWtCLENBQUNOLEtBQUtPLEtBQUssRUFBRUg7UUFDNUUsT0FBT1YscURBQVlBLENBQUNPLElBQUksQ0FBQ0k7SUFDM0IsRUFBRSxPQUFPSCxPQUFZO1FBQ25CLE9BQU9SLHFEQUFZQSxDQUFDTyxJQUFJLENBQUM7WUFBRUMsT0FBT0EsTUFBTU0sT0FBTztRQUFDLEdBQUc7WUFBRUwsUUFBUTtRQUFJO0lBQ25FO0FBQ0YiLCJzb3VyY2VzIjpbIi9ob21lL3NhYmFyaS9Xb3JrL3N0YXJ0dXAvbXZwMy9Bc3NldC1CdWlsZGVyL2FwcC9hcGkvZm9ybXMvW2lkXS9zdWJtaXNzaW9ucy9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5pbXBvcnQgeyBnZXRVc2VyIH0gZnJvbSBcIkAvbGliL3NlcnZlci9hdXRoXCI7XG5pbXBvcnQgeyBTdWJtaXNzaW9uc1NlcnZpY2UgfSBmcm9tIFwiQC9saWIvc2VydmVyL21vZHVsZXMvc3VibWlzc2lvbnMvc3VibWlzc2lvbnMuc2VydmljZVwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKFxuICByZXE6IE5leHRSZXF1ZXN0LFxuICB7IHBhcmFtcyB9OiB7IHBhcmFtczogUHJvbWlzZTx7IGlkOiBzdHJpbmcgfT4gfVxuKSB7XG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRVc2VyKHJlcSk7XG4gIGlmICghdXNlcikgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiVW5hdXRob3JpemVkXCIgfSwgeyBzdGF0dXM6IDQwMSB9KTtcblxuICB0cnkge1xuICAgIGNvbnN0IGlkID0gKGF3YWl0IHBhcmFtcykuaWQ7XG4gICAgY29uc3Qgc3VibWlzc2lvbnMgPSBhd2FpdCBTdWJtaXNzaW9uc1NlcnZpY2UuZ2V0Rm9ybVN1Ym1pc3Npb25zKHVzZXIudG9rZW4sIGlkKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oc3VibWlzc2lvbnMpO1xuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImdldFVzZXIiLCJTdWJtaXNzaW9uc1NlcnZpY2UiLCJHRVQiLCJyZXEiLCJwYXJhbXMiLCJ1c2VyIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwiaWQiLCJzdWJtaXNzaW9ucyIsImdldEZvcm1TdWJtaXNzaW9ucyIsInRva2VuIiwibWVzc2FnZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/forms/[id]/submissions/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/server/auth.ts":
/*!****************************!*\
  !*** ./lib/server/auth.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getUser: () => (/* binding */ getUser)\n/* harmony export */ });\n/* harmony import */ var _supabase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./supabase */ \"(rsc)/./lib/server/supabase.ts\");\n\n/**\n * In-memory cache for user sessions to avoid repeated Supabase Auth calls.\n * In Next.js Development mode, we use a global variable to persist the cache \n * across Hot Module Replacement (HMR) / file saves.\n */ const SESSION_TTL = 60 * 1000; // 1 minute\nconst globalForAuth = global;\nconst sessionCache = globalForAuth.sessionCache || new Map();\nif (true) {\n    globalForAuth.sessionCache = sessionCache;\n}\nasync function getUser(req) {\n    const authHeader = req.headers.get(\"Authorization\");\n    if (!authHeader?.startsWith(\"Bearer \")) return null;\n    const token = authHeader.split(\" \")[1];\n    // Check cache\n    const cached = sessionCache.get(token);\n    if (cached && Date.now() - cached.timestamp < SESSION_TTL) {\n        return {\n            ...cached.user,\n            token\n        };\n    }\n    const supabase = (0,_supabase__WEBPACK_IMPORTED_MODULE_0__.createSupabaseClient)(token);\n    try {\n        const { data: { user }, error } = await supabase.auth.getUser();\n        if (error || !user) return null;\n        const userData = {\n            id: user.id,\n            email: user.email\n        };\n        // Store in cache\n        sessionCache.set(token, {\n            user: userData,\n            timestamp: Date.now()\n        });\n        return {\n            ...userData,\n            token\n        };\n    } catch (err) {\n        console.error(\"Auth error:\", err);\n        return null;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc2VydmVyL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDa0Q7QUFFbEQ7Ozs7Q0FJQyxHQUNELE1BQU1DLGNBQWMsS0FBSyxNQUFNLFdBQVc7QUFPMUMsTUFBTUMsZ0JBQWdCQztBQUl0QixNQUFNQyxlQUFlRixjQUFjRSxZQUFZLElBQUksSUFBSUM7QUFFdkQsSUFBSUMsSUFBcUMsRUFBRTtJQUN6Q0osY0FBY0UsWUFBWSxHQUFHQTtBQUMvQjtBQUVPLGVBQWVHLFFBQVFDLEdBQWdCO0lBQzVDLE1BQU1DLGFBQWFELElBQUlFLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDO0lBQ25DLElBQUksQ0FBQ0YsWUFBWUcsV0FBVyxZQUFZLE9BQU87SUFFL0MsTUFBTUMsUUFBUUosV0FBV0ssS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO0lBRXRDLGNBQWM7SUFDZCxNQUFNQyxTQUFTWCxhQUFhTyxHQUFHLENBQUNFO0lBQ2hDLElBQUlFLFVBQVVDLEtBQUtDLEdBQUcsS0FBS0YsT0FBT0csU0FBUyxHQUFHakIsYUFBYTtRQUN6RCxPQUFPO1lBQ0wsR0FBR2MsT0FBT0ksSUFBSTtZQUNkTjtRQUNGO0lBQ0Y7SUFFQSxNQUFNTyxXQUFXcEIsK0RBQW9CQSxDQUFDYTtJQUV0QyxJQUFJO1FBQ0YsTUFBTSxFQUFFUSxNQUFNLEVBQUVGLElBQUksRUFBRSxFQUFFRyxLQUFLLEVBQUUsR0FBRyxNQUFNRixTQUFTRyxJQUFJLENBQUNoQixPQUFPO1FBQzdELElBQUllLFNBQVMsQ0FBQ0gsTUFBTSxPQUFPO1FBRTNCLE1BQU1LLFdBQVc7WUFDZkMsSUFBSU4sS0FBS00sRUFBRTtZQUNYQyxPQUFPUCxLQUFLTyxLQUFLO1FBQ25CO1FBRUEsaUJBQWlCO1FBQ2pCdEIsYUFBYXVCLEdBQUcsQ0FBQ2QsT0FBTztZQUFFTSxNQUFNSztZQUFVTixXQUFXRixLQUFLQyxHQUFHO1FBQUc7UUFFaEUsT0FBTztZQUNMLEdBQUdPLFFBQVE7WUFDWFg7UUFDRjtJQUNGLEVBQUUsT0FBT2UsS0FBSztRQUNaQyxRQUFRUCxLQUFLLENBQUMsZUFBZU07UUFDN0IsT0FBTztJQUNUO0FBQ0YiLCJzb3VyY2VzIjpbIi9ob21lL3NhYmFyaS9Xb3JrL3N0YXJ0dXAvbXZwMy9Bc3NldC1CdWlsZGVyL2xpYi9zZXJ2ZXIvYXV0aC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHsgY3JlYXRlU3VwYWJhc2VDbGllbnQgfSBmcm9tIFwiLi9zdXBhYmFzZVwiO1xuXG4vKipcbiAqIEluLW1lbW9yeSBjYWNoZSBmb3IgdXNlciBzZXNzaW9ucyB0byBhdm9pZCByZXBlYXRlZCBTdXBhYmFzZSBBdXRoIGNhbGxzLlxuICogSW4gTmV4dC5qcyBEZXZlbG9wbWVudCBtb2RlLCB3ZSB1c2UgYSBnbG9iYWwgdmFyaWFibGUgdG8gcGVyc2lzdCB0aGUgY2FjaGUgXG4gKiBhY3Jvc3MgSG90IE1vZHVsZSBSZXBsYWNlbWVudCAoSE1SKSAvIGZpbGUgc2F2ZXMuXG4gKi9cbmNvbnN0IFNFU1NJT05fVFRMID0gNjAgKiAxMDAwOyAvLyAxIG1pbnV0ZVxuXG5pbnRlcmZhY2UgQ2FjaGVkU2Vzc2lvbiB7XG4gIHVzZXI6IGFueTtcbiAgdGltZXN0YW1wOiBudW1iZXI7XG59XG5cbmNvbnN0IGdsb2JhbEZvckF1dGggPSBnbG9iYWwgYXMgdW5rbm93biBhcyB7IFxuICBzZXNzaW9uQ2FjaGU6IE1hcDxzdHJpbmcsIENhY2hlZFNlc3Npb24+IFxufTtcblxuY29uc3Qgc2Vzc2lvbkNhY2hlID0gZ2xvYmFsRm9yQXV0aC5zZXNzaW9uQ2FjaGUgfHwgbmV3IE1hcDxzdHJpbmcsIENhY2hlZFNlc3Npb24+KCk7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgZ2xvYmFsRm9yQXV0aC5zZXNzaW9uQ2FjaGUgPSBzZXNzaW9uQ2FjaGU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRVc2VyKHJlcTogTmV4dFJlcXVlc3QpIHtcbiAgY29uc3QgYXV0aEhlYWRlciA9IHJlcS5oZWFkZXJzLmdldChcIkF1dGhvcml6YXRpb25cIik7XG4gIGlmICghYXV0aEhlYWRlcj8uc3RhcnRzV2l0aChcIkJlYXJlciBcIikpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IHRva2VuID0gYXV0aEhlYWRlci5zcGxpdChcIiBcIilbMV07XG4gIFxuICAvLyBDaGVjayBjYWNoZVxuICBjb25zdCBjYWNoZWQgPSBzZXNzaW9uQ2FjaGUuZ2V0KHRva2VuKTtcbiAgaWYgKGNhY2hlZCAmJiBEYXRlLm5vdygpIC0gY2FjaGVkLnRpbWVzdGFtcCA8IFNFU1NJT05fVFRMKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmNhY2hlZC51c2VyLFxuICAgICAgdG9rZW5cbiAgICB9O1xuICB9XG5cbiAgY29uc3Qgc3VwYWJhc2UgPSBjcmVhdGVTdXBhYmFzZUNsaWVudCh0b2tlbik7XG4gIFxuICB0cnkge1xuICAgIGNvbnN0IHsgZGF0YTogeyB1c2VyIH0sIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKTtcbiAgICBpZiAoZXJyb3IgfHwgIXVzZXIpIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgdXNlckRhdGEgPSB7XG4gICAgICBpZDogdXNlci5pZCxcbiAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgIH07XG5cbiAgICAvLyBTdG9yZSBpbiBjYWNoZVxuICAgIHNlc3Npb25DYWNoZS5zZXQodG9rZW4sIHsgdXNlcjogdXNlckRhdGEsIHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi51c2VyRGF0YSxcbiAgICAgIHRva2VuXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkF1dGggZXJyb3I6XCIsIGVycik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJjcmVhdGVTdXBhYmFzZUNsaWVudCIsIlNFU1NJT05fVFRMIiwiZ2xvYmFsRm9yQXV0aCIsImdsb2JhbCIsInNlc3Npb25DYWNoZSIsIk1hcCIsInByb2Nlc3MiLCJnZXRVc2VyIiwicmVxIiwiYXV0aEhlYWRlciIsImhlYWRlcnMiLCJnZXQiLCJzdGFydHNXaXRoIiwidG9rZW4iLCJzcGxpdCIsImNhY2hlZCIsIkRhdGUiLCJub3ciLCJ0aW1lc3RhbXAiLCJ1c2VyIiwic3VwYWJhc2UiLCJkYXRhIiwiZXJyb3IiLCJhdXRoIiwidXNlckRhdGEiLCJpZCIsImVtYWlsIiwic2V0IiwiZXJyIiwiY29uc29sZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/server/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/server/logger.ts":
/*!******************************!*\
  !*** ./lib/server/logger.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   logger: () => (/* binding */ logger)\n/* harmony export */ });\n/* harmony import */ var pino__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pino */ \"(rsc)/./node_modules/pino/pino.js\");\n/* harmony import */ var pino__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pino__WEBPACK_IMPORTED_MODULE_0__);\n\n// In Next.js API routes, pino-pretty transport can cause \"worker thread exited\" errors \n// because it uses worker_threads which might not be correctly bundled/handled by Next.js.\n// Standardizing on simple JSON logging to ensure stability.\nconst logger = pino__WEBPACK_IMPORTED_MODULE_0___default()({\n    level: process.env.LOG_LEVEL || \"info\"\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc2VydmVyL2xvZ2dlci50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBd0I7QUFFeEIsd0ZBQXdGO0FBQ3hGLDBGQUEwRjtBQUMxRiw0REFBNEQ7QUFDckQsTUFBTUMsU0FBU0QsMkNBQUlBLENBQUM7SUFDekJFLE9BQU9DLFFBQVFDLEdBQUcsQ0FBQ0MsU0FBUyxJQUFJO0FBQ2xDLEdBQUciLCJzb3VyY2VzIjpbIi9ob21lL3NhYmFyaS9Xb3JrL3N0YXJ0dXAvbXZwMy9Bc3NldC1CdWlsZGVyL2xpYi9zZXJ2ZXIvbG9nZ2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwaW5vIGZyb20gXCJwaW5vXCI7XG5cbi8vIEluIE5leHQuanMgQVBJIHJvdXRlcywgcGluby1wcmV0dHkgdHJhbnNwb3J0IGNhbiBjYXVzZSBcIndvcmtlciB0aHJlYWQgZXhpdGVkXCIgZXJyb3JzIFxuLy8gYmVjYXVzZSBpdCB1c2VzIHdvcmtlcl90aHJlYWRzIHdoaWNoIG1pZ2h0IG5vdCBiZSBjb3JyZWN0bHkgYnVuZGxlZC9oYW5kbGVkIGJ5IE5leHQuanMuXG4vLyBTdGFuZGFyZGl6aW5nIG9uIHNpbXBsZSBKU09OIGxvZ2dpbmcgdG8gZW5zdXJlIHN0YWJpbGl0eS5cbmV4cG9ydCBjb25zdCBsb2dnZXIgPSBwaW5vKHtcbiAgbGV2ZWw6IHByb2Nlc3MuZW52LkxPR19MRVZFTCB8fCBcImluZm9cIixcbn0pO1xuIl0sIm5hbWVzIjpbInBpbm8iLCJsb2dnZXIiLCJsZXZlbCIsInByb2Nlc3MiLCJlbnYiLCJMT0dfTEVWRUwiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/server/logger.ts\n");

/***/ }),

/***/ "(rsc)/./lib/server/modules/submissions/submissions.service.ts":
/*!***************************************************************!*\
  !*** ./lib/server/modules/submissions/submissions.service.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SubmissionsService: () => (/* binding */ SubmissionsService)\n/* harmony export */ });\n/* harmony import */ var _submissions_sql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./submissions.sql */ \"(rsc)/./lib/server/modules/submissions/submissions.sql.ts\");\n/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../logger */ \"(rsc)/./lib/server/logger.ts\");\n\n\nconst normalize = (l)=>l.toLowerCase().split(\"-\")[0];\nconst SubmissionsService = {\n    async getFormSubmissions (accessToken, formId) {\n        const { data, error } = await _submissions_sql__WEBPACK_IMPORTED_MODULE_0__.SubmissionsSql.getSubmissionsByFormId(accessToken, formId);\n        if (error) throw error;\n        return (data || []).map((s)=>({\n                id: s.id,\n                formId: s.form_id,\n                respondentLanguage: s.respondent_language,\n                rawResponsesJson: s.raw_responses_json,\n                translatedResponsesJson: s.translated_responses_json,\n                sentimentAnalysisJson: s.sentiment_analysis_json,\n                translationStatus: s.translation_status,\n                submittedAt: s.submitted_at\n            }));\n    },\n    async submitForm (formId, respondentLanguage, responses, targetLanguage) {\n        const fromLang = normalize(respondentLanguage);\n        const toLang = normalize(targetLanguage);\n        const { data: submission, error } = await _submissions_sql__WEBPACK_IMPORTED_MODULE_0__.SubmissionsSql.createSubmission({\n            form_id: formId,\n            respondent_language: fromLang,\n            raw_responses_json: responses,\n            translation_status: fromLang === toLang ? \"skipped\" : \"pending\"\n        });\n        if (error) throw error;\n        // Trigger processing. We await it here for development/reliability, \n        // or keep it background for high-scale. Let's make it more reliable.\n        if (fromLang !== toLang) {\n            await this.processSubmission(submission.id, responses, fromLang, toLang).catch((err)=>{\n                _logger__WEBPACK_IMPORTED_MODULE_1__.logger.error({\n                    err\n                }, \"Translation processing failed\");\n            });\n        } else {\n            // Even if no translation needed, still analyze sentiment\n            this.processSubmission(submission.id, responses, fromLang, toLang).catch((err)=>{\n                _logger__WEBPACK_IMPORTED_MODULE_1__.logger.error({\n                    err\n                }, \"Sentiment processing failed\");\n            });\n        }\n        return submission;\n    },\n    async processSubmission (submissionId, responses, fromLang, toLang) {\n        try {\n            const { translateResponse, analyzeSentiment } = await __webpack_require__.e(/*! import() */ \"_rsc_lib_server_ai_ts\").then(__webpack_require__.bind(__webpack_require__, /*! ../../ai */ \"(rsc)/./lib/server/ai.ts\"));\n            let translated = null;\n            if (fromLang !== toLang) {\n                translated = await translateResponse(responses, fromLang, toLang);\n            }\n            const sentiment = await analyzeSentiment(responses, fromLang);\n            await _submissions_sql__WEBPACK_IMPORTED_MODULE_0__.SubmissionsSql.updateSubmission(submissionId, {\n                translated_responses_json: translated,\n                sentiment_analysis_json: sentiment,\n                translation_status: fromLang === toLang ? \"skipped\" : \"done\"\n            });\n        } catch (err) {\n            _logger__WEBPACK_IMPORTED_MODULE_1__.logger.error({\n                err,\n                submissionId\n            }, \"Submission processing failed\");\n            await _submissions_sql__WEBPACK_IMPORTED_MODULE_0__.SubmissionsSql.updateSubmission(submissionId, {\n                translation_status: \"failed\"\n            });\n        }\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc2VydmVyL21vZHVsZXMvc3VibWlzc2lvbnMvc3VibWlzc2lvbnMuc2VydmljZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBbUQ7QUFDYjtBQUV0QyxNQUFNRSxZQUFZLENBQUNDLElBQWNBLEVBQUVDLFdBQVcsR0FBR0MsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBRXZELE1BQU1DLHFCQUFxQjtJQUNoQyxNQUFNQyxvQkFBbUJDLFdBQW1CLEVBQUVDLE1BQWM7UUFDMUQsTUFBTSxFQUFFQyxJQUFJLEVBQUVDLEtBQUssRUFBRSxHQUFHLE1BQU1YLDREQUFjQSxDQUFDWSxzQkFBc0IsQ0FBQ0osYUFBYUM7UUFDakYsSUFBSUUsT0FBTyxNQUFNQTtRQUVqQixPQUFPLENBQUNELFFBQVEsRUFBRSxFQUFFRyxHQUFHLENBQUNDLENBQUFBLElBQU07Z0JBQzVCQyxJQUFJRCxFQUFFQyxFQUFFO2dCQUNSTixRQUFRSyxFQUFFRSxPQUFPO2dCQUNqQkMsb0JBQW9CSCxFQUFFSSxtQkFBbUI7Z0JBQ3pDQyxrQkFBa0JMLEVBQUVNLGtCQUFrQjtnQkFDdENDLHlCQUF5QlAsRUFBRVEseUJBQXlCO2dCQUNwREMsdUJBQXVCVCxFQUFFVSx1QkFBdUI7Z0JBQ2hEQyxtQkFBbUJYLEVBQUVZLGtCQUFrQjtnQkFDdkNDLGFBQWFiLEVBQUVjLFlBQVk7WUFDN0I7SUFDRjtJQUVBLE1BQU1DLFlBQVdwQixNQUFjLEVBQUVRLGtCQUEwQixFQUFFYSxTQUFjLEVBQUVDLGNBQXNCO1FBQ2pHLE1BQU1DLFdBQVc5QixVQUFVZTtRQUMzQixNQUFNZ0IsU0FBUy9CLFVBQVU2QjtRQUV6QixNQUFNLEVBQUVyQixNQUFNd0IsVUFBVSxFQUFFdkIsS0FBSyxFQUFFLEdBQUcsTUFBTVgsNERBQWNBLENBQUNtQyxnQkFBZ0IsQ0FBQztZQUN4RW5CLFNBQVNQO1lBQ1RTLHFCQUFxQmM7WUFDckJaLG9CQUFvQlU7WUFDcEJKLG9CQUFvQk0sYUFBYUMsU0FBUyxZQUFZO1FBQ3hEO1FBRUEsSUFBSXRCLE9BQU8sTUFBTUE7UUFFakIscUVBQXFFO1FBQ3JFLHFFQUFxRTtRQUNyRSxJQUFJcUIsYUFBYUMsUUFBUTtZQUN2QixNQUFNLElBQUksQ0FBQ0csaUJBQWlCLENBQUNGLFdBQVduQixFQUFFLEVBQUVlLFdBQVdFLFVBQVVDLFFBQVFJLEtBQUssQ0FBQ0MsQ0FBQUE7Z0JBQzVFckMsMkNBQU1BLENBQUNVLEtBQUssQ0FBQztvQkFBRTJCO2dCQUFJLEdBQUc7WUFDekI7UUFDRixPQUFPO1lBQ0wseURBQXlEO1lBQ3pELElBQUksQ0FBQ0YsaUJBQWlCLENBQUNGLFdBQVduQixFQUFFLEVBQUVlLFdBQVdFLFVBQVVDLFFBQVFJLEtBQUssQ0FBQ0MsQ0FBQUE7Z0JBQ3RFckMsMkNBQU1BLENBQUNVLEtBQUssQ0FBQztvQkFBRTJCO2dCQUFJLEdBQUc7WUFDekI7UUFDRjtRQUVBLE9BQU9KO0lBQ1Q7SUFFQSxNQUFNRSxtQkFBa0JHLFlBQW9CLEVBQUVULFNBQWMsRUFBRUUsUUFBZ0IsRUFBRUMsTUFBYztRQUM1RixJQUFJO1lBQ0YsTUFBTSxFQUFFTyxpQkFBaUIsRUFBRUMsZ0JBQWdCLEVBQUUsR0FBRyxNQUFNLDhKQUFrQjtZQUV4RSxJQUFJQyxhQUFhO1lBQ2pCLElBQUlWLGFBQWFDLFFBQVE7Z0JBQ3ZCUyxhQUFhLE1BQU1GLGtCQUFrQlYsV0FBV0UsVUFBVUM7WUFDNUQ7WUFFQSxNQUFNVSxZQUFZLE1BQU1GLGlCQUFpQlgsV0FBV0U7WUFFcEQsTUFBTWhDLDREQUFjQSxDQUFDNEMsZ0JBQWdCLENBQUNMLGNBQWM7Z0JBQ2xEakIsMkJBQTJCb0I7Z0JBQzNCbEIseUJBQXlCbUI7Z0JBQ3pCakIsb0JBQW9CTSxhQUFhQyxTQUFTLFlBQVk7WUFDeEQ7UUFDRixFQUFFLE9BQU9LLEtBQUs7WUFDWnJDLDJDQUFNQSxDQUFDVSxLQUFLLENBQUM7Z0JBQUUyQjtnQkFBS0M7WUFBYSxHQUFHO1lBQ3BDLE1BQU12Qyw0REFBY0EsQ0FBQzRDLGdCQUFnQixDQUFDTCxjQUFjO2dCQUFFYixvQkFBb0I7WUFBUztRQUNyRjtJQUNGO0FBQ0YsRUFBRSIsInNvdXJjZXMiOlsiL2hvbWUvc2FiYXJpL1dvcmsvc3RhcnR1cC9tdnAzL0Fzc2V0LUJ1aWxkZXIvbGliL3NlcnZlci9tb2R1bGVzL3N1Ym1pc3Npb25zL3N1Ym1pc3Npb25zLnNlcnZpY2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3VibWlzc2lvbnNTcWwgfSBmcm9tIFwiLi9zdWJtaXNzaW9ucy5zcWxcIjtcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gXCIuLi8uLi9sb2dnZXJcIjtcblxuY29uc3Qgbm9ybWFsaXplID0gKGw6IHN0cmluZykgPT4gbC50b0xvd2VyQ2FzZSgpLnNwbGl0KFwiLVwiKVswXTtcblxuZXhwb3J0IGNvbnN0IFN1Ym1pc3Npb25zU2VydmljZSA9IHtcbiAgYXN5bmMgZ2V0Rm9ybVN1Ym1pc3Npb25zKGFjY2Vzc1Rva2VuOiBzdHJpbmcsIGZvcm1JZDogc3RyaW5nKSB7XG4gICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgU3VibWlzc2lvbnNTcWwuZ2V0U3VibWlzc2lvbnNCeUZvcm1JZChhY2Nlc3NUb2tlbiwgZm9ybUlkKTtcbiAgICBpZiAoZXJyb3IpIHRocm93IGVycm9yO1xuICAgIFxuICAgIHJldHVybiAoZGF0YSB8fCBbXSkubWFwKHMgPT4gKHtcbiAgICAgIGlkOiBzLmlkLFxuICAgICAgZm9ybUlkOiBzLmZvcm1faWQsXG4gICAgICByZXNwb25kZW50TGFuZ3VhZ2U6IHMucmVzcG9uZGVudF9sYW5ndWFnZSxcbiAgICAgIHJhd1Jlc3BvbnNlc0pzb246IHMucmF3X3Jlc3BvbnNlc19qc29uLFxuICAgICAgdHJhbnNsYXRlZFJlc3BvbnNlc0pzb246IHMudHJhbnNsYXRlZF9yZXNwb25zZXNfanNvbixcbiAgICAgIHNlbnRpbWVudEFuYWx5c2lzSnNvbjogcy5zZW50aW1lbnRfYW5hbHlzaXNfanNvbixcbiAgICAgIHRyYW5zbGF0aW9uU3RhdHVzOiBzLnRyYW5zbGF0aW9uX3N0YXR1cyxcbiAgICAgIHN1Ym1pdHRlZEF0OiBzLnN1Ym1pdHRlZF9hdFxuICAgIH0pKTtcbiAgfSxcblxuICBhc3luYyBzdWJtaXRGb3JtKGZvcm1JZDogc3RyaW5nLCByZXNwb25kZW50TGFuZ3VhZ2U6IHN0cmluZywgcmVzcG9uc2VzOiBhbnksIHRhcmdldExhbmd1YWdlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBmcm9tTGFuZyA9IG5vcm1hbGl6ZShyZXNwb25kZW50TGFuZ3VhZ2UpO1xuICAgIGNvbnN0IHRvTGFuZyA9IG5vcm1hbGl6ZSh0YXJnZXRMYW5ndWFnZSk7XG5cbiAgICBjb25zdCB7IGRhdGE6IHN1Ym1pc3Npb24sIGVycm9yIH0gPSBhd2FpdCBTdWJtaXNzaW9uc1NxbC5jcmVhdGVTdWJtaXNzaW9uKHtcbiAgICAgIGZvcm1faWQ6IGZvcm1JZCxcbiAgICAgIHJlc3BvbmRlbnRfbGFuZ3VhZ2U6IGZyb21MYW5nLFxuICAgICAgcmF3X3Jlc3BvbnNlc19qc29uOiByZXNwb25zZXMsXG4gICAgICB0cmFuc2xhdGlvbl9zdGF0dXM6IGZyb21MYW5nID09PSB0b0xhbmcgPyBcInNraXBwZWRcIiA6IFwicGVuZGluZ1wiXG4gICAgfSk7XG5cbiAgICBpZiAoZXJyb3IpIHRocm93IGVycm9yO1xuXG4gICAgLy8gVHJpZ2dlciBwcm9jZXNzaW5nLiBXZSBhd2FpdCBpdCBoZXJlIGZvciBkZXZlbG9wbWVudC9yZWxpYWJpbGl0eSwgXG4gICAgLy8gb3Iga2VlcCBpdCBiYWNrZ3JvdW5kIGZvciBoaWdoLXNjYWxlLiBMZXQncyBtYWtlIGl0IG1vcmUgcmVsaWFibGUuXG4gICAgaWYgKGZyb21MYW5nICE9PSB0b0xhbmcpIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvY2Vzc1N1Ym1pc3Npb24oc3VibWlzc2lvbi5pZCwgcmVzcG9uc2VzLCBmcm9tTGFuZywgdG9MYW5nKS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgbG9nZ2VyLmVycm9yKHsgZXJyIH0sIFwiVHJhbnNsYXRpb24gcHJvY2Vzc2luZyBmYWlsZWRcIik7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRXZlbiBpZiBubyB0cmFuc2xhdGlvbiBuZWVkZWQsIHN0aWxsIGFuYWx5emUgc2VudGltZW50XG4gICAgICB0aGlzLnByb2Nlc3NTdWJtaXNzaW9uKHN1Ym1pc3Npb24uaWQsIHJlc3BvbnNlcywgZnJvbUxhbmcsIHRvTGFuZykuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgIGxvZ2dlci5lcnJvcih7IGVyciB9LCBcIlNlbnRpbWVudCBwcm9jZXNzaW5nIGZhaWxlZFwiKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBzdWJtaXNzaW9uO1xuICB9LFxuXG4gIGFzeW5jIHByb2Nlc3NTdWJtaXNzaW9uKHN1Ym1pc3Npb25JZDogc3RyaW5nLCByZXNwb25zZXM6IGFueSwgZnJvbUxhbmc6IHN0cmluZywgdG9MYW5nOiBzdHJpbmcpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyB0cmFuc2xhdGVSZXNwb25zZSwgYW5hbHl6ZVNlbnRpbWVudCB9ID0gYXdhaXQgaW1wb3J0KFwiLi4vLi4vYWlcIik7XG4gICAgICBcbiAgICAgIGxldCB0cmFuc2xhdGVkID0gbnVsbDtcbiAgICAgIGlmIChmcm9tTGFuZyAhPT0gdG9MYW5nKSB7XG4gICAgICAgIHRyYW5zbGF0ZWQgPSBhd2FpdCB0cmFuc2xhdGVSZXNwb25zZShyZXNwb25zZXMsIGZyb21MYW5nLCB0b0xhbmcpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzZW50aW1lbnQgPSBhd2FpdCBhbmFseXplU2VudGltZW50KHJlc3BvbnNlcywgZnJvbUxhbmcpO1xuXG4gICAgICBhd2FpdCBTdWJtaXNzaW9uc1NxbC51cGRhdGVTdWJtaXNzaW9uKHN1Ym1pc3Npb25JZCwge1xuICAgICAgICB0cmFuc2xhdGVkX3Jlc3BvbnNlc19qc29uOiB0cmFuc2xhdGVkLFxuICAgICAgICBzZW50aW1lbnRfYW5hbHlzaXNfanNvbjogc2VudGltZW50LFxuICAgICAgICB0cmFuc2xhdGlvbl9zdGF0dXM6IGZyb21MYW5nID09PSB0b0xhbmcgPyBcInNraXBwZWRcIiA6IFwiZG9uZVwiXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGxvZ2dlci5lcnJvcih7IGVyciwgc3VibWlzc2lvbklkIH0sIFwiU3VibWlzc2lvbiBwcm9jZXNzaW5nIGZhaWxlZFwiKTtcbiAgICAgIGF3YWl0IFN1Ym1pc3Npb25zU3FsLnVwZGF0ZVN1Ym1pc3Npb24oc3VibWlzc2lvbklkLCB7IHRyYW5zbGF0aW9uX3N0YXR1czogXCJmYWlsZWRcIiB9KTtcbiAgICB9XG4gIH1cbn07XG4iXSwibmFtZXMiOlsiU3VibWlzc2lvbnNTcWwiLCJsb2dnZXIiLCJub3JtYWxpemUiLCJsIiwidG9Mb3dlckNhc2UiLCJzcGxpdCIsIlN1Ym1pc3Npb25zU2VydmljZSIsImdldEZvcm1TdWJtaXNzaW9ucyIsImFjY2Vzc1Rva2VuIiwiZm9ybUlkIiwiZGF0YSIsImVycm9yIiwiZ2V0U3VibWlzc2lvbnNCeUZvcm1JZCIsIm1hcCIsInMiLCJpZCIsImZvcm1faWQiLCJyZXNwb25kZW50TGFuZ3VhZ2UiLCJyZXNwb25kZW50X2xhbmd1YWdlIiwicmF3UmVzcG9uc2VzSnNvbiIsInJhd19yZXNwb25zZXNfanNvbiIsInRyYW5zbGF0ZWRSZXNwb25zZXNKc29uIiwidHJhbnNsYXRlZF9yZXNwb25zZXNfanNvbiIsInNlbnRpbWVudEFuYWx5c2lzSnNvbiIsInNlbnRpbWVudF9hbmFseXNpc19qc29uIiwidHJhbnNsYXRpb25TdGF0dXMiLCJ0cmFuc2xhdGlvbl9zdGF0dXMiLCJzdWJtaXR0ZWRBdCIsInN1Ym1pdHRlZF9hdCIsInN1Ym1pdEZvcm0iLCJyZXNwb25zZXMiLCJ0YXJnZXRMYW5ndWFnZSIsImZyb21MYW5nIiwidG9MYW5nIiwic3VibWlzc2lvbiIsImNyZWF0ZVN1Ym1pc3Npb24iLCJwcm9jZXNzU3VibWlzc2lvbiIsImNhdGNoIiwiZXJyIiwic3VibWlzc2lvbklkIiwidHJhbnNsYXRlUmVzcG9uc2UiLCJhbmFseXplU2VudGltZW50IiwidHJhbnNsYXRlZCIsInNlbnRpbWVudCIsInVwZGF0ZVN1Ym1pc3Npb24iXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/server/modules/submissions/submissions.service.ts\n");

/***/ }),

/***/ "(rsc)/./lib/server/modules/submissions/submissions.sql.ts":
/*!***********************************************************!*\
  !*** ./lib/server/modules/submissions/submissions.sql.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SubmissionsSql: () => (/* binding */ SubmissionsSql)\n/* harmony export */ });\n/* harmony import */ var _supabase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../supabase */ \"(rsc)/./lib/server/supabase.ts\");\n\nconst SubmissionsSql = {\n    async getSubmissionsByFormId (accessToken, formId) {\n        const supabase = (0,_supabase__WEBPACK_IMPORTED_MODULE_0__.createSupabaseClient)(accessToken);\n        return await supabase.from(\"submissions\").select(\"*\").eq(\"form_id\", formId).order(\"submitted_at\", {\n            ascending: false\n        });\n    },\n    async createSubmission (submission) {\n        const admin = (0,_supabase__WEBPACK_IMPORTED_MODULE_0__.createAdminClient)();\n        return await admin.from(\"submissions\").insert(submission).select().single();\n    },\n    async updateSubmission (id, updates) {\n        const admin = (0,_supabase__WEBPACK_IMPORTED_MODULE_0__.createAdminClient)();\n        return await admin.from(\"submissions\").update(updates).eq(\"id\", id).select().single();\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc2VydmVyL21vZHVsZXMvc3VibWlzc2lvbnMvc3VibWlzc2lvbnMuc3FsLnRzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQXlFO0FBRWxFLE1BQU1FLGlCQUFpQjtJQUM1QixNQUFNQyx3QkFBdUJDLFdBQW1CLEVBQUVDLE1BQWM7UUFDOUQsTUFBTUMsV0FBV0wsK0RBQW9CQSxDQUFDRztRQUN0QyxPQUFPLE1BQU1FLFNBQ1ZDLElBQUksQ0FBQyxlQUNMQyxNQUFNLENBQUMsS0FDUEMsRUFBRSxDQUFDLFdBQVdKLFFBQ2RLLEtBQUssQ0FBQyxnQkFBZ0I7WUFBRUMsV0FBVztRQUFNO0lBQzlDO0lBRUEsTUFBTUMsa0JBQWlCQyxVQUFlO1FBQ3BDLE1BQU1DLFFBQVFkLDREQUFpQkE7UUFDL0IsT0FBTyxNQUFNYyxNQUFNUCxJQUFJLENBQUMsZUFBZVEsTUFBTSxDQUFDRixZQUFZTCxNQUFNLEdBQUdRLE1BQU07SUFDM0U7SUFFQSxNQUFNQyxrQkFBaUJDLEVBQVUsRUFBRUMsT0FBWTtRQUM3QyxNQUFNTCxRQUFRZCw0REFBaUJBO1FBQy9CLE9BQU8sTUFBTWMsTUFBTVAsSUFBSSxDQUFDLGVBQWVhLE1BQU0sQ0FBQ0QsU0FBU1YsRUFBRSxDQUFDLE1BQU1TLElBQUlWLE1BQU0sR0FBR1EsTUFBTTtJQUNyRjtBQUNGLEVBQUUiLCJzb3VyY2VzIjpbIi9ob21lL3NhYmFyaS9Xb3JrL3N0YXJ0dXAvbXZwMy9Bc3NldC1CdWlsZGVyL2xpYi9zZXJ2ZXIvbW9kdWxlcy9zdWJtaXNzaW9ucy9zdWJtaXNzaW9ucy5zcWwudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQWRtaW5DbGllbnQsIGNyZWF0ZVN1cGFiYXNlQ2xpZW50IH0gZnJvbSBcIi4uLy4uL3N1cGFiYXNlXCI7XG5cbmV4cG9ydCBjb25zdCBTdWJtaXNzaW9uc1NxbCA9IHtcbiAgYXN5bmMgZ2V0U3VibWlzc2lvbnNCeUZvcm1JZChhY2Nlc3NUb2tlbjogc3RyaW5nLCBmb3JtSWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHN1cGFiYXNlID0gY3JlYXRlU3VwYWJhc2VDbGllbnQoYWNjZXNzVG9rZW4pO1xuICAgIHJldHVybiBhd2FpdCBzdXBhYmFzZVxuICAgICAgLmZyb20oXCJzdWJtaXNzaW9uc1wiKVxuICAgICAgLnNlbGVjdChcIipcIilcbiAgICAgIC5lcShcImZvcm1faWRcIiwgZm9ybUlkKVxuICAgICAgLm9yZGVyKFwic3VibWl0dGVkX2F0XCIsIHsgYXNjZW5kaW5nOiBmYWxzZSB9KTtcbiAgfSxcblxuICBhc3luYyBjcmVhdGVTdWJtaXNzaW9uKHN1Ym1pc3Npb246IGFueSkge1xuICAgIGNvbnN0IGFkbWluID0gY3JlYXRlQWRtaW5DbGllbnQoKTtcbiAgICByZXR1cm4gYXdhaXQgYWRtaW4uZnJvbShcInN1Ym1pc3Npb25zXCIpLmluc2VydChzdWJtaXNzaW9uKS5zZWxlY3QoKS5zaW5nbGUoKTtcbiAgfSxcblxuICBhc3luYyB1cGRhdGVTdWJtaXNzaW9uKGlkOiBzdHJpbmcsIHVwZGF0ZXM6IGFueSkge1xuICAgIGNvbnN0IGFkbWluID0gY3JlYXRlQWRtaW5DbGllbnQoKTtcbiAgICByZXR1cm4gYXdhaXQgYWRtaW4uZnJvbShcInN1Ym1pc3Npb25zXCIpLnVwZGF0ZSh1cGRhdGVzKS5lcShcImlkXCIsIGlkKS5zZWxlY3QoKS5zaW5nbGUoKTtcbiAgfVxufTtcbiJdLCJuYW1lcyI6WyJjcmVhdGVBZG1pbkNsaWVudCIsImNyZWF0ZVN1cGFiYXNlQ2xpZW50IiwiU3VibWlzc2lvbnNTcWwiLCJnZXRTdWJtaXNzaW9uc0J5Rm9ybUlkIiwiYWNjZXNzVG9rZW4iLCJmb3JtSWQiLCJzdXBhYmFzZSIsImZyb20iLCJzZWxlY3QiLCJlcSIsIm9yZGVyIiwiYXNjZW5kaW5nIiwiY3JlYXRlU3VibWlzc2lvbiIsInN1Ym1pc3Npb24iLCJhZG1pbiIsImluc2VydCIsInNpbmdsZSIsInVwZGF0ZVN1Ym1pc3Npb24iLCJpZCIsInVwZGF0ZXMiLCJ1cGRhdGUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/server/modules/submissions/submissions.sql.ts\n");

/***/ }),

/***/ "(rsc)/./lib/server/supabase.ts":
/*!********************************!*\
  !*** ./lib/server/supabase.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createAdminClient: () => (/* binding */ createAdminClient),\n/* harmony export */   createSupabaseClient: () => (/* binding */ createSupabaseClient),\n/* harmony export */   isSupabaseConfigured: () => (/* binding */ isSupabaseConfigured)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/index.mjs\");\n\nconst supabaseUrl = process.env.SUPABASE_URL ?? \"\";\nconst supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? \"\";\nconst supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? \"\";\nfunction isSupabaseConfigured() {\n    return supabaseUrl.startsWith(\"https://\") && supabaseAnonKey.length > 0 && supabaseServiceKey.length > 0;\n}\nfunction createSupabaseClient(accessToken) {\n    if (!isSupabaseConfigured()) {\n        const missing = [];\n        if (!supabaseUrl.startsWith(\"https://\")) missing.push(\"SUPABASE_URL (must start with https://)\");\n        if (!supabaseAnonKey) missing.push(\"SUPABASE_ANON_KEY\");\n        if (!supabaseServiceKey) missing.push(\"SUPABASE_SERVICE_ROLE_KEY\");\n        throw new Error(`Supabase is not configured. Missing: ${missing.join(\", \")}`);\n    }\n    return (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey, {\n        auth: {\n            persistSession: false\n        },\n        global: {\n            headers: accessToken ? {\n                Authorization: `Bearer ${accessToken}`\n            } : {}\n        }\n    });\n}\nfunction createAdminClient() {\n    if (!isSupabaseConfigured()) {\n        throw new Error(\"Supabase is not configured. Ensure SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY are set.\");\n    }\n    return (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseServiceKey, {\n        auth: {\n            persistSession: false\n        }\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc2VydmVyL3N1cGFiYXNlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBcUQ7QUFFckQsTUFBTUMsY0FBY0MsUUFBUUMsR0FBRyxDQUFDQyxZQUFZLElBQUk7QUFDaEQsTUFBTUMsa0JBQWtCSCxRQUFRQyxHQUFHLENBQUNHLGlCQUFpQixJQUFJO0FBQ3pELE1BQU1DLHFCQUFxQkwsUUFBUUMsR0FBRyxDQUFDSyx5QkFBeUIsSUFBSTtBQUU3RCxTQUFTQztJQUNkLE9BQ0VSLFlBQVlTLFVBQVUsQ0FBQyxlQUN2QkwsZ0JBQWdCTSxNQUFNLEdBQUcsS0FDekJKLG1CQUFtQkksTUFBTSxHQUFHO0FBRWhDO0FBRU8sU0FBU0MscUJBQXFCQyxXQUFvQjtJQUN2RCxJQUFJLENBQUNKLHdCQUF3QjtRQUMzQixNQUFNSyxVQUFVLEVBQUU7UUFDbEIsSUFBSSxDQUFDYixZQUFZUyxVQUFVLENBQUMsYUFBYUksUUFBUUMsSUFBSSxDQUFDO1FBQ3RELElBQUksQ0FBQ1YsaUJBQWlCUyxRQUFRQyxJQUFJLENBQUM7UUFDbkMsSUFBSSxDQUFDUixvQkFBb0JPLFFBQVFDLElBQUksQ0FBQztRQUV0QyxNQUFNLElBQUlDLE1BQU0sQ0FBQyxxQ0FBcUMsRUFBRUYsUUFBUUcsSUFBSSxDQUFDLE9BQU87SUFDOUU7SUFDQSxPQUFPakIsbUVBQVlBLENBQUNDLGFBQWFJLGlCQUFpQjtRQUNoRGEsTUFBTTtZQUFFQyxnQkFBZ0I7UUFBTTtRQUM5QkMsUUFBUTtZQUNOQyxTQUFTUixjQUFjO2dCQUFFUyxlQUFlLENBQUMsT0FBTyxFQUFFVCxhQUFhO1lBQUMsSUFBSSxDQUFDO1FBQ3ZFO0lBQ0Y7QUFDRjtBQUVPLFNBQVNVO0lBQ2QsSUFBSSxDQUFDZCx3QkFBd0I7UUFDM0IsTUFBTSxJQUFJTyxNQUFNO0lBQ2xCO0lBQ0EsT0FBT2hCLG1FQUFZQSxDQUFDQyxhQUFhTSxvQkFBb0I7UUFDbkRXLE1BQU07WUFBRUMsZ0JBQWdCO1FBQU07SUFDaEM7QUFDRiIsInNvdXJjZXMiOlsiL2hvbWUvc2FiYXJpL1dvcmsvc3RhcnR1cC9tdnAzL0Fzc2V0LUJ1aWxkZXIvbGliL3NlcnZlci9zdXBhYmFzZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tIFwiQHN1cGFiYXNlL3N1cGFiYXNlLWpzXCI7XG5cbmNvbnN0IHN1cGFiYXNlVXJsID0gcHJvY2Vzcy5lbnYuU1VQQUJBU0VfVVJMID8/IFwiXCI7XG5jb25zdCBzdXBhYmFzZUFub25LZXkgPSBwcm9jZXNzLmVudi5TVVBBQkFTRV9BTk9OX0tFWSA/PyBcIlwiO1xuY29uc3Qgc3VwYWJhc2VTZXJ2aWNlS2V5ID0gcHJvY2Vzcy5lbnYuU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSA/PyBcIlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNTdXBhYmFzZUNvbmZpZ3VyZWQoKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgc3VwYWJhc2VVcmwuc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpICYmXG4gICAgc3VwYWJhc2VBbm9uS2V5Lmxlbmd0aCA+IDAgJiZcbiAgICBzdXBhYmFzZVNlcnZpY2VLZXkubGVuZ3RoID4gMFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3VwYWJhc2VDbGllbnQoYWNjZXNzVG9rZW4/OiBzdHJpbmcpIHtcbiAgaWYgKCFpc1N1cGFiYXNlQ29uZmlndXJlZCgpKSB7XG4gICAgY29uc3QgbWlzc2luZyA9IFtdO1xuICAgIGlmICghc3VwYWJhc2VVcmwuc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpKSBtaXNzaW5nLnB1c2goXCJTVVBBQkFTRV9VUkwgKG11c3Qgc3RhcnQgd2l0aCBodHRwczovLylcIik7XG4gICAgaWYgKCFzdXBhYmFzZUFub25LZXkpIG1pc3NpbmcucHVzaChcIlNVUEFCQVNFX0FOT05fS0VZXCIpO1xuICAgIGlmICghc3VwYWJhc2VTZXJ2aWNlS2V5KSBtaXNzaW5nLnB1c2goXCJTVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZXCIpO1xuICAgIFxuICAgIHRocm93IG5ldyBFcnJvcihgU3VwYWJhc2UgaXMgbm90IGNvbmZpZ3VyZWQuIE1pc3Npbmc6ICR7bWlzc2luZy5qb2luKFwiLCBcIil9YCk7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUNsaWVudChzdXBhYmFzZVVybCwgc3VwYWJhc2VBbm9uS2V5LCB7XG4gICAgYXV0aDogeyBwZXJzaXN0U2Vzc2lvbjogZmFsc2UgfSxcbiAgICBnbG9iYWw6IHtcbiAgICAgIGhlYWRlcnM6IGFjY2Vzc1Rva2VuID8geyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7YWNjZXNzVG9rZW59YCB9IDoge30sXG4gICAgfSxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBZG1pbkNsaWVudCgpIHtcbiAgaWYgKCFpc1N1cGFiYXNlQ29uZmlndXJlZCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiU3VwYWJhc2UgaXMgbm90IGNvbmZpZ3VyZWQuIEVuc3VyZSBTVVBBQkFTRV9VUkwsIFNVUEFCQVNFX0FOT05fS0VZLCBhbmQgU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSBhcmUgc2V0LlwiKTtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2xpZW50KHN1cGFiYXNlVXJsLCBzdXBhYmFzZVNlcnZpY2VLZXksIHtcbiAgICBhdXRoOiB7IHBlcnNpc3RTZXNzaW9uOiBmYWxzZSB9LFxuICB9KTtcbn1cbiJdLCJuYW1lcyI6WyJjcmVhdGVDbGllbnQiLCJzdXBhYmFzZVVybCIsInByb2Nlc3MiLCJlbnYiLCJTVVBBQkFTRV9VUkwiLCJzdXBhYmFzZUFub25LZXkiLCJTVVBBQkFTRV9BTk9OX0tFWSIsInN1cGFiYXNlU2VydmljZUtleSIsIlNVUEFCQVNFX1NFUlZJQ0VfUk9MRV9LRVkiLCJpc1N1cGFiYXNlQ29uZmlndXJlZCIsInN0YXJ0c1dpdGgiLCJsZW5ndGgiLCJjcmVhdGVTdXBhYmFzZUNsaWVudCIsImFjY2Vzc1Rva2VuIiwibWlzc2luZyIsInB1c2giLCJFcnJvciIsImpvaW4iLCJhdXRoIiwicGVyc2lzdFNlc3Npb24iLCJnbG9iYWwiLCJoZWFkZXJzIiwiQXV0aG9yaXphdGlvbiIsImNyZWF0ZUFkbWluQ2xpZW50Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/server/supabase.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fforms%2F%5Bid%5D%2Fsubmissions%2Froute&page=%2Fapi%2Fforms%2F%5Bid%5D%2Fsubmissions%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fforms%2F%5Bid%5D%2Fsubmissions%2Froute.ts&appDir=%2Fhome%2Fsabari%2FWork%2Fstartup%2Fmvp3%2FAsset-Builder%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fsabari%2FWork%2Fstartup%2Fmvp3%2FAsset-Builder&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fforms%2F%5Bid%5D%2Fsubmissions%2Froute&page=%2Fapi%2Fforms%2F%5Bid%5D%2Fsubmissions%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fforms%2F%5Bid%5D%2Fsubmissions%2Froute.ts&appDir=%2Fhome%2Fsabari%2FWork%2Fstartup%2Fmvp3%2FAsset-Builder%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fsabari%2FWork%2Fstartup%2Fmvp3%2FAsset-Builder&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_sabari_Work_startup_mvp3_Asset_Builder_app_api_forms_id_submissions_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/forms/[id]/submissions/route.ts */ \"(rsc)/./app/api/forms/[id]/submissions/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/forms/[id]/submissions/route\",\n        pathname: \"/api/forms/[id]/submissions\",\n        filename: \"route\",\n        bundlePath: \"app/api/forms/[id]/submissions/route\"\n    },\n    resolvedPagePath: \"/home/sabari/Work/startup/mvp3/Asset-Builder/app/api/forms/[id]/submissions/route.ts\",\n    nextConfigOutput,\n    userland: _home_sabari_Work_startup_mvp3_Asset_Builder_app_api_forms_id_submissions_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZmb3JtcyUyRiU1QmlkJTVEJTJGc3VibWlzc2lvbnMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmZvcm1zJTJGJTVCaWQlNUQlMkZzdWJtaXNzaW9ucyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmZvcm1zJTJGJTVCaWQlNUQlMkZzdWJtaXNzaW9ucyUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGc2FiYXJpJTJGV29yayUyRnN0YXJ0dXAlMkZtdnAzJTJGQXNzZXQtQnVpbGRlciUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGaG9tZSUyRnNhYmFyaSUyRldvcmslMkZzdGFydHVwJTJGbXZwMyUyRkFzc2V0LUJ1aWxkZXImaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ29DO0FBQ2pIO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvaG9tZS9zYWJhcmkvV29yay9zdGFydHVwL212cDMvQXNzZXQtQnVpbGRlci9hcHAvYXBpL2Zvcm1zL1tpZF0vc3VibWlzc2lvbnMvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2Zvcm1zL1tpZF0vc3VibWlzc2lvbnMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9mb3Jtcy9baWRdL3N1Ym1pc3Npb25zXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9mb3Jtcy9baWRdL3N1Ym1pc3Npb25zL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL2hvbWUvc2FiYXJpL1dvcmsvc3RhcnR1cC9tdnAzL0Fzc2V0LUJ1aWxkZXIvYXBwL2FwaS9mb3Jtcy9baWRdL3N1Ym1pc3Npb25zL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fforms%2F%5Bid%5D%2Fsubmissions%2Froute&page=%2Fapi%2Fforms%2F%5Bid%5D%2Fsubmissions%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fforms%2F%5Bid%5D%2Fsubmissions%2Froute.ts&appDir=%2Fhome%2Fsabari%2FWork%2Fstartup%2Fmvp3%2FAsset-Builder%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fsabari%2FWork%2Fstartup%2Fmvp3%2FAsset-Builder&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "module":
/*!*************************!*\
  !*** external "module" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("module");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "node:diagnostics_channel":
/*!*******************************************!*\
  !*** external "node:diagnostics_channel" ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:diagnostics_channel");

/***/ }),

/***/ "node:events":
/*!******************************!*\
  !*** external "node:events" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:events");

/***/ }),

/***/ "node:os":
/*!**************************!*\
  !*** external "node:os" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:os");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("worker_threads");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/tslib","vendor-chunks/@supabase","vendor-chunks/iceberg-js","vendor-chunks/pino","vendor-chunks/pino-std-serializers","vendor-chunks/thread-stream","vendor-chunks/sonic-boom","vendor-chunks/safe-stable-stringify","vendor-chunks/quick-format-unescaped","vendor-chunks/on-exit-leak-free","vendor-chunks/atomic-sleep","vendor-chunks/@pinojs"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fforms%2F%5Bid%5D%2Fsubmissions%2Froute&page=%2Fapi%2Fforms%2F%5Bid%5D%2Fsubmissions%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fforms%2F%5Bid%5D%2Fsubmissions%2Froute.ts&appDir=%2Fhome%2Fsabari%2FWork%2Fstartup%2Fmvp3%2FAsset-Builder%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fsabari%2FWork%2Fstartup%2Fmvp3%2FAsset-Builder&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();