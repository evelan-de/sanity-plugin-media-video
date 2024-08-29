import { FC } from 'react';
import { StringInputProps, TitledListValue, useTranslation } from 'sanity';

import { I18N_NAMESPACE } from '../../utils/constants';
import { ResourcesKeys } from '../../utils/i18n/resourceBundles';

type MediaVideoI18nStringListInputProps = {
  fieldProps: StringInputProps;
  translationKeys: {
    list?: ResourcesKeys[]; // This should be a list of strings, it will be used in chronological order to translate the options list 'title' field
  };
};

/**
 * MediaVideoI18nStringListInput
 *
 * A custom component to handle internationalization (i18n) of media video string fields
 * with options lists.
 *
 * This component is useful for defining input fields that require dynamic, localized
 * strings based on provided translation keys.
 *
 * Example Usage:
 *
 * ```typescript
 * defineField({
 *   ...,
 *   components: {
 *     input: (props) =>
 *       MediaVideoI18nStringListInput({
 *         fieldProps: props,
 *         translationKeys: {
 *           list: ['videoType.link.title', 'videoType.mux.title'],
 *         },
 *       }),
 *   },
 * });
 * ```
 */
const MediaVideoI18nStringListInput: FC<MediaVideoI18nStringListInputProps> = ({
  fieldProps,
  translationKeys,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE);

  const { list } = translationKeys;
  const optionsList = fieldProps.schemaType.options
    ?.list as TitledListValue<string>[];

  // Map the translated texts to the options list in chronological order of the list prop array of strings
  const translatedOptionsList =
    list && list?.length > 0
      ? optionsList?.map((option, idx) => ({
          ...option,
          title: t(list[idx]),
        }))
      : optionsList;

  const renderDefault = fieldProps.renderDefault({
    ...fieldProps,
    schemaType: {
      ...fieldProps.schemaType,
      options: {
        ...fieldProps.schemaType.options,
        list: translatedOptionsList,
      },
    },
  });

  return renderDefault;
};

export default MediaVideoI18nStringListInput;
