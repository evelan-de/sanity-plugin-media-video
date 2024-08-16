import { defineField, defineType } from 'sanity';

import MediaVideoI18nFieldInput from '../../../components/MediaVideoI18nFieldInput';
import { MediaVideoPluginOptions } from '../../../types/MediaVideoPluginOptions';
// import { DEFAULT_REQUIRED_TEXT } from '../../../utils/constants/translations';
// import { translate } from '../../../utils/i18n/translate';

const mediaObject = (pluginOptions: void | MediaVideoPluginOptions) => {
  const { isImageRequired } = pluginOptions ?? {};

  // const t = translate({ namespace: 'schema' });

  return defineType({
    name: 'media2', // TODO :Temporary, change to 'media' after
    title: 'Media',
    type: 'object',
    fields: [
      defineField({
        name: 'image',
        type: 'image',
        options: {
          collapsible: false,
          collapsed: false,
          hotspot: true,
        },
        fields: [
          defineField({
            name: 'altText',
            title: 'Alt Text',
            description: 'Set an alternative text for accessibility purposes',
            type: 'string',
            components: {
              field: (props) =>
                MediaVideoI18nFieldInput({
                  fieldProps: props,
                  translationKeys: {
                    title: 'image.altText.title',
                    description: 'image.altText.description',
                  },
                }),
            },
          }),
        ],
        validation: (Rule) =>
          Rule.custom((fieldValue, context) => {
            // console.log(
            //   'context',
            //   context,
            //   context.i18n.currentLocale,
            //   context.i18n.loadNamespaces(['schema']),
            // );
            // console.log(
            //   'i18n t TITLE',
            //   context.i18n.t('schema:schema.image.title'),
            // );
            // console.log(
            //   'i18n t DESCRIPTION',
            //   context.i18n.t('schema:schema.image.description'),
            // );
            const parent = context.parent as { [key: string]: unknown } | null;
            const t = context.i18n.t;

            if (isImageRequired && !fieldValue) {
              // return 'Image is required' ?? DEFAULT_REQUIRED_TEXT;
              return t('schema:schema.image.required.title');
            }

            // Validate required if enableVideo is true, since we use this as the base thumbnail for the video to help with ssr
            if (!fieldValue && parent?.enableVideo) {
              return t('schema:schema.image.required.title');
            }

            return true;
          }),
        components: {
          field: (props) =>
            MediaVideoI18nFieldInput({
              fieldProps: props,
              translationKeys: {
                title: 'image.title',
                description: 'image.description',
              },
            }),
        },
      }),
      defineField({
        name: 'enableVideo',
        // title: 'Enable Video',
        // description: 'Toggle to enable video',
        type: 'boolean',
        initialValue: false,
        components: {
          field: (props) => {
            return MediaVideoI18nFieldInput({
              fieldProps: props,
              translationKeys: {
                title: 'enableVideo.title',
                description: 'enableVideo.description',
              },
            });
          },
        },
      }),
      defineField({
        name: 'videoType',
        // title: 'Video Type',
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
            const t = context.i18n.t;

            // Validate required if enableVideo is true
            if (parent?.enableVideo && !fieldValue) {
              return t('schema:schema.videoType.required.title');
            }
            return true;
          }),
        ],
        components: {
          field: (props) =>
            MediaVideoI18nFieldInput({
              fieldProps: props,
              translationKeys: {
                title: 'videoType.title',
              },
            }),
        },
      }),
      defineField({
        name: 'isAutoPlay',
        // title: 'Auto Play',
        // description: 'Automatically play the video when loaded',
        type: 'boolean',
        initialValue: false,
        hidden: ({ parent }) => !parent?.enableVideo,
        components: {
          field: (props) =>
            MediaVideoI18nFieldInput({
              fieldProps: props,
              translationKeys: {
                title: 'isAutoPlay.title',
                description: 'isAutoPlay.description',
              },
            }),
        },
      }),
      defineField({
        name: 'isPipAutomatic',
        // title: 'Enable Automatic PiP for Autoplay',
        // description:
        //   'This automatically creates a small floating video player when you scroll past the main video',
        type: 'boolean',
        initialValue: false,
        hidden: ({ parent }) => !parent?.enableVideo || !parent?.isAutoPlay,
        components: {
          field: (props) =>
            MediaVideoI18nFieldInput({
              fieldProps: props,
              translationKeys: {
                title: 'isPipAutomatic.title',
                description: 'isPipAutomatic.description',
              },
            }),
        },
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
            const t = context.i18n.t;

            // Validate required if enableVideo is true
            if (
              parent?.enableVideo &&
              !fieldValue &&
              parent.videoType === 'link'
            ) {
              // return 'Video Link is required' ?? DEFAULT_REQUIRED_TEXT;
              return t('schema:schema.videoUrl.required.title');
            }

            return true;
          }),
          Rule.uri({ scheme: ['http', 'https'] }),
        ],
        components: {
          field: (props) =>
            MediaVideoI18nFieldInput({
              fieldProps: props,
              translationKeys: {
                title: 'videoUrl.title',
              },
            }),
        },
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
            const t = context.i18n.t;

            if (
              parent?.enableVideo &&
              !fieldValue &&
              parent.videoType === 'mux'
            ) {
              // return 'Mux Video is required' ?? DEFAULT_REQUIRED_TEXT;
              return t('schema:schema.muxVideo.required.title');
            }
            return true;
          }),
        ],
        components: {
          field: (props) =>
            MediaVideoI18nFieldInput({
              fieldProps: props,
              translationKeys: {
                title: 'muxVideo.title',
              },
            }),
        },
      }),
    ],
  });
};

export default mediaObject;
