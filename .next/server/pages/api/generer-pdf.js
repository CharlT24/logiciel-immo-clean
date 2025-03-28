"use strict";
(() => {
var exports = {};
exports.id = 253;
exports.ids = [253];
exports.modules = {

/***/ 730:
/***/ ((module) => {

module.exports = require("next/dist/server/api-utils/node.js");

/***/ }),

/***/ 3076:
/***/ ((module) => {

module.exports = require("next/dist/server/future/route-modules/route-module.js");

/***/ }),

/***/ 595:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  config: () => (/* binding */ config),
  "default": () => (/* binding */ next_route_loaderkind_PAGES_API_page_2Fapi_2Fgenerer_pdf_preferredRegion_absolutePagePath_private_next_pages_2Fapi_2Fgenerer_pdf_js_middlewareConfigBase64_e30_3D_),
  routeModule: () => (/* binding */ routeModule)
});

// NAMESPACE OBJECT: ./pages/api/generer-pdf.js
var generer_pdf_namespaceObject = {};
__webpack_require__.r(generer_pdf_namespaceObject);
__webpack_require__.d(generer_pdf_namespaceObject, {
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
;// CONCATENATED MODULE: external "html-pdf"
const external_html_pdf_namespaceObject = require("html-pdf");
var external_html_pdf_default = /*#__PURE__*/__webpack_require__.n(external_html_pdf_namespaceObject);
;// CONCATENATED MODULE: ./pages/api/generer-pdf.js


async function handler(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).send("ID manquant");
    // 🔎 Récupère le bien depuis Supabase
    const { data: bien, error } = await supabaseClient/* supabase */.O.from("biens").select("*").eq("id", id).single();
    if (error || !bien) return res.status(404).send("Bien introuvable");
    // 🧾 HTML à convertir en PDF
    const html = `
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Fiche Bien</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        h1 { color: #e67e22; }
        p { margin: 6px 0; }
        .label { font-weight: bold; color: #555; }
        .box { background: #f9f9f9; padding: 12px; border-radius: 8px; }
      </style>
    </head>
    <body>
      <h1>${bien.titre}</h1>
      <div class="box">
        <p><span class="label">📍 Ville :</span> ${bien.ville}</p>
        <p><span class="label">📏 Surface :</span> ${bien.surface_m2} m²</p>
        <p><span class="label">💰 Prix :</span> ${bien.prix.toLocaleString()} €</p>
        <p><span class="label">🔋 DPE :</span> ${bien.dpe}</p>
        <p><span class="label">💼 Honoraires :</span> ${bien.honoraires?.toLocaleString() || 0} €</p>
        <p><span class="label">📅 Disponibilité :</span> ${bien.disponible ? "Disponible" : "Indisponible"}</p>
        <p><span class="label">📦 Statut :</span> ${bien.vendu ? "Vendu" : bien.sous_compromis ? "Sous compromis" : "En vente"}</p>
      </div>

      <h3>Description</h3>
      <p>${bien.description}</p>
    </body>
    </html>
  `;
    // 🖨️ Génération PDF et réponse
    external_html_pdf_default().create(html).toBuffer((err, buffer)=>{
        if (err) {
            console.error("❌ Erreur PDF :", err);
            return res.status(500).send("Erreur g\xe9n\xe9ration PDF");
        }
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename=fiche-bien-${bien.id}.pdf`);
        res.send(buffer);
    });
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fgenerer-pdf&preferredRegion=&absolutePagePath=private-next-pages%2Fapi%2Fgenerer-pdf.js&middlewareConfigBase64=e30%3D!
// @ts-ignore this need to be imported from next/dist to be external



const PagesAPIRouteModule = pages_api_module.PagesAPIRouteModule;
// Import the userland code.
// @ts-expect-error - replaced by webpack/turbopack loader

// Re-export the handler (should be the default export).
/* harmony default export */ const next_route_loaderkind_PAGES_API_page_2Fapi_2Fgenerer_pdf_preferredRegion_absolutePagePath_private_next_pages_2Fapi_2Fgenerer_pdf_js_middlewareConfigBase64_e30_3D_ = ((0,helpers/* hoist */.l)(generer_pdf_namespaceObject, "default"));
// Re-export config.
const config = (0,helpers/* hoist */.l)(generer_pdf_namespaceObject, "config");
// Create and export the route module that will be consumed.
const routeModule = new PagesAPIRouteModule({
    definition: {
        kind: route_kind/* RouteKind */.x.PAGES_API,
        page: "/api/generer-pdf",
        pathname: "/api/generer-pdf",
        // The following aren't used in production.
        bundlePath: "",
        filename: ""
    },
    userland: generer_pdf_namespaceObject
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
var __webpack_exports__ = __webpack_require__.X(0, [172], () => (__webpack_exec__(595)));
module.exports = __webpack_exports__;

})();