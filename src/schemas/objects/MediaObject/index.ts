import { defineField, defineType } from 'sanity';

import VideoInputField from '../../../components/VideoInputField';
import { MediaVideoPluginOptions } from '../../../types/MediaVideoPluginOptions';
import { DEFAULT_SCHEMA_TRANSLATIONS } from '../../../utils/i18n/resourceBundles';
import { Resources, translate } from '../../../utils/i18n/translate';

const mediaObject = (pluginOptions: void | MediaVideoPluginOptions) => {
  const { translationSchema, isImageRequired } = pluginOptions ?? {};

  // We override the DEFAULT_SCHEMA_RESOURCE and NOT add a new locale as the locale from the 'sanity-plugin-ui-intl' is hardcoded to only use 'en,de,ru'
  const mergedResources: Resources = {
    en: {
      schema: {
        ...DEFAULT_SCHEMA_TRANSLATIONS,
        ...translationSchema,
      },
    },
  };

  // Pass the merged resources to get the actual translation function to start translating texts
  const translationFunction = translate({ customResources: mergedResources });
  const t = translationFunction({ namespace: 'schema' });

  return defineType({
    name: 'media2', // TODO :Temporary, change to 'media' after
    title: 'Media',
    type: 'object',
    fields: [
      defineField({
        name: 'image',
        title: t('image.title'),
        description: t('image.description'),
        type: 'image',
        options: {
          collapsible: false,
          collapsed: false,
          hotspot: true,
        },
        fields: [
          defineField({
            name: 'altText',
            title: t('image.altText.title'),
            description: t('image.altText.description'),
            type: 'string',
          }),
        ],
        validation: (Rule) =>
          Rule.custom((fieldValue, context) => {
            const parent = context.parent as { [key: string]: unknown } | null;

            if (isImageRequired && !fieldValue) {
              return t('image.required.title');
            }

            // Validate required if enableVideo is true, since we use this as the base thumbnail for the video to help with ssr
            if (!fieldValue && parent?.enableVideo) {
              return t('image.required.title');
            }

            return true;
          }),
      }),
      defineField({
        name: 'enableVideo',
        title: t('enableVideo.title'),
        description: t('enableVideo.description'),
        type: 'boolean',
        initialValue: false,
      }),
      defineField({
        name: 'videoType',
        title: t('videoType.title'),
        type: 'string',
        options: {
          list: [
            {
              value: 'link',
              title: t('videoType.link.title'),
            },
            { value: 'mux', title: 'Mux' },
          ],
          layout: 'radio',
          direction: 'horizontal',
        },
        initialValue: 'link',
        hidden: ({ parent }) => !parent?.enableVideo,
        validation: (Rule) => [
          Rule.custom((fieldValue, context) => {
            const parent = context.parent as { [key: string]: unknown } | null;

            // Validate required if enableVideo is true
            if (parent?.enableVideo && !fieldValue) {
              return t('videoType.required.title');
            }
            return true;
          }),
        ],
      }),
      defineField({
        name: 'isAutoPlay',
        title: t('isAutoPlay.title'),
        description: t('isAutoPlay.description'),
        type: 'boolean',
        initialValue: false,
        hidden: ({ parent }) => !parent?.enableVideo,
      }),
      defineField({
        name: 'isPipAutomatic',
        title: t('isPipAutomatic.title'),
        description: t('isPipAutomatic.description'),
        type: 'boolean',
        initialValue: false,
        hidden: ({ parent }) => !parent?.enableVideo || !parent?.isAutoPlay,
      }),
      defineField({
        name: 'videoUrl',
        title: t('videoUrl.title'),
        type: 'url',
        hidden: ({ parent }) => {
          if (!parent?.enableVideo) {
            return true;
          }
          if (parent?.enableVideo && parent?.videoType !== 'link') {
            return true;
          }

          return false;
        },
        validation: (Rule) => [
          Rule.custom((fieldValue, context) => {
            const parent = context.parent as { [key: string]: unknown } | null;

            // Validate required if enableVideo is true
            if (
              parent?.enableVideo &&
              !fieldValue &&
              parent.videoType === 'link'
            ) {
              return t('videoUrl.required.title');
            }

            return true;
          }),
          Rule.uri({ scheme: ['http', 'https'] }),
        ],
        components: {
          input: VideoInputField,
        },
      }),
      defineField({
        name: 'muxVideo',
        title: t('muxVideo.title'),
        type: 'mux.video',
        options: { collapsible: false, collapsed: false },
        hidden: ({ parent }) => {
          if (!parent?.enableVideo) {
            return true;
          }
          if (parent?.enableVideo && parent?.videoType !== 'mux') {
            return true;
          }

          return false;
        },
        validation: (Rule) => [
          Rule.custom((fieldValue, context) => {
            const parent = context.parent as { [key: string]: unknown } | null;

            if (
              parent?.enableVideo &&
              !fieldValue &&
              parent.videoType === 'mux'
            ) {
              return t('muxVideo.required.title');
            }
            return true;
          }),
        ],
      }),
    ],
  });
};

export default mediaObject;
