import { configureTranslate } from 'sanity-plugin-ui-intl';

import { DEFAULT_RESOURCE_BUNDLE } from './resourceBundles';

const DEFAULT_LOCALE = 'en';

type NamespaceKeys = keyof typeof DEFAULT_RESOURCE_BUNDLE;

// We should only map one locale resource to ensure that the translations are consistent across all locales
// since any translations that are not mapped will be missing an will result in an error
export type ResourcesKeys = {
  [K in keyof typeof DEFAULT_RESOURCE_BUNDLE]: keyof (typeof DEFAULT_RESOURCE_BUNDLE)[K];
};

export const resources = {
  en: DEFAULT_RESOURCE_BUNDLE,
};

// When providing the default locale, we are just telling the plugin which locale is used in /
export const translate = configureTranslate<ResourcesKeys, NamespaceKeys>(
  resources,
  DEFAULT_LOCALE, // Default locale
);
