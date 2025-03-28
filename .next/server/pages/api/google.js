"use strict";
(() => {
var exports = {};
exports.id = 791;
exports.ids = [791];
exports.modules = {

/***/ 730:
/***/ ((module) => {

module.exports = require("next/dist/server/api-utils/node.js");

/***/ }),

/***/ 3076:
/***/ ((module) => {

module.exports = require("next/dist/server/future/route-modules/route-module.js");

/***/ }),

/***/ 1437:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  config: () => (/* binding */ config),
  "default": () => (/* binding */ next_route_loaderkind_PAGES_API_page_2Fapi_2Fgoogle_preferredRegion_absolutePagePath_private_next_pages_2Fapi_2Fgoogle_js_middlewareConfigBase64_e30_3D_),
  routeModule: () => (/* binding */ routeModule)
});

// NAMESPACE OBJECT: ./pages/api/google.js
var google_namespaceObject = {};
__webpack_require__.r(google_namespaceObject);
__webpack_require__.d(google_namespaceObject, {
  "default": () => (handler)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/pages-api/module.js
var pages_api_module = __webpack_require__(6429);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-kind.js
var route_kind = __webpack_require__(7153);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/helpers.js
var helpers = __webpack_require__(7305);
;// CONCATENATED MODULE: ./pages/api/google.js
// pages/api/google.js
async function handler(req, res) {
    const { query } = req.query;
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;
    if (!apiKey || !cx || !query) {
        return res.status(400).json({
            error: "Param\xe8tres manquants"
        });
    }
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const results = data.items?.map((item)=>({
                title: item.title,
                link: item.link,
                snippet: item.snippet
            })) || [];
        res.status(200).json(results);
    } catch (error) {
        console.error("❌ Erreur Google Search :", error);
        res.status(500).json({
            error: "Erreur serveur"
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fgoogle&preferredRegion=&absolutePagePath=private-next-pages%2Fapi%2Fgoogle.js&middlewareConfigBase64=e30%3D!
// @ts-ignore this need to be imported from next/dist to be external



const PagesAPIRouteModule = pages_api_module.PagesAPIRouteModule;
// Import the userland code.
// @ts-expect-error - replaced by webpack/turbopack loader

// Re-export the handler (should be the default export).
/* harmony default export */ const next_route_loaderkind_PAGES_API_page_2Fapi_2Fgoogle_preferredRegion_absolutePagePath_private_next_pages_2Fapi_2Fgoogle_js_middlewareConfigBase64_e30_3D_ = ((0,helpers/* hoist */.l)(google_namespaceObject, "default"));
// Re-export config.
const config = (0,helpers/* hoist */.l)(google_namespaceObject, "config");
// Create and export the route module that will be consumed.
const routeModule = new PagesAPIRouteModule({
    definition: {
        kind: route_kind/* RouteKind */.x.PAGES_API,
        page: "/api/google",
        pathname: "/api/google",
        // The following aren't used in production.
        bundlePath: "",
        filename: ""
    },
    userland: google_namespaceObject
});

//# sourceMappingURL=pages-api.js.map

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [172], () => (__webpack_exec__(1437)));
module.exports = __webpack_exports__;

})();