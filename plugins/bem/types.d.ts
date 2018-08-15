export type BemFunction = (
  element: string,
  modificators: { [key: string]: any },
  mixins: string
) => string;

export interface IBemBlockConfig {
  block: string;
  el?: string;
  mods?: any;
  mixin?: string;
}

export interface IBemDelimitersConfig {
  namespace: string;
  element: string;
  modificator: string;
  modificatorValue: string;
}

export interface IBemPluginConfig {
  hyphenate: boolean;
  methodName: string;
  delimiters: IBemDelimitersConfig;
}
