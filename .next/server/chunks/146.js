exports.id = 146;
exports.ids = [146];
exports.modules = {

/***/ 9146:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ App)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: ./styles/globals.css
var globals = __webpack_require__(6764);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: external "@supabase/auth-helpers-nextjs"
var auth_helpers_nextjs_ = __webpack_require__(4001);
// EXTERNAL MODULE: external "@supabase/auth-helpers-react"
var auth_helpers_react_ = __webpack_require__(6749);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(5675);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
;// CONCATENATED MODULE: ./components/Layout.js
// components/Layout.js



function Layout({ children }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "min-h-screen flex flex-col bg-gray-100 font-sans",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("header", {
                className: "bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ jsx_runtime.jsx((image_default()), {
                                src: "/logo.png",
                                alt: "Logo",
                                width: 36,
                                height: 36
                            }),
                            /*#__PURE__*/ jsx_runtime.jsx("h1", {
                                className: "text-xl font-bold text-orange-600 tracking-tight",
                                children: "Open Immobilier"
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime.jsx("div", {
                        className: "text-sm text-gray-600",
                        children: "\uD83D\uDC64 Compte connect\xe9"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex flex-1",
                children: [
                    /*#__PURE__*/ jsx_runtime.jsx("aside", {
                        className: "w-64 bg-white border-r shadow-md p-5 hidden md:flex flex-col space-y-6",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("nav", {
                            className: "flex flex-col space-y-3 text-sm font-medium text-gray-700",
                            children: [
                                /*#__PURE__*/ jsx_runtime.jsx(NavItem, {
                                    href: "/dashboard",
                                    icon: "\uD83C\uDFE0",
                                    label: "Tableau de bord"
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx(NavItem, {
                                    href: "/biens",
                                    icon: "\uD83C\uDFE1",
                                    label: "Biens"
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx(NavItem, {
                                    href: "/clients",
                                    icon: "\uD83D\uDC65",
                                    label: "Clients"
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx(NavItem, {
                                    href: "/reseau",
                                    icon: "\uD83C\uDF10",
                                    label: "Mon r\xe9seau"
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx(NavItem, {
                                    href: "/rapprochements",
                                    icon: "\uD83D\uDD0D",
                                    label: "Rapprochements"
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx(NavItem, {
                                    href: "/statistiques",
                                    icon: "\uD83D\uDCCA",
                                    label: "Statistiques"
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx(NavItem, {
                                    href: "/parametres",
                                    icon: "⚙️",
                                    label: "Param\xe8tres"
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx(NavItem, {
                                    href: "/mentions-legales",
                                    icon: "\uD83D\uDCDC",
                                    label: "Mentions l\xe9gales"
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime.jsx("main", {
                        className: "flex-1 p-8 overflow-y-auto",
                        children: children
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("aside", {
                        className: "w-80 bg-orange-50 border-l hidden xl:flex flex-col p-6 space-y-4 shadow-inner",
                        children: [
                            /*#__PURE__*/ jsx_runtime.jsx("h2", {
                                className: "font-semibold text-orange-700 text-sm mb-2",
                                children: "⚡ Actions rapides"
                            }),
                            /*#__PURE__*/ jsx_runtime.jsx(QuickLink, {
                                href: "/biens/ajouter",
                                text: "➕ Ajouter un bien"
                            }),
                            /*#__PURE__*/ jsx_runtime.jsx(QuickLink, {
                                href: "/clients/ajouter",
                                text: "\uD83D\uDC64 Nouveau client"
                            }),
                            /*#__PURE__*/ jsx_runtime.jsx(QuickLink, {
                                href: "/agenda",
                                text: "\uD83D\uDCC5 Acc\xe9der \xe0 l'agenda"
                            }),
                            /*#__PURE__*/ jsx_runtime.jsx(QuickLink, {
                                href: "/reseau",
                                text: "\uD83C\uDF10 Voir les agents"
                            }),
                            /*#__PURE__*/ jsx_runtime.jsx(QuickLink, {
                                href: "/statistiques",
                                text: "\uD83D\uDCCA Voir les stats"
                            })
                        ]
                    })
                ]
            })
        ]
    });
}
function NavItem({ href, icon, label }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)((link_default()), {
        href: href,
        className: "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-orange-100 hover:text-orange-700 transition",
        children: [
            /*#__PURE__*/ jsx_runtime.jsx("span", {
                children: icon
            }),
            " ",
            /*#__PURE__*/ jsx_runtime.jsx("span", {
                children: label
            })
        ]
    });
}
function QuickLink({ href, text }) {
    return /*#__PURE__*/ jsx_runtime.jsx((link_default()), {
        href: href,
        className: "text-sm text-orange-700 hover:underline transition",
        children: text
    });
}

;// CONCATENATED MODULE: ./pages/_app.js
// pages/_app.js






function App({ Component, pageProps }) {
    const [supabaseClient] = (0,external_react_.useState)(()=>(0,auth_helpers_nextjs_.createPagesBrowserClient)());
    return /*#__PURE__*/ jsx_runtime.jsx(auth_helpers_react_.SessionContextProvider, {
        supabaseClient: supabaseClient,
        initialSession: pageProps.initialSession,
        children: /*#__PURE__*/ jsx_runtime.jsx(Layout, {
            children: /*#__PURE__*/ jsx_runtime.jsx(Component, {
                ...pageProps
            })
        })
    });
}


/***/ }),

/***/ 6764:
/***/ (() => {



/***/ })

};
;