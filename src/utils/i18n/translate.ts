import { configureTranslate } from 'sanity-plugin-ui-intl';

import { DEFAULT_LOCALE } from '../constants/translations';
import { DEFAULT_SCHEMA_RESOURCE } from './resourceBundles';

type NamespaceKeys = keyof typeof DEFAULT_SCHEMA_RESOURCE;

// We should only map one locale resource to ensure that the translations are consistent across all locales
// since any translations that are not mapped will be missing an will result in an error
export type ResourcesKeys = {
  [K in keyof typeof DEFAULT_SCHEMA_RESOURCE]: keyof (typeof DEFAULT_SCHEMA_RESOURCE)[K];
};

export const resources = {
  en: DEFAULT_SCHEMA_RESOURCE,
};

// When providing the default locale, we are just telling the plugin which locale is used in /
export const translate = configureTranslate<ResourcesKeys, NamespaceKeys>(
  resources,
  DEFAULT_LOCALE, // Default locale
);
