import { defineField, defineType } from 'sanity';

import { MediaVideoPluginOptions } from '../../../types/MediaVideoPluginOptions';
import { DEFAULT_REQUIRED_TEXT } from '../../../utils/constants/translations';
import { translate } from '../../../utils/i18n/translate';

const t = translate({ namespace: 'schema' });

const mediaObject = (pluginOptions: void | MediaVideoPluginOptions) => {
  const { isImageRequired } = pluginOptions ?? {};

  // Fallback to default translations if pluginOptions doesn't provide any
  // const resolvedTranslations = {
  //   ...DEFAULT_TRANSLATIONS,
  //   // ...translationSchema,
  // };

  return defineType({
    name: 'media2', // TODO :Temporary, change to 'media' after
    title: 'Media',
    type: 'object',
    fields: [
      defineField({
        name: 'image',
        // title: 'IMAGE',
        title: t('image.title'),
        description: 'Serves as the image preview of the video',
        type: 'image',
        options: {
          collapsible: false,
          collapsed: false,
          hotspot: true,
        },
        fields: [
          {
            name: 'altText',
            title: 'Alt Text',
            description: 'Set an alternative text for accessibility purposes',
            type: 'string',
          },
        ],
        validation: (Rule) =>
          Rule.custom((fieldValue, context) => {
            const parent = context.parent as { [key: string]: unknown } | null;

            if (isImageRequired && !fieldValue) {
              return 'Image is required' ?? DEFAULT_REQUIRED_TEXT;
            }

            // Validate required if enableVideo is true, since we use this as the base thumbnail for the video to help with ssr
            if (!fieldValue && parent?.enableVideo) {
              return 'Image is required' ?? DEFAULT_REQUIRED_TEXT;
            }

            return true;
          }),
      }),
      defineField({
        name: 'enableVideo',
        title: 'Enable Video',
        description: 'Toggle to enable video',
        type: 'boolean',
        initialValue: false,
      }),
      defineField({
        name: 'videoType',
        title: 'Video Type',
        type: 'string',
        options: {
          list: [
            {
              value: 'link',
              title: 'Link',
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
              return 'Video Type is required' ?? DEFAULT_REQUIRED_TEXT;
            }
            return true;
          }),
        ],
      }),
      defineField({
        name: 'isAutoPlay',
        title: 'Auto Play',
        description: 'Automatically play the video when loaded',
        type: 'boolean',
        initialValue: false,
        hidden: ({ parent }) => !parent?.enableVideo,
      }),
      defineField({
        name: 'isPipAutomatic',
        title: 'Enable Automatic PiP for Autoplay',
        description:
          'This automatically creates a small floating video player when you scroll past the main video',
        type: 'boolean',
        initialValue: false,
        hidden: ({ parent }) => !parent?.enableVideo || !parent?.isAutoPlay,
      }),
      defineField({
        name: 'videoUrl',
        title: 'Video Link',
        // description: resolvedTranslations.videoUrlDescription,
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
              return 'Video Link is required' ?? DEFAULT_REQUIRED_TEXT;
            }

            return true;
          }),
          Rule.uri({ scheme: ['http', 'https'] }),
        ],
      }),
      defineField({
        name: 'muxVideo',
        title: 'Mux Video',
        // description: resolvedTranslations.muxVideoDescription,
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
              return 'Mux Video is required' ?? DEFAULT_REQUIRED_TEXT;
            }
            return true;
          }),
        ],
      }),
    ],
  });
};

export default mediaObject;
