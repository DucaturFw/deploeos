import { VueConstructor } from "vue";
import { isString, isPObject, hyphenate } from "./utils";
import bem from "./bem";
import { IBemPluginConfig, BemFunction } from "./types";

export default {
  install(Vue: VueConstructor, config: any = { delimiters: {} }) {
    const configuration: IBemPluginConfig = {
      hyphenate: false,
      methodName: "b",
      ...config,

      delimiters: {
        namespace: "",
        element: "__",
        modificator: "--",
        modificatorValue: "-",
        ...config.delimiters
      }
    };

    Vue.mixin({
      props: ["mods"],
      computed: {
        _bemModificators() {
          return Object.assign({}, this.mods || {}, this.modificators || {});
        }
      },
      created() {
        const block = this.$options.blockName || this.$options.name;
        if (!isString(block)) return;

        const generator = bem(block, configuration);

        this[configuration.methodName] = (...args) => {
          const resultObj = {
            el: "",
            mods: {},
            mixin: ""
          };

          let possibleMixins = 0;

          if (isPObject(args[1])) {
            resultObj.mods = args[1];
            possibleMixins = 2;
          }

          if (isString(args[0])) {
            resultObj.el = args[0];
            possibleMixins = Math.max(possibleMixins, 1);
          } else if (isPObject(args[0])) {
            resultObj.mods = args[0];
            possibleMixins = 1;
          }

          if (args.length > possibleMixins) {
            const mixins = args.slice(possibleMixins);
            resultObj.mixin = mixins.join(" ");
            mixins.forEach(mixin => {
              resultObj.mods[mixin] = true;
            });
          }

          resultObj.mods = Object.assign(resultObj.mods, this._bemModificators);

          return generator(resultObj.el, resultObj.mods, resultObj.mixin);
        };
      }
    });
  }
};
