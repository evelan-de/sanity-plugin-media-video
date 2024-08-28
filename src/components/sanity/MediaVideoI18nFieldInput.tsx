import { FC } from 'react';
import { FieldProps, useTranslation } from 'sanity';

import { ResourcesKeys } from '../../utils/i18n/resourceBundles';

type MediaVideoI18nFieldInputProps = {
  fieldProps: FieldProps;
  translationKeys: {
    title: ResourcesKeys;
    description?: ResourcesKeys;
  };
};

/**
 * MediaVideoI18nFieldInput
 *
 * A custom component to handle internationalization (i18n) for media video fields.
 *
 * This component is primarily designed to work with string-type fields and may not
 * function correctly with other field types.
 *
 * Example Usage:
 *
 * ```typescript
 * defineField({
 *   ...,
 *   components: {
 *     field: (props) =>
 *       MediaVideoI18nFieldInput({
 *         fieldProps: props,
 *         translationKeys: {
 *           title: 'videoType.title',
 *         },
 *       }),
 *   },
 * });
 * ```
 */
const MediaVideoI18nFieldInput: FC<MediaVideoI18nFieldInputProps> = ({
  fieldProps,
  translationKeys,
}) => {
  const { t } = useTranslation('schema');

  const { title, description } = translationKeys;
  const fieldTitle = t(title);
  const fieldDescription = description ? t(description) : undefined;

  const renderDefault = fieldProps.renderDefault({
    ...fieldProps,
    title: fieldTitle,
    description: fieldDescription,
  });

  return renderDefault;
};

export default MediaVideoI18nFieldInput;
