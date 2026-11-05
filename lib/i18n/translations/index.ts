import { en } from './en';
import { ua } from './ua';

export const translations = {
  en,
  ua
} as const;

export type TranslationKey = keyof typeof en;
export type NestedTranslationKey<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${string & K}.${NestedTranslationKey<T[K]>}`
        : string & K;
    }[keyof T]
  : never;

export type TranslationPath = NestedTranslationKey<typeof en>;
