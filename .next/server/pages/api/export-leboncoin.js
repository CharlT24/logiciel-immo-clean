"use strict";
(() => {
var exports = {};
exports.id = 591;
exports.ids = [591];
exports.modules = {

/***/ 730:
/***/ ((module) => {

module.exports = require("next/dist/server/api-utils/node.js");

/***/ }),

/***/ 3076:
/***/ ((module) => {

module.exports = require("next/dist/server/future/route-modules/route-module.js");

/***/ }),

/***/ 7251:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  config: () => (/* binding */ config),
  "default": () => (/* binding */ next_route_loaderkind_PAGES_API_page_2Fapi_2Fexport_leboncoin_preferredRegion_absolutePagePath_private_next_pages_2Fapi_2Fexport_leboncoin_js_middlewareConfigBase64_e30_3D_),
  routeModule: () => (/* binding */ routeModule)
});

// NAMESPACE OBJECT: ./pages/api/export-leboncoin.js
var export_leboncoin_namespaceObject = {};
__webpack_require__.r(export_leboncoin_namespaceObject);
__webpack_require__.d(export_leboncoin_namespaceObject, {
  "default": () => (handler)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/pages-api/module.js
var pages_api_module = __webpack_require__(6429);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-kind.js
var route_kind = __webpack_require__(7153);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/helpers.js
var helpers = __webpack_require__(7305);
// EXTERNAL MODULE: ./lib/supabaseClient.js + 1 modules
var supabaseClient = __webpack_require__(9973);
;// CONCATENATED MODULE: ./pages/api/export-leboncoin.js

async function handler(req, res) {
    const { data: biens, error } = await supabaseClient/* supabase */.O.from("biens").select("*").eq("disponible", true).eq("export_leboncoin", true);
    if (error) {
        return res.status(500).json({
            error: "Erreur Supabase"
        });
    }
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<annonces>
${biens.map((bien)=>`
  <annonce>
    <titre>${bien.titre}</titre>
    <ville>${bien.ville}</ville>
    <prix>${bien.prix}</prix>
    <surface>${bien.surface_m2}</surface>
    <dpe>${bien.dpe || "NC"}</dpe>
    <description>${bien.description || "Bien propos\xe9 via Logiciel Immo."}</description>
  </annonce>
`).join("\n")}
</annonces>
`;
    res.setHeader("Content-Type", "application/xml");
    return res.status(200).send(xml);
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fexport-leboncoin&preferredRegion=&absolutePagePath=private-next-pages%2Fapi%2Fexport-leboncoin.js&middlewareConfigBase64=e30%3D!
// @ts-ignore this need to be imported from next/dist to be external



const PagesAPIRouteModule = pages_api_module.PagesAPIRouteModule;
// Import the userland code.
// @ts-expect-error - replaced by webpack/turbopack loader

// Re-export the handler (should be the default export).
/* harmony default export */ const next_route_loaderkind_PAGES_API_page_2Fapi_2Fexport_leboncoin_preferredRegion_absolutePagePath_private_next_pages_2Fapi_2Fexport_leboncoin_js_middlewareConfigBase64_e30_3D_ = ((0,helpers/* hoist */.l)(export_leboncoin_namespaceObject, "default"));
// Re-export config.
const config = (0,helpers/* hoist */.l)(export_leboncoin_namespaceObject, "config");
// Create and export the route module that will be consumed.
const routeModule = new PagesAPIRouteModule({
    definition: {
        kind: route_kind/* RouteKind */.x.PAGES_API,
        page: "/api/export-leboncoin",
        pathname: "/api/export-leboncoin",
        // The following aren't used in production.
        bundlePath: "",
        filename: ""
    },
    userland: export_leboncoin_namespaceObject
});

//# sourceMappingURL=pages-api.js.map

/***/ }),

/***/ 9973:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  O: () => (/* binding */ supabase)
});

;// CONCATENATED MODULE: external "@supabase/supabase-js"
const supabase_js_namespaceObject = require("@supabase/supabase-js");
;// CONCATENATED MODULE: ./lib/supabaseClient.js

const supabaseUrl = "https://fkavtsofmglifzalclyn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYXZ0c29mbWdsaWZ6YWxjbHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDgzNDIsImV4cCI6MjA1ODQ4NDM0Mn0.vN8-2RzyVu_2X4lWT4Uqa6aI3OYuAcIFFuMeGS5Po1Y";
const supabase = (0,supabase_js_namespaceObject.createClient)(supabaseUrl, supabaseAnonKey);


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [172], () => (__webpack_exec__(7251)));
module.exports = __webpack_exports__;

})();