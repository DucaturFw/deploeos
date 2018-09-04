import Vue from "vue";
import AsyncComputed from "vue-async-computed";
import Component, { createDecorator } from "vue-class-component";
import "reflect-metadata";

export type AsyncComputedFunc = (() => Promise<any>);

export interface IAsyncComputedOptions {
  default: any;
}

interface IAsyncComputedDecoratorOptions extends IAsyncComputedOptions {
  get: AsyncComputedFunc;
}

export type AsyncComputedOptions = IAsyncComputedOptions | AsyncComputedFunc;

Vue.use(AsyncComputed);

/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
export default function Async(
  options?: AsyncComputedOptions
): PropertyDecorator {
  return function(target: Vue, key: string) {
    let opts = {} as IAsyncComputedDecoratorOptions;
    if (typeof options === "function") {
      opts.get = options;
    } else {
      opts = { ...options } as IAsyncComputedDecoratorOptions;
    }

    createDecorator((componentOptions: any, k: any) => {
      if (
        componentOptions.methods &&
        typeof componentOptions.methods[k] !== "undefined"
      ) {
        delete componentOptions.methods[k];
      }

      (componentOptions.asyncComputed ||
        ((componentOptions.asyncComputed = {}) as any))[k] = opts;
    })(target, key);
  };
}
