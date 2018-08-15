export function isString(val: any): boolean {
  return val && typeof val === "string" && val.length > 0;
}
export function isPObject(val: any): boolean {
  return (
    val && typeof val === "object" && val !== null && val.constructor === Object
  );
}

export function hyphenate(str: string): string {
  return str.replace(/\B([A-Z])/g, "-$1").toLowerCase();
}
