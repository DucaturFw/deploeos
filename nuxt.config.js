const parseArgs = require("minimist");
const argv = parseArgs(process.argv.slice(2), {
  alias: {
    H: "hostname",
    p: "port"
  },
  string: ["H"],
  unknown: parameter => false
});

const port =
  argv.port ||
  process.env.PORT ||
  process.env.npm_package_config_nuxt_port ||
  "3000";
const host =
  argv.hostname ||
  process.env.HOST ||
  process.env.npm_package_config_nuxt_host ||
  "localhost";

const routerBase =
  process.env.DEPLOY_ENV === "GH_PAGES"
    ? {
        router: {
          base: "/deploeos/"
        }
      }
    : {};
module.exports = {
  // env: {
  //   baseUrl: process.env.BASE_URL || `http://${host}:${port}`
  // },
  plugins: [
    { src: "~/plugins/elements.plugin.ts" },
    { src: "~/plugins/bem.plugin.ts" },
    { src: "~/plugins/async-computed.plugin.ts" }
  ],
  head: {
    title: "DEPLOES for EOS Community. Made by Aler Denisov in Ducatur",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        hid: "description",
        name: "description",
        content: "Nuxt.js project"
      }
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico"
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: "#3B8070" },
  /*
  ** Build configuration
  */
  css: ["~/assets/css/main.css"],
  build: {},
  modules: ["@nuxtjs/axios", "~/modules/typescript.js"],
  axios: {},

  ...routerBase
};
