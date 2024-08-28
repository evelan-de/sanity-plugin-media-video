import { FC } from 'react';
import { BooleanInputProps, useTranslation } from 'sanity';

import { ResourcesKeys } from '../../utils/i18n/resourceBundles';

type MediaVideoI18nBooleanInputProps = {
  fieldProps: BooleanInputProps;
  translationKeys: {
    title: ResourcesKeys;
    description?: ResourcesKeys;
  };
};

/**
 * MediaVideoI18nBooleanInput
 *
 * A custom component to handle internationalization (i18n) of media video boolean fields.
 *
 * This component is useful for defining input fields that represent boolean values with
 * localized titles and descriptions based on the provided translation keys.
 *
 * Example Usage:
 *
 * ```typescript
 * defineField({
 *   ...,
 *   components: {
 *     input: (props) => {
 *       return MediaVideoI18nBooleanInput({
 *         fieldProps: props,
 *         translationKeys: {
 *           title: 'enableVideo.title',
 *           description: 'enableVideo.description',
 *         },
 *       });
 *     },
 *   },
 * });
 * ```
 */
const MediaVideoI18nBooleanInput: FC<MediaVideoI18nBooleanInputProps> = ({
  fieldProps,
  translationKeys,
}) => {
  const { t } = useTranslation('schema');

  const { title, description } = translationKeys;
  const fieldTitle = t(title);
  const fieldDescription = description ? t(description) : undefined;

  const renderDefault = fieldProps.renderDefault({
    ...fieldProps,
    schemaType: {
      ...fieldProps.schemaType,
      title: fieldTitle,
      description: fieldDescription,
    },
  });

  return renderDefault;
};

export default MediaVideoI18nBooleanInput;
