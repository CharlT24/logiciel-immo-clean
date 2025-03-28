"use strict";
(() => {
var exports = {};
exports.id = 877;
exports.ids = [877];
exports.modules = {

/***/ 730:
/***/ ((module) => {

module.exports = require("next/dist/server/api-utils/node.js");

/***/ }),

/***/ 3076:
/***/ ((module) => {

module.exports = require("next/dist/server/future/route-modules/route-module.js");

/***/ }),

/***/ 7539:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  config: () => (/* binding */ config),
  "default": () => (/* binding */ next_route_loaderkind_PAGES_API_page_2Fapi_2Fleboncoin_preferredRegion_absolutePagePath_private_next_pages_2Fapi_2Fleboncoin_js_middlewareConfigBase64_e30_3D_),
  routeModule: () => (/* binding */ routeModule)
});

// NAMESPACE OBJECT: ./pages/api/leboncoin.js
var leboncoin_namespaceObject = {};
__webpack_require__.r(leboncoin_namespaceObject);
__webpack_require__.d(leboncoin_namespaceObject, {
  "default": () => (handler)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/pages-api/module.js
var pages_api_module = __webpack_require__(6429);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-kind.js
var route_kind = __webpack_require__(7153);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/helpers.js
var helpers = __webpack_require__(7305);
;// CONCATENATED MODULE: ./pages/api/leboncoin.js
async function handler(req, res) {
    const mockResults = [
        {
            title: "\uD83C\uDFE0 Maison 100m\xb2 avec jardin (simul\xe9e)",
            price: "320 000 €",
            image: "https://via.placeholder.com/300x200.png?text=Maison+Simul\xe9e",
            link: "https://www.leboncoin.fr/annonce-fictive-1"
        },
        {
            title: "\uD83C\uDFE2 Appartement 70m\xb2 centre-ville (simul\xe9)",
            price: "210 000 €",
            image: "https://via.placeholder.com/300x200.png?text=Appartement+Simul\xe9",
            link: "https://www.leboncoin.fr/annonce-fictive-2"
        }
    ];
    res.status(200).json({
        results: mockResults,
        simulated: true
    });
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fleboncoin&preferredRegion=&absolutePagePath=private-next-pages%2Fapi%2Fleboncoin.js&middlewareConfigBase64=e30%3D!
// @ts-ignore this need to be imported from next/dist to be external



const PagesAPIRouteModule = pages_api_module.PagesAPIRouteModule;
// Import the userland code.
// @ts-expect-error - replaced by webpack/turbopack loader

// Re-export the handler (should be the default export).
/* harmony default export */ const next_route_loaderkind_PAGES_API_page_2Fapi_2Fleboncoin_preferredRegion_absolutePagePath_private_next_pages_2Fapi_2Fleboncoin_js_middlewareConfigBase64_e30_3D_ = ((0,helpers/* hoist */.l)(leboncoin_namespaceObject, "default"));
// Re-export config.
const config = (0,helpers/* hoist */.l)(leboncoin_namespaceObject, "config");
// Create and export the route module that will be consumed.
const routeModule = new PagesAPIRouteModule({
    definition: {
        kind: route_kind/* RouteKind */.x.PAGES_API,
        page: "/api/leboncoin",
        pathname: "/api/leboncoin",
        // The following aren't used in production.
        bundlePath: "",
        filename: ""
    },
    userland: leboncoin_namespaceObject
});

//# sourceMappingURL=pages-api.js.map

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [172], () => (__webpack_exec__(7539)));
module.exports = __webpack_exports__;

})();