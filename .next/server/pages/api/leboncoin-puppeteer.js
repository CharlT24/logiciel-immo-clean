"use strict";
(() => {
var exports = {};
exports.id = 641;
exports.ids = [641];
exports.modules = {

/***/ 730:
/***/ ((module) => {

module.exports = require("next/dist/server/api-utils/node.js");

/***/ }),

/***/ 3076:
/***/ ((module) => {

module.exports = require("next/dist/server/future/route-modules/route-module.js");

/***/ }),

/***/ 5462:
/***/ ((module) => {

module.exports = import("puppeteer");;

/***/ }),

/***/ 8196:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   config: () => (/* binding */ config),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   routeModule: () => (/* binding */ routeModule)
/* harmony export */ });
/* harmony import */ var next_dist_server_future_route_modules_pages_api_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6429);
/* harmony import */ var next_dist_server_future_route_modules_pages_api_module__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_pages_api_module__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7153);
/* harmony import */ var next_dist_build_webpack_loaders_next_route_loader_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7305);
/* harmony import */ var private_next_pages_api_leboncoin_puppeteer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2187);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([private_next_pages_api_leboncoin_puppeteer_js__WEBPACK_IMPORTED_MODULE_3__]);
private_next_pages_api_leboncoin_puppeteer_js__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
// @ts-ignore this need to be imported from next/dist to be external



const PagesAPIRouteModule = next_dist_server_future_route_modules_pages_api_module__WEBPACK_IMPORTED_MODULE_0__.PagesAPIRouteModule;
// Import the userland code.
// @ts-expect-error - replaced by webpack/turbopack loader

// Re-export the handler (should be the default export).
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_webpack_loaders_next_route_loader_helpers__WEBPACK_IMPORTED_MODULE_2__/* .hoist */ .l)(private_next_pages_api_leboncoin_puppeteer_js__WEBPACK_IMPORTED_MODULE_3__, "default"));
// Re-export config.
const config = (0,next_dist_build_webpack_loaders_next_route_loader_helpers__WEBPACK_IMPORTED_MODULE_2__/* .hoist */ .l)(private_next_pages_api_leboncoin_puppeteer_js__WEBPACK_IMPORTED_MODULE_3__, "config");
// Create and export the route module that will be consumed.
const routeModule = new PagesAPIRouteModule({
    definition: {
        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__/* .RouteKind */ .x.PAGES_API,
        page: "/api/leboncoin-puppeteer",
        pathname: "/api/leboncoin-puppeteer",
        // The following aren't used in production.
        bundlePath: "",
        filename: ""
    },
    userland: private_next_pages_api_leboncoin_puppeteer_js__WEBPACK_IMPORTED_MODULE_3__
});

//# sourceMappingURL=pages-api.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2187:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var puppeteer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5462);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([puppeteer__WEBPACK_IMPORTED_MODULE_0__]);
puppeteer__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

async function handler(req, res) {
    const { ville = "Lyon", min = 100000, max = 500000, type = "maison" } = req.query;
    const url = `https://www.leboncoin.fr/recherche?category=9&real_estate_type=${type}&locations=${ville}&price=${min}-${max}`;
    try {
        const browser = await puppeteer__WEBPACK_IMPORTED_MODULE_0__["default"].launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox"
            ]
        });
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
        console.log("\uD83D\uDD0D Ouverture de la page Leboncoin...");
        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 30000
        });
        console.log("⏳ Attente des annonces...");
        await page.waitForSelector('[data-qa-id="aditem_container"]', {
            timeout: 20000
        }).catch(()=>{
            console.warn("⚠️ Aucune annonce d\xe9tect\xe9e – le s\xe9lecteur n'est peut-\xeatre plus \xe0 jour.");
        });
        console.log("\uD83D\uDCE6 R\xe9cup\xe9ration des annonces...");
        const annonces = await page.evaluate(()=>{
            const cards = document.querySelectorAll('[data-qa-id="aditem_container"]');
            if (!cards || cards.length === 0) return [];
            const data = [];
            cards.forEach((card)=>{
                const title = card.querySelector('[data-qa-id="aditem_title"]')?.innerText?.trim();
                const price = card.querySelector('[data-qa-id="aditem_price"]')?.innerText?.trim();
                const image = card.querySelector("img")?.src;
                const link = "https://www.leboncoin.fr" + card.getAttribute("href");
                if (title && price && link) {
                    data.push({
                        title,
                        price,
                        image,
                        link
                    });
                }
            });
            return data;
        });
        await browser.close();
        if (!annonces || annonces.length === 0) {
            console.warn("⚠️ Aucune annonce r\xe9cup\xe9r\xe9e");
            return res.status(200).json({
                results: [],
                message: "Aucune annonce trouv\xe9e."
            });
        }
        console.log(`✅ ${annonces.length} annonces récupérées.`);
        res.status(200).json({
            results: annonces
        });
    } catch (error) {
        console.error("❌ Erreur Puppeteer:", error.message);
        res.status(500).json({
            error: "Scraping \xe9chou\xe9",
            details: error.message
        });
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [172], () => (__webpack_exec__(8196)));
module.exports = __webpack_exports__;

})();