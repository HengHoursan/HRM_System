import { useI18n } from "vue-i18n";
import { en } from "@/locales";
import type { Schema } from "@/locales";

export function useAppI18n(moduleName?: string) {
  const i18n = useI18n<{ message: Schema }>();
  const { t } = i18n;

  // Reactive proxy for any namespace (fields, crud, or modules like product)
  const group = (ns: string): any => {
    const isModule = (en as any).modules?.[ns];
    const prefix = isModule ? `modules.${ns}` : ns;
    const base = (en as any)[ns] || isModule || {};

    const buildProxy = (path: string, obj: any): any => {
      if (typeof obj !== "object" || obj === null) {
        return obj;
      }
      const proxyObj = {} as any;
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          Object.defineProperty(proxyObj, key, {
            get: () => buildProxy(`${path}.${key}`, value),
            enumerable: true,
            configurable: true,
          });
        } else {
          Object.defineProperty(proxyObj, key, {
            get: () => t(`${path}.${key}`),
            enumerable: true,
            configurable: true,
          });
        }
      });
      return proxyObj;
    };

    return buildProxy(prefix, base);
  };

  return {
    ...i18n,
    group,
    labels: moduleName ? group(moduleName) : ({} as any),
    fields: group("fields"),
    crud: group("crud"),
    actions: group("actions"),
    auth: group("auth"),
    menu: group("menu"),
    layout: group("layout"),
    common: group("common"),
  };
}
