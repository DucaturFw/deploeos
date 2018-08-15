import {
  IBemPluginConfig,
  BemFunction,
  IBemDelimitersConfig,
  IBemBlockConfig
} from "./types";
import { isString, hyphenate, isPObject } from "./utils";

export default function bemCn(
  block: string,
  options: IBemPluginConfig
): BemFunction {
  if (!isString(block)) return (a, b, c) => "";

  return function entitys(elem, mods, mix) {
    const resultObj = {
      block,
      el: elem,
      mods: mods,
      mixin: mix
    };

    if (options.hyphenate) {
      return hyphenate(bemNames(resultObj, options.delimiters));
    }

    return bemNames(resultObj, options.delimiters);
  };
}

export function bemNames(
  entitys: Partial<IBemBlockConfig>,
  delimiters: Partial<IBemDelimitersConfig>
) {
  let resultString = "";
  const names: IBemBlockConfig = {
    block: "",
    mods: {},
    mixin: "",
    ...entitys
  };

  const delims: IBemDelimitersConfig = {
    namespace: "",
    element: "__",
    modificator: "--",
    modificatorValue: "-",
    ...delimiters
  };

  if (!names.block) return "";

  const mixin = isString(names.mixin) ? " " + names.mixin : "";

  resultString = delims.namespace
    ? delims.namespace + names.block
    : names.block;

  if (names.el) resultString += delims.element + names.el;

  if (isPObject(names.mods)) {
    resultString += Object.keys(names.mods).reduce((prev, name) => {
      const val = names.mods[name];
      if (val === true) {
        prev += " " + resultString + delims.modificator + name;
      } else if (isString(val)) {
        prev +=
          " " +
          resultString +
          delims.modificator +
          name +
          delims.modificatorValue +
          names.mods[name];
      }

      return prev;
    }, "");
  }
  return resultString + mixin;
}
