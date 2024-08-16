import { configureTranslate } from 'sanity-plugin-ui-intl';

import { DEFAULT_LOCALE } from '../constants/translations';
import { DEFAULT_SCHEMA_RESOURCE } from './resourceBundles';

type NamespaceKeys = keyof typeof DEFAULT_SCHEMA_RESOURCE;

// We should only map one locale resource to ensure that the translations are consistent across all locales
// since any translations that are not mapped will be missing an will result in an error
export type ResourcesKeys = {
  [K in keyof typeof DEFAULT_SCHEMA_RESOURCE]: keyof (typeof DEFAULT_SCHEMA_RESOURCE)[K];
};

export type Resources = {
  [key: string]: {
    [K in keyof ResourcesKeys]: (typeof DEFAULT_SCHEMA_RESOURCE)['schema'];
  };
};

// Just pass the "locale" as the default locale as the locale from the 'sanity-plugin-ui-intl' is hardcoded to only use 'en,de,ru'
export const translate = ({
  customResources,
}: {
  customResources: Resources;
}) => {
  return configureTranslate<ResourcesKeys, NamespaceKeys>(
    customResources,
    DEFAULT_LOCALE, // Default locale
  );
};
