import { FC } from 'react';
import { FieldProps, useTranslation } from 'sanity';

import { ResourcesKeys } from '../utils/i18n/translate';

type MediaVideoI18nFieldInputProps = {
  fieldProps: FieldProps;
  translationKeys: {
    title: ResourcesKeys['schema'];
    description?: ResourcesKeys['schema'];
  };
};

const MediaVideoI18nFieldInput: FC<MediaVideoI18nFieldInputProps> = ({
  fieldProps,
  translationKeys,
}) => {
  const { t } = useTranslation('schema');

  const { title, description } = translationKeys;
  const fieldTitle = t(`schema.${title}`);
  const fieldDescription = description ? t(`schema.${description}`) : undefined;

  return fieldProps.renderDefault({
    ...fieldProps,
    title: fieldTitle,
    description: fieldDescription,
  });
};

export default MediaVideoI18nFieldInput;
